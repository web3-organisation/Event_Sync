// "use client";
//
// import { useState } from "react";
// import SpeakerCard from "./SpeakerCard";
// import styles from "./SessionGroup.module.css";
//
// const SessionGroup = ({ session, searchQuery }) => {
//
//   const [collapsed, setCollapsed] = useState(false);
//
//   const count = session.speakers.length;
//
//   // Grille adaptée selon le nombre de speakers
//   const gridClass =
//       count === 1
//           ? `${styles.grid} ${styles.gridOne}`
//           : count === 2
//               ? `${styles.grid} ${styles.gridTwo}`
//               : styles.grid;
//
//   return (
//       <div className={styles.group}>
//
//         {/* ── HEADER ───────────────────────── */}
//         <div
//             className={styles.header}
//             onClick={() => setCollapsed(!collapsed)}
//         >
//
//           <div className={styles.headerInfo}>
//
//             {/* Badge */}
//             <span className={styles.badge}>
//             Session {session.id}
//           </span>
//
//             {/* Nom session */}
//             <h2 className={styles.sessionName}>
//               {session.name}
//             </h2>
//
//             {/* Description */}
//             {session.description && (
//                 <p className={styles.description}>
//                   {session.description}
//                 </p>
//             )}
//
//             {/* Meta infos */}
//             <div className={styles.meta}>
//             <span className={styles.metaItem}>
//               📅 {session.date}
//             </span>
//               <span className={styles.metaItem}>
//               🕐 {session.time}
//             </span>
//               {session.location && (
//                   <span className={styles.metaItem}>
//                 📍 {session.location}
//               </span>
//               )}
//               <span className={styles.speakerCount}>
//               🎤 {count} intervenant{count > 1 ? "s" : ""}
//             </span>
//             </div>
//
//           </div>
//
//           {/* Bouton collapse */}
//           <button className={styles.toggleBtn}>
//             {collapsed ? "▼ Afficher" : "▲ Masquer"}
//           </button>
//
//         </div>
//
//         {/* ── CONTENT ──────────────────────── */}
//         {!collapsed && (
//             <div className={styles.content}>
//
//               {/* Sous titre */}
//               <p className={styles.subtitle}>
//                 {count === 1
//                     ? "👤 Intervenant unique pour cette session"
//                     : `👥 ${count} intervenants pour cette session`}
//               </p>
//
//               {/* Grille des cartes */}
//               <div className={gridClass}>
//                 {session.speakers.map((speaker) => (
//                     <SpeakerCard
//                         key={speaker.id}
//                         speaker={speaker}
//                         searchQuery={searchQuery}
//                     />
//                 ))}
//               </div>
//
//             </div>
//         )}
//
//       </div>
//   );
// };
//
// export default SessionGroup;


"use client";

import SpeakerCard from "./SpeakerCard";
import styles from "./SessionGroup.module.css";

const SessionGroup = ({ session, searchQuery }) => {
  const count = session.speakers.length;

  return (
      <div className={styles.sessionBlock}>

        {/* ── HEADER ── */}
        <div className={styles.sessionHeader}>
          {session.isLive && <span className={styles.liveDot} />}
          <span className={styles.sessionTime}>{session.time}</span>
          <span className={styles.sessionTitle}>{session.name}</span>
          <div className={styles.sessionMeta}>
            {session.isLive && (
                <span className={styles.liveBadge}>Live</span>
            )}
            {session.location && (
                <span className={styles.metaPill}>📍 {session.location}</span>
            )}
            <span className={styles.metaPill}>
            🎤 {count} intervenant{count > 1 ? "s" : ""}
          </span>
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
  );
};

export default SessionGroup;