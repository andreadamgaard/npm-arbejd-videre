import Image from "next/image.js";
import Link from "next/link.js";
import { krona_one } from "@/app/fonts";

export default function LineupBands({
  lineUp,
  schedule,
  filterDay,
  filterGenre,
}) {
  const filterBands = () => {
    let filteredBands = lineUp;

    if (filterDay !== "all") {
      let actsDay = [];
      Object.values(schedule).forEach((scene) => {
        actsDay = actsDay.concat(scene[filterDay]?.map((act) => act.act) || []);
      });

      filteredBands = filteredBands.filter((band) =>
        actsDay.includes(band.name)
      );
    }

    if (filterGenre !== "all") {
      filteredBands = filteredBands.filter(
        (band) => band.genre === filterGenre
      );
    }

    return filteredBands;
  };

  const filteredLineUp = filterBands();

  return (
    <div
      className={`grid grid-cols-2 px-6 py-5 sm:grid-cols-3 lg:grid-cols-4 gap-4 ${krona_one.className}`}
    >
      {filteredLineUp.map((band) => (
        <article
          key={band.name}
          tabIndex={0}
          className="relative overflow-hidden flex flex-col h-48 md:h-72 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor"
        >
          <Link
            href={band.slug}
            prefetch={false}
            className="flex flex-col h-full overflow-hidden group"
            aria-label={`Link to ${band.name} details`}
          >
            <figure className="relative w-full h-full transform transition">
              <Image
                src={
                  band.logo.includes("https")
                    ? band.logo
                    : `/logos/${band.logo}`
                }
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                alt={`Logo of ${band.name}`}
                className="absolute grayscale group-hover:grayscale-0 inset-0 w-full h-full object-cover duration-300 transform group-hover:scale-110"
              />
              <figcaption className="absolute inset-0 flex items-end">
                <p className="text-bgColor bg-primaryColor rounded-lg p-1 bg-opacity-80 small-size">
                  {band.name}
                </p>
              </figcaption>
            </figure>
          </Link>
        </article>
      ))}
    </div>
  );
}
