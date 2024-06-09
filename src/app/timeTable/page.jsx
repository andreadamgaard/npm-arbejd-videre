"use client";
import { fetchAPI } from "../../app/api/api.js";
import { useState, useEffect } from "react";
import { krona_one } from "@/app/fonts";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import TimeTableBands from "@/components/frondend/TimeTableBands.jsx";

export default function Schedule() {
  // State til data
  const [lineUp, setLineUp] = useState([]);
  const [schedule, setSchedule] = useState({});

  // State til day filter
  const [filterDay, setFilterDay] = useState("mon");
  const [days, setDays] = useState([]);

  // State til scene filter
  const [filterScene, setFilterScene] = useState("all");

  const dayNames = {
    mon: "Mandag",
    tue: "Tirsdag",
    wed: "Onsdag",
    thu: "Torsdag",
    fri: "Fredag",
    sat: "Lørdag",
    sun: "Søndag",
  };

  useEffect(() => {
    const loadSchedule = async () => {
      const bandsData = await fetchAPI("/bands");
      const scheduleData = await fetchAPI("/schedule");

      setLineUp(bandsData);
      setSchedule(scheduleData);

      // Nyt array med dage fra /schedule
      const scheduleDays = [...new Set(Object.keys(scheduleData).flatMap((stage) => Object.keys(scheduleData[stage])))];
      setDays(scheduleDays);
    };
    loadSchedule();
  }, []);

  return (
    <section className="min-h-screen md:px-2">
      <div className={`${krona_one.className} headliner text-center`}>
        <h1>Tidsplan</h1>
      </div>
      <header className="flex justify-between gap-3 px-2 md:grid md:justify-end md:px-4 py-5">
        <div className="flex justify-center mb-4 gap-2 w-full lg:w-auto">
          <div className="relative w-full md:hidden">
            <label htmlFor="scene-select" className="sr-only">
              Vælg scene
            </label>
            <Listbox value={filterScene} onChange={setFilterScene}>
              <div className="relative mt-1">
                <ListboxButton className={clsx("mt-1 block w-full appearance-none border-none rounded-lg bg-inputFieldColor text-bgColor py-2 px-5", "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor")}>
                  {filterScene === "all" ? "Alle scener" : filterScene}
                  <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 h-5 w-5 text-bgColor" aria-hidden="true" />
                </ListboxButton>
                <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto py-1 shadow-lg small-size border-none rounded-lg bg-inputFieldColor text-bgColor focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor">
                    <ListboxOption key="all" value="all">
                      {({ selected }) => <div className={`cursor-default select-none relative py-2 pl-10 pr-4 ${selected ? "font-medium" : "font-normal"}`}>Alle scener</div>}
                    </ListboxOption>
                    {Object.keys(schedule).map((scene) => (
                      <ListboxOption key={scene} className={({ active }) => clsx(active ? "bg-accentColor" : "", "cursor-default select-none relative py-2 pl-10 pr-4")} value={scene}>
                        {({ selected }) => (
                          <>
                            <span className={clsx(selected ? "font-semibold" : "font-normal", "block truncate")}>{scene}</span>
                          </>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* <div className="hidden lg:flex flex-wrap gap-4">
            <button onClick={() => setFilterScene("all")} className={`${filterScene === "all" ? "bg-secondaryColor text-bgColor border-bgColor" : "bg-bgColor text-secondaryColor border-inputFieldColor"} rounded-lg border-2 transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-4 py-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor`} aria-pressed={filterScene === "all"}>
              Alle scener
            </button>
            {Object.keys(schedule).map((scene) => (
              <button key={scene} onClick={() => setFilterScene(scene)} className={`${filterScene === scene ? "bg-secondaryColor text-bgColor border-bgColor" : "bg-bgColor text-secondaryColor border-inputFieldColor"} rounded-lg border-2 transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-4 py-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor`} aria-pressed={filterScene === scene}>
                {scene}
              </button>
            ))}
          </div> */}
        </div>

        <div className="flex justify-center mb-4 gap-2 w-full lg:w-auto">
          <div className="relative w-full md:hidden">
            <label htmlFor="day-select" className="sr-only">
              Vælg dag
            </label>
            <Listbox value={filterDay} onChange={setFilterDay}>
              <div className="relative mt-1">
                <ListboxButton className={clsx("mt-1 block w-full appearance-none border-none rounded-lg bg-inputFieldColor text-bgColor py-2 px-5", "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor")}>
                  {dayNames[filterDay]}
                  <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 h-5 w-5 text-bgColor" aria-hidden="true" />
                </ListboxButton>
                <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto py-1 shadow-lg  small-size border-none rounded-lg bg-inputFieldColor text-bgColor focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor z-10">
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
            </Listbox>
          </div>
          <div className="hidden md:flex flex-wrap gap-4">
            {days.map((day) => (
              <button key={day} onClick={() => setFilterDay(day)} className={`${filterDay === day ? "bg-secondaryColor text-bgColor border-bgColor" : "bg-bgColor text-secondaryColor border-inputFieldColor"} rounded-lg border-2 transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-4 py-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor`} aria-pressed={filterDay === day}>
                {dayNames[day]}
              </button>
            ))}
          </div>
        </div>
      </header>
      <TimeTableBands lineUp={lineUp} schedule={schedule} filterDay={filterDay} filterScene={filterScene} />
    </section>
  );
}
