"use client";

import SpeakerCard from "./SpeakerCard";
import styles from "./SessionGroup.module.css";
import Reveal from "../ui/Reveal";

const SessionGroup = ({ session, searchQuery }) => {
  const count = session.speakers.length;
    const formatTime = (ts) => {
        if (!ts) return "";

        // cas Firebase Timestamp
        const date =
            ts.seconds
                ? new Date(ts.seconds * 1000)
                : new Date(ts);

        return date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

  return (
      <Reveal>
      <div className={styles.sessionBlock}>

        {/* ── HEADER ── */}
        <div className={styles.sessionHeader}>
          {session.isLive && <span className={styles.liveDot} />}
          <span className={styles.sessionTime}>
              {formatTime(session.startTime)} - {formatTime(session.endTime)}
          </span>


          <span className={styles.sessionTitle}>
              {session.title}
          </span>
          <div className={styles.sessionMeta}>
            {session.isLive && (
                <span className={styles.liveBadge}>Live</span>
            )}
              {session.room && (
                  <span className={styles.location}>📍 {session.room}</span>
              )}

          </div>
        </div>

        <div className={styles.sep} />

        {/* ── GRILLE ── */}
        <div className={styles.grid}>
          {session.speakers.map((speaker) => (
              <SpeakerCard
                  key={speaker.id}
                  speaker={speaker}
                  searchQuery={searchQuery}
              />
          ))}
        </div>

      </div>
      </Reveal>
  );
};

export default SessionGroup;