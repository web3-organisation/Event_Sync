"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import SessionGroup from "./SessionGroup";
import styles from "./SpeakerList.module.css";

const SpeakerList = ({ sessions }) => {

    const [search, setSearch] = useState("");
    const [selectedSession, setSelectedSession] = useState("all");

    // Stats
    const totalSpeakers = sessions.reduce(
        (acc, s) => acc + s.speakers.length, 0
    );

    // Filter
    const query = search.toLowerCase();

    const filteredSessions = sessions
        .filter((s) =>
            selectedSession === "all" ||
            s.id === selectedSession
        )
        .map((session) => ({
            ...session,
            speakers: session.speakers.filter((sp) =>
                sp.fullName.toLowerCase().includes(query) ||
                sp.bio?.toLowerCase().includes(query)
            ),
        }))
        .filter((s) => s.speakers.length > 0);

    const resultCount = filteredSessions.reduce(
        (acc, s) => acc + s.speakers.length, 0
    );

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.searchContainer}>

                {/* Searching speakers */}
                    <div className={styles.searchBarContainer}>
                        <SearchBar
                            search={search}
                            setSearch={setSearch}
                            selectedSession={selectedSession}
                            setSelectedSession={setSelectedSession}
                            sessions={sessions}
                            resultCount={resultCount}
                        />
                    </div>


                    <div className={styles.stats}>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Sessions</span>
                            <span className={styles.statValue}>
                                {sessions.length}
                            </span>

                        </div>
                        <div className={styles.statCard}>
                            <span className={styles.statLabel}>Speakers</span>
                            <span className={styles.statValue}>
                                {totalSpeakers}
                            </span>

                        </div>
                    </div>
                </div>

                {/* If case : No results */}
                {filteredSessions.length === 0 && (
                    <div className={styles.noResults}>
                        <p className={styles.noResultsIcon}>Speakers not found</p>
                        <p className={styles.noResultsText}>
                            Aucun intervenant trouvé
                        </p>
                        <button
                            className={styles.resetBtn}
                            onClick={() => {
                                setSearch("");
                                setSelectedSession("all");
                            }}
                        >
                            Réinitialiser
                        </button>
                    </div>
                )}

                {/* Sessions */}
                <div>
                    {filteredSessions.map((session) => (
                        <SessionGroup
                            key={session.id}
                            session={session}
                            searchQuery={search}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SpeakerList;