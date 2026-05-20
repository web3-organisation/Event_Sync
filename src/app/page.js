import styles from "./page.module.css";
import Link from "next/link";

const LIVE_SESSIONS_MOCK = [
  {
    id: "1",
    title: "L'IA au service de l'expérience client",
    time: "10:00 - 11:00",
    room: "Auditorium A",
    speaker: "Sophie Martin",
    avatar: "SM",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=200&h=120&fit=crop"
  },
  {
    id: "2",
    title: "Cybersécurité : défis et perspectives",
    time: "10:15 - 11:15",
    room: "Salle B",
    speaker: "Lucas Bernard",
    avatar: "LB",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=200&h=120&fit=crop"
  },
  {
    id: "3",
    title: "Cloud & DevOps Best Practices",
    time: "09:45 - 10:45",
    room: "Salle C",
    speaker: "Emma Dubois",
    avatar: "ED",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200&h=120&fit=crop"
  },
  {
    id: "4",
    title: "Design Systems à grande échelle",
    time: "10:30 - 11:30",
    room: "Salle D",
    speaker: "Thomas Petit",
    avatar: "TP",
    image: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?q=80&w=200&h=120&fit=crop"
  }
];

export default function Home() {
  return (
    <main className={styles.page}>
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.liveTag}>En direct maintenant</span>
          <h1 className={styles.heroTitle}>Conférence Tech Innovations 2024</h1>
          
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span>📅</span> 24 - 25 Mai 2024
            </div>
            <div className={styles.metaItem}>
              <span>📍</span> Paris, France
            </div>
            <div className={styles.metaItem}>
              <span>👥</span> 1,2K participants
            </div>
          </div>

          <p className={styles.description}>
            Deux jours d'inspiration, de conférences et d'ateliers pour découvrir 
            les dernières tendances technologiques et rencontrer l'écosystème.
          </p>

          <div className={styles.heroActions}>
            <Link href="/planning" className={styles.btnPrimary}>
              Voir le planning
            </Link>
            <Link href="/planning" className={styles.btnSecondary}>
              À propos
            </Link>
          </div>
        </div>

        {/* Conference Hero Image Card */}
        <div className={styles.featuredCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/conference_hero.png" 
            alt="Conférence d'ouverture" 
            className={styles.featuredImage}
          />
          <div className={styles.featuredBadge}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'white', display: 'inline-block' }} className="live-pulse"></span>
            Live
          </div>
          <div className={styles.featuredOverlay}>
            <h2 className={styles.featuredTitle}>Conférence d'ouverture</h2>
            <div className={styles.featuredMeta}>
              <span>🕐 09:30 - 10:30</span>
              <span>📍 Auditorium A</span>
              <span>👁️ 1.2K</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sessions en direct Grid */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Sessions en direct</h2>
          <Link href="/planning" className={styles.seeAll}>
            Voir tout &rarr;
          </Link>
        </div>

        <div className={styles.grid}>
          {LIVE_SESSIONS_MOCK.map((session) => (
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
      </section>

    </main>
  );
}
