// app/events/page.tsx — Server Component
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MapPin, Calendar, Layers, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  const events = await prisma.event.findMany({
    where: q ? {
      OR: [
        { title:       { contains: q, mode:"insensitive" } },
        { location:    { contains: q, mode:"insensitive" } },
        { description: { contains: q, mode:"insensitive" } },
      ],
    } : undefined,
    include: {
      rooms: true,
      _count: { select: { sessions: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12 animate-slide-up">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 uppercase tracking-widest"
             style={{ background:"rgba(108,99,255,0.08)", color:"#6C63FF", border:"1px solid rgba(108,99,255,0.18)" }}>
          🗓️ Plateforme Événements
        </div>
        <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(2rem,5vw,3.2rem)", fontWeight:800, color:"#1A1A2E", marginBottom:"14px", lineHeight:1.15 }}>
          Découvrez nos<br />
          <span style={{ background:"linear-gradient(135deg,#6C63FF,#00D4AA)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            événements
          </span>
        </h1>
        <p style={{ fontSize:"16px", color:"rgba(26,26,46,0.5)", maxWidth:"480px", margin:"0 auto 32px" }}>
          Conférences, workshops, festivals — inscrivez-vous et participez en direct.
        </p>

        {/* Search form */}
        <form method="GET" className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input name="q" defaultValue={q} placeholder="Rechercher un événement..."
              className="flex-1 px-5 py-3 rounded-2xl text-sm border transition-all"
              style={{ background:"white", borderColor:"rgba(26,26,46,0.12)", color:"#1A1A2E", fontFamily:"'Space Grotesk',sans-serif" }}/>
            <button type="submit" className="px-5 py-3 rounded-2xl text-sm font-bold text-white"
              style={{ background:"linear-gradient(135deg,#6C63FF,#5850E8)" }}>Chercher</button>
          </div>
        </form>
      </div>

      {/* Count */}
      <div className="mb-6 text-sm font-medium" style={{ color:"rgba(26,26,46,0.4)" }}>
        {events.length} événement{events.length !== 1 ? "s" : ""}{q ? ` pour "${q}"` : ""}
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-6xl">🔍</div>
          <p style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.2rem", fontWeight:700, color:"rgba(26,26,46,0.35)" }}>
            Aucun événement trouvé
          </p>
          <Link href="/events">
            <button className="px-5 py-2.5 rounded-2xl text-sm font-semibold text-white" style={{ background:"#6C63FF" }}>
              Tout afficher
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => {
            let startStr = "", endStr = "";
            try { startStr = format(new Date(event.startDate), "dd MMM yyyy", { locale: fr }); } catch {}
            try { endStr   = format(new Date(event.endDate),   "dd MMM yyyy", { locale: fr }); } catch {}
            const now = new Date();
            const isLive = new Date(event.startDate) <= now && new Date(event.endDate) >= now;
            const isPast = new Date(event.endDate) < now;

            return (
              <Link key={event.id} href={`/events/${event.id}`}>
                <div className={`bg-white rounded-2xl overflow-hidden border h-full flex flex-col cursor-pointer transition-all animate-slide-up s${(i%6)+1}`}
                     style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 12px rgba(26,26,46,0.06)" }}
                     onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform="translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow="0 16px 40px rgba(26,26,46,0.12)"; }}
                     onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform="translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow="0 2px 12px rgba(26,26,46,0.06)"; }}>
                  {/* Banner */}
                  <div className="h-32 flex items-center justify-center relative"
                       style={{ background:`linear-gradient(135deg,rgba(108,99,255,0.10),rgba(0,212,170,0.12))` }}>
                    <span className="text-5xl">📅</span>
                    <div className="absolute top-3 left-3">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                              style={{ background:"rgba(0,212,170,0.15)", color:"#00D4AA" }}>
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background:"#00D4AA" }}/>En direct
                        </span>
                      ) : isPast ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ background:"rgba(26,26,46,0.08)", color:"rgba(26,26,46,0.4)" }}>Terminé</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold"
                              style={{ background:"rgba(77,150,255,0.12)", color:"#4D96FF" }}>À venir</span>
                      )}
                    </div>
                  </div>
                  {/* Body */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="mb-3" style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"15px", color:"#1A1A2E", lineHeight:1.3 }}>
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="mb-3" style={{ fontSize:"12px", color:"rgba(26,26,46,0.5)", lineHeight:1.6,
                        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>
                        {event.description}
                      </p>
                    )}
                    <div className="flex flex-col gap-1.5 mt-auto">
                      <div className="flex items-center gap-2 text-xs" style={{ color:"rgba(26,26,46,0.45)" }}>
                        <Calendar size={11}/>{startStr}{startStr !== endStr ? ` → ${endStr}` : ""}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-xs" style={{ color:"rgba(26,26,46,0.45)" }}>
                          <MapPin size={11}/>{event.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs" style={{ color:"rgba(26,26,46,0.45)" }}>
                        <Layers size={11}/>{event._count.sessions} session{event._count.sessions!==1?"s":""} · {event.rooms.length} salle{event.rooms.length!==1?"s":""}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4 pt-3 border-t text-xs font-semibold"
                         style={{ borderColor:"rgba(26,26,46,0.06)", color:"#6C63FF" }}>
                      Voir les sessions <ArrowRight size={12}/>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
