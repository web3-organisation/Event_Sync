-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speakers" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "photo_url" TEXT,
    "bio" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speaker_links" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "speaker_id" TEXT NOT NULL,

    CONSTRAINT "speaker_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "event_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session_speakers" (
    "session_id" TEXT NOT NULL,
    "speaker_id" TEXT NOT NULL,

    CONSTRAINT "session_speakers_pkey" PRIMARY KEY ("session_id","speaker_id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_name" TEXT,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "session_id" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_question" (
    "id_admins" TEXT NOT NULL,
    "id_questions" TEXT NOT NULL,

    CONSTRAINT "admin_question_pkey" PRIMARY KEY ("id_admins","id_questions")
);

-- CreateTable
CREATE TABLE "admin_session" (
    "id_admin" TEXT NOT NULL,
    "id_sessions" TEXT NOT NULL,

    CONSTRAINT "admin_session_pkey" PRIMARY KEY ("id_admin","id_sessions")
);

-- CreateTable
CREATE TABLE "admin_speakers" (
    "id_admin" TEXT NOT NULL,
    "id_speaker" TEXT NOT NULL,

    CONSTRAINT "admin_speakers_pkey" PRIMARY KEY ("id_admin","id_speaker")
);

-- CreateTable
CREATE TABLE "admin_room" (
    "id_admin" TEXT NOT NULL,
    "id_rooms" TEXT NOT NULL,

    CONSTRAINT "admin_room_pkey" PRIMARY KEY ("id_admin","id_rooms")
);

-- CreateTable
CREATE TABLE "admin_event" (
    "id_admins" TEXT NOT NULL,
    "id_events" TEXT NOT NULL,

    CONSTRAINT "admin_event_pkey" PRIMARY KEY ("id_admins","id_events")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speaker_links" ADD CONSTRAINT "speaker_links_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "speakers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_speakers" ADD CONSTRAINT "session_speakers_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_speakers" ADD CONSTRAINT "session_speakers_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "speakers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_question" ADD CONSTRAINT "admin_question_id_admins_fkey" FOREIGN KEY ("id_admins") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_question" ADD CONSTRAINT "admin_question_id_questions_fkey" FOREIGN KEY ("id_questions") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_id_sessions_fkey" FOREIGN KEY ("id_sessions") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_speakers" ADD CONSTRAINT "admin_speakers_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_speakers" ADD CONSTRAINT "admin_speakers_id_speaker_fkey" FOREIGN KEY ("id_speaker") REFERENCES "speakers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_room" ADD CONSTRAINT "admin_room_id_admin_fkey" FOREIGN KEY ("id_admin") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_room" ADD CONSTRAINT "admin_room_id_rooms_fkey" FOREIGN KEY ("id_rooms") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_event" ADD CONSTRAINT "admin_event_id_admins_fkey" FOREIGN KEY ("id_admins") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_event" ADD CONSTRAINT "admin_event_id_events_fkey" FOREIGN KEY ("id_events") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
