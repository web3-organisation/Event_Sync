// src/app/sessions/[id]/actions.js
"use server";

import { revalidatePath } from "next/cache";

const API_BASE = process.env.NEXT_PUBLIC_APP_URL;

export async function submitQuestion(sessionId, formData) {
  const content = formData.get("content");
  const authorName = formData.get("author_name");

  if (!content || content.trim().length === 0) {
    return { error: "La question ne peut pas être vide." };
  }

  try {
    const res = await fetch(`${API_BASE}/api/sessions/${sessionId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content:    content.trim(),
        authorName: authorName?.trim() || null,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      // Remonte le message d'erreur de la route (anti-spam, doublon, etc.)
      return { error: data.error ?? "Erreur lors de l'envoi de la question." };
    }

    revalidatePath(`/sessions/${sessionId}`);
    return { question: data };

  } catch (e) {
    console.error(e);
    return { error: "Erreur réseau lors de l'envoi de la question." };
  }
}

export async function upvoteQuestion(questionId, sessionId) {
  try {
    await fetch(`${API_BASE}/api/questions/${questionId}/upvote`, {
      method: "POST",
    });
    revalidatePath(`/sessions/${sessionId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function downvoteQuestion(questionId, sessionId) {
  try {
    await fetch(`${API_BASE}/api/questions/${questionId}/downvote`, {
      method: "POST",
    });
    revalidatePath(`/sessions/${sessionId}`);
  } catch (e) {
    console.error(e);
  }
}