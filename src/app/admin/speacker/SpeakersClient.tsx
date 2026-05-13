"use client";
// app/admin/speakers/SpeakersClient.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Link2, Layers } from "lucide-react";
import Modal from "@/components/ui/Modal";

type SpeakerLink = { id:string; label:string; url:string };
type Speaker = { id:string; fullName:string; bio:string|null; photoUrl:string|null; speakerLinks:SpeakerLink[]; _count:{sessionSpeakers:number} };

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

const emptyForm = { fullName:"", bio:"", photoUrl:"", links:[{ label:"", url:"" }] };

export default function SpeakersClient({ speakers: init }: { speakers: Speaker[] }) {
  const router = useRouter();
  const [speakers, setSpeakers] = useState(init);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Speaker | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit   = (s: Speaker) => {
    setEditing(s);
    setForm({ fullName:s.fullName, bio:s.bio??"", photoUrl:s.photoUrl??"",
              links: s.speakerLinks.length ? s.speakerLinks.map(l=>({label:l.label,url:l.url})) : [{ label:"", url:"" }] });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const body = { ...form, links: form.links.filter(l => l.url.trim()) };
    const url    = editing ? `/api/speakers/${editing.id}` : "/api/speakers";
    const method = editing ? "PUT" : "POST";
    const res    = await fetch(url, { method, headers:{"Content-Type":"application/json"}, body:JSON.stringify(body) });
    const json   = await res.json();
    setSaving(false);
    if (json.success) {
      toast.success(editing ? "Speaker mis à jour ✅" : "Speaker créé 🎉");
      setModalOpen(false);
      if (editing) setSpeakers(ss => ss.map(s => s.id === editing.id ? { ...s, ...json.data } : s));
      else { setSpeakers(ss => [...ss, json.data]); router.refresh(); }
    } else toast.error(json.error ?? "Erreur");
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Supprimer "${name}" ?`)) return;
    const res  = await fetch(`/api/speakers/${id}`, { method:"DELETE" });
    const json = await res.json();
    if (json.success) { toast.success("Speaker supprimé"); setSpeakers(ss => ss.filter(s => s.id !== id)); }
    else toast.error(json.error ?? "Erreur");
  };

  const addLink    = () => setForm(f => ({ ...f, links:[...f.links,{ label:"",url:"" }] }));
  const removeLink = (i: number) => setForm(f => ({ ...f, links:f.links.filter((_,j)=>j!==i) }));
  const setLink    = (i: number, k: "label"|"url", v: string) =>
    setForm(f => ({ ...f, links: f.links.map((l,j) => j===i ? {...l,[k]:v} : l) }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8 animate-slide-up">
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, color:"#1A1A2E" }}>Speakers</h1>
          <p style={{ color:"rgba(26,26,46,0.45)", fontSize:"14px", marginTop:"4px" }}>{speakers.length} intervenant{speakers.length!==1?"s":""}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white"
          style={{ background:"linear-gradient(135deg,#6C63FF,#5850E8)", boxShadow:"0 6px 20px rgba(108,99,255,0.3)" }}>
          <Plus size={15}/> Ajouter un speaker
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {speakers.map((sp, i) => (
          <div key={sp.id} className={`bg-white rounded-2xl p-5 border animate-slide-up s${(i%6)+1}`}
               style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.05)" }}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                     style={{ background:"linear-gradient(135deg,rgba(108,99,255,0.12),rgba(0,212,170,0.12))" }}>
                  {sp.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight:700, fontSize:"14px", color:"#1A1A2E" }}>{sp.fullName}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Layers size={10} style={{ color:"rgba(26,26,46,0.35)" }}/>
                    <span style={{ fontSize:"11px", color:"rgba(26,26,46,0.38)" }}>{sp._count.sessionSpeakers} session{sp._count.sessionSpeakers!==1?"s":""}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(sp)} className="p-1.5 rounded-lg transition-all" style={{ color:"#6C63FF" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(108,99,255,0.1)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><Pencil size={13}/></button>
                <button onClick={() => handleDelete(sp.id, sp.fullName)} className="p-1.5 rounded-lg transition-all" style={{ color:"#FF6B6B" }}
                  onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,107,107,0.1)")} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}><Trash2 size={13}/></button>
              </div>
            </div>
            {sp.bio && <p style={{ fontSize:"12px", color:"rgba(26,26,46,0.55)", lineHeight:1.6, marginBottom:"12px" }}>{sp.bio}</p>}
            {sp.speakerLinks.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {sp.speakerLinks.map(l => (
                  <a key={l.id} href={l.url} target="_blank" rel="noopener"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                    style={{ background:"rgba(77,150,255,0.08)", color:"#4D96FF" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(77,150,255,0.16)")} onMouseLeave={e=>(e.currentTarget.style.background="rgba(77,150,255,0.08)")}>
                    <Link2 size={9}/>{l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "✏️ Modifier le speaker" : "➕ Nouveau speaker"}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div><label style={lS}>Nom complet *</label>
            <input value={form.fullName} onChange={e=>setForm(f=>({...f,fullName:e.target.value}))} style={iS} required onFocus={fo} onBlur={bl}/></div>
          <div><label style={lS}>Bio</label>
            <textarea value={form.bio} onChange={e=>setForm(f=>({...f,bio:e.target.value}))} style={{ ...iS, resize:"vertical" }} rows={3} onFocus={fo} onBlur={bl}/></div>
          <div><label style={lS}>Photo URL</label>
            <input value={form.photoUrl} onChange={e=>setForm(f=>({...f,photoUrl:e.target.value}))} style={iS} placeholder="https://..." onFocus={fo} onBlur={bl}/></div>
          {/* Links */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label style={lS}>Liens</label>
              <button type="button" onClick={addLink} className="text-xs font-semibold px-2 py-1 rounded-lg"
                style={{ background:"rgba(108,99,255,0.08)", color:"#6C63FF" }}>+ Lien</button>
            </div>
            {form.links.map((l,i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={l.label} onChange={e=>setLink(i,"label",e.target.value)} style={{ ...iS, width:"30%" }} placeholder="Label" onFocus={fo} onBlur={bl}/>
                <input value={l.url}   onChange={e=>setLink(i,"url",e.target.value)}   style={{ ...iS, flex:1 }}    placeholder="https://..." onFocus={fo} onBlur={bl}/>
                {form.links.length > 1 && (
                  <button type="button" onClick={() => removeLink(i)} className="px-2 rounded-xl flex-shrink-0"
                    style={{ background:"rgba(255,107,107,0.08)", color:"#FF6B6B" }}>✕</button>
                )}
              </div>
            ))}
          </div>
          <button type="submit" disabled={saving}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm"
            style={{ background: saving ? "rgba(108,99,255,0.4)" : "linear-gradient(135deg,#6C63FF,#5850E8)", cursor: saving?"not-allowed":"pointer" }}>
            {saving ? "Sauvegarde..." : editing ? "💾 Mettre à jour" : "✨ Créer le speaker"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
