//app/admin/events/page.jsx
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AddEventModal from "@/app/components/AddEventModal";
import styles from "./page.module.css";

async function deleteEventsByIds(eventIds) {
  if (!eventIds.length) return;

  // Delete related sessions and their dependencies
  const sessions = await prisma.session.findMany({
    where: { eventId: { in: eventIds } },
    select: { id: true },
  });
  const sessionIds = sessions.map((s) => s.id);
  if (sessionIds.length) {
    await prisma.adminSession.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.question.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.session.deleteMany({ where: { id: { in: sessionIds } } });
  }

  // Delete related rooms
  const rooms = await prisma.room.findMany({
    where: { eventId: { in: eventIds } },
    select: { id: true },
  });
  const roomIds = rooms.map((r) => r.id);
  if (roomIds.length) {
    await prisma.adminRoom.deleteMany({ where: { roomId: { in: roomIds } } });
    await prisma.room.deleteMany({ where: { id: { in: roomIds } } });
  }

  // Delete admin-event links and the events themselves
  await prisma.adminEvent.deleteMany({ where: { eventId: { in: eventIds } } });
  await prisma.event.deleteMany({ where: { id: { in: eventIds } } });
}

async function deleteEvent(formData) {
  "use server";
  const id = formData.get("id");
  if (!id) return;
  await deleteEventsByIds([id]);
  redirect("/admin/events");
}

async function getEvents() {
  return await prisma.event.findMany({
    orderBy: { startDate: "asc" },
    select: { id: true, title: true, startDate: true, endDate: true, location: true },
  });
}

export default async function AdminEventsPage() {
  const events = await getEvents();
  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <h1 className={styles.title}>Gestion des événements</h1>
        <AddEventModal />
      </section>
      <table className={styles.eventTable}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Lieu</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id}>
              <td>{e.title}</td>
              <td>{new Date(e.startDate).toLocaleDateString("fr-FR")}</td>
              <td>{new Date(e.endDate).toLocaleDateString("fr-FR")}</td>
              <td>{e.location ?? "-"}</td>
              <td>
                <form action={deleteEvent} className={styles.deleteForm}>
                  <input type="hidden" name="id" value={e.id} />
                  <button type="submit" className={styles.deleteButton}>🗑️ Supprimer</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
