"use client";
// app/admin/events/[id]/EditEventForm.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save } from "lucide-react";

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

export default function EditEventForm({ event }: { event: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title:       event.title,
    description: event.description ?? "",
    startDate:   event.startDate?.slice(0, 16) ?? "",
    endDate:     event.endDate?.slice(0, 16)   ?? "",
    location:    event.location ?? "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    const res = await fetch(`/api/events/${event.id}`, {
      method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form),
    });
    const json = await res.json();
    setLoading(false);
    if (json.success) { toast.success("Événement mis à jour ✅"); router.refresh(); }
    else toast.error(json.error ?? "Erreur");
  };

  return (
    <div className="bg-white rounded-2xl p-6 border"
         style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.05)" }}>
      <h2 className="mb-5" style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:700, color:"#1A1A2E" }}>
        Modifier l'événement
      </h2>
      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <div><label style={lS}>Titre *</label>
          <input value={form.title} onChange={set("title")} style={iS} required onFocus={fo} onBlur={bl}/></div>
        <div><label style={lS}>Description</label>
          <textarea value={form.description} onChange={set("description")} style={{ ...iS, resize:"vertical" }}
            rows={3} onFocus={fo} onBlur={bl}/></div>
        <div><label style={lS}>Début *</label>
          <input type="datetime-local" value={form.startDate} onChange={set("startDate")} style={iS} required onFocus={fo} onBlur={bl}/></div>
        <div><label style={lS}>Fin *</label>
          <input type="datetime-local" value={form.endDate} onChange={set("endDate")} style={iS} required onFocus={fo} onBlur={bl}/></div>
        <div><label style={lS}>Lieu</label>
          <input value={form.location} onChange={set("location")} style={iS} placeholder="Ville, Lieu" onFocus={fo} onBlur={bl}/></div>
        <button type="submit" disabled={loading}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-white text-sm transition-all"
          style={{ background: loading ? "rgba(108,99,255,0.4)" : "linear-gradient(135deg,#6C63FF,#5850E8)",
                   cursor: loading ? "not-allowed" : "pointer" }}>
          <Save size={14}/>{loading ? "Sauvegarde..." : "Sauvegarder"}
        </button>
      </form>
    </div>
  );
}
