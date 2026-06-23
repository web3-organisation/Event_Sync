"use client";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // ou remplace par props si tu n'utilises pas React Router
import { Link } from "react-router-dom";      // idem, adapte si besoin
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Mic,
} from "lucide-react";

// ─── Utilitaires (remplace les imports de @/lib) ───────────────────────────

function formatEventDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTimeRange(start, end) {
  const fmt = (d) =>
    new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}`;
}

function getSessionStatus(startTime, endTime) {
  const now = Date.now();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  if (now >= start && now <= end) return "live";
  if (now < start) return "upcoming";
  return "ended";
}

function groupSessionsByDate(sessions) {
  const map = new Map();
  for (const s of sessions) {
    const day = new Date(s.startTime).toISOString().split("T")[0];
    if (!map.has(day)) map.set(day, []);
    map.get(day).push(s);
  }
  return map;
}

// ─── Config statut ────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  live: {
    label: "En direct",
    bg: "rgba(0,212,170,0.13)",
    color: "var(--teal)",
    border: "rgba(0,212,170,0.4)",
    dot: true,
  },
  upcoming: {
    label: "À venir",
    bg: "rgba(108,99,255,0.1)",
    color: "var(--violet)",
    border: "rgba(108,99,255,0.3)",
    dot: false,
  },
  ended: {
    label: "Terminée",
    bg: "rgba(26,26,46,0.05)",
    color: "rgba(26,26,46,0.4)",
    border: "rgba(26,26,46,0.1)",
    dot: false,
  },
};

// ─── Page principale ──────────────────────────────────────────────────────

export default function EventDetailPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState("rooms");
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setEvent(data);
          if (data.sessions?.length) {
            const firstDate = new Date(data.sessions[0].startTime)
              .toISOString()
              .split("T")[0];
            setSelectedDate(firstDate);
          }
        }
      })
      .catch(() => setError("Erreur réseau."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          color: "var(--navy)",
          background: "var(--ghost)",
        }}
      >
        <span
          className="animate-spin"
          style={{
            width: "24px",
            height: "24px",
            border: "3px solid var(--violet)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            display: "inline-block",
          }}
        />
        Chargement…
      </div>
    );

  if (error || !event)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "var(--ghost)",
        }}
      >
        <p style={{ color: "var(--coral)", fontWeight: 600 }}>
          {error || "Événement introuvable."}
        </p>
        <Link to="/events" style={{ color: "var(--violet)", textDecoration: "none" }}>
          ← Retour aux événements
        </Link>
      </div>
    );

  const dateMap = groupSessionsByDate(event.sessions);
  const dates = Array.from(dateMap.keys()).sort();
  const sessionsForDate = selectedDate ? (dateMap.get(selectedDate) ?? []) : event.sessions;

  return (
    <main style={{ minHeight: "100vh", background: "var(--ghost)" }}>
      {/* Header */}
      <header
        style={{
          background: "var(--navy)",
          padding: "3rem 2rem 2.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="animate-float-bg"
          style={{
            position: "absolute",
            top: "-80px",
            right: "-80px",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ maxWidth: "980px", margin: "0 auto", position: "relative" }}>
          <Link
            to="/events"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              color: "rgba(248,249,255,0.55)",
              fontSize: "0.85rem",
              textDecoration: "none",
              marginBottom: "1.5rem",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(248,249,255,0.55)")}
          >
            <ChevronLeft size={15} /> Tous les événements
          </Link>

          <h1
            className="animate-slide-up"
            style={{
              color: "white",
              fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
              fontWeight: 800,
              margin: "0 0 1rem",
              lineHeight: 1.2,
            }}
          >
            {event.title}
          </h1>

          {event.description && (
            <p
              className="animate-slide-up s1"
              style={{
                color: "rgba(248,249,255,0.65)",
                fontSize: "1rem",
                maxWidth: "600px",
                lineHeight: 1.6,
                marginBottom: "1.25rem",
              }}
            >
              {event.description}
            </p>
          )}

          <div
            className="animate-slide-up s2"
            style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}
          >
            <HeaderMeta icon={<Calendar size={15} />}>
              {formatEventDate(event.startDate)}
              {event.startDate.split("T")[0] !== event.endDate.split("T")[0] &&
                ` → ${formatEventDate(event.endDate)}`}
            </HeaderMeta>
            {event.location && (
              <HeaderMeta icon={<MapPin size={15} />}>{event.location}</HeaderMeta>
            )}
            <HeaderMeta icon={<Users size={15} />}>
              {event.rooms.length} salle{event.rooms.length !== 1 ? "s" : ""} ·{" "}
              {event.sessions.length} session{event.sessions.length !== 1 ? "s" : ""}
            </HeaderMeta>
          </div>
        </div>
      </header>

      {/* Date tabs */}
      {dates.length > 1 && (
        <div
          style={{
            background: "white",
            borderBottom: "1px solid rgba(26,26,46,0.08)",
            overflowX: "auto",
          }}
        >
          <div
            style={{
              maxWidth: "980px",
              margin: "0 auto",
              padding: "0 2rem",
              display: "flex",
              gap: "4px",
            }}
          >
            {dates.map((d) => {
              const active = d === selectedDate;
              const label = new Date(d).toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              });
              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  style={{
                    padding: "0.85rem 1.25rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontFamily: "inherit",
                    fontWeight: active ? 700 : 500,
                    color: active ? "var(--violet)" : "rgba(26,26,46,0.55)",
                    background: "transparent",
                    borderBottom: active ? "2px solid var(--violet)" : "2px solid transparent",
                    transition: "color 0.15s, border-color 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* View toggle */}
      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "1.5rem 2rem 0" }}>
        <div
          style={{
            display: "flex",
            gap: "6px",
            background: "white",
            borderRadius: "10px",
            padding: "4px",
            width: "fit-content",
            boxShadow: "0 1px 6px rgba(26,26,46,0.08)",
          }}
        >
          {["rooms", "timeline"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 18px",
                borderRadius: "7px",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.83rem",
                fontWeight: 600,
                background: view === v ? "var(--navy)" : "transparent",
                color: view === v ? "white" : "rgba(26,26,46,0.5)",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {v === "rooms" ? "Par salle" : "Chronologie"}
            </button>
          ))}
        </div>
      </div>

      {/* Planning content */}
      <section style={{ maxWidth: "980px", margin: "0 auto", padding: "1.5rem 2rem 3rem" }}>
        {view === "rooms" ? (
          <RoomsView rooms={event.rooms} selectedDate={selectedDate} eventId={event.id} />
        ) : (
          <TimelineView sessions={sessionsForDate} eventId={event.id} />
        )}
      </section>
    </main>
  );
}

// ─── Rooms View ───────────────────────────────────────────────────────────

function RoomsView({ rooms, selectedDate, eventId }) {
  const ROOM_COLORS = [
    { accent: "var(--violet)", light: "rgba(108,99,255,0.08)" },
    { accent: "var(--teal)",   light: "rgba(0,212,170,0.08)"  },
    { accent: "var(--coral)",  light: "rgba(255,107,107,0.08)"},
    { accent: "var(--sky)",    light: "rgba(77,150,255,0.08)" },
    { accent: "var(--golden)", light: "rgba(255,217,61,0.08)" },
  ];

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {rooms.map((room, ri) => {
        const col = ROOM_COLORS[ri % ROOM_COLORS.length];
        const sessions = selectedDate
          ? room.sessions.filter(
              (s) => new Date(s.startTime).toISOString().split("T")[0] === selectedDate
            )
          : room.sessions;

        if (sessions.length === 0) return null;

        return (
          <div
            key={room.id}
            className="animate-slide-up"
            style={{
              background: "white",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 2px 12px rgba(26,26,46,0.06)",
              border: "1px solid rgba(26,26,46,0.06)",
            }}
          >
            {/* Room header */}
            <div
              style={{
                padding: "1rem 1.5rem",
                background: col.light,
                borderBottom: `2px solid ${col.accent}`,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: col.accent,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.95rem" }}>
                {room.name}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  color: col.accent,
                  fontSize: "0.78rem",
                  fontWeight: 600,
                }}
              >
                {sessions.length} session{sessions.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Sessions */}
            <div style={{ padding: "0.75rem" }}>
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  eventId={eventId}
                  accentColor={col.accent}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Timeline View ────────────────────────────────────────────────────────

function TimelineView({ sessions, eventId }) {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  const COLORS = [
    "var(--violet)",
    "var(--teal)",
    "var(--coral)",
    "var(--sky)",
    "var(--golden)",
    "var(--green)",
  ];

  return (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      {sorted.map((session, i) => (
        <SessionCard
          key={session.id}
          session={session}
          eventId={eventId}
          accentColor={COLORS[i % COLORS.length]}
          showRoom
        />
      ))}
    </div>
  );
}

// ─── Session Card ─────────────────────────────────────────────────────────

function SessionCard({ session, eventId, accentColor, showRoom = false }) {
  const status = getSessionStatus(session.startTime, session.endTime);
  const cfg = STATUS_CONFIG[status];
  const speakers = session.sessionSpeakers.map((ss) => ss.speaker);

  return (
    <Link
      to={`/events/${eventId}/sessions/${session.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          display: "flex",
          gap: "0",
          borderRadius: "10px",
          overflow: "hidden",
          border: "1px solid rgba(26,26,46,0.07)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateX(3px)";
          e.currentTarget.style.boxShadow = "0 4px 18px rgba(26,26,46,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateX(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Color stripe */}
        <div style={{ width: "4px", background: accentColor, flexShrink: 0 }} />

        <div style={{ flex: 1, padding: "0.9rem 1.1rem", background: "white" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Time + status */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.35rem",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    color: "rgba(26,26,46,0.5)",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                  }}
                >
                  <Clock size={12} />
                  {formatTimeRange(session.startTime, session.endTime)}
                </span>

                {showRoom && (
                  <span style={{ color: "rgba(26,26,46,0.35)", fontSize: "0.75rem" }}>
                    · {session.room.name}
                  </span>
                )}

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    background: cfg.bg,
                    color: cfg.color,
                    border: `1px solid ${cfg.border}`,
                    borderRadius: "999px",
                    padding: "2px 8px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {cfg.dot && (
                    <span
                      className="animate-pulse-dot"
                      style={{
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: cfg.color,
                        display: "inline-block",
                      }}
                    />
                  )}
                  {cfg.label}
                </span>
              </div>

              <h3
                style={{
                  color: "var(--navy)",
                  fontWeight: 700,
                  fontSize: "0.97rem",
                  margin: "0 0 0.35rem",
                  lineHeight: 1.35,
                }}
              >
                {session.title}
              </h3>

              {session.description && (
                <p
                  style={{
                    color: "rgba(26,26,46,0.55)",
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                    margin: "0 0 0.55rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {session.description}
                </p>
              )}

              {/* Speakers */}
              {speakers.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    flexWrap: "wrap",
                  }}
                >
                  <Mic size={12} color={accentColor} />
                  {speakers.map((sp) => (
                    <span
                      key={sp.id}
                      style={{
                        fontSize: "0.78rem",
                        color: "rgba(26,26,46,0.6)",
                        fontWeight: 500,
                      }}
                    >
                      {sp.fullName}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
              {session._count.questions > 0 && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(26,26,46,0.4)",
                    fontWeight: 600,
                  }}
                >
                  {session._count.questions} Q
                </span>
              )}
              <ChevronRight size={16} color={accentColor} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function HeaderMeta({ icon, children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        color: "rgba(248,249,255,0.7)",
        fontSize: "0.88rem",
      }}
    >
      {icon}
      {children}
    </span>
  );
}