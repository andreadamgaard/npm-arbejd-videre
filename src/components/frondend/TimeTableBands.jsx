import Image from "next/image.js";
import Link from "next/link.js";
import { krona_one } from "@/app/fonts";
import React, { useEffect, useRef } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/solid";


export default function TimeTableBands({ lineUp, schedule, filterDay, filterScene }) {
  // Scroll containeren skal nulstilles når man vælger ny dag:
  const scrollReset = useRef(null);

  useEffect(() => {
    if (scrollReset.current) {
      scrollReset.current.scrollLeft = 0;
      // Scroll sættes til 0, hver gang filterDay ændres
    }
  }, [filterDay]);
  // Ved at bruge en ref prop på div'en, får vi adgang til DOM-elementet og kan nulstille scroll
  // Jeg har sat en ref på band div for at kunne nulstille scroll-positionen, når filterDay ændres.

  // Filter logikken her
  const getBandSchedule = () => {
    let actsDay = [];

    // Hvis scenen står på all, henter vi alle acts
    if (filterScene === "all") {
      // Object.entries = returnerer et array af et objekts egne enumerable par [scener, tider]
      Object.entries(schedule)
        // itererer over hver scene og tid
        .forEach(([sceneName, sceneSchedule]) => {
          // Concat = merge to arrays med hianden
          actsDay = actsDay.concat(
            // Finder alle acts den dag og tilføjer scene navn til dem og putter det i array
            sceneSchedule[filterDay]?.map((act) => ({
              // ?. sikre der ikke sker fejl hvis vi prøver at finde en undefined værdi
              ...act,
              scene: sceneName,
            })) ||
              // Hvis ike der er nogen optrædner bruger vi en tom array
              []
          );
        });
    } else {
      // Hvis der er valgt en scene viser vi kun acts for den, den specifikke dag.
      actsDay =
        // Vi filrere hennem filterScene og Day, og h
        schedule[filterScene]?.[filterDay]?.map((act) => ({
          // Nyt object med acts og scene
          ...act, // Spræder alle acts
          scene: filterScene, // vi tilføjer scene værdien
        })) || [];
    }

    //BAND OG ACT ===

    // reducere Lineup til et enkelt objekt
    const bandsMap = lineUp.reduce((map, band) => {
      // Vi hiver alle bandnavne ud og giver dem band som værdi
      map[band.name] = band;
      return map;
    }, {}); // initialiseringsværdi for map.

    return (
      actsDay
        // Vi mapper acts for at tilføje ekstra værdi (Bandsmap)
        .map((act) => ({
          // Kopler act navnet, sammen med band navn
          ...act,
          band: bandsMap[act.act],
        }))
        // Vi beholder kun acts hvor navnet IKKE er "break"
        .filter((act) => act.act !== "break")
    );
  };

  // Min filtering tilføjes bandSchedule
  const bandSchedule = getBandSchedule();

  // Gruperet efter scene (til ipad + desktop)
  // Reducer band schedule til ét object

  // acc = "accumulator". Starter som tomt object
  // opdateres ved hver iteration af reducer funktion
  const groupedByScene = bandSchedule.reduce((acc, act) => {
    // Tjekker om acc har egenskab for act.scene.
    // Hvis IKKE, så initialiseres det som en tom array
    if (!acc[act.scene]) {
      acc[act.scene] = [];
    }
    // Tilføj act til den specifikke scene i vores array
    acc[act.scene].push(act);
    // Returnerer det opdaterede acc objekt
    return acc;
  }, {}); 

  // Gruperet efter tid (til mobil view)
  const groupedByTime = bandSchedule.reduce((acc, act) => {
    if (!acc[act.start]) {
      acc[act.start] = [];
    }
    acc[act.start].push(act);
    return acc;
  }, {});

  return (
    <section>
      {/* Tidsplan i desktop */}
      <div className="hidden md:block">
        {/* Itererer over groupedByScene objekterne */}
        {Object.keys(groupedByScene).map((scene) => (
          <div key={scene} className="py-6 px-6 relative">
            <h2 className={`${krona_one.className} scene-size mb-4 text-primaryTextColor`}>
              {/* viser scene navn */}
              {scene}
            </h2>
            <div className="relative">
              <div key={filterDay} ref={scrollReset} className="flex gap-8 overflow-x-scroll snap-x">
                {/* Itererer over acts for den aktuelle scene */}
                {/* Vi bruger dataen til at sætte det visuelt op herunder */}
                {groupedByScene[scene].map((act) => (
                  <article key={act.act} tabIndex={0} className="relative min-w-fit snap-start overflow-hidden flex flex-col h-72 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor">
                    <Link
                      // Link til bandets side, eller "#" hvis ingen slug
                      href={act.band?.slug || "#"}
                      prefetch={false}
                      className="flex flex-col h-full overflow-hidden group"
                      aria-label={`Link to ${act.act} details`}
                    >
                      <figure className="relative h-full w-full transform transition-all">
                        <div className="aspect-square relative w-full h-full">
                          <Image
                            // Hvis billedet indeholder http, hent fra api ELLERS hent lokalt
                            src={act.band.logo.includes("https") ? act.band.logo : `/logos/${act.band.logo}`}
                            layout="fill"
                            objectFit="cover"
                            loading="lazy"
                            alt={`Logo of ${act.act}`}
                            className="lg:grayscale lg:group-hover:grayscale-0 duration-300 transform lg:group-hover:scale-110"
                          />
                        </div>
                        <figcaption className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-bgColor p-2 to-transparent">
                          <p className={`${krona_one.className} normal-size text-primaryTextColor`}>{act.act}</p>
                          <div className="flex gap-4 items-center">
                            <p className="normal-size">
                              {act.start} - {act.end}
                            </p>
                            <p>{filterDay}</p>
                          </div>
                        </figcaption>
                      </figure>
                    </Link>
                  </article>
                ))}
              </div>
              <div className="absolute top-1/2 right-0  -translate-y-1/2 h-12 pointer-events-none">
                <ChevronRightIcon className="h-12 w-12 text-current" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tidsplan i mobil - Listeview */}
      <article className="md:hidden px-6 py-5">
        {/* Itererer over tiderne i groupedByTime */}
        {Object.keys(groupedByTime).map((time) => (
          <div key={time}>
            <div className="bg-secondaryBgColor py-3 px-3 small-size">
              <p>{time}</p>
            </div>
            <ul className="w-full">
              {/* Itererer over acts inden for den specifikke tidsramme */}
              {/* Vi bruger dataen til at sætte det visuelt op herunder */}
              {groupedByTime[time].map((act) => (
                <li key={`${act.act}-${act.scene}`} tabIndex={0} className="flex justify-between overflow-hidden w-full h-24 border-b border-primaryTextColor last:border-b-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor hover:bg-secondaryBgColor hover:bg-opacity-30 group">
                  <Link href={act.band?.slug || "#"} prefetch={false} className="w-full h-24 overflow-hidden flex items-center xsmall-size pl-2" aria-label={`Link to ${act.act} details`}>
                    <div className="flex flex-col flex-1">
                      <p>
                        {time} - {act.scene}
                      </p>
                      <p className={`${krona_one.className}`}>{act.act}</p>
                    </div>
                    <figure className="flex-1 h-24 flex justify-end items-end overflow-hidden">
                      {act.band && (
                        <div className="relative h-24 w-24 flex justify-center items-center">
                          <Image src={act.band.logo.includes("https") ? act.band.logo : `/logos/${act.band.logo}`} layout="fill" objectFit="cover" loading="lazy" alt={`Picture of ${act.act}`} className="h-full grayscale w-full object-cover duration-300 transform group-hover:grayscale-0 group-hover:scale-110" />
                        </div>
                      )}
                    </figure>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </article>
    </section>
  );
}
