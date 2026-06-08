import prisma from "@/lib/prisma";

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    const questions = await prisma.question.findMany({
      where: { sessionId: id },
      select: { id: true },
    });
    const questionIds = questions.map((q) => q.id);
    if (questionIds.length) {
      await prisma.adminQuestion.deleteMany({ where: { questionId: { in: questionIds } } });
      await prisma.question.deleteMany({ where: { id: { in: questionIds } } });
    }

    await prisma.adminSession.deleteMany({ where: { sessionId: id } });
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } });
    await prisma.session.delete({
      where: { id }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Impossible de supprimer la session." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
