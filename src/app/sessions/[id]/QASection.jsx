// app/sessions/[id]/QASection.jsx
"use client";

import { useState, useEffect, useTransition, useRef, useCallback } from "react";
import { submitQuestion, upvoteQuestion, downvoteQuestion } from "./actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp, faLock, faSpinner, faCheck,
  faComments, faArrowUp, faClock,
} from "@fortawesome/free-solid-svg-icons";

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

function Toast({ message, onDone }) {
  return (
    <div className="qa-toast" role="alert" aria-live="assertive" onAnimationEnd={onDone}>
      <FontAwesomeIcon icon={faCheck} style={{ width: "16px", height: "16px" }} className="qa-toast__icon" />
      {message}
    </div>
  );
}

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
      <FontAwesomeIcon icon={faChevronUp} style={{ width: "16px", height: "16px" }} />
      <span className="upvote-count">{question.upvotes}</span>
      <span className="upvote-label">votes</span>
    </button>
  );
}

function QuestionCard({ question, sessionId, voted, onToggle, isNew }) {
  const [relativeTime, setRelativeTime] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRelativeTime(formatRelative(question.created_at));
    const interval = setInterval(() => {
      setRelativeTime(formatRelative(question.created_at));
    }, 30_000);
    return () => clearInterval(interval);
  }, [question.created_at]);

  return (
    <li className={`question-card ${isNew ? "is-new" : ""}`}>
      <UpvoteButton question={question} sessionId={sessionId} voted={voted} onToggle={onToggle} />
      <div className="question-body">
        <p className="question-content">{question.content}</p>
        <div className="question-meta">
          <span className={`question-author ${!question.author_name ? "question-anon" : ""}`}>
            {question.author_name ?? "Anonyme"}
          </span>
          {/* ✅ Rendu conditionnel : vide au SSR, rempli au montage client */}
          {relativeTime && (
            <span className="question-time">
              · <FontAwesomeIcon icon={faClock} style={{ width: "11px", height: "11px", marginRight: "3px" }} />
              {relativeTime}
            </span>
          )}
          {isNew && <span className="question-new-badge">Nouvelle</span>}
        </div>
      </div>
    </li>
  );
}

function QAForm({ sessionId, onSubmitted }) {
  const [content, setContent]        = useState("");
  const [author, setAuthor]          = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError]            = useState(null);
  const textareaRef                  = useRef(null);

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
          <span className="form-hint">
            <FontAwesomeIcon icon={faArrowUp} style={{ width: "11px", height: "11px" }} /> ⌘↵ pour envoyer
          </span>
          <button
            className="btn btn--primary btn--sm"
            onClick={handleSubmit}
            disabled={!canSubmit || isPending}
          >
            {isPending
              ? <><FontAwesomeIcon icon={faSpinner} spin style={{ width: "14px", height: "14px" }} /> Envoi…</>
              : "Envoyer →"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function QASection({ sessionId, isLive, sessionStart, initialQuestions = [] }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [newIds,    setNewIds]    = useState(new Set());
  const [sortMode,  setSortMode]  = useState("votes");
  const [toast,     setToast]     = useState(null);

  const [voted, setVoted] = useState(new Set());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVoted(loadVoted(sessionId));
  }, [sessionId]);

  const sorted = [...questions].sort((a, b) =>
    sortMode === "votes"
      ? (b.upvotes - a.upvotes || new Date(b.created_at) - new Date(a.created_at))
      : (new Date(b.created_at) - new Date(a.created_at))
  );

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

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

  function handleNewQuestion({ content, author_name }) {
    const tempId = `temp-${Date.now()}`;
    const newQ = {
      id:         tempId,
      content,
      author_name,
      upvotes:    0,
      created_at: new Date().toISOString(),
    };
    setQuestions((prev) => [newQ, ...prev]);
    setNewIds((prev) => new Set([...prev, tempId]));
    setSortMode("recent");
    showToast("Question envoyée !");
    setTimeout(() => {
      setNewIds((prev) => { const n = new Set(prev); n.delete(tempId); return n; });
    }, 8000);
  }

  if (!isLive) {
    return (
      <div className="qa-section">
        <h2 className="qa-title">Questions / Réponses</h2>
        <div className="qa-locked" role="status">
          <div className="qa-locked__icon">
            <FontAwesomeIcon icon={faLock} style={{ width: "22px", height: "22px" }} />
          </div>
          <p className="qa-locked__title">Q&A disponible pendant la session</p>
          <p className="qa-locked__desc">
            Le système de questions sera accessible dès le début de la session à{" "}
            <strong>{sessionStart}</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="qa-section">
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

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
            <FontAwesomeIcon icon={faChevronUp} style={{ width: "12px", height: "12px" }} /> Votes
          </button>
          <button
            className={`sort-btn ${sortMode === "recent" ? "active" : ""}`}
            onClick={() => setSortMode("recent")}
            aria-pressed={sortMode === "recent"}
          >
            <FontAwesomeIcon icon={faClock} style={{ width: "12px", height: "12px" }} /> Récent
          </button>
        </div>
      </div>

      <QAForm sessionId={sessionId} onSubmitted={handleNewQuestion} />

      {sorted.length === 0 ? (
        <div className="qa-empty" role="status">
          <div className="qa-empty__icon">
            <FontAwesomeIcon icon={faComments} style={{ width: "32px", height: "32px" }} />
          </div>
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