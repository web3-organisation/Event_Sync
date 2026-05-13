// app/events/[id]/sessions/[sessionId]/page.tsx — Server Component
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Users, Link2 } from "lucide-react";
import QASection from "./QASection";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ id: string; sessionId: string }> };

export default async function SessionDetailPage({ params }: Props) {
  const { id: eventId, sessionId } = await params;
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      event: true,
      room:  true,
      sessionSpeakers: { include: { speaker: { include: { speakerLinks: true } } } },
      questions: { orderBy: { upvotes: "desc" } },
    },
  });
  if (!session || session.eventId !== eventId) notFound();

  let startT = "", endT = "";
  try { startT = format(new Date(session.startTime), "HH'h'mm · dd MMMM yyyy", { locale:fr }); } catch {}
  try { endT   = format(new Date(session.endTime),   "HH'h'mm");                                } catch {}

  return (
    <div style={{ background:"#F8F9FF" }}>
      {/* Header */}
      <div className="border-b" style={{ background:"white", borderColor:"rgba(26,26,46,0.08)" }}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Link href={`/events/${eventId}`} className="inline-flex items-center gap-2 mb-5 text-sm font-semibold"
            style={{ color:"rgba(26,26,46,0.5)" }}>
            <ArrowLeft size={14}/> {session.event.title}
          </Link>
          <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, color:"#1A1A2E", marginBottom:"14px" }}>
            {session.title}
          </h1>
          <div className="flex flex-wrap gap-4">
            <span className="flex items-center gap-1.5 text-sm" style={{ color:"rgba(26,26,46,0.5)" }}>
              <Clock size={13}/>{startT} → {endT}
            </span>
            <span className="flex items-center gap-1.5 text-sm" style={{ color:"rgba(26,26,46,0.5)" }}>
              <MapPin size={13}/>{session.room.name}
            </span>
            {session.capacity && (
              <span className="flex items-center gap-1.5 text-sm" style={{ color:"rgba(26,26,46,0.5)" }}>
                <Users size={13}/>{session.capacity} places
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main */}
        <div className="lg:col-span-2">
          {session.description && (
            <div className="bg-white rounded-2xl p-6 border mb-6 animate-slide-up"
                 style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 10px rgba(26,26,46,0.05)" }}>
              <h2 className="mb-3" style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:700, color:"#1A1A2E" }}>Description</h2>
              <p style={{ fontSize:"14px", color:"rgba(26,26,46,0.6)", lineHeight:1.7 }}>{session.description}</p>
            </div>
          )}

          {/* Q&A */}
          <QASection sessionId={sessionId} initialQuestions={session.questions} />
        </div>

        {/* Speakers */}
        <div className="lg:col-span-1 animate-slide-up s2">
          <h2 className="mb-4" style={{ fontFamily:"'Syne',sans-serif", fontSize:"1rem", fontWeight:700, color:"#1A1A2E" }}>
            Speakers ({session.sessionSpeakers.length})
          </h2>
          {session.sessionSpeakers.length === 0 ? (
            <div className="bg-white rounded-2xl p-5 border text-center" style={{ borderColor:"rgba(26,26,46,0.07)" }}>
              <p style={{ fontSize:"13px", color:"rgba(26,26,46,0.35)" }}>Aucun intervenant</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {session.sessionSpeakers.map(({ speaker }) => (
                <div key={speaker.id} className="bg-white rounded-2xl p-5 border"
                     style={{ borderColor:"rgba(26,26,46,0.07)", boxShadow:"0 2px 10px rgba(26,26,46,0.05)" }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                         style={{ background:"linear-gradient(135deg,rgba(108,99,255,0.1),rgba(0,212,170,0.1))" }}>
                      {speaker.fullName.charAt(0)}
                    </div>
                    <div style={{ fontWeight:700, fontSize:"14px", color:"#1A1A2E" }}>{speaker.fullName}</div>
                  </div>
                  {speaker.bio && <p style={{ fontSize:"12px", color:"rgba(26,26,46,0.55)", lineHeight:1.6, marginBottom:"10px" }}>{speaker.bio}</p>}
                  {speaker.speakerLinks.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {speaker.speakerLinks.map(l => (
                        <a key={l.id} href={l.url} target="_blank" rel="noopener"
                           className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                           style={{ background:"rgba(77,150,255,0.08)", color:"#4D96FF" }}>
                          <Link2 size={9}/>{l.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
