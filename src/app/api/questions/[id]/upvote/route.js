//src/app/api/questions/[id]/upvote/route.js
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { isSessionLive } from "../../../../../lib/session-utils";

const COOLDOWN_MS = 10_000; // 10 secondes

// Deux maps séparées : une par IP (anonymes), une par nom
const ipRateLimit   = new Map(); // ip → timestamp
const nameRateLimit = new Map(); // nom_normalisé → timestamp

function normalizeName(name) {
  return name.trim().toLowerCase();
}

function checkRateLimit(map, key) {
  const last = map.get(key);
  if (!last) return null;
  const elapsed = Date.now() - last;
  if (elapsed < COOLDOWN_MS) {
    const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
    return remaining;
  }
  return null;
}

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

export async function GET(_req, { params }) {
  const { id: sessionId } = params;

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

export async function POST(req, { params }) {
  const { id: sessionId } = params;

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

  // 3. Valider
  const errors = validateQuestion(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "Données invalides.", details: errors }, { status: 422 });
  }

  const hasName = body.authorName?.trim().length > 0;
  const ip      = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";

  // 4. Anti-spam
  if (hasName) {
    // Utilisateur nommé → rate limit par nom
    const key       = normalizeName(body.authorName);
    const remaining = checkRateLimit(nameRateLimit, key);
    if (remaining !== null) {
      return NextResponse.json(
        { error: `Merci d'attendre ${remaining}s avant de poser une autre question, ${body.authorName.trim()}.` },
        { status: 429 }
      );
    }
    nameRateLimit.set(key, Date.now());
  } else {
    // Anonyme → rate limit par IP
    const remaining = checkRateLimit(ipRateLimit, ip);
    if (remaining !== null) {
      return NextResponse.json(
        { error: `Merci d'attendre ${remaining}s avant de poser une autre question.` },
        { status: 429 }
      );
    }
    ipRateLimit.set(ip, Date.now());
  }

  // 5. Créer la question
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