"use client";

import { useRouter } from "next/navigation";
import styles from "../planning/page.module.css";

export default function SessionCard({ session }) {
  const router = useRouter();

  const deleteSession = async () => {
    if (!confirm('Supprimer cette session ?')) return;
    try {
      const res = await fetch(`/api/sessions/${session.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Échec de la suppression');
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('Impossible de supprimer la session');
    }
  };

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
            <span>🕐</span> {formatTime(session.startTime)} - {formatTime(session.endTime)}
          </div>
        </div>
        <span className={`${styles.cardBadge} ${badgeStyleClass}`}>
          {live && <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} className="live-pulse" />}
          {statusLabel}
        </span>
      </div>
      <div className={styles.speakers}>
        {session.speakers && session.speakers.length > 0
          ? `Intervenants : ${session.speakers.join(', ')}`
          : "Pas d'intervenants renseignés"}
      </div>
      <div style={{ marginTop: '12px' }}>
        <button className={styles.btnSecondary} type="button" onClick={deleteSession}>Supprimer</button>
        <button className={styles.btnSecondary} type="button">Détails</button>
      </div>
    </article>
  );
}

function formatTime(dateString) {
  try {
    return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '--:--';
  }
}
