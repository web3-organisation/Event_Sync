import "../../css/session.css";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "../../lib/prisma";
import QASection from "./QASection";
import FavButton from "./FavButton";

function isLive(session) {
  const now = new Date();
  return now >= session.startTime && now <= session.endTime;
}

function formatTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TRACK_CLASS = {
  "Intelligence Artificielle": "track-ai",
  "Architecture":  "track-arch",
  "Frontend":      "track-frontend",
  "Langages":      "track-lang",
  "DevOps":        "track-devops",
  "Design":        "track-design",
  "Cloud":         "track-cloud",
  "Sécurité":      "track-security",
  "Keynote":       "track-keynote",
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    select: { title: true, description: true },
  });
  if (!session) return { title: "Session introuvable — EventSync" };
  return {
    title: `${session.title} — EventSync`,
    description: session.description?.slice(0, 160) ?? "",
  };
}

const IconClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconRoom = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconPeople = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
  </svg>
);
const IconBack = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const LINK_ICONS = {
  Twitter:  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25z"/></svg>,
  LinkedIn: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  GitHub:   <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>,
};
const DefaultLinkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
  </svg>
);

function SpeakerLinks({ links }) {
  if (!links?.length) return null;
  return (
    <div className="speaker-full-card__links">
      {links.map((link) => (
        <a key={link.id} href={link.url}
          className={`social-link ${link.label === "Site web" ? "social-link--web" : ""}`}
          target="_blank" rel="noopener noreferrer">
          {LINK_ICONS[link.label] ?? <DefaultLinkIcon />}
          {link.label}
        </a>
      ))}
    </div>
  );
}

function SpeakerAvatar({ speaker, size = "lg" }) {
  const cls   = size === "sm" ? "sidebar-speaker__avatar" : "speaker-full-card__avatar";
  const initials = speaker.fullName.split(" ").map((n) => n[0].toUpperCase()).slice(0, 2).join("");
  return (
    <div className={cls}>
      {speaker.photoUrl
        ? <img src={speaker.photoUrl} alt={speaker.fullName} style={{width:"100%",height:"100%",objectFit:"cover",borderRadius:"50%"}} />
        : initials}
    </div>
  );
}

export default async function SessionPage({ params }) {
  const { id } = await params;
  
  const session = await prisma.session.findUnique({
    where: { id },
    include: {
      room: true,
      event: {
        select: { id: true, title: true },
      },
      sessionSpeakers: {
        include: {
          speaker: {
            include: { speakerLinks: true },
          },
        },
        orderBy: { speaker: { fullName: "asc" } },
      },
      questions: {
        orderBy: [
          { upvotes: "desc" },
          { createdAt: "desc" },
        ],
      },
    },
  });

  if (!session) notFound();

  const live      = isLive(session);
  const speakers  = session.sessionSpeakers.map((ss) => ss.speaker);
  const questions = session.questions;
  const timeStart = formatTime(session.startTime);
  const timeEnd   = formatTime(session.endTime);

  return (
    <div className="container">
      <nav className="breadcrumb" aria-label="Fil d'Ariane">
        <Link href="/">Accueil</Link>
        <span className="breadcrumb-sep">›</span>
        <Link href={`/sessions`}>Sessions</Link>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{session.title}</span>
      </nav>

      <section className="session-hero" aria-label="En-tête de session">
        <div className="session-hero__inner">
          <div className="session-hero__badges">
            {live
              ? <span className="live-badge"><span className="live-dot" />LIVE</span>
              : <span className="status-badge status-upcoming">À venir</span>}
          </div>

          <h1 className="session-hero__title">{session.title}</h1>

          <div className="session-hero__actions">
            <Link href={`/sessions`} className="btn btn--outline btn--sm">
              <IconBack /> Retour aux sessions
            </Link>
            {live && <a href="#qa" className="btn btn--teal btn--sm">Poser une question →</a>}
          </div>
        </div>
      </section>

      <div className="session-layout">
        <main className="session-main">
          {session.description && (
            <section className="session-description" aria-label="Description">
              <h2>À propos de cette session</h2>
              {session.description.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </section>
          )}

          {speakers.length > 0 && (
            <section aria-label="Intervenants">
              <h2 className="session-description__heading">
                Intervenant{speakers.length > 1 ? "s" : ""}
              </h2>
              <div className="speakers-full-grid">
                {speakers.map((sp) => (
                  <div key={sp.id} className="speaker-full-card">
                    <div className="speaker-full-card__header">
                      <SpeakerAvatar speaker={sp} size="lg" />
                      <div>
                        <div className="speaker-full-card__name">{sp.fullName}</div>
                        {sp.bio && (
                          <p className="speaker-full-card__bio">{sp.bio}</p>
                        )}
                      </div>
                    </div>
                    <SpeakerLinks links={sp.speakerLinks} />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section id="qa" aria-label="Questions et réponses">
            <QASection
              sessionId={session.id}
              isLive={live}
              sessionStart={timeStart}
              initialQuestions={questions.map((q) => ({
                id:          q.id,
                content:     q.content,
                author_name: q.authorName,
                upvotes:     q.upvotes,
                created_at:  q.createdAt.toISOString(),
              }))}
            />
          </section>
        </main>

        <aside className="session-sidebar" aria-label="Informations pratiques">
          <div className="info-card">
            <p className="info-card__title">Infos pratiques</p>

            <div className="info-row">
              <div className="info-row__icon"><IconClock /></div>
              <div>
                <div className="info-row__label">Horaire</div>
                <div className={`info-row__value ${live ? "info-row__value--live" : ""}`}>
                  {timeStart} – {timeEnd}
                </div>
              </div>
            </div>

            <div className="info-row">
              <div className="info-row__icon"><IconRoom /></div>
              <div>
                <div className="info-row__label">Salle</div>
                <div className="info-row__value">{session.room.name}</div>
              </div>
            </div>

            {session.capacity != null && (
              <div className="info-row">
                <div className="info-row__icon"><IconPeople /></div>
                <div>
                  <div className="info-row__label">Capacité (indicative)</div>
                  <div className="info-row__value">{session.capacity} places</div>
                </div>
              </div>
            )}
          </div>

          <FavButton sessionId={session.id} />

          {speakers.length > 0 && (
            <div className="info-card">
              <p className="info-card__title">Intervenants</p>
              {speakers.map((sp) => (
                <div key={sp.id} className="sidebar-speaker">
                  <SpeakerAvatar speaker={sp} size="sm" />
                  <div>
                    <div className="sidebar-speaker__name">{sp.fullName}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}