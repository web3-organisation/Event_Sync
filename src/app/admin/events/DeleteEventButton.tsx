"use client";
// app/admin/events/DeleteEventButton.tsx
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function DeleteEventButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Supprimer "${title}" ? Cette action est irréversible.`)) return;
    const res  = await fetch(`/api/events/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (json.success) { toast.success("Événement supprimé"); router.refresh(); }
    else toast.error(json.error ?? "Erreur");
  };

  return (
    <button onClick={handleDelete} className="p-2 rounded-lg transition-all" style={{ color:"#FF6B6B" }} title="Supprimer"
      onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,107,107,0.1)")}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
      <Trash2 size={15}/>
    </button>
  );
}
