// app/sessions/[id]/QASection.jsx — Client Component
"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { submitQuestion, upvoteQuestion, downvoteQuestion } from "./actions";

// ─────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────
const MAX_CHARS = 280;
const VOTED_KEY = (id) => `eventsync-voted-${id}`;

function loadVoted(sessionId) {
  try { return new Set(JSON.parse(localStorage.getItem(VOTED_KEY(sessionId)) || "[]")); }
  catch { return new Set(); }
}
function saveVoted(sessionId, voted) {
  try { localStorage.setItem(VOTED_KEY(sessionId), JSON.stringify([...voted])); }
  catch {}
}

function formatRelative(iso) {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60)   return "à l'instant";
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`;
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

// ─────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────
function IconChevronUp({ filled }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg className="qa-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  );
}

// ─────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────
function Toast({ message, onDone }) {
  return (
    <div className="qa-toast" role="alert" aria-live="assertive"
      onAnimationEnd={onDone}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="qa-toast__icon">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      {message}
    </div>
  );
}

// ─────────────────────────────────────────────
// UpvoteButton — optimiste
// ─────────────────────────────────────────────
function UpvoteButton({ question, sessionId, voted, onToggle }) {
  const [isPending, startTransition] = useTransition();
  const isVoted = voted.has(question.id);

  function handleClick() {
    onToggle(question.id, !isVoted);
    startTransition(async () => {
      if (isVoted) {
        await downvoteQuestion(question.id, sessionId);
      } else {
        await upvoteQuestion(question.id, sessionId);
      }
    });
  }

  return (
    <button
      className={`upvote-btn ${isVoted ? "voted" : ""} ${isPending ? "pending" : ""}`}
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={isVoted}
      aria-label={`${isVoted ? "Retirer vote" : "Upvoter"} — ${question.upvotes} votes`}
    >
      <IconChevronUp filled={isVoted} />
      <span className="upvote-count">{question.upvotes}</span>
      <span className="upvote-label">votes</span>
    </button>
  );
}

// ─────────────────────────────────────────────
// QuestionCard
// ─────────────────────────────────────────────
function QuestionCard({ question, sessionId, voted, onToggle, isNew }) {
  return (
    <li className={`question-card ${isNew ? "is-new" : ""}`}>
      <UpvoteButton question={question} sessionId={sessionId} voted={voted} onToggle={onToggle} />
      <div className="question-body">
        <p className="question-content">{question.content}</p>
        <div className="question-meta">
          <span className={`question-author ${!question.author_name ? "question-anon" : ""}`}>
            {question.author_name ?? "Anonyme"}
          </span>
          <span className="question-time">· {formatRelative(question.created_at)}</span>
          {isNew && <span className="question-new-badge">Nouvelle</span>}
        </div>
      </div>
    </li>
  );
}

// ─────────────────────────────────────────────
// QAForm
// ─────────────────────────────────────────────
function QAForm({ sessionId, onSubmitted }) {
  const [content, setContent]     = useState("");
  const [author, setAuthor]       = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError]         = useState(null);
  const textareaRef               = useRef(null);

  const charsLeft = MAX_CHARS - content.length;
  const canSubmit = content.trim().length > 0 && charsLeft >= 0;

  function handleKeyDown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && canSubmit) {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if (!canSubmit || isPending) return;
    setError(null);
    const fd = new FormData();
    fd.append("content",     content.trim());
    fd.append("author_name", author.trim());

    startTransition(async () => {
      const result = await submitQuestion(sessionId, fd);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setContent("");
      setAuthor("");
      onSubmitted({ content: content.trim(), author_name: author.trim() || null });
    });
  }

  return (
    <div className="qa-form">
      <p className="qa-form__title">Poser une question</p>

      <div className="form-field">
        <label className="form-label" htmlFor="qa-content">
          Votre question <span>*</span>
        </label>
        <textarea
          id="qa-content"
          ref={textareaRef}
          className={`form-textarea ${charsLeft < 0 ? "form-textarea--error" : ""}`}
          placeholder="Posez votre question à l'intervenant…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          disabled={isPending}
          aria-describedby="char-hint"
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="qa-author">
          Votre nom <span>(optionnel — anonyme par défaut)</span>
        </label>
        <input
          id="qa-author"
          type="text"
          className="form-input"
          placeholder="Anonyme"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={60}
          disabled={isPending}
        />
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <div className="form-footer">
        <span
          id="char-hint"
          className={`char-count ${charsLeft < 0 ? "over" : charsLeft < 40 ? "warn" : ""}`}
        >
          {charsLeft < 0
            ? `${Math.abs(charsLeft)} caractères en trop`
            : `${charsLeft} caractères restants`}
        </span>
        <div className="form-actions">
          <span className="form-hint">⌘↵ pour envoyer</span>
          <button
            className="btn btn--primary btn--sm"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
          >
            {isPending ? <><IconSpinner /> Envoi…</> : "Envoyer →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main QASection
// ─────────────────────────────────────────────
export default function QASection({ sessionId, isLive, sessionStart, initialQuestions = [] }) {
  // Questions — state local pour mises à jour optimistes
  const [questions, setQuestions] = useState(initialQuestions);
  const [newIds,    setNewIds]    = useState(new Set());
  const [sortMode,  setSortMode]  = useState("votes");
  const [toast,     setToast]     = useState(null);
  // voted — initialisé côté client depuis localStorage
  const [voted, setVoted]         = useState(() => {
    if (typeof window === "undefined") return new Set();
    return loadVoted(sessionId);
  });

  // ── Tri ──────────────────────────────────
  const sorted = [...questions].sort((a, b) =>
    sortMode === "votes"
      ? (b.upvotes - a.upvotes || new Date(b.created_at) - new Date(a.created_at))
      : (new Date(b.created_at) - new Date(a.created_at))
  );

  // ── Toast helper ──────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Upvote toggle optimiste ───────────────
  function handleToggleVote(questionId, nowVoted) {
    setVoted((prev) => {
      const next = new Set(prev);
      nowVoted ? next.add(questionId) : next.delete(questionId);
      saveVoted(sessionId, next);
      return next;
    });
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, upvotes: q.upvotes + (nowVoted ? 1 : -1) }
          : q
      )
    );
    showToast(nowVoted ? "Vote enregistré !" : "Vote retiré");
  }

  // ── Nouvelle question (optimiste) ─────────
  function handleNewQuestion({ content, author_name }) {
    const tempId = `temp-${Date.now()}`;
    const newQ = {
      id:          tempId,
      content,
      author_name,
      upvotes:     0,
      created_at:  new Date().toISOString(),
    };
    setQuestions((prev) => [newQ, ...prev]);
    setNewIds((prev) => new Set([...prev, tempId]));
    setSortMode("recent");
    showToast("Question envoyée !");
    // Retire le badge "new" au bout de 8s
    setTimeout(() => {
      setNewIds((prev) => { const n = new Set(prev); n.delete(tempId); return n; });
    }, 8000);
  }

  // ─────────────────────────────────────────
  // Rendu — session pas encore live
  // ─────────────────────────────────────────
  if (!isLive) {
    return (
      <div className="qa-section">
        <h2 className="qa-title">Questions / Réponses</h2>
        <div className="qa-locked" role="status">
          <div className="qa-locked__icon"><IconLock /></div>
          <p className="qa-locked__title">Q&A disponible pendant la session</p>
          <p className="qa-locked__desc">
            Le système de questions sera accessible dès le début de la session à{" "}
            <strong>{sessionStart}</strong>.
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Rendu — session live
  // ─────────────────────────────────────────
  return (
    <div className="qa-section">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      {/* Header Q&A */}
      <div className="qa-header">
        <div>
          <h2 className="qa-title">
            Questions / Réponses{" "}
            <span className="qa-count">({questions.length})</span>
          </h2>
        </div>
        <div className="qa-sort" role="group" aria-label="Trier les questions">
          <span className="qa-sort__label">Trier :</span>
          <button
            className={`sort-btn ${sortMode === "votes" ? "active" : ""}`}
            onClick={() => setSortMode("votes")}
            aria-pressed={sortMode === "votes"}
          >
            ▲ Votes
          </button>
          <button
            className={`sort-btn ${sortMode === "recent" ? "active" : ""}`}
            onClick={() => setSortMode("recent")}
            aria-pressed={sortMode === "recent"}
          >
            ⏱ Récent
          </button>
        </div>
      </div>

      {/* Formulaire */}
      <QAForm sessionId={sessionId} onSubmitted={handleNewQuestion} />

      {/* Liste */}
      {sorted.length === 0 ? (
        <div className="qa-empty" role="status">
          <div className="qa-empty__icon">💬</div>
          <p className="qa-empty__title">Aucune question pour l&#39;instant</p>
          <p className="qa-empty__desc">Soyez le premier à interroger l&#39;intervenant !</p>
        </div>
      ) : (
        <ol className="questions-list">
          {sorted.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              sessionId={sessionId}
              voted={voted}
              onToggle={handleToggleVote}
              isNew={newIds.has(q.id)}
            />
          ))}
        </ol>
      )}
    </div>
  );
}