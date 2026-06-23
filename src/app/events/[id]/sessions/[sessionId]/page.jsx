"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  MapPin,
  Mic,
  ChevronLeft,
  Send,
  ThumbsUp,
  ExternalLink,
  Radio,
  CheckCircle,
  Calendar,
} from "lucide-react";
import {
  formatTimeRange,
  formatEventDate,
  getSessionStatus,
} from "@/lib/session-utils";

export default function SessionDetailPage() {
  const { id: eventId, sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Q&A state
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [upvotedIds, setUpvotedIds] = useState(new Set());
  const pollRef = useRef(null);

  const fetchQuestions = useCallback(async () => {
    if (!sessionId) return;
    try {
      const r = await fetch(`/api/sessions/${sessionId}/questions`);
      if (r.ok) {
        const data = await r.json();
        setQuestions(data);
      }
    } catch {}
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else {
          setSession(data);
          setQuestions(data.questions ?? []);
        }
      })
      .catch(() => setError("Erreur réseau."))
      .finally(() => setLoading(false));
  }, [sessionId]);

  // Live polling for Q&A when session is live
  useEffect(() => {
    if (!session) return;
    const status = getSessionStatus(session.startTime, session.endTime);
    if (status === "live") {
      pollRef.current = setInterval(fetchQuestions, 8000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [session, fetchQuestions]);

  async function handleSubmitQuestion() {
    if (!newQuestion.trim() || !sessionId) return;
    setSubmitting(true);
    try {
      const r = await fetch(`/api/sessions/${sessionId}/questions`, {
        method: "POST",
        headers,
        body: JSON.stringify({ content: newQuestion.trim(), authorName: authorName.trim() || undefined }),
      });
      if (r.ok) {
        const created = await r.json();
        setQuestions((prev) => [created, ...prev]);
        setNewQuestion("");
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      }
    } catch {}
    setSubmitting(false);
  }

  async function handleUpvote(questionId) {
    if (upvotedIds.has(questionId)) return;
    try {
      const r = await fetch(`/api/questions/${questionId}/upvote`, { method: "PATCH" });
      if (r.ok) {
        const updated = await r.json();
        setQuestions((prev) =>
          prev
            .map((q) => (q.id === questionId ? updated : q))
            .sort((a, b) => b.upvotes - a.upvotes)
        );
        setUpvotedIds((prev) => new Set(prev).add(questionId));
      }
    } catch {}
  }

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
            width: "24px", height: "24px",
            border: "3px solid var(--violet)", borderTopColor: "transparent",
            borderRadius: "50%", display: "inline-block",
          }}
        />
        Chargement…
      </div>
    );

  if (error || !session)
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", background: "var(--ghost)" }}>
        <p style={{ color: "var(--coral)", fontWeight: 600 }}>{error || "Session introuvable."}</p>
        <Link href={`/events/${eventId}`} style={{ color: "var(--violet)", textDecoration: "none" }}>
          ← Retour à l&apos;événement
        </Link>
      </div>
    );

  const status = getSessionStatus(session.startTime, session.endTime);
  const isLive = status === "live";
  const speakers = session.sessionSpeakers.map((ss) => ss.speaker);

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
            position: "absolute", top: "-80px", right: "-60px",
            width: "340px", height: "340px", borderRadius: "50%",
            background: isLive
              ? "radial-gradient(circle, rgba(0,212,170,0.28) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(108,99,255,0.28) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: "820px", margin: "0 auto", position: "relative" }}>
          {/* Breadcrumb */}
          <nav style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "1.5rem" }}>
            <Link
              href="/events"
              style={{ color: "rgba(248,249,255,0.45)", fontSize: "0.82rem", textDecoration: "none" }}
            >
              Événements
            </Link>
            <ChevronLeft size={13} color="rgba(248,249,255,0.3)" style={{ transform: "rotate(180deg)" }} />
            <Link
              href={`/events/${eventId}`}
              style={{ color: "rgba(248,249,255,0.55)", fontSize: "0.82rem", textDecoration: "none", display: "flex", alignItems: "center", gap: "4px" }}
            >
              <ChevronLeft size={13} />
              {session.event.title}
            </Link>
          </nav>

          {/* Live badge */}
          {isLive && (
            <div
              className="animate-slide-up"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "rgba(0,212,170,0.15)", border: "1px solid rgba(0,212,170,0.5)",
                borderRadius: "999px", padding: "5px 14px", marginBottom: "1rem",
              }}
            >
              <Radio size={13} color="var(--teal)" />
              <span className="animate-pulse-dot" style={{ width: "7px", height: "7px", borderRadius: "50%", background: "var(--teal)", display: "inline-block" }} />
              <span style={{ color: "var(--teal)", fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Session en direct
              </span>
            </div>
          )}

          <h1
            className="animate-slide-up s1"
            style={{ color: "white", fontSize: "clamp(1.4rem, 3.5vw, 2.2rem)", fontWeight: 800, margin: "0 0 0.75rem", lineHeight: 1.25 }}
          >
            {session.title}
          </h1>

          {session.description && (
            <p
              className="animate-slide-up s2"
              style={{ color: "rgba(248,249,255,0.65)", fontSize: "0.97rem", lineHeight: 1.6, marginBottom: "1.25rem", maxWidth: "580px" }}
            >
              {session.description}
            </p>
          )}

          {/* Meta row */}
          <div className="animate-slide-up s3" style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem" }}>
            <MetaChip icon={<Clock size={14} />}>
              {formatTimeRange(session.startTime, session.endTime)}
            </MetaChip>
            <MetaChip icon={<Calendar size={14} />}>
              {formatEventDate(session.startTime)}
            </MetaChip>
            <MetaChip icon={<MapPin size={14} />}>{session.room.name}</MetaChip>
          </div>
        </div>
      </header>

      {/* Body */}
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "2.5rem 2rem 4rem",
          display: "grid",
          gridTemplateColumns: speakers.length ? "1fr 300px" : "1fr",
          gap: "2rem",
          alignItems: "start",
        }}
      >
        {/* Left: Q&A */}
        <div>
          <QASection
            questions={questions}
            isLive={isLive}
            sessionStatus={status}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
            authorName={authorName}
            setAuthorName={setAuthorName}
            submitting={submitting}
            submitSuccess={submitSuccess}
            upvotedIds={upvotedIds}
            onSubmit={handleSubmitQuestion}
            onUpvote={handleUpvote}
          />
        </div>

        {/* Right: Speakers */}
        {speakers.length > 0 && (
          <aside>
            <h2 style={{ color: "var(--navy)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "1rem", opacity: 0.6 }}>
              Intervenants
            </h2>
            <div style={{ display: "grid", gap: "1rem" }}>
              {speakers.map((sp) => (
                <div
                  key={sp.id}
                  style={{
                    background: "white",
                    borderRadius: "12px",
                    padding: "1.1rem",
                    boxShadow: "0 2px 10px rgba(26,26,46,0.06)",
                    border: "1px solid rgba(26,26,46,0.06)",
                  }}
                >
                  {/* Avatar placeholder */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.65rem" }}>
                    <div
                      style={{
                        width: "40px", height: "40px", borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--violet), var(--teal))",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: 700, fontSize: "1rem", flexShrink: 0,
                      }}
                    >
                      {sp.fullName.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--navy)" }}>{sp.fullName}</div>
                      {sp.bio && (
                        <div style={{ fontSize: "0.75rem", color: "rgba(26,26,46,0.5)", lineHeight: 1.4, marginTop: "2px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {sp.bio}
                        </div>
                      )}
                    </div>
                  </div>

                  {sp.speakerLinks.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {sp.speakerLinks.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            fontSize: "0.72rem", fontWeight: 600, color: "var(--violet)",
                            background: "rgba(108,99,255,0.08)", borderRadius: "6px",
                            padding: "3px 8px", textDecoration: "none",
                          }}
                        >
                          <ExternalLink size={10} />
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}

/* ─── Q&A Section ────────────────────────────────────────────────────── */
function QASection({
  questions,
  isLive,
  sessionStatus,
  newQuestion,
  setNewQuestion,
  authorName,
  setAuthorName,
  submitting,
  submitSuccess,
  upvotedIds,
  onSubmit,
  onUpvote,
}) {
  const canAsk = isLive;

  return (
    <div>
      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
        <h2 style={{ color: "var(--navy)", fontSize: "1.1rem", fontWeight: 800, margin: 0 }}>
          Questions &amp; Réponses
        </h2>
        {isLive && (
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: "5px",
              background: "rgba(0,212,170,0.12)", color: "var(--teal)",
              borderRadius: "999px", padding: "3px 10px",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
            }}
          >
            <span className="animate-pulse-dot" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--teal)", display: "inline-block" }} />
            Live
          </span>
        )}
        <span style={{ marginLeft: "auto", color: "rgba(26,26,46,0.4)", fontSize: "0.82rem" }}>
          {questions.length} question{questions.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Ask form — only when live */}
      {canAsk && (
        <div
          style={{
            background: "white",
            borderRadius: "14px",
            padding: "1.25rem",
            marginBottom: "1.5rem",
            boxShadow: "0 2px 12px rgba(26,26,46,0.07)",
            border: "1px solid rgba(0,212,170,0.2)",
          }}
        >
          <p style={{ fontSize: "0.82rem", color: "rgba(26,26,46,0.55)", marginBottom: "0.75rem", fontWeight: 500 }}>
            <Mic size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px", color: "var(--teal)" }} />
            Posez votre question à l&apos;intervenant
          </p>

          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Votre question…"
            rows={3}
            style={{
              width: "100%", boxSizing: "border-box",
              border: "1.5px solid rgba(26,26,46,0.12)",
              borderRadius: "8px", padding: "10px 12px",
              fontSize: "0.9rem", fontFamily: "inherit",
              color: "var(--navy)", resize: "vertical",
              transition: "border-color 0.15s",
              marginBottom: "0.6rem",
            }}
            onFocus={(e) => (e.target.style.borderColor = "var(--teal)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(26,26,46,0.12)")}
          />

          <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Votre prénom (optionnel)"
              style={{
                flex: "1 1 160px", border: "1.5px solid rgba(26,26,46,0.12)",
                borderRadius: "8px", padding: "8px 12px",
                fontSize: "0.85rem", fontFamily: "inherit", color: "var(--navy)",
              }}
            />
            <button
              onClick={onSubmit}
              disabled={submitting || !newQuestion.trim()}
              style={{
                display: "inline-flex", alignItems: "center", gap: "7px",
                background: newQuestion.trim() ? "var(--teal)" : "rgba(26,26,46,0.1)",
                color: newQuestion.trim() ? "white" : "rgba(26,26,46,0.35)",
                border: "none", borderRadius: "8px",
                padding: "9px 18px", fontFamily: "inherit",
                fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {submitting ? (
                <span className="animate-spin" style={{ width: "14px", height: "14px", border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", display: "inline-block" }} />
              ) : submitSuccess ? (
                <CheckCircle size={15} />
              ) : (
                <Send size={15} />
              )}
              {submitSuccess ? "Envoyée !" : "Envoyer"}
            </button>
          </div>
        </div>
      )}

      {/* Upcoming info */}
      {sessionStatus === "upcoming" && (
        <div
          style={{
            background: "rgba(108,99,255,0.07)",
            border: "1px solid rgba(108,99,255,0.2)",
            borderRadius: "12px", padding: "1rem 1.25rem",
            color: "var(--violet)", fontSize: "0.88rem", fontWeight: 500,
            marginBottom: "1.25rem",
          }}
        >
          Les questions seront ouvertes lorsque la session débutera.
        </div>
      )}

      {/* Questions list */}
      {questions.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem 0", color: "rgba(26,26,46,0.3)" }}>
          <Mic size={36} strokeWidth={1} style={{ marginBottom: "0.75rem" }} />
          <p style={{ fontSize: "0.95rem" }}>Aucune question pour l&apos;instant.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {questions.map((q, i) => {
            const voted = upvotedIds.has(q.id);
            return (
              <div
                key={q.id}
                className={`animate-slide-up s${Math.min(i + 1, 6)}`}
                style={{
                  background: "white",
                  borderRadius: "10px",
                  padding: "1rem 1.1rem",
                  display: "flex",
                  gap: "0.9rem",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 8px rgba(26,26,46,0.05)",
                  border: "1px solid rgba(26,26,46,0.06)",
                }}
              >
                {/* Upvote */}
                <button
                  onClick={() => canAsk && onUpvote(q.id)}
                  disabled={voted || !canAsk}
                  title={canAsk ? (voted ? "Déjà voté" : "Voter pour cette question") : undefined}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
                    background: voted ? "rgba(108,99,255,0.1)" : "rgba(26,26,46,0.04)",
                    border: voted ? "1px solid rgba(108,99,255,0.3)" : "1px solid transparent",
                    borderRadius: "8px", padding: "6px 9px",
                    cursor: canAsk && !voted ? "pointer" : "default",
                    transition: "background 0.15s",
                    flexShrink: 0,
                  }}
                >
                  <ThumbsUp size={14} color={voted ? "var(--violet)" : "rgba(26,26,46,0.35)"} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: voted ? "var(--violet)" : "rgba(26,26,46,0.4)" }}>
                    {q.upvotes}
                  </span>
                </button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "var(--navy)", fontSize: "0.9rem", lineHeight: 1.5, margin: "0 0 0.3rem" }}>
                    {q.content}
                  </p>
                  <span style={{ fontSize: "0.74rem", color: "rgba(26,26,46,0.4)" }}>
                    {q.authorName ? `— ${q.authorName}` : "— Anonyme"}{" "}
                    · {new Date(q.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MetaChip({ icon, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "rgba(248,249,255,0.65)", fontSize: "0.85rem" }}>
      {icon}
      {children}
    </span>
  );
}
