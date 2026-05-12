"use client";

import Image from "next/image";
import { useState } from "react";

const SpeakerCard = ({ speaker, searchQuery }) => {
    const [copied, setCopied]   = useState(false);
    const [showBio, setShowBio] = useState(false);

    const copyEmail = () => {
        navigator.clipboard.writeText(speaker.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── Fonction pour surligner le texte qui correspond à la recherche ──
    const highlight = (text) => {
        if (!searchQuery || searchQuery.trim() === "") return text;

        const regex = new RegExp(`(${searchQuery})`, "gi");
        const parts = text.split(regex);

        return parts.map((part, i) =>
                regex.test(part) ? (
                    <span key={i} className="bg-yellow-200 text-yellow-900
                                  rounded px-0.5 font-semibold">
          {part}
        </span>
                ) : (
                    part
                )
        );
    };

    return (
        <div
            className="
        flex flex-col bg-white rounded-2xl overflow-hidden
        border border-gray-100 shadow-sm
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
      "
        >
            {/* ── Photo ───────────────────────────── */}
            <div className="bg-gradient-to-br from-violet-100 to-purple-100
                      flex justify-center py-6">
                <div className="relative">
                    <Image
                        src={speaker.picture}
                        alt={speaker.name}
                        width={90}
                        height={90}
                        className="rounded-full border-4 border-white
                       shadow-md object-cover"
                    />
                    <span
                        className="absolute bottom-1 right-1
                       w-4 h-4 rounded-full
                       bg-green-400 border-2 border-white"
                    />
                </div>
            </div>

            {/* ── Corps ───────────────────────────── */}
            <div className="flex flex-col flex-1 p-5">

                {/* Nom / Titre / Entreprise */}
                <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">
                        {highlight(speaker.name)}
                    </h3>
                    <p className="text-sm text-violet-600 font-medium mt-0.5">
                        {highlight(speaker.title)}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                        🏢 {highlight(speaker.company)}
                    </p>
                </div>

                {/* Bio */}
                {speaker.bio && (
                    <div className="mb-4 text-center">
                        <p
                            className={`text-xs text-gray-500 leading-relaxed
                          ${!showBio ? "line-clamp-2" : ""}`}
                        >
                            {speaker.bio}
                        </p>
                        <button
                            onClick={() => setShowBio(!showBio)}
                            className="text-xs text-violet-400 hover:text-violet-600
                         mt-1 transition-colors"
                        >
                            {showBio ? "Voir moins ▲" : "Voir plus ▼"}
                        </button>
                    </div>
                )}

                <hr className="border-gray-100 mb-4" />

                {/* Contacts */}
                <div className="space-y-2.5 flex-1 mb-4">

                    {/* Email */}
                    <div className="flex items-center gap-2 text-sm">
                        <span>📧</span>
                        <a
                            href={`mailto:${speaker.email}`}
                            className="flex-1 truncate text-violet-600 hover:underline"
                        >
                            {highlight(speaker.email)}
                        </a>
                        <button
                            onClick={copyEmail}
                            title="Copier l'email"
                            className="flex-shrink-0 px-2 py-1 rounded-lg text-xs
                         bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            {copied ? "✅" : "📋"}
                        </button>
                    </div>

                    {/* Téléphone */}
                    <div className="flex items-center gap-2 text-sm">
                        <span>📞</span>
                        <a
                            href={`tel:${speaker.phone}`}
                            className="text-gray-600 hover:text-violet-600 transition-colors"
                        >
                            {highlight(speaker.phone)}
                        </a>
                    </div>

                    {/* LinkedIn */}
                    <div className="flex items-center gap-2 text-sm">
                        <span>💼</span>
                        <a
                            href={`https://${speaker.linkedin}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 truncate text-gray-600
                         hover:text-violet-600 transition-colors"
                        >
                            {speaker.linkedin}
                        </a>
                    </div>

                    {/* Twitter */}
                    {speaker.twitter && (
                        <div className="flex items-center gap-2 text-sm">
                            <span>🐦</span>
                            <span className="text-gray-600">{speaker.twitter}</span>
                        </div>
                    )}
                </div>

                {/* Boutons */}
                <div className="flex gap-2 mt-auto">
                    <a
                        href={`mailto:${speaker.email}`}
                        className="
              flex-1 text-center py-2 rounded-xl text-sm font-semibold
              text-white bg-gradient-to-r from-violet-600 to-purple-600
              hover:opacity-90 transition-opacity
            "
                    >
                        Contacter
                    </a>
                    <a
                        href={`https://${speaker.linkedin}`}
                        target="_blank"
                        rel="noreferrer"
                        className="
              flex-1 text-center py-2 rounded-xl text-sm font-semibold
              text-violet-600 border-2 border-violet-600
              hover:bg-violet-600 hover:text-white transition-all
            "
                    >
                        LinkedIn
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SpeakerCard;