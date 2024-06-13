import { krona_one } from "@/app/fonts.jsx";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
} from "@headlessui/react";
import RegularTicketSVG from "./RegularTicketSVG";
import VIPTicketSVG from "./VIPTicketSVG";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import CartSummary from "./CartSummary";
import Image from "next/image";

export default function SummaryPage({ bookingData, onBack, onNext }) {
  const { ticketType, ticketQuantity, personalInfo, camping, totalPrice, areaImage } =
    bookingData;

  const TicketSVG =
    ticketType.toLowerCase() === "vip" ? VIPTicketSVG : RegularTicketSVG;

  return (
    <div className="grid grid-cols-gridContent">
      <div className="pt-8 pb-16 col-start-3 gap-3 flex flex-wrap items-center justify-center ">
        <div className="bg-secondaryBgColor rounded-lg p-8 shadow-lg w-full max-w-lg">
          <h2 className={`${krona_one.className} large-size  text-primaryTextColor mb-6`}>Opsummering</h2>
          <div className="mb-6 space-y-6">
            <div className="flex flex-wrap md:justify-evenly items-center mb-8 gap-2">
              <div className="normal-size">
                <p className="font-semibold mb-2 ">Billetter:</p>
                <p className="mb-2">
                  {ticketType.charAt(0).toUpperCase() + ticketType.slice(1)} billet x {ticketQuantity}
                </p>
              </div>
              <TicketSVG className=" w-64" aria-hidden="true" />
            </div>
            <TabGroup>
              <TabList className="flex space-x-1 rounded-xl bg-primaryTextColor text-bgColor p-1">
                <Tab className={({ selected }) => (selected ? "w-full py-2.5 xsmall-size rounded-lg bg-inputFieldColor text-bgColor shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor" : "w-full py-2.5 xsmall-size rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor")}>Personlige oplysninger</Tab>
                <Tab className={({ selected }) => (selected ? "w-full py-2.5 xsmall-size  rounded-lg bg-inputFieldColor text-bgColor shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor" : "w-full py-2.5 xsmall-size  rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor")}>Campingområde</Tab>
              </TabList>
              <TabPanels className="mt-2">
                <TabPanel className="rounded-xl p-3">
                  {personalInfo.map((info, index) => (
                    <Disclosure key={index} defaultOpen={index === 0}>
                      {({ open }) => (
                        <>
                          <div className="relative mb-2">
                            <DisclosureButton className={clsx("w-full py-2.5 small-size rounded-lg bg-inputFieldColor text-bgColor shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor", { " ": open })} aria-expanded={open} aria-controls={`panel-${index}`}>
                              <b>Billet</b> {index + 1} ({ticketType})
                            </DisclosureButton>
                            {open ? <ChevronUpIcon className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-bgColor" aria-hidden="true" /> : <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-bgColor" aria-hidden="true" />}
                          </div>

                          <DisclosurePanel className=" pt-2 mb-4  pb-4 px-5 flex flex-wrap text-bgColor bg-primaryTextColor rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor" id={`panel-${index}`}>
                            <div>
                              <p className="small-size">
                                <b>Fornavn:</b> {info.firstName}
                              </p>
                              <p className="small-size">
                                <b>Efternavn:</b> {info.lastName}
                              </p>
                              <p className="small-size">
                                <b>Telefonnummer:</b> {info.phoneNumber}
                              </p>
                            </div>
                            <div>
                              <p className="small-size">
                                <b>Fødselsdato:</b> {info.dateOfBirth}
                              </p>
                              <p className="small-size">
                                <b>Email:</b> {info.email}
                              </p>
                            </div>
                          </DisclosurePanel>
                        </>
                      )}
                    </Disclosure>
                  ))}
                </TabPanel>
                <TabPanel className="rounded-xl  bg-primaryTextColor text-bgColor pt-2 mb-4  pb-4 px-5 ">
                  <div className="grid justify-center">
                    <div className="flex flex-col justify-between items-center py-3">
                      {camping.selectedArea && <p className="small-size">Camping område - {camping.selectedArea}</p>}
                      {areaImage && <Image src={areaImage} alt="Campingområde billede" width={100} height={50} className="h-auto w-40 py-2" />}
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="flex flex-col">
                        {camping.twoPersonTent > 0 && (
                          <div className="flex gap-2 pb-1">
                            <p>2 personers telt:</p>
                            <p>x {camping.twoPersonTent}</p>
                          </div>
                        )}

                        {camping.threePersonTent > 0 && (
                          <div className="flex gap-2 pb-1 ">
                            <p>3 personers telt:</p>
                            <p>x {camping.threePersonTent}</p>
                          </div>
                        )}
                      </div>

                      {camping.greenCamping && (
                        <div className="flex gap-2 ">
                          <p>Grøn camping:</p>
                          <p>{camping.greenCamping}x 1</p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
          <div className="flex justify-between">
            <button onClick={onBack} className="bg-bgColor border-2 rounded-lg border-inputFieldColor text-secondaryColor transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor" aria-label="Tilbage">
              Tilbage
            </button>
            <button onClick={onNext} className="bg-bgColor border-2 rounded-lg border-inputFieldColor text-secondaryColor transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor ml-4" aria-label="Fortsæt til betaling">
              Fortsæt til betaling
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center fixed w-full max-w-md md:w-44">
          <CartSummary ticketType={ticketType} ticketQuantity={ticketQuantity} campingOptions={camping} />
        </div>
      </div>
    </div>
  );
}
