import styles from "./page.module.css";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SessionCard from "@/app/components/SessionCard";


export const dynamic = "force-dynamic";

async function deleteSessionsById(sessionIds) {
  if (!sessionIds.length) return;

  const questions = await prisma.question.findMany({
    where: { sessionId: { in: sessionIds } },
    select: { id: true },
  });
  const questionIds = questions.map((q) => q.id);
  if (questionIds.length) {
    await prisma.adminQuestion.deleteMany({ where: { questionId: { in: questionIds } } });
    await prisma.question.deleteMany({ where: { id: { in: questionIds } } });
  }

  await prisma.adminSession.deleteMany({ where: { sessionId: { in: sessionIds } } });
  await prisma.sessionSpeaker.deleteMany({ where: { sessionId: { in: sessionIds } } });
  await prisma.session.deleteMany({ where: { id: { in: sessionIds } } });
}

async function deleteEventsByIds(eventIds) {
  if (!eventIds.length) return;

  const sessions = await prisma.session.findMany({
    where: { eventId: { in: eventIds } },
    select: { id: true },
  });
  await deleteSessionsById(sessions.map((s) => s.id));

  const rooms = await prisma.room.findMany({
    where: { eventId: { in: eventIds } },
    select: { id: true },
  });
  const roomIds = rooms.map((r) => r.id);
  if (roomIds.length) {
    await prisma.adminRoom.deleteMany({ where: { roomId: { in: roomIds } } });
    await prisma.room.deleteMany({ where: { id: { in: roomIds } } });
  }

  await prisma.adminEvent.deleteMany({ where: { eventId: { in: eventIds } } });
  await prisma.event.deleteMany({ where: { id: { in: eventIds } } });
}

async function deleteEvent(formData) {
  "use server";
  const id = formData.get("id");
  if (!id) return;
  try {
    await deleteEventsByIds([id]);
  } catch (err) {
    console.error(err);
  }
  redirect("/planning");
}

async function getSessions() {
  try {
    const pastEvents = await prisma.event.findMany({
      where: { endDate: { lt: new Date() } },
      select: { id: true },
    });
    const pastEventIds = pastEvents.map((e) => e.id);
    if (pastEventIds.length) {
      await deleteEventsByIds(pastEventIds);
    }
  } catch (cleanupError) {
    console.error(cleanupError);
  }

  try {
    const pastSessions = await prisma.session.findMany({
      where: { endTime: { lt: new Date() } },
      select: { id: true },
    });
    await deleteSessionsById(pastSessions.map((s) => s.id));
  } catch (cleanupError) {
    console.error(cleanupError);
  }

  try {
    const sessions = await prisma.session.findMany({
      orderBy: { startTime: "asc" },
      include: {
        room: true,
        event: { select: { title: true } },
        sessionSpeakers: { include: { speaker: { select: { fullName: true } } } },
      },
    });
    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      room: s.room.name,
      eventTitle: s.event?.title || null,
      speakers: s.sessionSpeakers.map((ss) => ss.speaker.fullName),
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getLatestEvent() {
  try {
    return await prisma.event.findFirst({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    console.error(error);
    return null;
  }
}

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function SchedulePage() {
  const [sessions, event] = await Promise.all([getSessions(), getLatestEvent()]);
  const rooms = [...new Set(sessions.map((s) => s.room))];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={`${styles.badge} ${styles.badgeLive}`}>
          <span
            className="live-pulse"
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--ev-success)",
              display: "inline-block",
            }}
          />
          Planning connecté
        </span>

        <h1 className={styles.title}>{event ? event.title : "Planning global"}</h1>
        
        <div style={{ margin: "20px 0" }}>
          <Link 
            href="http://localhost:5173/admin/events" 
            target="react_admin_tab"
            style={{ 
              display: "inline-flex", 
              alignItems: "center",
              background: "var(--ev-primary)", 
              color: "var(--ev-background)", 
              padding: "10px 24px", 
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
              boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.39)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease"
            }}
          >
            Gérer les événements ⚙️
          </Link>
        </div>

        {event && (
          <div className={styles.eventMeta}>
            {event.startDate && event.endDate && (
              <span className={styles.eventMetaItem}>
                📅 {formatDate(event.startDate)} → {formatDate(event.endDate)}
              </span>
            )}
            {event.location && (
              <span className={styles.eventMetaItem}>📍 {event.location}</span>
            )}
            <span className={styles.eventMetaItem}>
              🏛️ {rooms.length} salle{rooms.length !== 1 ? "s" : ""} ·{" "}
              {sessions.length} session{sessions.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        <p className={styles.subtitle}>
          {event?.description ||
            "Vue multi-salles avec sessions en cours, horaires et intervenants en temps réel."}
        </p>
      </section>

      {sessions.length === 0 ? (
        <div className={styles.noSessions}>
          <span className={styles.noSessionsIcon}>📋</span>
          <h2 className={styles.noSessionsTitle}>
            {event
              ? `Aucune session pour « ${event.title} »`
              : "Aucune session programmée"}
          </h2>
          <p className={styles.noSessionsText}>
            {event
              ? "Cet événement n'a pas encore de sessions. Les sessions apparaîtront ici une fois créées."
              : "Créez d'abord un événement depuis la page d'accueil, puis ajoutez des sessions."}
          </p>
          <Link href="/" className={styles.noSessionsLink}>
            ← Retour à l'accueil
          </Link>
        </div>
      ) : (
        <section className={styles.roomsGrid}>
          {rooms.map((room) => (
            <div key={room} className={styles.roomCard}>
              <h2 className={styles.roomTitle}>{room}</h2>
              <div className={styles.sessionList}>
                {sessions
                  .filter((session) => session.room === room)
                  .map((session) => (
                    <SessionCard key={session.id} session={session} />
                  ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}