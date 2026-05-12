"use server";

import { prisma } from "../../lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitQuestion(sessionId, formData) {
  const content = formData.get("content");
  const authorName = formData.get("author_name");

  if (!content || content.trim().length === 0) {
    return { error: "La question ne peut pas être vide." };
  }

  try {
    await prisma.question.create({
      data: {
        content: content.trim(),
        authorName: authorName?.trim() || null,
        sessionId,
      },
    });
    revalidatePath(`/sessions/${sessionId}`);
  } catch (e) {
    console.error(e);
    return { error: "Erreur lors de l'envoi de la question." };
  }
}

export async function upvoteQuestion(questionId, sessionId) {
  try {
    await prisma.question.update({
      where: { id: questionId },
      data: { upvotes: { increment: 1 } },
    });
    revalidatePath(`/sessions/${sessionId}`);
  } catch (e) {
    console.error(e);
  }
}

export async function downvoteQuestion(questionId, sessionId) {
  try {
    await prisma.question.update({
      where: { id: questionId },
      data: { upvotes: { decrement: 1 } },
    });
    revalidatePath(`/sessions/${sessionId}`);
  } catch (e) {
    console.error(e);
  }
}
