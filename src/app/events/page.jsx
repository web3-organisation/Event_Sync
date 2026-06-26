"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Users, ChevronRight, Zap } from "lucide-react";
import { formatEventDate } from "@/lib/session-utils";
import "../css/event.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";

// Couleurs disponibles pour les gradients
const GRADIENT_COLORS = [
  "#6C63FF", // Violet primaire
  "#5A4BFF", // Violet foncé
  "#7C5CFF", // Violet moyen
  "#8A6BFF", // Violet clair
  "#60A5FA", // Bleu
  "#EC4899", // Rose
  "#F472B6", // Rose clair
  "#A78BFA", // Violet lavande
  "#818CF8", // Indigo
  "#34D399", // Vert menthe (pour varier)
];

// Fonction pour générer un gradient aléatoire à 3 couleurs
const getRandomGradient = () => {
  const shuffled = [...GRADIENT_COLORS].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  return `linear-gradient(90deg, ${selected[0]}, ${selected[1]}, ${selected[2]})`;
};

// Fonction pour générer un gradient pour le CTA (2 couleurs)
const getRandomCtaGradient = () => {
  const shuffled = [...GRADIENT_COLORS].sort(() => Math.random() - 0.5);
  return `linear-gradient(135deg, ${shuffled[0]}, ${shuffled[1]})`;
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gradients, setGradients] = useState({});

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setEvents(data);
          const newGradients = {};
          data.forEach((event, index) => {
            const seed = index * 7 + 3;
            newGradients[event.id] = {
              bar: getRandomGradient(),
              cta: getRandomCtaGradient(),
            };
          });
          setGradients(newGradients);
        } else {
          setError("Impossible de charger les événements.");
        }
      })
      .catch(() => setError("Erreur réseau."))
      .finally(() => setLoading(false));
  }, []);
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_CORS_ORIGIN ?? "#";
  return (
    <main className="event-page">
      {/* Hero header */}
      <header className="event-header">
        {/* Decorative blobs */}
        <div className="blob blob-1 animate-float-bg" />
        <div className="blob blob-2 animate-float-bg" />
        <div className="blob blob-3 animate-float-bg" />

        <div className="header-content">
          <div className="hero-badge animate-slide-up">
            <Zap size={14} className="badge-icon" />
            <span className="badge-text">Événements à venir</span>
          </div>

          <h1 className="hero-title animate-slide-up s1">
            Tous les <span className="gradient-text">événements</span>
          </h1>

          <p className="hero-subtitle animate-slide-up s2">
            Découvrez les conférences, workshops et summits. Consultez les
            plannings, les intervenants et les sessions en direct.
          </p>

          {/* Bouton Gérer les événements - placé en bas du header */}
          <div className="header-actions animate-slide-up s3">
            <Link
              href={adminUrl ?? "#"}
              target="_blank"
              rel="noreferrer"
              className="admin-button"
            >
              <FontAwesomeIcon icon={faGear} className="admin-icon" />
              Gérer les événements
            </Link>
          </div>
        </div>
      </header>

      <section className="event-section">
        {loading && (
          <div className="loading-state">
            <span className="spinner" />
            Chargement des événements…
          </div>
        )}
        {error && <div className="error-state">{error}</div>}
        {!loading && !error && events.length === 0 && (
          <div className="empty-state">
            <Calendar size={48} strokeWidth={1} className="empty-icon" />
            <p className="empty-text">
              Aucun événement disponible pour le moment.
            </p>
          </div>
        )}
        <div className="events-grid">
          {events.map((event, i) => {
            const isOngoing =
              new Date(event.startDate) <= new Date() &&
              new Date(event.endDate) >= new Date();

            const eventGradient = gradients[event.id] || {
              bar: "linear-gradient(90deg, #6C63FF, #5A4BFF, #7C5CFF)",
              cta: "linear-gradient(135deg, #6C63FF, #EC4899)",
            };

            return (
              <Link
                key={event.id}
                href={`/planning?eventId=${event.id}`}
                className={`event-card animate-slide-up s${Math.min(i + 1, 6)}`}
              >
                <div
                  className="gradient-bar"
                  style={{ background: eventGradient.bar }}
                />

                <div className="card-content">
                  <div className="card-inner">
                    <div className="card-body">
                      {isOngoing && (
                        <span className="status-badge">
                          <span className="pulse-dot" />
                          En cours
                        </span>
                      )}

                      <h2 className="event-title">{event.title}</h2>

                      {event.description && (
                        <p className="event-description">{event.description}</p>
                      )}
                      <div className="event-meta">
                        <MetaItem icon={<Calendar size={14} />}>
                          {formatEventDate(event.startDate)}
                          {event.startDate.split("T")[0] !==
                            event.endDate.split("T")[0] &&
                            ` → ${formatEventDate(event.endDate)}`}
                        </MetaItem>

                        {event.location && (
                          <MetaItem icon={<MapPin size={14} />}>
                            {event.location}
                          </MetaItem>
                        )}

                        <MetaItem icon={<Users size={14} />}>
                          {event._count.sessions} session
                          {event._count.sessions !== 1 ? "s" : ""} ·{" "}
                          {event._count.rooms} salle
                          {event._count.rooms !== 1 ? "s" : ""}
                        </MetaItem>
                      </div>
                    </div>

                    <div
                      className="card-cta"
                      style={{ background: eventGradient.cta }}
                    >
                      <ChevronRight size={18} />
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

function MetaItem({ icon, children }) {
  return (
    <span className="meta-item">
      <span className="meta-icon" style={{ color: "#6C63FF" }}>
        {icon}
      </span>
      {children}
    </span>
  );
}
