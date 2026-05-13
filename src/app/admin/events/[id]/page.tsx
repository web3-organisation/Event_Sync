// app/admin/events/[id]/page.tsx — Server Component
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft, Plus, MapPin, Calendar } from "lucide-react";
import EditEventForm from "./EditEventForm";
import SessionsManager from "./SessionsManager";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminEventDetailPage({ params }: Props) {
  const { id } = await params;

  const [event, speakers] = await Promise.all([
    prisma.event.findUnique({
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
    }),
    prisma.speaker.findMany({ orderBy: { fullName: "asc" } }),
  ]);

  if (!event) notFound();

  let startStr = "", endStr = "";
  try { startStr = format(new Date(event.startDate), "dd MMMM yyyy", { locale: fr }); } catch {}
  try { endStr   = format(new Date(event.endDate),   "dd MMMM yyyy", { locale: fr }); } catch {}

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Back */}
      <Link href="/admin/events" className="inline-flex items-center gap-2 mb-6 text-sm font-semibold"
        style={{ color:"rgba(26,26,46,0.5)" }}
        onMouseEnter={e => (e.currentTarget.style.color = "#6C63FF")}
        onMouseLeave={e => (e.currentTarget.style.color = "rgba(26,26,46,0.5)")}>
        <ArrowLeft size={15}/> Tous les événements
      </Link>

      {/* Hero */}
      <div className="mb-8 p-8 rounded-3xl animate-slide-up"
           style={{ background:"linear-gradient(135deg,rgba(108,99,255,0.08),rgba(0,212,170,0.06))", border:"1px solid rgba(108,99,255,0.12)" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"2rem", fontWeight:800, color:"#1A1A2E" }}>
              {event.title}
            </h1>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-sm" style={{ color:"rgba(26,26,46,0.55)" }}>
                <Calendar size={14}/> {startStr} → {endStr}
              </span>
              {event.location && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color:"rgba(26,26,46,0.55)" }}>
                  <MapPin size={14}/> {event.location}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background:"rgba(108,99,255,0.1)", color:"#6C63FF" }}>
              {event.rooms.length} salle{event.rooms.length !== 1 ? "s" : ""}
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background:"rgba(0,212,170,0.1)", color:"#00D4AA" }}>
              {event.sessions.length} session{event.sessions.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Edit form */}
        <div className="lg:col-span-1">
          <EditEventForm event={event} />
        </div>
        {/* Right: Sessions */}
        <div className="lg:col-span-2">
          <SessionsManager
            event={{ id: event.id, rooms: event.rooms }}
            sessions={event.sessions as any}
            speakers={speakers}
          />
        </div>
      </div>
    </div>
  );
}
