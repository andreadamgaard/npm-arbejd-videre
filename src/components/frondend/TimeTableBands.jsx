import Image from "next/image.js";
import Link from "next/link.js";
import { krona_one } from "@/app/fonts";
import React, { useEffect, useRef } from "react";

export default function TimeTableBands({ lineUp, schedule, filterDay, filterScene }) {
  // Scroll containeren skal nulstilles når man vælger ny dag:
  const scrollReset = useRef(null);

  // Vi resetter vores scroll når dagen ændres
  useEffect(() => {
    if (scrollReset.current) {
      scrollReset.current.scrollLeft = 0;
      // Scroll sættes til 0, hver gang filterDay ændres
    }
  }, [filterDay]);
  // Jeg har sat en key på den div der indeholder vores bands, da det er derunder vores bands er.
  // Ved at give den en key prop, tvinger vi den til at re-mounte elementen og nulstille scroll

  // Filter logikken her
  const getBandSchedule = () => {
    let actsDay = [];

    // Hvis scenen står på all
    if (filterScene === "all") {
      // Nyt array = vi går ind og mapper igennem, så vi får fat på alle acts den dag
      // Det smider vi så i det tomme array
      Object.entries(schedule).forEach(([sceneName, sceneSchedule]) => {
        actsDay = actsDay.concat(
          sceneSchedule[filterDay]?.map((act) => ({
            ...act,
            scene: sceneName,
          })) || []
        );
      });
    } else {
      // Hvis der er valgt en scene viser vi kun acts for den.
      actsDay =
        schedule[filterScene]?.[filterDay]?.map((act) => ({
          ...act,
          scene: filterScene,
        })) || [];
    }

    const bandsMap = lineUp.reduce((map, band) => {
      map[band.name] = band;
      return map;
    }, {});

    return actsDay
      .map((act) => ({
        ...act,
        band: bandsMap[act.act],
      }))
      .filter((act) => act.act !== "break");
  };

  const bandSchedule = getBandSchedule();

  // Gruperet efter scene (til ipad + desktop)
  const groupedByScene = bandSchedule.reduce((acc, act) => {
    if (!acc[act.scene]) {
      acc[act.scene] = [];
    }
    acc[act.scene].push(act);
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
      <article className="hidden md:block">
        {Object.keys(groupedByScene).map((scene) => (
          <div key={scene} className="py-6 px-6">
            <h2 className={`${krona_one.className} scene-size mb-4 text-primaryTextColor`}>{scene}</h2>
            <div key={filterDay} ref={scrollReset} className="flex gap-8 overflow-x-scroll snap-x">
              {groupedByScene[scene].map((act) => (
                <article key={act.act} tabIndex={0} className="relative min-w-fit snap-start overflow-hidden flex flex-col h-72 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor">
                  <Link href={act.band?.slug || "#"} prefetch={false} className="flex flex-col h-full overflow-hidden group" aria-label={`Link to ${act.act} details`}>
                    <figure className="relative h-full w-full transform transition-all">
                      <div className="aspect-square relative w-full h-full">
                        <Image src={act.band.logo.includes("https") ? act.band.logo : `/logos/${act.band.logo}`} layout="fill" objectFit="cover" loading="lazy" alt={`Logo of ${act.act}`} className="lg:grayscale lg:group-hover:grayscale-0 duration-300 transform lg:group-hover:scale-110" />
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
          </div>
        ))}
      </article>

      <article className="md:hidden px-6 py-5">
        {Object.keys(groupedByTime).map((time) => (
          <div key={time}>
            <div className="bg-secondaryBgColor py-3 px-3 small-size">
              <p>{time}</p>
            </div>
            <ul className="w-full">
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
