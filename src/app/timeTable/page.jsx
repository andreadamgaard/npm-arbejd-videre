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
  const [filterDay, setFilterDay] = useState("mon"); // Viser mon per default
  const [days, setDays] = useState([]);

  // State til scene filter
  const [filterScene, setFilterScene] = useState("all"); // Viser alle per default

  // Dage fra database oversat til dansk
  const dayNames = {
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
    const loadSchedule = async () => {
      // Fetch fra databaserne
      const bandsData = await fetchAPI("/bands");
      const scheduleData = await fetchAPI("/schedule");

      // Vi sender dataen op i state
      setLineUp(bandsData);
      setSchedule(scheduleData);

      // Nyt array med dage fra /schedule
      // Jeg henter alle unikke dage fra alle "stadier" i scheduleData.
      const scheduleDays =
        // [...] bruges til at konvertere Set tilbage til en array
        [
          ...new Set( //= Fjerne dubletter i array. Set tilader kun unikke værdier
            Object.keys(scheduleData) // Retuner Array med alle keys (scener, dage, kunstnere) fra scheduleData

              // flatMap = mapper hver scene til nyt array og "flader" det ud, så det hele er på samme level
              .flatMap((stage) =>
                // returnerer en array af nøgler (dage) til den tilsvarende stage.
                Object.keys(scheduleData[stage])
              )
          ),
        ];

      // Vi sender vores nye array op i state
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
          {/* Dropdown filter til scener - MOBIL VIEW */}
          <div className="relative w-full md:hidden">
            <label htmlFor="scene-select" className="sr-only">
              Vælg scene
            </label>
            {/* Vi sætter value til filterScene state. Ved ændring sender vi den nye value til state */}
            <Listbox value={filterScene} onChange={setFilterScene}>
              <div className="relative mt-1">
                <ListboxButton className={clsx("mt-1 block w-full appearance-none border-none rounded-lg bg-inputFieldColor text-bgColor py-2 px-5", "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor")}>
                  {/* Vi starter altid med all (sat i vores state) */}
                  {filterScene === "all" ? "Alle scener" : filterScene}
                  <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 h-5 w-5 text-bgColor" aria-hidden="true" />
                </ListboxButton>
                <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto py-1 shadow-lg small-size border-none rounded-lg bg-inputFieldColor text-bgColor focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor">
                    {/* vi starter altid med at den viser all */}
                    <ListboxOption key="all" value="all">
                      {({ selected }) => <div className={`cursor-default select-none relative py-2 pl-10 pr-4 ${selected ? "font-medium" : "font-normal"}`}>Alle scener</div>}
                    </ListboxOption>
                    {/* vi mapper igennem schedule og henter scenerne. Den viser en option for hver scene den finder */}
                    {Object.keys(schedule).map((scene) => (
                      <ListboxOption key={scene} className={({ active }) => clsx(active ? "bg-accentColor" : "", "cursor-default select-none relative py-2 pl-10 pr-4")} value={scene}>
                        {({ selected }) => <span className={clsx(selected ? "font-semibold" : "font-normal", "block truncate")}>{scene}</span>}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Jeg har udkommenteret Scene knapper til min nye løsning. Der viser den alle scener med side scroll og så filtrere man kun på dage */}

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
          {/* Dropdown filter til dage - MOBIL VIEW */}
          <div className="relative w-full md:hidden">
            <label htmlFor="day-select" className="sr-only">
              Vælg dag
            </label>

            {/* Vi sætter value til filterDay state. Ved ændring sender vi den nye value til state */}
            <Listbox value={filterDay} onChange={setFilterDay}>
              <div className="relative mt-1">
                <ListboxButton className={clsx("mt-1 block w-full appearance-none border-none rounded-lg bg-inputFieldColor text-bgColor py-2 px-5", "focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor")}>
                  {/* Vi beder den om at vise den dag vi er på, hentet fra vores state */}
                  {dayNames[filterDay]}
                  <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 h-5 w-5 text-bgColor" aria-hidden="true" />
                </ListboxButton>
                <Transition leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                  <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto py-1 shadow-lg  small-size border-none rounded-lg bg-inputFieldColor text-bgColor focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor z-10">
                    {/* Vi mapper igennem vores Array med days. For hver dag laver den en option */}
                    {days.map((day) => (
                      <ListboxOption key={day} className={({ active }) => clsx(active ? "bg-accentColor" : "", "cursor-default select-none relative py-2 pl-10 pr-4")} value={day}>
                        {({ selected }) => (
                          <span className={clsx(selected ? "font-semibold" : "font-normal", "block truncate")}>
                            {/* Vi beder den om at vise dag, ved at bruge [day] til at finde den oversatte dag i vores const */}
                            {dayNames[day]}
                          </span>
                        )}
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* Knap filter til dage - IPAD + DESKTOP */}
          <div className="hidden md:flex flex-wrap gap-4">
            {/* Vi mapper igennem vores Array med dage, som før, men køre den nu ud som knapper */}
            {days.map((day) => (
              <button key={day} onClick={() => setFilterDay(day)} className={`${filterDay === day ? "bg-secondaryColor text-bgColor border-bgColor" : "bg-bgColor text-secondaryColor border-inputFieldColor"} rounded-lg border-2 transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-4 py-1 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor`} aria-pressed={filterDay === day}>
                {dayNames[day]}
              </button>
            ))}
          </div>
        </div>
      </header>
      {/* Vi sender alle vores states ned til komponenten der skal vise vores bands */}
      <TimeTableBands lineUp={lineUp} schedule={schedule} filterDay={filterDay} filterScene={filterScene} />
    </section>
  );
}
