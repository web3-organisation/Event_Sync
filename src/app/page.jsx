import { redirect } from "next/navigation";

export default function Home() {
  const condition = true; // remplacez par votre logique
  if (condition) {
    redirect("/events");
  } else {
    redirect("/sessions/1");
  }
}
