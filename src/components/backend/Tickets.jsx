import { useState, useEffect } from "react";
import prices from "../backend/settings.js";
import { krona_one } from "@/app/fonts.jsx";
import {
  Select,
  RadioGroup,
  Radio,
  Field,
  Label,
  Legend,
  Fieldset,
} from "@headlessui/react";
import { CheckCircleIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";

import RegularTicketSVG from "./RegularTicketSVG";
import VIPTicketSVG from "./VIPTicketSVG";

export default function TicketsForm({
  ticketType,
  ticketQuantity,
  onClick,
  onNext,
}) {
  const [localTicketType, setLocalTicketType] = useState(ticketType);
  const [localQuantity, setLocalQuantity] = useState(ticketQuantity);
  const [localTotalPrice, setLocalTotalPrice] = useState(0);

  useEffect(() => {
    updatePrice();
  }, [localTicketType, localQuantity]);

  const updatePrice = () => {
    const pricePerTicket =
      localTicketType === "regular" ? prices.regular : prices.vip;
    setLocalTotalPrice(localQuantity * pricePerTicket);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onClick({ ticketType: localTicketType, ticketQuantity: localQuantity });
    onNext();
  };

  const ticketOptions = [
    { name: "Regular", price: prices.regular, SVG: RegularTicketSVG, desc: "Full festival access og regular camping" },
    { name: "VIP", price: prices.vip, SVG: VIPTicketSVG, desc: "Full festival access, VIP camping og VIP area" },
  ];

  return (
    <div className="grid grid-cols-gridContent">
      <div className="pt-8 pb-16 col-start-3 flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-secondaryBgColor p-8 rounded-lg shadow-md shadow-primaryColor w-full max-w-xl">
          <Fieldset className="space-y-6">
            <Legend className={`${krona_one.className} large-size mb-1 text-primaryTextColor`}>Vælg billettype</Legend>
            <RadioGroup value={localTicketType} onChange={setLocalTicketType} className="space-y-6">
              <Label>Billettype</Label>
              {ticketOptions.map((option) => (
                //ChatGpt prompt: Jeg har brug for en generel introduktion til `clsx`-biblioteket. Hvordan bruger jeg `clsx` til at tilføje CSS-klasser i en React-komponent?
                <Radio
                  key={option.name}
                  value={option.name.toLowerCase()}
                  className={({ active, checked }) =>
                    clsx("relative flex cursor-pointer rounded-lg bg-bgColor py-4 px-5 shadow-md transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor", {
                      "ring-2 ring-offset-2 ring-accentColor": active,
                      "bg-primaryTextColor/10": checked,
                    })
                  }
                >
                  {({ checked }) => (
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <option.SVG className=" h-16 md:h-20 w-auto" aria-hidden="true" />
                        <div>
                          <div className="flex gap-4 text-primaryTextColor normal-size">
                            <p>{option.name}</p>
                            <p>{option.price} DKK</p>
                          </div>
                          <p className="xsmall-size">{option.desc}</p>
                        </div>
                      </div>
                      {checked && <CheckCircleIcon className="size-7 fill-accentColor" aria-hidden="true" />}
                    </div>
                  )}
                </Radio>
              ))}
            </RadioGroup>
            <Field className="flex flex-col small-size">
              <Label htmlFor="ticketQuantity" className="mb-1 font-bold">
                Vælg antal billetter:
              </Label>
              <div className="relative">
                <Select id="ticketQuantity" value={localQuantity} onChange={(e) => setLocalQuantity(parseInt(e.target.value, 10))} className={clsx("mt-1 block w-28 appearance-none border-none rounded-lg bg-inputFieldColor text-bgColor py-2 px-5", "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor")} aria-describedby="ticketQuantity-description" required>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                </Select>
                <ChevronDownIcon className="pointer-events-none absolute top-3.5 left-20 size-5 fill-bgColor" aria-hidden="true" />
              </div>
            </Field>
            <div className="normal-size">Total pris for billetter: {localTotalPrice} DKK</div>
            <div className="flex justify-end">
              <button type="submit" className="bg-bgColor rounded-lg border-2 border-inputFieldColor text-secondaryColor transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor" aria-label="Køb billetter">
                Køb billetter
              </button>
            </div>
          </Fieldset>
        </form>
      </div>
    </div>
  );
}
