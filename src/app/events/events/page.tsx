"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, ChevronRight, Zap } from "lucide-react";
import type { EventSummary } from "@/lib/types";
import { formatEventDate } from "@/lib/session-utils";

// Assign a gradient accent per event index (cycling through palette)
const ACCENTS = [
  { from: "var(--violet)", to: "var(--sky)", tag: "#6C63FF" },
  { from: "var(--teal)", to: "var(--green)", tag: "#00D4AA" },
  { from: "var(--coral)", to: "var(--golden)", tag: "#FF6B6B" },
  { from: "var(--sky)", to: "var(--violet)", tag: "#4D96FF" },
  { from: "var(--golden)", to: "var(--coral)", tag: "#FFD93D" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvents(data);
        else setError("Impossible de charger les événements.");
      })
      .catch(() => setError("Erreur réseau."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--ghost)",
        padding: "0",
      }}
    >
      {/* Hero header */}
      <header
        style={{
          background: "var(--navy)",
          padding: "4rem 2rem 3rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative blobs */}
        <div
          className="animate-float-bg"
          style={{
            position: "absolute",
            top: "-60px",
            right: "-60px",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(108,99,255,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="animate-float-bg"
          style={{
            position: "absolute",
            bottom: "-40px",
            left: "10%",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,212,170,0.25) 0%, transparent 70%)",
            animationDelay: "3.5s",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative" }}>
          <div
            className="animate-slide-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(108,99,255,0.2)",
              border: "1px solid rgba(108,99,255,0.5)",
              borderRadius: "999px",
              padding: "6px 16px",
              marginBottom: "1.25rem",
            }}
          >
            <Zap size={14} color="var(--violet)" />
            <span
              style={{
                color: "var(--violet)",
                fontSize: "0.78rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Événements à venir
            </span>
          </div>

          <h1
            className="animate-slide-up s1"
            style={{
              color: "white",
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              fontWeight: 800,
              lineHeight: 1.15,
              margin: "0 0 1rem",
            }}
          >
            Tous les{" "}
            <span
              style={{
                background: "linear-gradient(135deg, var(--violet), var(--teal))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              événements
            </span>
          </h1>

          <p
            className="animate-slide-up s2"
            style={{
              color: "rgba(248,249,255,0.65)",
              fontSize: "1.05rem",
              maxWidth: "520px",
              lineHeight: 1.6,
            }}
          >
            Découvrez les conférences, workshops et summits. Consultez les plannings,
            les intervenants et les sessions en direct.
          </p>
        </div>
      </header>

      {/* Content */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              padding: "4rem 0",
              color: "var(--navy)",
              opacity: 0.5,
            }}
          >
            <span
              className="animate-spin"
              style={{
                width: "22px",
                height: "22px",
                border: "3px solid var(--violet)",
                borderTopColor: "transparent",
                borderRadius: "50%",
                display: "inline-block",
              }}
            />
            Chargement des événements…
          </div>
        )}

        {error && (
          <div
            style={{
              background: "rgba(255,107,107,0.12)",
              border: "1px solid var(--coral)",
              borderRadius: "12px",
              padding: "1.25rem 1.5rem",
              color: "var(--coral)",
              fontWeight: 500,
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 0",
              color: "rgba(26,26,46,0.4)",
            }}
          >
            <Calendar size={48} strokeWidth={1} style={{ marginBottom: "1rem" }} />
            <p style={{ fontSize: "1.1rem" }}>Aucun événement disponible pour le moment.</p>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gap: "1.25rem",
          }}
        >
          {events.map((event, i) => {
            const accent = ACCENTS[i % ACCENTS.length];
            const isUpcoming = new Date(event.startDate) > new Date();
            const isOngoing =
              new Date(event.startDate) <= new Date() &&
              new Date(event.endDate) >= new Date();

            return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className={`animate-slide-up s${Math.min(i + 1, 6)}`}
                style={{
                  display: "block",
                  background: "white",
                  borderRadius: "16px",
                  overflow: "hidden",
                  textDecoration: "none",
                  boxShadow: "0 2px 16px rgba(26,26,46,0.07)",
                  border: "1px solid rgba(26,26,46,0.07)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 8px 32px rgba(26,26,46,0.13)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 2px 16px rgba(26,26,46,0.07)";
                }}
              >
                {/* Accent bar */}
                <div
                  style={{
                    height: "5px",
                    background: `linear-gradient(90deg, ${accent.from}, ${accent.to})`,
                  }}
                />

                <div style={{ padding: "1.5rem 1.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Status badge */}
                      {isOngoing && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            background: "rgba(0,212,170,0.12)",
                            color: "var(--teal)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            letterSpacing: "0.07em",
                            textTransform: "uppercase",
                            padding: "3px 10px",
                            borderRadius: "999px",
                            marginBottom: "0.6rem",
                          }}
                        >
                          <span className="animate-pulse-dot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--teal)", display: "inline-block" }} />
                          En cours
                        </span>
                      )}

                      <h2
                        style={{
                          color: "var(--navy)",
                          fontSize: "1.25rem",
                          fontWeight: 700,
                          margin: "0 0 0.6rem",
                          lineHeight: 1.3,
                        }}
                      >
                        {event.title}
                      </h2>

                      {event.description && (
                        <p
                          style={{
                            color: "rgba(26,26,46,0.6)",
                            fontSize: "0.92rem",
                            lineHeight: 1.55,
                            margin: "0 0 1rem",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {event.description}
                        </p>
                      )}

                      {/* Meta */}
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        <MetaItem icon={<Calendar size={14} />} color={accent.tag}>
                          {formatEventDate(event.startDate)}
                          {event.startDate.split("T")[0] !== event.endDate.split("T")[0] &&
                            ` → ${formatEventDate(event.endDate)}`}
                        </MetaItem>

                        {event.location && (
                          <MetaItem icon={<MapPin size={14} />} color={accent.tag}>
                            {event.location}
                          </MetaItem>
                        )}

                        <MetaItem icon={<Users size={14} />} color={accent.tag}>
                          {event._count.sessions} session
                          {event._count.sessions !== 1 ? "s" : ""} · {event._count.rooms} salle
                          {event._count.rooms !== 1 ? "s" : ""}
                        </MetaItem>
                      </div>
                    </div>

                    {/* CTA arrow */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                        flexShrink: 0,
                        alignSelf: "center",
                      }}
                    >
                      <ChevronRight size={18} color="white" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function MetaItem({
  icon,
  color,
  children,
}: {
  icon: React.ReactNode;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        color: "rgba(26,26,46,0.6)",
        fontSize: "0.82rem",
      }}
    >
      <span style={{ color }}>{icon}</span>
      {children}
    </span>
  );
}
