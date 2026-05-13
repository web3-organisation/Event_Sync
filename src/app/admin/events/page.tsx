// app/admin/events/page.tsx — Server Component
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Pencil, Eye, Layers } from "lucide-react";
import DeleteEventButton from "./DeleteEventButton";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    include: {
      rooms: true,
      _count: { select: { sessions: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-slide-up">
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, color:"#1A1A2E" }}>
            Gestion des Événements
          </h1>
          <p style={{ color:"rgba(26,26,46,0.45)", fontSize:"14px", marginTop:"4px" }}>
            {events.length} événement{events.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link href="/admin/events/new">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white transition-all"
            style={{ background:"linear-gradient(135deg,#6C63FF,#5850E8)", boxShadow:"0 6px 20px rgba(108,99,255,0.3)" }}>
            <Plus size={16} /> Créer un événement
          </button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border overflow-hidden animate-slide-up s2"
           style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 16px rgba(26,26,46,0.06)" }}>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="text-5xl">📭</div>
            <p style={{ fontSize:"16px", fontWeight:600, color:"rgba(26,26,46,0.35)" }}>Aucun événement</p>
            <Link href="/admin/events/new">
              <button className="mt-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-white" style={{ background:"#6C63FF" }}>
                Créer le premier →
              </button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background:"rgba(248,249,255,0.9)", borderBottom:"1px solid rgba(26,26,46,0.06)" }}>
                  {["Événement","Dates","Lieu","Salles","Sessions","Actions"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left"
                        style={{ fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(26,26,46,0.38)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  let start = "", end = "";
                  try { start = format(new Date(event.startDate), "dd MMM yyyy", { locale: fr }); } catch {}
                  try { end   = format(new Date(event.endDate),   "dd MMM yyyy", { locale: fr }); } catch {}
                  return (
                    <tr key={event.id} className="border-b transition-colors"
                        style={{ borderColor:"rgba(26,26,46,0.04)" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "rgba(108,99,255,0.02)")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <td className="px-5 py-4">
                        <div style={{ fontWeight:600, fontSize:"14px", color:"#1A1A2E" }}>{event.title}</div>
                        {event.description && (
                          <div style={{ fontSize:"12px", color:"rgba(26,26,46,0.42)", marginTop:"2px", maxWidth:"260px", overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>
                            {event.description}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div style={{ fontSize:"13px", color:"rgba(26,26,46,0.65)" }}>{start}</div>
                        <div style={{ fontSize:"12px", color:"rgba(26,26,46,0.4)" }}>→ {end}</div>
                      </td>
                      <td className="px-5 py-4" style={{ fontSize:"13px", color:"rgba(26,26,46,0.65)" }}>
                        {event.location ?? "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{ background:"rgba(77,150,255,0.1)", color:"#4D96FF" }}>
                          {event.rooms.length} salle{event.rooms.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                              style={{ background:"rgba(108,99,255,0.1)", color:"#6C63FF" }}>
                          <Layers size={10}/>{event._count.sessions}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <Link href={`/events/${event.id}`}>
                            <button className="p-2 rounded-lg transition-all" style={{ color:"#00D4AA" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "rgba(0,212,170,0.1)")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")} title="Voir">
                              <Eye size={15}/>
                            </button>
                          </Link>
                          <Link href={`/admin/events/${event.id}`}>
                            <button className="p-2 rounded-lg transition-all" style={{ color:"#6C63FF" }}
                              onMouseEnter={e => (e.currentTarget.style.background = "rgba(108,99,255,0.1)")}
                              onMouseLeave={e => (e.currentTarget.style.background = "transparent")} title="Éditer">
                              <Pencil size={15}/>
                            </button>
                          </Link>
                          <DeleteEventButton id={event.id} title={event.title} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
