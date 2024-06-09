import Image from "next/image.js";
import Link from "next/link.js";
import { krona_one } from "@/app/fonts";

export default function LineupBands({
  lineUp,
  schedule,
  filterDay,
  filterGenre,
}) {
  // Filter logikken her
  const filterBands = () => {
    let filteredBands = lineUp;

    // Ved valg af dag kører filteret:
    if (filterDay !== "all") {
      let actsDay = []; // Tomt array der tager imod acts for valgte dag

      // Nyt array => for hver scene tilføjes alle act for den dag til det tomme array
      Object.values(schedule).forEach((scene) => {
        actsDay = actsDay.concat(scene[filterDay]?.map((act) => act.act) || []);
        // ?. sikre der ikke sker fejl hvis dagen ikke findes i scenen
      });

      // Filtrér i bands baseret på acts for den valgte dag, så de snakker sammen
      filteredBands = filteredBands.filter((band) =>
        // (band.navn === schedule.act)
        actsDay.includes(band.name)
      );
    }

    // Ved valg af genre kører filteret:
    // Filtrere gennem vores data og sender kun dem med rigtig genre tilbage til os.
    if (filterGenre !== "all") {
      filteredBands = filteredBands.filter((band) => band.genre === filterGenre);
    }

    // Returner den nye liste til filteredBands
    return filteredBands;
  };

  const filteredLineUp = filterBands();

  return (
    <div className={`grid grid-cols-2 px-6 py-5 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${krona_one.className}`}>
      {/* Vi mapper gennem vores filtrerede bands, så den laver en article for hvert band med info */}
      {filteredLineUp.map((band) => (
        <article key={band.name} tabIndex={0} className="relative overflow-hidden flex flex-col h-48 md:h-72 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor">
          <Link href={band.slug} prefetch={false} className="flex flex-col h-full overflow-hidden group" aria-label={`Link to ${band.name} details`}>
            <figure className="relative w-full h-full transform transition">
              <Image src={band.logo.includes("https") ? band.logo : `/logos/${band.logo}`} fill loading="lazy" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" alt={`Logo of ${band.name}`} className="absolute grayscale group-hover:grayscale-0 inset-0 w-full h-full object-cover duration-300 transform group-hover:scale-110" />
              <figcaption className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-bgColor p-2 to-transparent">
                <p className=" text-primaryTextColor img-text-size text-center">{band.name}</p>
              </figcaption>
            </figure>
          </Link>
        </article>
      ))}
    </div>
  );
}
