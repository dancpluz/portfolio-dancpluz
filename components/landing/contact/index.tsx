import { getSectionId } from "@/lib/utils";
import { ROUTES } from "@/lib/constant";
import FlipText from "../flip-text";

export default function Contact() {
  return (
    <section id={getSectionId(ROUTES.contact)} className="w-full">
      <FlipText text="Contato" className="font-heading text-7xl" />
    </section>
  )
}
