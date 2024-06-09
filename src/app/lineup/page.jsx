"use client";
import { fetchAPI } from "../../app/api/api.js";
import { useState, useEffect } from "react";
import { krona_one } from "@/app/fonts";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import LineupBands from "@/components/frondend/LineupBands.jsx";

export default function Lineup() {
  // State til at gemme vores data i
  const [lineUp, setLineUp] = useState([]);
  const [schedule, setSchedule] = useState({});

  // State til DAG -variabler
  const [filterDay, setFilterDay] = useState("all"); //Starter altid med at vise alle dage
  const [days, setDays] = useState([]);

  // State til GENRE
  const [filterGenre, setFilterGenre] = useState("all"); //Starter altid med at vise alle genre
  const [genres, setGenres] = useState([]);

  //Oversatte dage der skal vises i knapperne
  const dayNames = {
    all: "Alle dage",
    mon: "Mandag",
    tue: "Tirsdag",
    wed: "Onsdag",
    thu: "Torsdag",
    fri: "Fredag",
    sat: "Lørdag",
    sun: "Søndag",
  };

  // Her vi henter al vores data fra API
  useEffect(() => {
    const loadLineup = async () => {
      // Fetch fra databaserne
      const bandsData = await fetchAPI("/bands");
      const scheduleData = await fetchAPI("/schedule");

      // Vi sender dataen op i state
      setLineUp(bandsData);
      setSchedule(scheduleData);

      // Vi laver nyt array med genre
      const bandsGenres = ["all", ...new Set(bandsData.map((band) => band.genre))];
      // Vi henter genrene ud fra bandsData "all" så vi kan starte med at have alle genre vist.
      // New set - indeholder kun unikke værdier. Sikre vi ikke får dobbelt OG ...new pakker genrene fra set ud og sætter i nyt array hvor vi har "all" som første element
      setGenres(bandsGenres);
      // Vi sender genre i state

      // Vi laver nyt array med dage
      const scheduleDays = ["all", ...new Set(Object.keys(scheduleData).flatMap((stage) => Object.keys(scheduleData[stage])))];
      //Object.keys henter alle keys(første stage, anden dage)
      //Flatmap = for hver stage skal den hente keys(dage her), og ligger i et "flat" array
      //new set igen så der ikke er duplering
      setDays(scheduleDays);
      // Vi sender dage i state
    };

    loadLineup();
  }, []);

  return (
    <section className="min-h-screen md:px-2">
      <div className={`${krona_one.className} headliner text-center`}>
        <h1>Line-up</h1>
      </div>
      <header className="flex justify-between gap-4 py-5 px-2 md:px-4">
        <div className="w-1/2 lg:w-1/4">
          {/* Vores Listbox til at vise genre filter */}
          <Listbox value={filterGenre} onChange={setFilterGenre}>
            {({ open }) => (
              <>
                <div className="relative">
                  <label htmlFor="genre-select" className="sr-only">
                    Vælg genre
                  </label>

                  <ListboxButton id="genre-select" className={clsx("mt-1 block w-full appearance-none border-none rounded-lg bg-inputFieldColor text-bgColor py-2 px-5", "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor")}>
                    <span className="block truncate">
                      {/* Knappen viser enten "Alle genre", ellers viser den det den genre vi er på */}
                      {filterGenre === "all" ? "Alle genre" : filterGenre}
                    </span>
                    <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-bgColor" aria-hidden="true" />
                  </ListboxButton>

                  <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className={clsx("absolute mt-1 w-full max-h-60 overflow-auto rounded-lg bg-inputFieldColor py-1 text-bgColor shadow-lg ring-1 ring-black ring-opacity-5", "focus:outline-none small-size z-10 ")}>
                      {/* Mapper igennem vores genre array og laver en option for hver genre */}
                      {genres.map((genre) => (
                        <ListboxOption key={genre} className={({ active }) => clsx(active ? "bg-accentColor" : "", "cursor-default select-none relative py-2 pl-10 pr-4")} value={genre}>
                          {({ selected }) => (
                            <>
                              {/* Her vi viser den valgte genre. Er den = "all" vises "Alle genre" */}
                              {/* Ellers vises navnet på den aktuel genre */}
                              <span className={clsx(selected ? "font-semibold" : "font-normal", "block truncate")}>{genre === "all" ? "Alle genre" : genre}</span>
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>

        {/* Mobil filter til dag - Listbox til at vise dagsfilter */}
        <div className="w-1/2 lg:w-auto lg:hidden">
          <Listbox value={filterDay} onChange={setFilterDay}>
            {({ open }) => (
              <>
                <div className="relative">
                  <label htmlFor="day-select" className="sr-only">
                    Vælg dag
                  </label>
                  <ListboxButton id="day-select" className={clsx("mt-1 block w-full appearance-none border-none rounded-lg bg-inputFieldColor text-bgColor py-2 px-5", "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor")}>
                    <span className="block truncate">{dayNames[filterDay]}</span>
                    <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-bgColor" aria-hidden="true" />
                  </ListboxButton>
                  <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className={clsx("absolute mt-1 w-full rounded-lg bg-inputFieldColor py-1 text-bgColor shadow-lg ring-1 ring-black ring-opacity-5", "focus:outline-none small-size z-10")}>
                      {days.map((day) => (
                        <ListboxOption key={day} className={({ active }) => clsx(active ? "bg-accentColor" : "", "cursor-default select-none relative py-2 pl-10 pr-4")} value={day}>
                          {({ selected }) => (
                            <>
                              <span className={clsx(selected ? "font-semibold" : "font-normal", "block truncate")}>{dayNames[day]}</span>
                            </>
                          )}
                        </ListboxOption>
                      ))}
                    </ListboxOptions>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>

        {/* Desktop filter til dag - knapper */}
        <div className="hidden h-fit lg:flex flex-wrap gap-4">
          {/* vi mapper vores dage igennem, så der bliver lavet knapper for hver dag i vores array.  */}
          {days.map((day) => (
            // onClick sender den nye value op i state. Der er også dynamisk styling på, alt etfer om knappen er aktiv eller ej.
            <button key={day} onClick={() => setFilterDay(day)} className={`${filterDay === day ? "bg-secondaryColor text-bgColor border-bgColor" : "bg-bgColor text-secondaryColor border-inputFieldColor"} rounded-lg border-2 transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-4 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor`} aria-pressed={filterDay === day} aria-label={`Filter bands by ${dayNames[day]}`}>
              {/* sørger for vores dag bliver vist i knappen */}
              {dayNames[day]}
            </button>
          ))}
        </div>
      </header>

      {/* Vi sender al data fra vores state ned i LineupBands som props */}
      <LineupBands lineUp={lineUp} schedule={schedule} filterDay={filterDay} filterGenre={filterGenre} />
    </section>
  );
}
