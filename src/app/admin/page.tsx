// app/admin/page.tsx — Server Component
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDays, Users, Layers, MessageSquare, Plus, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [events, speakersCount, sessionsCount, questionsCount] = await Promise.all([
    prisma.event.findMany({
      include: { _count: { select: { sessions: true, rooms: true } } },
      orderBy: { startDate: "asc" },
      take: 6,
    }),
    prisma.speaker.count(),
    prisma.session.count(),
    prisma.question.count(),
  ]);

  const stats = [
    { label: "Événements",  value: events.length, icon: CalendarDays, color: "#6C63FF", bg: "rgba(108,99,255,0.08)" },
    { label: "Sessions",    value: sessionsCount,  icon: Layers,       color: "#00D4AA", bg: "rgba(0,212,170,0.08)"  },
    { label: "Speakers",    value: speakersCount,  icon: Users,        color: "#4D96FF", bg: "rgba(77,150,255,0.08)" },
    { label: "Questions",   value: questionsCount, icon: MessageSquare,color: "#FFD93D", bg: "rgba(255,217,61,0.08)" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-10 animate-slide-up">
        <div>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, color:"#1A1A2E" }}>
            Dashboard Admin
          </h1>
          <p style={{ color:"rgba(26,26,46,0.45)", fontSize:"14px", marginTop:"4px" }}>
            Vue d'ensemble de la plateforme EventSync
          </p>
        </div>
        <Link href="/admin/events/new">
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold text-white transition-all"
            style={{ background:"linear-gradient(135deg,#6C63FF,#5850E8)", boxShadow:"0 6px 20px rgba(108,99,255,0.3)" }}>
            <Plus size={16} /> Nouvel événement
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <div key={label} className={`bg-white rounded-2xl p-5 border animate-slide-up s${i+1}`}
               style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.05)" }}>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize:"11px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em", color:"rgba(26,26,46,0.38)" }}>{label}</span>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background:bg }}>
                <Icon size={15} style={{ color }} />
              </div>
            </div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"2.4rem", fontWeight:800, color:"#1A1A2E" }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Events list */}
      <div className="bg-white rounded-3xl border overflow-hidden animate-slide-up s3"
           style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 16px rgba(26,26,46,0.06)" }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor:"rgba(26,26,46,0.06)" }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.1rem", fontWeight:700, color:"#1A1A2E" }}>
            Événements récents
          </h2>
          <Link href="/admin/events" className="flex items-center gap-1.5 text-sm font-semibold transition-all"
            style={{ color:"#6C63FF" }}>
            Tout voir <ArrowRight size={14}/>
          </Link>
        </div>
        <div className="divide-y" style={{}}>
          {events.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="text-4xl mb-3">📭</div>
              <p style={{ color:"rgba(26,26,46,0.35)", fontSize:"15px" }}>Aucun événement créé</p>
              <Link href="/admin/events/new">
                <button className="mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background:"#6C63FF" }}>Créer le premier →</button>
              </Link>
            </div>
          ) : events.map((event) => {
            let dateStr = "";
            try { dateStr = format(new Date(event.startDate), "dd MMM yyyy", { locale: fr }); } catch {}
            return (
              <div key={event.id} className="flex items-center justify-between px-6 py-4 transition-colors"
                   onMouseEnter={e => (e.currentTarget.style.background = "rgba(108,99,255,0.02)")}
                   onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                       style={{ background:"rgba(108,99,255,0.08)" }}>📅</div>
                  <div>
                    <div style={{ fontWeight:600, fontSize:"14px", color:"#1A1A2E" }}>{event.title}</div>
                    <div style={{ fontSize:"12px", color:"rgba(26,26,46,0.42)", marginTop:"2px" }}>
                      {dateStr} · {event.location ?? "—"} · {event._count.sessions} session{event._count.sessions !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <Link href={`/admin/events/${event.id}`}>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                    style={{ color:"#6C63FF", borderColor:"rgba(108,99,255,0.2)" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(108,99,255,0.06)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    Gérer <ArrowRight size={12}/>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
