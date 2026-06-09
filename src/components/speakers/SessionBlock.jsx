"use client";
import styles from "./SessionBlock.module.css";

const TRACK_LABEL = { ai:"IA", cy:"Cyber", cl:"Cloud", ds:"Design" };

const SessionBlock = ({ session }) => {
    const isLive = session.isLive;

    return (
        <div className={styles.block}>
            <div className={styles.header}>
                {isLive && <span className={styles.liveDot} />}
                <span className={styles.time}>{session.time}</span>
                <span className={styles.title}>{session.name}</span>
                <div className={styles.meta}>
                    {isLive && <span className={styles.liveBadge}>Live</span>}
                    {session.location && (
                        <span className={styles.room}>📍 {session.location}</span>
                    )}
                </div>
            </div>

            <div className={styles.sep} />

            <div className={styles.cards}>
                {session.speakers.map((sp) => (
                    <div key={sp.id} className={`${styles.card} ${styles[sp.track]}`}>
                        <div className={`${styles.avatar} ${styles[sp.track]}`}>
                            {sp.initials}
                        </div>
                        <div className={styles.info}>
                            <div className={styles.name}>{sp.fullName}</div>
                            <div className={styles.role}>{sp.role}</div>
                            <div className={styles.company}>{sp.company}</div>
                        </div>
                        <span className={`${styles.track} ${styles[sp.track]}`}>
              {TRACK_LABEL[sp.track]}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SessionBlock;