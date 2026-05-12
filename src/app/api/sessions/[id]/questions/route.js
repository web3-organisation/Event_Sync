import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { isSessionLive } from "@/app/lib/session-utils";

// ── Validation ─────────────────────────────────────────────────────────────
function validateQuestion(body) {
  const errors = {};

  if (!body.content || typeof body.content !== "string") {
    errors.content = "La question est obligatoire.";
  } else if (body.content.trim().length === 0) {
    errors.content = "La question ne peut pas être vide.";
  } else if (body.content.length > 500) {
    errors.content = "La question ne peut pas dépasser 500 caractères.";
  }

  if (
    body.authorName !== undefined &&
    body.authorName !== null &&
    typeof body.authorName === "string" &&
    body.authorName.length > 100
  ) {
    errors.authorName = "Le nom ne peut pas dépasser 100 caractères.";
  }

  return errors;
}

// ── GET ────────────────────────────────────────────────────────────────────
// Retourne les questions de la session triées par upvotes décroissants
export async function GET(_req, { params }) {
  const { id: sessionId } = params;

  // On récupère startTime / endTime pour le calcul LIVE
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true, startTime: true, endTime: true },
  });

  if (!session) {
    return NextResponse.json(
      { error: "Session introuvable." },
      { status: 404 }
    );
  }

  // Champs du modèle Question (@@map("questions"))
  // id, content, authorName (author_name), upvotes, createdAt (created_at), sessionId (session_id)
  const questions = await prisma.question.findMany({
    where: { sessionId },          // sessionId = session_id en DB
    orderBy: { upvotes: "desc" },  // tri décroissant (spec §4.5)
    select: {
      id: true,
      content: true,
      authorName: true,  // author_name en DB
      upvotes: true,
      createdAt: true,   // created_at en DB
    },
  });

  return NextResponse.json({
    isLive: isSessionLive(session.startTime, session.endTime),
    total: questions.length,
    questions,
  });
}

// ── POST ───────────────────────────────────────────────────────────────────
// Crée une question — uniquement si la session est LIVE
export async function POST(req, { params }) {
  const { id: sessionId } = params;

  // 1. Session existante ?
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true, startTime: true, endTime: true },
  });

  if (!session) {
    return NextResponse.json(
      { error: "Session introuvable." },
      { status: 404 }
    );
  }

  // 2. Garde LIVE (spec §4.5)
  if (!isSessionLive(session.startTime, session.endTime)) {
    return NextResponse.json(
      {
        error:
          "Les questions ne peuvent être posées que pendant une session en cours (LIVE).",
      },
      { status: 403 }
    );
  }

  // 3. Parser le body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    );
  }

  // 4. Valider
  const errors = validateQuestion(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json(
      { error: "Données invalides.", details: errors },
      { status: 422 }
    );
  }

  // 5. Créer la question
  // authorName null = anonyme (spec §3.5)
  const question = await prisma.question.create({
    data: {
      content: body.content.trim(),
      authorName: body.authorName?.trim() || null,
      sessionId,
    },
    select: {
      id: true,
      content: true,
      authorName: true,
      upvotes: true,
      createdAt: true,
    },
  });

  return NextResponse.json(question, { status: 201 });
}