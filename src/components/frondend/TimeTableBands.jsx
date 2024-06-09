import Image from "next/image.js";
import Link from "next/link.js";
import { krona_one } from "@/app/fonts";

export default function TimeTableBands({
  lineUp,
  schedule,
  filterDay,
  filterScene,
}) {
  const getBandSchedule = () => {
    let actsDay = [];
    if (filterScene === "all") {
      Object.entries(schedule).forEach(([sceneName, sceneSchedule]) => {
        actsDay = actsDay.concat(
          sceneSchedule[filterDay]?.map((act) => ({
            ...act,
            scene: sceneName,
          })) || []
        );
      });
    } else {
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

  const groupedByTime = bandSchedule.reduce((acc, act) => {
    if (!acc[act.start]) {
      acc[act.start] = [];
    }
    acc[act.start].push(act);
    return acc;
  }, {});

  return (
    <section className="md:grid md:grid-cols-gridContent px-6 py-5 md:px-5">
      {Object.keys(groupedByTime).map((time) => (
        <div key={time} className="col-start-2 col-end-5">
          <div className="bg-secondaryBgColor py-3 px-3 small-size">
            <p>{time}</p>
          </div>
          <ul className="col-start-2 col-end-5 w-full">
            {groupedByTime[time].map((act) => (
              <li
                key={`${act.act}-${act.scene}`}
                tabIndex={0}
                className="flex justify-between overflow-hidden w-full h-24 md:h-40 border-b border-primaryTextColor last:border-b-0 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor hover:bg-secondaryBgColor hover:bg-opacity-30 group"
              >
                <Link
                  href={act.band?.slug || "#"}
                  prefetch={false}
                  className="w-full h-24 md:h-40 overflow-hidden flex items-center xsmall-size md:small-size pl-2 md:pl-0"
                  aria-label={`Link to ${act.act} details`}
                >
                  <div className="flex flex-col md:flex-row md:gap-12 flex-1">
                    <div className="flex">
                      <p>
                        {time} - {act.scene}
                      </p>
                    </div>
                    <div className={`${krona_one.className} flex-1`}>
                      <p>{act.act}</p>
                    </div>
                  </div>
                  <figure className="flex-1 h-24 md:h-40 flex justify-end items-end overflow-hidden">
                    {act.band && (
                      <div className="relative h-24 w-24 md:w-44 md:h-40 flex justify-center items-center">
                        <Image
                          src={
                            act.band.logo.includes("https")
                              ? act.band.logo
                              : `/logos/${act.band.logo}`
                          }
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 
                                 (max-width: 1200px) 50vw, 
                                 25vw"
                          alt={`Picture of ${act.act}`}
                          className="h-full grayscale w-full object-cover duration-300 transform group-hover:grayscale-0 group-hover:scale-110"
                        />
                      </div>
                    )}
                  </figure>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
