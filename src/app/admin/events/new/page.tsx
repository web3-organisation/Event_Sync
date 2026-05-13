// app/admin/events/new/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

const iStyle: React.CSSProperties = {
  width:"100%", padding:"12px 16px", borderRadius:"12px", fontSize:"14px",
  fontFamily:"'Space Grotesk',sans-serif", background:"rgba(26,26,46,0.04)",
  border:"1.5px solid rgba(26,26,46,0.12)", color:"#1A1A2E", transition:"all .2s",
};
const label: React.CSSProperties = {
  display:"block", fontSize:"11px", fontWeight:700, textTransform:"uppercase",
  letterSpacing:"0.08em", color:"rgba(26,26,46,0.42)", marginBottom:"7px",
};

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<string[]>([""]);
  const [form, setForm] = useState({
    title:"", description:"", startDate:"", endDate:"", location:"",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create event
    const res  = await fetch("/api/events", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(form) });
    const json = await res.json();
    if (!json.success) { toast.error(json.error ?? "Erreur"); setLoading(false); return; }

    const eventId = json.data.id;

    // 2. Create rooms
    const validRooms = rooms.filter(r => r.trim());
    await Promise.all(validRooms.map(name =>
      fetch("/api/rooms", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name, eventId }) })
    ));

    toast.success("Événement créé ! 🎉");
    router.push(`/admin/events/${eventId}`);
    router.refresh();
  };

  const focusStyle = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "#6C63FF");
  const blurStyle  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    (e.currentTarget.style.borderColor = "rgba(26,26,46,0.12)");

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <Link href="/admin/events" className="inline-flex items-center gap-2 mb-6 text-sm font-semibold transition-all"
        style={{ color:"rgba(26,26,46,0.5)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#6C63FF")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(26,26,46,0.5)")}>
        <ArrowLeft size={15}/> Retour aux événements
      </Link>

      <h1 className="animate-slide-up" style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.8rem", fontWeight:800, color:"#1A1A2E", marginBottom:"6px" }}>
        Créer un événement
      </h1>
      <p className="animate-slide-up s1 mb-8" style={{ fontSize:"14px", color:"rgba(26,26,46,0.45)" }}>
        Remplissez les informations puis définissez les salles
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Infos principales */}
        <div className="bg-white rounded-2xl p-6 border animate-slide-up s2"
             style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.05)" }}>
          <h2 className="mb-5" style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:700, color:"#1A1A2E" }}>
            Informations générales
          </h2>
          <div className="flex flex-col gap-4">
            <div>
              <label style={label}>Titre *</label>
              <input value={form.title} onChange={set("title")} style={iStyle} placeholder="Ex: TechConf Paris 2025"
                required onFocus={focusStyle} onBlur={blurStyle}/>
            </div>
            <div>
              <label style={label}>Description</label>
              <textarea value={form.description} onChange={set("description")} style={{ ...iStyle, resize:"vertical" }}
                rows={3} placeholder="Décrivez l'événement..." onFocus={focusStyle} onBlur={blurStyle}/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label style={label}>Date de début *</label>
                <input type="datetime-local" value={form.startDate} onChange={set("startDate")} style={iStyle}
                  required onFocus={focusStyle} onBlur={blurStyle}/>
              </div>
              <div>
                <label style={label}>Date de fin *</label>
                <input type="datetime-local" value={form.endDate} onChange={set("endDate")} style={iStyle}
                  required onFocus={focusStyle} onBlur={blurStyle}/>
              </div>
            </div>
            <div>
              <label style={label}>Lieu</label>
              <input value={form.location} onChange={set("location")} style={iStyle}
                placeholder="Ex: Palais des Congrès, Paris" onFocus={focusStyle} onBlur={blurStyle}/>
            </div>
          </div>
        </div>

        {/* Salles */}
        <div className="bg-white rounded-2xl p-6 border animate-slide-up s3"
             style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.05)" }}>
          <div className="flex items-center justify-between mb-5">
            <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:700, color:"#1A1A2E" }}>
              Salles
            </h2>
            <button type="button" onClick={() => setRooms(r => [...r, ""])}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{ background:"rgba(108,99,255,0.08)", color:"#6C63FF" }}>
              <Plus size={12}/> Ajouter
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {rooms.map((room, i) => (
              <div key={i} className="flex gap-2">
                <input value={room} onChange={e => setRooms(r => r.map((v, j) => j === i ? e.target.value : v))}
                  style={iStyle} placeholder={`Salle ${i + 1} (ex: Grande Scène)`}
                  onFocus={focusStyle} onBlur={blurStyle}/>
                {rooms.length > 1 && (
                  <button type="button" onClick={() => setRooms(r => r.filter((_, j) => j !== i))}
                    className="px-3 rounded-xl flex-shrink-0 transition-all"
                    style={{ background:"rgba(255,107,107,0.08)", color:"#FF6B6B" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,107,107,0.18)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,107,107,0.08)")}>
                    <Trash2 size={14}/>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-4 rounded-2xl font-bold text-white transition-all animate-slide-up s4"
          style={{ background: loading ? "rgba(108,99,255,0.45)" : "linear-gradient(135deg,#6C63FF,#5850E8)",
                   boxShadow: loading ? "none" : "0 8px 24px rgba(108,99,255,0.3)",
                   cursor: loading ? "not-allowed" : "pointer", fontSize:"15px" }}>
          {loading ? "Création en cours..." : "✨ Créer l'événement"}
        </button>
      </form>
    </div>
  );
}
