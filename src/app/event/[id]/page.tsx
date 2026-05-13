// app/events/[id]/page.tsx — Server Component
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock, Users, MessageSquare, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string }> };

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      rooms: true,
      sessions: {
        include: {
          room: true,
          sessionSpeakers: { include: { speaker: true } },
          _count: { select: { questions: true } },
        },
        orderBy: { startTime: "asc" },
      },
    },
  });
  if (!event) notFound();

  let startStr = "", endStr = "";
  try { startStr = format(new Date(event.startDate), "EEEE dd MMMM yyyy", { locale:fr }); } catch {}
  try { endStr   = format(new Date(event.endDate),   "EEEE dd MMMM yyyy", { locale:fr }); } catch {}

  const now    = new Date();
  const isLive = new Date(event.startDate) <= now && new Date(event.endDate) >= now;
  const isPast = new Date(event.endDate) < now;

  // Group sessions by day
  const byDay = event.sessions.reduce((acc, s) => {
    let day = "";
    try { day = format(new Date(s.startTime), "EEEE dd MMMM", { locale:fr }); } catch {}
    if (!acc[day]) acc[day] = [];
    acc[day].push(s);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div style={{ background:"#F8F9FF" }}>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ background:"linear-gradient(135deg,rgba(108,99,255,0.12),rgba(0,212,170,0.08))", borderBottom:"1px solid rgba(108,99,255,0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link href="/events" className="inline-flex items-center gap-2 mb-6 text-sm font-semibold transition-all"
            style={{ color:"rgba(26,26,46,0.5)" }}>
            <ArrowLeft size={15}/> Tous les événements
          </Link>

          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              {/* Status */}
              <div className="mb-4">
                {isLive ? (
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold"
                        style={{ background:"rgba(0,212,170,0.12)", color:"#00D4AA", border:"1px solid rgba(0,212,170,0.2)" }}>
                    <span className="w-2 h-2 rounded-full animate-pulse-dot" style={{ background:"#00D4AA" }}/> En direct maintenant
                  </span>
                ) : isPast ? (
                  <span className="px-4 py-1.5 rounded-full text-sm font-bold"
                        style={{ background:"rgba(26,26,46,0.07)", color:"rgba(26,26,46,0.4)" }}>Événement terminé</span>
                ) : (
                  <span className="px-4 py-1.5 rounded-full text-sm font-bold"
                        style={{ background:"rgba(77,150,255,0.1)", color:"#4D96FF", border:"1px solid rgba(77,150,255,0.2)" }}>À venir</span>
                )}
              </div>

              <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.8rem,4vw,2.8rem)", fontWeight:800, color:"#1A1A2E", lineHeight:1.15, marginBottom:"16px" }}>
                {event.title}
              </h1>

              {event.description && (
                <p style={{ fontSize:"15px", color:"rgba(26,26,46,0.6)", lineHeight:1.7, maxWidth:"600px" }}>
                  {event.description}
                </p>
              )}
            </div>

            {/* Info card */}
            <div className="bg-white rounded-2xl p-5 border flex-shrink-0 min-w-[260px]"
                 style={{ borderColor:"rgba(26,26,46,0.08)", boxShadow:"0 4px 20px rgba(26,26,46,0.08)" }}>
              {[
                { icon: Calendar, text: startStr },
                { icon: Clock,    text: `→ ${endStr}` },
                ...(event.location ? [{ icon: MapPin, text: event.location }] : []),
                { icon: Users,        text: `${event.sessions.length} sessions` },
                { icon: MessageSquare,text: `${event.rooms.length} salles` },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-start gap-3 py-2.5 border-b last:border-b-0"
                     style={{ borderColor:"rgba(26,26,46,0.05)" }}>
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                       style={{ background:"rgba(108,99,255,0.08)" }}>
                    <Icon size={12} style={{ color:"#6C63FF" }}/>
                  </div>
                  <span style={{ fontSize:"13px", color:"rgba(26,26,46,0.65)", textTransform:"capitalize" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="mb-8 animate-slide-up" style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.5rem", fontWeight:800, color:"#1A1A2E" }}>
          Programme des sessions
        </h2>

        {Object.keys(byDay).length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <p style={{ color:"rgba(26,26,46,0.35)", fontSize:"15px" }}>Aucune session programmée</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {(Object.entries(byDay) as [string, any[]][]).map(([day, sessions], di) => (
              <div key={day} className={`animate-slide-up s${di+1}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-4 py-1.5 rounded-full text-sm font-bold capitalize"
                        style={{ background:"rgba(108,99,255,0.08)", color:"#6C63FF", border:"1px solid rgba(108,99,255,0.15)" }}>
                    📅 {day}
                  </span>
                  <div className="flex-1 h-px" style={{ background:"rgba(26,26,46,0.07)" }}/>
                </div>

                <div className="flex flex-col gap-3">
                  {sessions.map(session => {
                    let startT = "", endT = "";
                    try { startT = format(new Date(session.startTime), "HH'h'mm"); } catch {}
                    try { endT   = format(new Date(session.endTime),   "HH'h'mm"); } catch {}
                    return (
                      <Link key={session.id} href={`/events/${event.id}/sessions/${session.id}`}>
                        <div className="bg-white rounded-2xl p-5 border flex gap-4 cursor-pointer transition-all"
                             style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 8px rgba(26,26,46,0.04)" }}
                             onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor="#6C63FF"; (e.currentTarget as HTMLElement).style.boxShadow="0 8px 24px rgba(108,99,255,0.1)"; }}
                             onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor="rgba(26,26,46,0.07)"; (e.currentTarget as HTMLElement).style.boxShadow="0 2px 8px rgba(26,26,46,0.04)"; }}>
                          {/* Time */}
                          <div className="text-center flex-shrink-0 w-16">
                            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"14px", color:"#6C63FF" }}>{startT}</div>
                            <div style={{ fontSize:"11px", color:"rgba(26,26,46,0.38)", marginTop:"2px" }}>→ {endT}</div>
                          </div>
                          <div className="w-px self-stretch" style={{ background:"rgba(108,99,255,0.12)" }}/>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div style={{ fontWeight:700, fontSize:"14px", color:"#1A1A2E", marginBottom:"6px" }}>
                              {session.title}
                            </div>
                            <div className="flex flex-wrap gap-3">
                              <span style={{ fontSize:"11px", color:"rgba(26,26,46,0.42)" }}>📍 {session.room.name}</span>
                              {session.capacity && <span style={{ fontSize:"11px", color:"rgba(26,26,46,0.42)" }}><Users size={10} style={{display:"inline"}}/> {session.capacity}</span>}
                              <span style={{ fontSize:"11px", color:"rgba(26,26,46,0.42)" }}>
                                <MessageSquare size={10} style={{display:"inline"}}/> {session._count.questions} question{session._count.questions!==1?"s":""}
                              </span>
                            </div>
                            {session.sessionSpeakers.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mt-2">
                                {session.sessionSpeakers.map(ss => (
                                  <span key={ss.speaker.id} className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                                        style={{ background:"rgba(0,212,170,0.07)", color:"#00D4AA" }}>
                                    {ss.speaker.fullName}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <ArrowRight size={16} style={{ color:"rgba(26,26,46,0.2)", flexShrink:0, alignSelf:"center" }}/>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
