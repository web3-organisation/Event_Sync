"use client";

import Link from "next/link";
import styles from "../planning/page.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCircle,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";

export default function SessionCard({ session }) {
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
    <article className={styles.sessionCard}>
      <div className={styles.sessionHeader}>
        <div>
          <h3 className={styles.sessionTitle}>{session.title}</h3>
          <div className={styles.sessionTime}>
            <FontAwesomeIcon
              icon={faClock}
              style={{ width: "13px", height: "13px" }}
            />
            {formatTime(session.startTime)} - {formatTime(session.endTime)}
          </div>
        </div>
        <span className={`${styles.cardBadge} ${badgeStyleClass}`}>
          {live && (
            <FontAwesomeIcon
              icon={faCircle}
              className="live-pulse"
              style={{ width: "6px", height: "6px" }}
            />
          )}
          {statusLabel}
        </span>
      </div>

      <div className={styles.speakers}>
        <FontAwesomeIcon
          icon={faMicrophone}
          style={{ width: "12px", height: "12px", marginRight: "6px" }}
        />
        {session.speakers && session.speakers.length > 0
          ? session.speakers.join(", ")
          : "Pas d'intervenants renseignés"}
      </div>

      <div style={{ marginTop: "12px" }}>
        <Link href={`/sessions/${session.id}`} className={styles.btnSecondary}>
          Voir la session
        </Link>
      </div>
    </article>
  );
}

function formatTime(dateString) {
  try {
    return new Date(dateString).toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Europe/Paris", 
    });
  } catch {
    return "--:--";
  }
}