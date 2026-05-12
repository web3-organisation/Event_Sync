"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import SessionGroup from "./SessionGroup";
import { sessions } from "@/data/speakers";

const SpeakerList = () => {

    // ── États pour la recherche et le filtre ──
    const [search, setSearch] = useState("");
    const [selectedSession, setSelectedSession] = useState("all");

    // ── Nombre total de speakers ──
    const totalSpeakers = sessions.reduce(
        (acc, s) => acc + s.speakers.length, 0
    );

    // ── Logique de filtrage ───────────────────
    const query = search.toLowerCase();

    const filteredSessions = sessions

        // 1. Filtrer par session sélectionnée
        .filter((session) =>
            selectedSession === "all" ||
            session.id === parseInt(selectedSession)
        )

        // 2. Filtrer les speakers par la recherche
        .map((session) => ({
            ...session,
            speakers: session.speakers.filter((speaker) =>
                // Recherche dans le nom
                speaker.name.toLowerCase().includes(query)     ||
                // Recherche dans l'email
                speaker.email.toLowerCase().includes(query)    ||
                // Recherche dans l'entreprise
                speaker.company.toLowerCase().includes(query)  ||
                // Recherche dans le titre/poste
                speaker.title.toLowerCase().includes(query)    ||
                // Recherche dans le téléphone
                speaker.phone.includes(query)                  ||
                // Recherche dans le twitter
                (speaker.twitter &&
                    speaker.twitter.toLowerCase().includes(query))
            ),
        }))

        // 3. Supprimer les sessions qui n'ont plus de speakers
        .filter((session) => session.speakers.length > 0);

    // ── Nombre de résultats ──
    const resultCount = filteredSessions.reduce(
        (acc, s) => acc + s.speakers.length, 0
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* ── En-tête ───────────────────────── */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold mb-3
                         bg-gradient-to-r from-violet-600 to-purple-600
                         bg-clip-text text-transparent">
                        🎤 Nos Intervenants
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Découvrez tous nos speakers groupés par session
                    </p>
                </div>

                {/* ── Stats ─────────────────────────── */}
                <div className="flex justify-center gap-4 mb-10 flex-wrap">
                    {[
                        { icon: "🗓️", value: sessions.length,  label: "Sessions"     },
                        { icon: "🎤", value: totalSpeakers,     label: "Intervenants" },
                    ].map((s) => (
                        <div
                            key={s.label}
                            className="bg-white rounded-2xl px-8 py-5 shadow-sm
                         border border-gray-100 flex flex-col items-center
                         min-w-[130px]"
                        >
                            <span className="text-2xl mb-1">{s.icon}</span>
                            <span className="text-3xl font-extrabold text-violet-600">
                {s.value}
              </span>
                            <span className="text-xs text-gray-400 uppercase
                               tracking-widest mt-1">
                {s.label}
              </span>
                        </div>
                    ))}
                </div>

                {/* ── Recherche + Filtre ────────────── */}
                <SearchBar
                    search={search}
                    setSearch={setSearch}
                    selectedSession={selectedSession}
                    setSelectedSession={setSelectedSession}
                    sessions={sessions}
                    resultCount={resultCount}
                />

                {/* ── Aucun résultat ────────────────── */}
                {filteredSessions.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-2xl
                          border border-gray-100 shadow-sm">
                        <p className="text-5xl mb-4">😕</p>
                        <p className="text-gray-400 text-xl mb-2">
                            Aucun intervenant trouvé
                        </p>
                        <p className="text-gray-300 text-sm mb-6">
                            Essayez un autre mot-clé ou changez de session
                        </p>
                        <button
                            onClick={() => {
                                setSearch("");
                                setSelectedSession("all");
                            }}
                            className="px-6 py-3 bg-violet-600 text-white rounded-xl
                         font-semibold hover:bg-violet-700 transition-colors"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                )}

                {/* ── Sessions + Cartes ─────────────── */}
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