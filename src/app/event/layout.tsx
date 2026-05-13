// app/events/layout.tsx — Server Component
import Navbar from "@/components/ui/Navbar";
export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background:"#F8F9FF" }}>
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
