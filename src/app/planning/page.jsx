// src/app/planning/page.jsx
import styles from "./page.module.css";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SessionCard from "@/app/components/SessionCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faLocationDot,
  faBuildingColumns,
  faCircleDot,
  faGear, 
} from "@fortawesome/free-solid-svg-icons";

export const dynamic = "force-dynamic";

async function getEvent(eventId) {
  if (!eventId) return null;
  try {
    return await prisma.event.findUnique({ where: { id: eventId } });
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getSessions(eventId) {
  try {
    const sessions = await prisma.session.findMany({
      where: eventId ? { eventId } : {},
      orderBy: { startTime: "asc" },
      include: {
        room: true,
        event: { select: { title: true } },
        sessionSpeakers: {
          include: { speaker: { select: { fullName: true } } },
        },
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

export default async function SchedulePage({ searchParams }) {
  const { eventId = null } = await searchParams;

  const [sessions, event] = await Promise.all([
    getSessions(eventId),
    getEvent(eventId),
  ]);

  const rooms = [...new Set(sessions.map((s) => s.room))];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={`${styles.badge} ${styles.badgeLive}`}>
          <FontAwesomeIcon
            icon={faCircleDot}
            style={{ width: "10px", height: "10px", color: "var(--ev-success)" }}
          />
          Planning connecté
        </span>

        <h1 className={styles.title}>
          {event ? event.title : "Planning global"}
        </h1>

        <div style={{ display: "flex", gap: "12px", margin: "20px 0", flexWrap: "wrap" }}>
          <Link
            href="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              color: "var(--ev-primary)",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
              border: "2px solid var(--ev-primary)",
            }}
          >
            ← Tous les événements
          </Link>

          <Link
  href="/admin/events"
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "var(--ev-primary)",
    color: "var(--ev-background)",
    padding: "10px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
    boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.39)",
  }}
>
  <FontAwesomeIcon icon={faGear} style={{ width: "14px", height: "14px" }} />
  Gérer les événements
</Link>
        </div>

        {event && (
          <div className={styles.eventMeta}>
            {event.startDate && event.endDate && (
              <span className={styles.eventMetaItem}>
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  style={{ width: "14px", height: "14px" }}
                />
                {formatDate(event.startDate)} → {formatDate(event.endDate)}
              </span>
            )}
            {event.location && (
              <span className={styles.eventMetaItem}>
                <FontAwesomeIcon
                  icon={faLocationDot}
                  style={{ width: "14px", height: "14px" }}
                />
                {event.location}
              </span>
            )}
            <span className={styles.eventMetaItem}>
              <FontAwesomeIcon
                icon={faBuildingColumns}
                style={{ width: "14px", height: "14px" }}
              />
              {rooms.length} salle{rooms.length !== 1 ? "s" : ""} ·{" "}
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
          <span className={styles.noSessionsIcon}>
            <FontAwesomeIcon icon={faCalendarDays} style={{ width: "32px", height: "32px" }} />
          </span>
          <h2 className={styles.noSessionsTitle}>
            {event
              ? `Aucune session pour « ${event.title} »`
              : "Aucune session programmée"}
          </h2>
          <p className={styles.noSessionsText}>
            {event
              ? "Cet événement n'a pas encore de sessions. Les sessions apparaîtront ici une fois créées."
              : "Sélectionnez un événement depuis la liste pour voir ses sessions."}
          </p>
          <Link href="/events" className={styles.noSessionsLink}>
            ← Retour aux événements
          </Link>
        </div>
      ) : (
        <section className={styles.roomsGrid}>
          {rooms.map((room) => (
            <div key={room} className={styles.roomCard}>
              <h2 className={styles.roomTitle}>{room}</h2>
              <div className={styles.sessionList}>
                {sessions
                  .filter((s) => s.room === room)
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