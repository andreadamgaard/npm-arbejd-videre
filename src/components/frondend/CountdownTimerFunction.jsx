import { useEffect, useState } from "react";
import CountdownTimer from "@/components/globals/CountdownTimer";

export default function Countdown() {
  // holder styr på om komponenten er monteret
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    //isMounted er true, viser at komponenten er monteret
    setIsMounted(true);
  }, []); //tomt array sørger for den kun kører en gang (componentDiMount)
  return (
    <section className="text-center pt-12 pb-8">
      {/* Render CountdownTimer kun efter komponenten er monteret */}
      {isMounted && <CountdownTimer targetDate={new Date("2024-07-01T00:00:00")} />}
    </section>
  );
}
