import styles from "./page.module.css";
import Link from "next/link";

const MOCK_SESSIONS = [
  {
    id: "1",
    title: "Introduction à l'Agentic AI et Web3",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 5400000).toISOString(),
    room: "Grand Amphithéâtre",
    speakers: ["Alice Nakamoto"],
  },
  {
    id: "2",
    title: "L'avenir du Web 3.0",
    startTime: new Date(Date.now() + 7200000).toISOString(),
    endTime: new Date(Date.now() + 10800000).toISOString(),
    room: "Salle 102",
    speakers: ["Alice Smith"],
  },
  {
    id: "3",
    title: "Design Systems Modernes",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
    room: "Salle 102",
    speakers: ["Bob Martin"],
  }
];

async function getSessions() {
  const { default: prisma } = await import("@/lib/prisma");
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { startTime: "asc" },
      include: {
        room: true,
        sessionSpeakers: {
          include: {
            speaker: {
              select: { fullName: true },
            },
          },
        },
      },
    });

    if (sessions.length === 0) {
      return MOCK_SESSIONS;
    }

    return sessions.map((s) => ({
      id: s.id,
      title: s.title,
      startTime: s.startTime.toISOString(),
      endTime: s.endTime.toISOString(),
      room: s.room.name,
      speakers: s.sessionSpeakers.map((ss) => ss.speaker.fullName),
    }));
  } catch (error) {
    console.error("Impossible de charger le planning depuis Prisma:", error.message);
    return MOCK_SESSIONS;
  }
}

function formatTime(dateString) {
  try {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "--:--";
  }
}

export default async function SchedulePage() {
  const sessions = await getSessions();
  const rooms = [...new Set(sessions.map((s) => s.room))];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <span className={`${styles.badge} ${styles.badgeLive}`}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ev-success)', display: 'inline-block' }} className="live-pulse"></span>
          Planning connecté
        </span>
        <h1 className={styles.title}>Planning global</h1>
        <p className={styles.subtitle}>
          Vue multi-salles avec sessions en cours, horaires et intervenants en temps réel.
        </p>
      </section>

      <section className={styles.roomsGrid}>
        {rooms.map((room) => (
          <div key={room} className={styles.roomCard}>
            <h2 className={styles.roomTitle}>{room}</h2>

            <div className={styles.sessionList}>
              {sessions
                .filter((session) => session.room === room)
                .map((session) => {
                  const now = new Date();
                  const start = new Date(session.startTime);
                  const end = new Date(session.endTime);
                  const live = start <= now && end >= now;
                  const upcoming = start > now;
                  
                  let statusLabel = "Terminé";
                  let badgeStyleClass = styles.done;
                  if (live) {
                    statusLabel = "Live";
                    badgeStyleClass = styles.live;
                  } else if (upcoming) {
                    statusLabel = "À venir";
                    badgeStyleClass = styles.upcoming;
                  }

                  return (
                    <article key={session.id} className={styles.sessionCard}>
                      <div className={styles.sessionHeader}>
                        <div>
                          <h3 className={styles.sessionTitle}>{session.title}</h3>
                          <div className={styles.sessionTime}>
                            <span>🕐</span> {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </div>
                        </div>

                        <span className={`${styles.cardBadge} ${badgeStyleClass}`}>
                          {live && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} className="live-pulse"></span>}
                          {statusLabel}
                        </span>
                      </div>

                      <div className={styles.speakers}>
                        {session.speakers && session.speakers.length > 0 
                          ? `Intervenants : ${session.speakers.join(", ")}`
                          : "Pas d'intervenants renseignés"}
                      </div>

                      <div style={{ marginTop: '12px' }}>
                        <button className={styles.btnSecondary} type="button">
                          Détails
                        </button>
                      </div>
                    </article>
                  );
                })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}