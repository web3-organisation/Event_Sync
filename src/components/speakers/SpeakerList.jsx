"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import SpeakerCard from "./SpeakerCard";
import styles from "./SpeakerList.module.css";

const SpeakerList = ({ speakers = [] }) => {
  const [search, setSearch] = useState("");

  const query = search.toLowerCase();

  const filteredSpeakers = speakers.filter(
    (sp) =>
      sp.fullName.toLowerCase().includes(query) ||
      sp.bio?.toLowerCase().includes(query),
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.searchContainer}>
          <div className={styles.searchBarContainer}>
            <SearchBar
              search={search}
              setSearch={setSearch}
              resultCount={filteredSpeakers.length}
            />
          </div>

          <div className={styles.stats}>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {speakers.length}
                  <span className={styles.statUnit}>speakers</span>
                </span>
                <span className={styles.statLabel}>
                  <span className={styles.statDot} />
                  CONFIRMÉS
                </span>
              </div>

              <div className={styles.statDivider} />

              <div className={styles.statCard}>
                <span className={styles.statValue}>
                  {filteredSpeakers.length}
                  <span className={styles.statUnit}>résultats</span>
                </span>
                <span className={styles.statLabel}>
                  <span className={styles.statDot} />
                  TROUVÉS
                </span>
              </div>
            </div>
          </div>
        </div>

        {filteredSpeakers.length === 0 && (
          <div className={styles.noResults}>
            <p className={styles.noResultsIcon}>404</p>
            <p className={styles.noResultsText}>Speaker not found</p>
            <p className={styles.noResultsScuse}>
              Sorry ! This Speaker does not exist
            </p>
            <button className={styles.resetBtn} onClick={() => setSearch("")}>
              Go Back
            </button>
          </div>
        )}

        {filteredSpeakers.length > 0 && (
          <div className={styles.grid}>
            {filteredSpeakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                searchQuery={search}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SpeakerList;
