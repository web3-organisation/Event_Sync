"use client";

import { useState } from "react";
import SpeakerCard from "./SpeakerCard";

const SessionGroup = ({ session, searchQuery }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const count = session.speakers.length;

  const gridClass =
    count === 1
      ? "grid-cols-1 max-w-sm mx-auto"
      : count === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100
                    shadow-sm mb-8">

      {/* ── En-tête session ─────────────────── */}
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="
          flex items-start justify-between gap-4 p-6 cursor-pointer
          bg-gradient-to-r from-violet-600 to-purple-600
          hover:opacity-95 transition-opacity
        "
      >
        <div className="flex-1">
          <span className="inline-block bg-white/20 text-white
                           text-xs font-semibold px-3 py-1 rounded-full
                           uppercase tracking-wider mb-3">
            Session {session.id}
          </span>

          <h2 className="text-xl font-bold text-white mb-1">
            {session.name}
          </h2>

          {session.description && (
            <p className="text-white/75 text-sm mb-3">
              {session.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <span className="text-white/85 text-sm">📅 {session.date}</span>
            <span className="text-white/85 text-sm">🕐 {session.time}</span>
            {session.location && (
              <span className="text-white/85 text-sm">
                📍 {session.location}
              </span>
            )}
            <span className="bg-white/20 text-white text-xs
                             font-semibold px-3 py-1 rounded-full">
              🎤 {count} intervenant{count > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <button className="flex-shrink-0 bg-white/20 hover:bg-white/30
                           text-white text-sm font-medium
                           px-4 py-2 rounded-xl transition-colors">
          {isCollapsed ? "▼ Afficher" : "▲ Masquer"}
        </button>
      </div>

      {/* ── Grille des speakers ─────────────── */}
      {!isCollapsed && (
        <div className="bg-gray-50 p-6">
          <p className="text-xs text-gray-400 text-center mb-5">
            {count === 1
              ? "👤 Intervenant unique pour cette session"
              : `👥 ${count} intervenants pour cette session`}
          </p>

          <div className={`grid gap-4 ${gridClass}`}>
            {session.speakers.map((speaker) => (
              <SpeakerCard
                key={speaker.id}
                speaker={speaker}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionGroup;