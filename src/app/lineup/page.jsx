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
  // State til data
  const [lineUp, setLineUp] = useState([]);
  const [schedule, setSchedule] = useState({});

  //State til day filter
  const [filterDay, setFilterDay] = useState("all");
  const [days, setDays] = useState([]);

  //State til genre filter
  const [filterGenre, setFilterGenre] = useState("all");
  const [genres, setGenres] = useState([]);

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

  useEffect(() => {
    const loadLineup = async () => {
      const bandsData = await fetchAPI("/bands");
      const scheduleData = await fetchAPI("/schedule");

      setLineUp(bandsData);
      setSchedule(scheduleData);

      // Nyt array med alle Genre fra /bands & tilføjet "all" i starten af vores array
      const bandsGenres = ["all", ...new Set(bandsData.map((band) => band.genre))];
      setGenres(bandsGenres);

      // Nyt array med dage fra /schedule & tilføjet "all" i starten af vores array
      const scheduleDays = ["all", ...new Set(Object.keys(scheduleData).flatMap((stage) => Object.keys(scheduleData[stage])))];
      setDays(scheduleDays);
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
          <Listbox value={filterGenre} onChange={setFilterGenre}>
            {({ open }) => (
              <>
                <div className="relative">
                  <label htmlFor="genre-select" className="sr-only">
                    Vælg genre
                  </label>

                  <ListboxButton id="genre-select" className={clsx("mt-1 block w-full appearance-none border-none rounded-lg bg-inputFieldColor text-bgColor py-2 px-5", "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor")}>
                    <span className="block truncate">{filterGenre === "all" ? "Alle genre" : filterGenre}</span>
                    <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-bgColor" aria-hidden="true" />
                  </ListboxButton>

                  <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <ListboxOptions className={clsx("absolute mt-1 w-full max-h-60 overflow-auto rounded-lg bg-inputFieldColor py-1 text-bgColor shadow-lg ring-1 ring-black ring-opacity-5", "focus:outline-none small-size z-10 ")}>
                      {genres.map((genre) => (
                        <ListboxOption key={genre} className={({ active }) => clsx(active ? "bg-accentColor" : "", "cursor-default select-none relative py-2 pl-10 pr-4")} value={genre}>
                          {({ selected }) => (
                            <>
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

        <div className="hidden h-fit lg:flex flex-wrap gap-4">
          {days.map((day) => (
            <button key={day} onClick={() => setFilterDay(day)} className={`${filterDay === day ? "bg-secondaryColor text-bgColor border-bgColor" : "bg-bgColor text-secondaryColor border-inputFieldColor"} rounded-lg border-2 transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-4 py-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor`} aria-pressed={filterDay === day} aria-label={`Filter bands by ${dayNames[day]}`}>
              {dayNames[day]}
            </button>
          ))}
        </div>
      </header>
      <LineupBands lineUp={lineUp} schedule={schedule} filterDay={filterDay} filterGenre={filterGenre} />
    </section>
  );
}
