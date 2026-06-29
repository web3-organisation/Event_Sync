import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddSessionModal from "@/app/components/AddSessionModal";
import styles from "../page.module.css";

async function deleteSession(formData: FormData) {
  "use server";
  const id = formData.get("id") as string | null;
  const eventId = formData.get("eventId") as string | null;
  if (!id || !eventId) return;

  // Delete dependencies
  await prisma.adminSession.deleteMany({ where: { sessionId: id } });
  await prisma.sessionSpeaker.deleteMany({ where: { sessionId: id } });
  
  const questions = await prisma.question.findMany({
    where: { sessionId: id },
    select: { id: true },
  });
  const questionIds = questions.map(q => q.id);
  if (questionIds.length) {
    await prisma.adminQuestion.deleteMany({ where: { questionId: { in: questionIds } } });
    await prisma.question.deleteMany({ where: { id: { in: questionIds } } });
  }

  // Delete session
  await prisma.session.delete({ where: { id } });

  redirect(`/admin/events/${eventId}`);
}

export default async function AdminSessionsPage({ params }: { params: { id: string } }) {
  const eventId = params.id;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      sessions: {
        orderBy: { startTime: 'asc' },
        include: { room: true }
      }
    }
  });

  if (!event) return <div>Événement introuvable</div>;

  return (
    <main className={styles.page}>
      <Link href="/admin/events" style={{ color: 'var(--primary)', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
        ← Retour aux événements
      </Link>
      <section className={styles.header}>
        <h1 className={styles.title}>Sessions pour : {event.title}</h1>
        <AddSessionModal eventId={event.id} />
      </section>

      <table className={styles.eventTable}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Salle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {event.sessions.map((s) => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>{new Date(s.startTime).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</td>
              <td>{new Date(s.endTime).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' })}</td>
              <td>{s.room?.name ?? "-"}</td>
              <td>
                <form action={deleteSession} className={styles.deleteForm}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="eventId" value={event.id} />
                  <button type="submit" className={styles.deleteButton}>🗑️ Supprimer</button>
                </form>
              </td>
            </tr>
          ))}
          {event.sessions.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '1rem' }}>
                Aucune session programmée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
