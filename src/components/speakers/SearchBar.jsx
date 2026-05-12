"use client";

const SearchBar = ({
                       search,
                       setSearch,
                       selectedSession,
                       setSelectedSession,
                       sessions,
                       resultCount,
                   }) => {
    // Vérifier si des filtres sont actifs
    const hasFilters = search !== "" || selectedSession !== "all";

    // Réinitialiser tous les filtres
    const resetAll = () => {
        setSearch("");
        setSelectedSession("all");
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100
                    shadow-sm p-6 mb-10">

            {/* ── Titre section ──────────────────── */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-500 uppercase
                       tracking-wider">
                    🔍 Rechercher un intervenant
                </h2>

                {/* Nombre de résultats */}
                {hasFilters && (
                    <span className="text-xs bg-violet-100 text-violet-600
                           font-semibold px-3 py-1 rounded-full">
            {resultCount} résultat{resultCount > 1 ? "s" : ""} trouvé
                        {resultCount > 1 ? "s" : ""}
          </span>
                )}
            </div>

            {/* ── Input + Select ─────────────────── */}
            <div className="flex flex-col sm:flex-row gap-3">

                {/* Input de recherche */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Rechercher par nom, email, entreprise, poste..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="
              w-full pl-10 pr-10 py-3 rounded-xl
              bg-gray-50 text-sm text-gray-700
              border-2 border-gray-200
              focus:border-violet-500 focus:bg-white
              focus:outline-none transition-all
              placeholder:text-gray-400
            "
                    />

                    {/* Icône loupe */}
                    <span className="absolute left-3 top-1/2 -translate-y-1/2
                           text-gray-400 text-lg pointer-events-none">
            🔍
          </span>

                    {/* Bouton effacer le texte */}
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2
                         text-gray-400 hover:text-gray-600
                         transition-colors text-sm"
                            title="Effacer"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Select des sessions */}
                <div className="relative min-w-[250px]">
                    <select
                        value={selectedSession}
                        onChange={(e) => setSelectedSession(e.target.value)}
                        className="
              w-full pl-10 pr-4 py-3 rounded-xl
              bg-gray-50 text-sm text-gray-700
              border-2 border-gray-200
              focus:border-violet-500 focus:bg-white
              focus:outline-none transition-all
              appearance-none cursor-pointer
            "
                    >
                        <option value="all">
                            📋 Toutes les sessions ({sessions.length})
                        </option>
                        {sessions.map((session) => (
                            <option key={session.id} value={session.id}>
                                {session.name} — {session.speakers.length} intervenant
                                {session.speakers.length > 1 ? "s" : ""}
                            </option>
                        ))}
                    </select>

                    {/* Icône session */}
                    <span className="absolute left-3 top-1/2 -translate-y-1/2
                           text-gray-400 text-lg pointer-events-none">
            🗓️
          </span>

                    {/* Flèche dropdown */}
                    <span className="absolute right-3 top-1/2 -translate-y-1/2
                           text-gray-400 pointer-events-none">
            ▼
          </span>
                </div>
            </div>

            {/* ── Bouton réinitialiser ───────────── */}
            {hasFilters && (
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={resetAll}
                        className="text-sm text-violet-500 hover:text-violet-700
                       font-medium transition-colors flex items-center gap-1"
                    >
                        ✕ Réinitialiser les filtres
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchBar;