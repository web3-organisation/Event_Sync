// lib/types.ts  (shared public types — extend as needed)

export interface Speaker {
  id: string;
  fullName: string;
  photoUrl: string | null;
  bio: string | null;
  speakerLinks: { id: string; label: string; url: string }[];
}

export interface Question {
  id: string;
  content: string;
  authorName: string | null;
  upvotes: number;
  createdAt: string;
  sessionId: string;
}

export interface Room {
  id: string;
  name: string;
  eventId: string;
}

export interface SessionSummary {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  capacity: number | null;
  roomId: string;
  room: Room;
  eventId: string;
  sessionSpeakers: { speaker: Speaker }[];
  _count: { questions: number };
}

export interface SessionDetail extends SessionSummary {
  event: EventSummary;
  questions: Question[];
}

export interface RoomWithSessions extends Room {
  sessions: SessionSummary[];
}

export interface EventSummary {
  id: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  location: string | null;
  createdAt: string;
  _count: { sessions: number; rooms: number };
}

export interface EventDetail extends Omit<EventSummary, "_count"> {
  rooms: RoomWithSessions[];
  sessions: SessionSummary[];
}
