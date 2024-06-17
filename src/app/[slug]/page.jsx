// export async function generateMetadata({ params }) {
//   const { slug } = params;
//   const fetchData = await fetchAPI("/bands");
//   const filterData = fetchData.filter((band) => band.slug === slug);
//   const band = filterData[0];

//   return {
//     title: `FooFest - ${band.name}`,
//   };
// }

// export async function generateStaticParams() {
//   const data = await fetchAPI("/bands");
//   return data.map((band) => ({
//     slug: band.slug,
//   }));
// }

import { fetchAPI } from "../../app/api/api.js";
import Image from "next/image.js";
import { krona_one } from "@/app/fonts";
import BandBio from "@/components/frondend/BandBio.jsx";
import { notFound } from "next/navigation.js";

// Her vi håndtere banddata
export default async function Band({ params }) {
  const { slug } = params; // Henter slug fra prams

  // Fetcher vores data fra API'erne
  const fetchBandsData = await fetchAPI("/bands");
  const fetchScheduleData = await fetchAPI("/schedule");

  // Filtrere bandData for at finde band der matcher slug
  const filterBandsData = fetchBandsData.filter((band) => band.slug === slug);
  // Det første matchende band vælges og gemmes i variablen band
  const band = filterBandsData[0];

  let bandSchedule = []; // Initialisere array til bandets tidsplan

  // Hvis bandet findes, så byg tidsplan
  if (band) {
    Object.keys(fetchScheduleData).forEach((stage) => {
      Object.keys(fetchScheduleData[stage]).forEach((day) => {
        fetchScheduleData[stage][day].forEach((event) => {
          if (event.act === band.name) {
            // Tilføjer vores event til bandets tidsplan
            bandSchedule.push({ ...event, stage, day });
          }
        });
      });
    });
  } else {
    // Hvis ikke bandet findes => 404 side
    return notFound();
  }

  return (
    <article className="grid grid-cols-gridContent">
      <h1 className={`${krona_one.className} bandheader pb-6 md:pb-0 text-center col-start-2 col-end-5 pt-5`}>{band.name}</h1>
      <section className="col-start-2 col-end-5">
        <div className="grid md:grid-cols-2">
          <div className="flex flex-col order-last md:order-first md:p-5">
            <div className="flex gap-4 justify-center md:justify-start items-center py-5 md:pt-0 md:pb-11">
              <div className={`${krona_one.className} uppercase bg-primaryColor small-size text-center text-secondaryTextColor rounded-lg w-28 lg:w-32 lg:px-5 py-1`} aria-label="Genre">
                Genre:
              </div>
              <p className={`${krona_one.className} small-size`}>{band.genre}</p>
            </div>
            <div className="pb-6">
              <BandBio bio={band.bio} />
            </div>
            <div className="py-5">
              <div className="rounded-lg overflow-hidden">
                <iframe title={`Spotify playlist for ${band.name}`} src="https://open.spotify.com/embed/artist/08GQAI4eElDnROBrJRGE0X?utm_source=generator" width="100%" height="352" frameBorder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" className="w-full h-88"></iframe>
              </div>
            </div>
          </div>
          <div className="md:p-5">
            {bandSchedule.length > 0 && (
              <div role="region" aria-labelledby="schedule-heading">
                <h2 id="schedule-heading" className="sr-only">
                  Band Schedule
                </h2>
                {bandSchedule.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center text-center pb-4 md:pb-2">
                    <div className="uppercase bg-labelColor text-secondaryTextColor rounded-lg w-40 md:w-36 lg:w-48 lg:px-5 py-3">
                      {schedule.day.charAt(0).toUpperCase() + schedule.day.slice(1)} {schedule.start}
                    </div>
                    <div className="uppercase bg-labelColor text-secondaryTextColor rounded-lg w-40 md:w-36 lg:w-48 lg:px-5 py-3">{schedule.stage}</div>
                  </div>
                ))}
              </div>
            )}
            <figure className="md:py-5">
              <Image src={band.logo.includes("https") ? band.logo : `/logos/${band.logo}`} width={400} height={400} alt={`Logo of ${band.name}`} />
              <figcaption className="text-xs text-right px-2">{band.logoCredits}</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </article>
  );
}
