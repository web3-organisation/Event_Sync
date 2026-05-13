"use client";
// app/events/[id]/sessions/[sessionId]/QASection.tsx
import { useState } from "react";
import { MessageSquare, ThumbsUp, Send } from "lucide-react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type Question = { id:string; content:string; authorName:string|null; upvotes:number; createdAt:string };

export default function QASection({ sessionId, initialQuestions }: { sessionId:string; initialQuestions:Question[] }) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [content, setContent]     = useState("");
  const [author, setAuthor]       = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [upvoted, setUpvoted]     = useState<Set<string>>(new Set());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    const res  = await fetch(`/api/sessions/${sessionId}/questions`, {
      method:"POST", headers:{"Content-Type":"application/json"},
      body:JSON.stringify({ content:content.trim(), authorName:author.trim()||null }),
    });
    const json = await res.json();
    setSubmitting(false);
    if (json.success) {
      setQuestions(q => [json.data, ...q]);
      setContent(""); setAuthor("");
      toast.success("Question posée ! 🙋");
    } else toast.error(json.error ?? "Erreur");
  };

  const handleUpvote = async (id: string) => {
    if (upvoted.has(id)) return;
    const res  = await fetch(`/api/questions/${id}/upvote`, { method:"POST" });
    const json = await res.json();
    if (json.success) {
      setQuestions(q => q.map(qu => qu.id === id ? { ...qu, upvotes: json.data.upvotes } : qu).sort((a,b) => b.upvotes - a.upvotes));
      setUpvoted(s => new Set([...s, id]));
    }
  };

  const iS: React.CSSProperties = {
    width:"100%", padding:"11px 14px", borderRadius:"12px", fontSize:"13px",
    fontFamily:"'Space Grotesk',sans-serif", background:"rgba(26,26,46,0.04)",
    border:"1.5px solid rgba(26,26,46,0.12)", color:"#1A1A2E", transition:"all .2s",
  };

  return (
    <div className="bg-white rounded-2xl border overflow-hidden animate-slide-up s2"
         style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 10px rgba(26,26,46,0.05)" }}>
      {/* Header */}
      <div className="px-6 py-4 border-b flex items-center gap-3"
           style={{ borderColor:"rgba(26,26,46,0.06)", background:"rgba(108,99,255,0.03)" }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:"rgba(108,99,255,0.1)" }}>
          <MessageSquare size={15} style={{ color:"#6C63FF" }}/>
        </div>
        <div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"15px", fontWeight:700, color:"#1A1A2E" }}>Questions & Réponses</h2>
          <p style={{ fontSize:"11px", color:"rgba(26,26,46,0.4)" }}>{questions.length} question{questions.length!==1?"s":""} · Votez pour les meilleures</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 py-5 border-b" style={{ borderColor:"rgba(26,26,46,0.06)" }}>
        <div className="flex flex-col gap-3">
          <textarea value={content} onChange={e=>setContent(e.target.value)} style={{ ...iS, resize:"vertical" }} rows={3}
            placeholder="Posez votre question..."
            onFocus={e=>(e.currentTarget.style.borderColor="#6C63FF")}
            onBlur={e=>(e.currentTarget.style.borderColor="rgba(26,26,46,0.12)")}/>
          <div className="flex gap-2">
            <input value={author} onChange={e=>setAuthor(e.target.value)} style={{ ...iS, flex:1 }}
              placeholder="Votre prénom (optionnel)"
              onFocus={e=>(e.currentTarget.style.borderColor="#6C63FF")}
              onBlur={e=>(e.currentTarget.style.borderColor="rgba(26,26,46,0.12)")}/>
            <button type="submit" disabled={submitting || !content.trim()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white flex-shrink-0 transition-all"
              style={{ background: (!content.trim()||submitting) ? "rgba(108,99,255,0.35)" : "linear-gradient(135deg,#6C63FF,#5850E8)",
                       cursor: (!content.trim()||submitting) ? "not-allowed" : "pointer" }}>
              <Send size={13}/>{submitting ? "..." : "Envoyer"}
            </button>
          </div>
        </div>
      </form>

      {/* Questions list */}
      <div className="divide-y" style={{}}>
        {questions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <div className="text-4xl mb-2">💬</div>
            <p style={{ fontSize:"13px", color:"rgba(26,26,46,0.35)" }}>Soyez le premier à poser une question !</p>
          </div>
        ) : questions.map(q => {
          let dateStr = "";
          try { dateStr = format(new Date(q.createdAt), "dd MMM · HH'h'mm", { locale:fr }); } catch {}
          const voted = upvoted.has(q.id);
          return (
            <div key={q.id} className="px-6 py-4 flex gap-4 transition-colors"
                 onMouseEnter={e=>(e.currentTarget.style.background="rgba(108,99,255,0.02)")}
                 onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
              {/* Upvote */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button onClick={() => handleUpvote(q.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{ background: voted ? "rgba(108,99,255,0.12)" : "rgba(26,26,46,0.05)",
                           cursor: voted ? "default" : "pointer" }}
                  disabled={voted}>
                  <ThumbsUp size={13} style={{ color: voted ? "#6C63FF" : "rgba(26,26,46,0.4)" }}/>
                </button>
                <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"13px",
                               color: q.upvotes > 0 ? "#6C63FF" : "rgba(26,26,46,0.3)" }}>
                  {q.upvotes}
                </span>
              </div>
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p style={{ fontSize:"14px", color:"#1A1A2E", lineHeight:1.6, marginBottom:"6px" }}>{q.content}</p>
                <div className="flex items-center gap-2" style={{ fontSize:"11px", color:"rgba(26,26,46,0.38)" }}>
                  {q.authorName && <span className="font-semibold" style={{ color:"rgba(26,26,46,0.55)" }}>— {q.authorName}</span>}
                  <span>{dateStr}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
