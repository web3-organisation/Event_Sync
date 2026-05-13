"use client";
// app/admin/events/[id]/SessionsManager.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, MessageSquare, Clock, Users } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";

type Speaker  = { id:string; fullName:string };
type Room     = { id:string; name:string };
type Session  = {
  id:string; title:string; description:string|null;
  startTime:string; endTime:string; capacity:number|null;
  roomId:string; room:Room;
  sessionSpeakers: { speaker: Speaker }[];
  _count: { questions: number };
};

const iS: React.CSSProperties = {
  width:"100%", padding:"11px 14px", borderRadius:"12px", fontSize:"13px",
  fontFamily:"'Space Grotesk',sans-serif", background:"rgba(26,26,46,0.04)",
  border:"1.5px solid rgba(26,26,46,0.12)", color:"#1A1A2E", transition:"all .2s",
};
const lS: React.CSSProperties = {
  display:"block", fontSize:"10px", fontWeight:700, textTransform:"uppercase",
  letterSpacing:"0.08em", color:"rgba(26,26,46,0.38)", marginBottom:"6px",
};
const fo = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = "#6C63FF");
const bl = (e: React.FocusEvent<any>) => (e.currentTarget.style.borderColor = "rgba(26,26,46,0.12)");

const emptyForm = { title:"", description:"", startTime:"", endTime:"", capacity:"", roomId:"", speakerIds:[] as string[] };

export default function SessionsManager({
  event, sessions: init, speakers,
}: {
  event: { id:string; rooms: Room[] };
  sessions: Session[];
  speakers: Speaker[];
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>(init);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm, roomId: event.rooms[0]?.id ?? "" });
    setModalOpen(true);
  };

  const openEdit = (s: Session) => {
    setEditing(s);
    setForm({
      title:       s.title,
      description: s.description ?? "",
      startTime:   s.startTime?.slice(0, 16) ?? "",
      endTime:     s.endTime?.slice(0, 16)   ?? "",
      capacity:    s.capacity?.toString() ?? "",
      roomId:      s.roomId,
      speakerIds:  s.sessionSpeakers.map(ss => ss.speaker.id),
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = {
      ...form,
      capacity:    form.capacity ? parseInt(form.capacity) : null,
      startTime:   form.startTime,
      endTime:     form.endTime,
    };

    let res, json;
    if (editing) {
      res  = await fetch(`/api/sessions/${editing.id}`, { method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    } else {
      res  = await fetch(`/api/events/${event.id}/sessions`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    }
    json = await res.json();
    setSaving(false);
    if (json.success) {
      toast.success(editing ? "Session mise à jour ✅" : "Session créée 🎉");
      setModalOpen(false);
      router.refresh();
      // optimistic update
      if (editing) setSessions(ss => ss.map(s => s.id === editing.id ? json.data : s));
      else setSessions(ss => [...ss, json.data]);
    } else toast.error(json.error ?? "Erreur");
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer "${title}" ?`)) return;
    const res  = await fetch(`/api/sessions/${id}`, { method:"DELETE" });
    const json = await res.json();
    if (json.success) { toast.success("Session supprimée"); setSessions(ss => ss.filter(s => s.id !== id)); }
    else toast.error(json.error ?? "Erreur");
  };

  const toggleSpeaker = (id: string) =>
    setForm(f => ({ ...f, speakerIds: f.speakerIds.includes(id) ? f.speakerIds.filter(s => s !== id) : [...f.speakerIds, id] }));

  return (
    <div>
      <div className="bg-white rounded-2xl border overflow-hidden"
           style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.05)" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b"
             style={{ borderColor:"rgba(26,26,46,0.06)" }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:700, color:"#1A1A2E" }}>
            Sessions ({sessions.length})
          </h2>
          <button onClick={openCreate}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
            style={{ background:"linear-gradient(135deg,#6C63FF,#5850E8)" }}>
            <Plus size={13}/> Ajouter une session
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="text-4xl">📋</div>
            <p style={{ color:"rgba(26,26,46,0.35)", fontSize:"14px" }}>Aucune session pour l'instant</p>
          </div>
        ) : (
          <div className="divide-y" style={{}}>
            {sessions.map(s => {
              let start = "", end = "";
              try { start = format(new Date(s.startTime), "HH'h'mm"); } catch {}
              try { end   = format(new Date(s.endTime),   "HH'h'mm"); } catch {}
              return (
                <div key={s.id} className="px-6 py-4 flex items-start justify-between gap-4 transition-colors"
                     onMouseEnter={e => (e.currentTarget.style.background = "rgba(108,99,255,0.02)")}
                     onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <div className="flex gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                         style={{ background:"rgba(108,99,255,0.08)" }}>
                      <Clock size={15} style={{ color:"#6C63FF" }}/>
                    </div>
                    <div className="min-w-0">
                      <div style={{ fontWeight:600, fontSize:"13px", color:"#1A1A2E" }}>{s.title}</div>
                      <div className="flex flex-wrap gap-3 mt-1">
                        <span style={{ fontSize:"11px", color:"rgba(26,26,46,0.45)" }}>⏱ {start} → {end}</span>
                        <span style={{ fontSize:"11px", color:"rgba(26,26,46,0.45)" }}>📍 {s.room.name}</span>
                        {s.capacity && <span style={{ fontSize:"11px", color:"rgba(26,26,46,0.45)" }}><Users size={10} style={{display:"inline"}}/> {s.capacity}</span>}
                        <span style={{ fontSize:"11px", color:"rgba(26,26,46,0.45)" }}>
                          <MessageSquare size={10} style={{display:"inline"}}/> {s._count.questions} Q
                        </span>
                      </div>
                      {s.sessionSpeakers.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {s.sessionSpeakers.map(ss => (
                            <span key={ss.speaker.id} className="text-xs px-2 py-0.5 rounded-full font-medium"
                                  style={{ background:"rgba(0,212,170,0.08)", color:"#00D4AA" }}>
                              {ss.speaker.fullName}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/events/${s.id}/sessions/${s.id}`}>
                      <button className="p-1.5 rounded-lg transition-all" style={{ color:"#00D4AA" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,212,170,0.1)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                        <MessageSquare size={14}/>
                      </button>
                    </Link>
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg transition-all" style={{ color:"#6C63FF" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(108,99,255,0.1)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <Pencil size={14}/>
                    </button>
                    <button onClick={() => handleDelete(s.id, s.title)} className="p-1.5 rounded-lg transition-all" style={{ color:"#FF6B6B" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,107,107,0.1)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "✏️ Modifier la session" : "➕ Nouvelle session"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div><label style={lS}>Titre *</label>
            <input value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} style={iS} required onFocus={fo} onBlur={bl}/></div>
          <div><label style={lS}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} style={{ ...iS, resize:"vertical" }} rows={2} onFocus={fo} onBlur={bl}/></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label style={lS}>Début *</label>
              <input type="datetime-local" value={form.startTime} onChange={e => setForm(f=>({...f,startTime:e.target.value}))} style={iS} required onFocus={fo} onBlur={bl}/></div>
            <div><label style={lS}>Fin *</label>
              <input type="datetime-local" value={form.endTime} onChange={e => setForm(f=>({...f,endTime:e.target.value}))} style={iS} required onFocus={fo} onBlur={bl}/></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label style={lS}>Salle *</label>
              <select value={form.roomId} onChange={e => setForm(f=>({...f,roomId:e.target.value}))} style={iS} required onFocus={fo} onBlur={bl}>
                <option value="">Choisir...</option>
                {event.rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
            <div><label style={lS}>Capacité</label>
              <input type="number" min="1" value={form.capacity} onChange={e => setForm(f=>({...f,capacity:e.target.value}))} style={iS} placeholder="Illimitée" onFocus={fo} onBlur={bl}/></div>
          </div>
          {/* Speakers multi-select */}
          {speakers.length > 0 && (
            <div>
              <label style={lS}>Speakers</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {speakers.map(sp => {
                  const active = form.speakerIds.includes(sp.id);
                  return (
                    <button key={sp.id} type="button" onClick={() => toggleSpeaker(sp.id)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                      style={{ background: active ? "#6C63FF" : "transparent", color: active ? "white" : "rgba(26,26,46,0.55)", borderColor: active ? "#6C63FF" : "rgba(26,26,46,0.15)" }}>
                      {sp.fullName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <button type="submit" disabled={saving}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all mt-1"
            style={{ background: saving ? "rgba(108,99,255,0.4)" : "linear-gradient(135deg,#6C63FF,#5850E8)",
                     cursor: saving ? "not-allowed" : "pointer" }}>
            {saving ? "Sauvegarde..." : editing ? "💾 Mettre à jour" : "✨ Créer la session"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
