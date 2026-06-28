// src/app/api/sessions/[id]/questions/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isSessionLive } from "../../../../../lib/session-utils";

const COOLDOWN_MS = 10_000; 

const anonRateLimit = new Map();  
const nameRateLimit = new Map();  

function normalizeContent(str) {
  return str.trim().toLowerCase();
}

function normalizeName(str) {
  return str.trim().toLowerCase();
}

function getRemainingCooldown(timestamp) {
  const elapsed = Date.now() - timestamp;
  if (elapsed < COOLDOWN_MS) return Math.ceil((COOLDOWN_MS - elapsed) / 1000);
  return null;
}

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
export async function GET(_req, { params }) {
  const { id: sessionId } = await params;

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true, startTime: true, endTime: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  const questions = await prisma.question.findMany({
    where: { sessionId },
    orderBy: { upvotes: "desc" },
    select: {
      id: true,
      content: true,
      authorName: true,
      upvotes: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    isLive: isSessionLive(session.startTime, session.endTime),
    total: questions.length,
    questions,
  });
}

// ── POST ───────────────────────────────────────────────────────────────────
export async function POST(req, { params }) {
  const { id: sessionId } = await params;

  // 1. Session existante et live ?
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    select: { id: true, startTime: true, endTime: true },
  });

  if (!session) {
    return NextResponse.json({ error: "Session introuvable." }, { status: 404 });
  }

  if (!isSessionLive(session.startTime, session.endTime)) {
    return NextResponse.json(
      { error: "Les questions ne peuvent être posées que pendant une session en cours (LIVE)." },
      { status: 403 }
    );
  }

  // 2. Parser le body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  // 3. Valider les champs
  const errors = validateQuestion(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Données invalides.", details: errors }, { status: 422 });
  }

  const contentNorm = normalizeContent(body.content);
  const hasName     = typeof body.authorName === "string" && body.authorName.trim().length > 0;
  const nameNorm    = hasName ? normalizeName(body.authorName) : null;

  // 4. Vérifier si la question existe déjà en base (même contenu, même session)
  const existingQuestion = await prisma.question.findFirst({
    where: {
      sessionId,
      content: { equals: body.content.trim(), mode: "insensitive" },
    },
    select: { id: true },
  });

  if (existingQuestion) {
    return NextResponse.json(
      { error: "Cette question est déjà posée." },
      { status: 409 }
    );
  }

  // 5. Anti-spam : logique différente selon anonyme ou nommé
  if (hasName) {
    // ── Utilisateur nommé ──────────────────────────────────────────────────
    // Bloqué si : même nom posté il y a < 10s (peu importe le contenu)
    //           OU même nom + même contenu posté il y a < 10s
    const entry = nameRateLimit.get(nameNorm);

    if (entry) {
      const remaining = getRemainingCooldown(entry.timestamp);
      if (remaining !== null) {
        // Même nom récent → bloqué dans tous les cas
        return NextResponse.json(
          {
            error: `Merci d'attendre encore ${remaining}s avant de poser à nouveau une question, ${body.authorName.trim()}.`,
          },
          { status: 429 }
        );
      }
    }

    // Mise à jour du rate limit pour ce nom
    nameRateLimit.set(nameNorm, { timestamp: Date.now(), content: contentNorm });

  } else {
    // ── Utilisateur anonyme ────────────────────────────────────────────────
    // Bloqué si : même contenu (normalisé) posté il y a < 10s
    const entry = anonRateLimit.get(contentNorm);

    if (entry) {
      const remaining = getRemainingCooldown(entry.timestamp);
      if (remaining !== null) {
        return NextResponse.json(
          {
            error: `Merci d'attendre encore ${remaining}s avant de reposer cette question.`,
          },
          { status: 429 }
        );
      }
    }

    // Mise à jour du rate limit pour ce contenu anonyme
    anonRateLimit.set(contentNorm, { timestamp: Date.now() });
  }

  // 6. Créer la question
  const question = await prisma.question.create({
    data: {
      content:    body.content.trim(),
      authorName: hasName ? body.authorName.trim() : null,
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