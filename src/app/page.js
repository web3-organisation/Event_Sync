import styles from "./page.module.css";
import Link from "next/link";
import prisma from "@/lib/prisma";


function formatDateRange(startDate, endDate) {
  if (!startDate || !endDate) return "Date non disponible";
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If same month and same year
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      const monthYear = end.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      return `${start.getDate()} - ${end.getDate()} ${monthYear}`;
    }
    
    return `${start.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`;
  } catch (e) {
    return "Date non disponible";
  }
}

function formatTime(date) {
  if (!date) return "--:--";
  try {
    return new Date(date).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "--:--";
  }
}

async function getEventData() {
  try {
    const event = await prisma.event.findFirst({
      orderBy: { createdAt: "desc" },
    });
    return event;
  } catch (error) {
    console.error("Impossible de charger l'événement depuis Prisma:", error.message);
    return null;
  }
}

async function getLiveSessions() {
  const now = new Date();
  try {
    const liveSessions = await prisma.session.findMany({
      where: {
        startTime: { lte: now },
        endTime: { gte: now },
      },
      orderBy: { startTime: "asc" },
      include: {
        room: true,
        sessionSpeakers: {
          include: {
            speaker: true,
          },
        },
      },
    });

    return liveSessions.map((s) => {
      const firstSpeaker = s.sessionSpeakers[0]?.speaker;
      const speakerName = firstSpeaker ? firstSpeaker.fullName : "Pas d'intervenants renseignés";
      
      // Initials for avatar
      const avatar = firstSpeaker 
        ? firstSpeaker.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : "?";

      // Format time range
      const time = `${formatTime(s.startTime)} - ${formatTime(s.endTime)}`;

      // photoUrl or fallback
      const image = firstSpeaker?.photoUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=400&h=240&fit=crop";

      return {
        id: s.id,
        title: s.title,
        time,
        room: s.room.name,
        speaker: speakerName,
        avatar,
        image,
      };
    });
  } catch (error) {
    console.error("Impossible de charger les sessions en direct depuis Prisma:", error.message);
    return [];
  }
}

async function getFeaturedSession() {
  const now = new Date();
  try {
    // Try to get a live session first
    let session = await prisma.session.findFirst({
      where: {
        startTime: { lte: now },
        endTime: { gte: now },
      },
      include: {
        room: true,
      },
      orderBy: { startTime: "asc" },
    });

    // If no live session, get the next upcoming session
    if (!session) {
      session = await prisma.session.findFirst({
        where: {
          startTime: { gt: now },
        },
        include: {
          room: true,
        },
        orderBy: { startTime: "asc" },
      });
    }

    // If still no session, get any session
    if (!session) {
      session = await prisma.session.findFirst({
        include: {
          room: true,
        },
        orderBy: { startTime: "asc" },
      });
    }

    return session;
  } catch (error) {
    console.error("Impossible de charger la session vedette depuis Prisma:", error.message);
    return null;
  }
}

export default async function Home() {
  const event = await getEventData();
  const sessions = await getLiveSessions();
  const featuredSession = await getFeaturedSession();

  // Determine fallback metadata if no event is found in the database
  const eventTitle = event?.title || "Événement Tech";
  const eventDescription = event?.description || "Découvrez notre planning d'ateliers et de conférences en temps réel.";
  const eventLocation = event?.location || "En ligne / Sur place";
  const eventDates = event ? formatDateRange(event.startDate, event.endDate) : "Dates à venir";

  // Determine if featured session is live
  const now = new Date();
  const isFeaturedLive = featuredSession && new Date(featuredSession.startTime) <= now && new Date(featuredSession.endTime) >= now;

  return (
    <main className={styles.page}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.liveTag}>
            {sessions.length > 0 ? "En direct maintenant" : "Planning connecté"}
          </span>
          <h1 className={styles.heroTitle}>{eventTitle}</h1>
          
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span>📅</span> {eventDates}
            </div>
            <div className={styles.metaItem}>
              <span>📍</span> {eventLocation}
            </div>
            {featuredSession && (
              <div className={styles.metaItem}>
                <span>👥</span> Actif
              </div>
            )}
          </div>

          <p className={styles.description}>{eventDescription}</p>

          <div className={styles.heroActions}>
            <Link href="/planning" className={styles.btnPrimary}>
              Voir le planning
            </Link>

            <Link href="/planning" className={styles.btnSecondary}>
              À propos
            </Link>
          </div>
        </div>

        {/* Dynamic Featured Session Card */}
        {featuredSession ? (
          <div className={styles.featuredCard}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&h=350&fit=crop" 
              alt={featuredSession.title} 
              className={styles.featuredImage}
            />
            <div className={styles.featuredBadge}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white', display: 'inline-block' }} className="live-pulse"></span>
              {isFeaturedLive ? "Live" : "À la une"}
            </div>
            <div className={styles.featuredOverlay}>
              <h2 className={styles.featuredTitle}>{featuredSession.title}</h2>
              <div className={styles.featuredMeta}>
                <span>🕐 {formatTime(featuredSession.startTime)} - {formatTime(featuredSession.endTime)}</span>
                <span>📍 {featuredSession.room.name}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.featuredCardEmpty}>
            <div>
              <span style={{ fontSize: "2rem" }}>📅</span>
              <h3 style={{ margin: "10px 0 5px", color: "var(--text-primary)" }}>Aucune session</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                Les conférences apparaîtront ici dès qu'elles seront programmées.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Sessions en direct Grid */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sessions en direct</h2>
          <Link href="/planning" className={styles.seeAll}>
            Voir tout &rarr;
          </Link>
        </div>

        {sessions.length === 0 ? (
          <div className={styles.noSessions}>
            <span className={styles.noSessionsIcon}>📢</span>
            <p className={styles.noSessionsText}>Aucune session n'est en cours de diffusion pour le moment.</p>
            <Link href="/planning" className={styles.noSessionsLink}>
              Découvrir le planning complet
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {sessions.map((session) => (
              <Link key={session.id} href="/planning" className={styles.sessionCard}>
                <div className={styles.cardHeader}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={session.image} 
                    alt={session.title} 
                    className={styles.cardImage}
                  />
                  <div className={styles.cardHeaderBadge}>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'white', display: 'inline-block' }} className="live-pulse"></span>
                    Live
                  </div>
                </div>
                
                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{session.title}</h3>
                  
                  <div className={styles.cardTimeRow}>
                    <span>🕐 {session.time}</span>
                    <span>•</span>
                    <span>📍 {session.room}</span>
                  </div>

                  <div className={styles.cardFooter}>
                    <div className={styles.speakerAvatar}>
                      {session.avatar}
                    </div>
                    <span className={styles.speakerName}>{session.speaker}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}
