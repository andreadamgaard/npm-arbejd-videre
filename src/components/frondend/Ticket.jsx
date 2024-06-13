import Link from "next/link";
import { krona_one } from "@/app/fonts";
import TicketVip from "@/components/svgs/TicketVip";
import Logo from "@/components/svgs/Logo";

export default function Ticket({ color, campArea }) {
  const fillColor = {
    pink: "#ff7ab5",
    orange: "#de903e",
    blue: "#7deaef",
    yellow: "#FFD700",
    purple: "#987ca3",
    green: "#9ecc78",
  }[color];

  return (
    <div className="relative h-auto md:h-auto">
      <div className="absolute inset-0 z-0 h-full w-full">
        <Link href="/booking" prefetch={false} className="focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor" aria-label="Køb billet">
          <TicketVip style={{ fill: fillColor }} className="w-full h-full object-contain" />
        </Link>
      </div>
      <div className="relative z-10 h-full text-secondaryTextColor px-6 md:px-12 py-2">
        <div className="flex justify-between md:pb-2 border-b-2 border-secondaryTextColor">
          <Logo className="w-16 md:pl-6 lg:w-32 fill-secondaryTextColor" />
          <p className="text-right ticket-text-size md:pr-6">
            Monday <br /> July 1
          </p>
        </div>
        <div className="grid">
          <p className="ticket-text-size pb-2 pt-3 lg:pt-7">Camping area</p>
          <h2 className={`${krona_one.className} ticket-size`}>{campArea}</h2>
        </div>
      </div>
    </div>
  );
}
