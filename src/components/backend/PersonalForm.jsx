import { useState, useEffect } from "react";
import { Disclosure, Field, Label, Description } from "@headlessui/react";
import clsx from "clsx";
import prices from "../backend/settings.js";
import { krona_one } from "@/app/fonts.jsx";
import CartSummary from "./CartSummary";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

export default function PersonalForm({
  personalInfo,
  ticketQuantity,
  ticketType,
  campingOptions,
  onClick,
  onNext,
  onBack,
}) {
  const [localPersonalInfo, setLocalPersonalInfo] = useState(personalInfo);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (localPersonalInfo.length === 0) {
      const initialInfo = Array.from({ length: ticketQuantity }, () => ({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: "",
        email: "",
      }));
      setLocalPersonalInfo(initialInfo);
    }
  }, [ticketQuantity]);

  useEffect(() => {
    const ticketPrice =
      ticketQuantity * (ticketType === "regular" ? prices.regular : prices.vip);
    const addOnPrice =
      (campingOptions.greenCamping ? prices.greenCamping : 0) +
      campingOptions.twoPersonTent * prices.TwoPersonsTent +
      campingOptions.threePersonTent * prices.ThreePersonsTent;
    setTotalPrice(ticketPrice + addOnPrice + prices.fee);
  }, [ticketQuantity, ticketType, campingOptions]);

  const handleInputChange = (index, field, value) => {
    setLocalPersonalInfo((prev) => {
      const newPersonalInfo = [...prev];
      newPersonalInfo[index] = { ...newPersonalInfo[index], [field]: value };
      return newPersonalInfo;
    });
  };

  const handlePhoneKeyPress = (e) => {
    const allowedChars = /^[0-9+]+$/;
    if (!allowedChars.test(e.key) && !e.ctrlKey && e.key !== "Backspace") {
      e.preventDefault();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const orderData = localPersonalInfo.map((info) => ({
      first_name: info.firstName,
      last_name: info.lastName,
      email: info.email,
      phone: info.phoneNumber,
      amount: ticketQuantity,
      birthday: info.dateOfBirth,
      id: info.id,
    }));

    onClick({
      personalInfo: localPersonalInfo,
      totalPrice: totalPrice,
    });
    onNext();
  };

  const validateDateOfBirth = (date) => {
    const today = new Date();
    const birthDate = new Date(date);
    const age = today.getFullYear() - birthDate.getFullYear();
    const isFutureDate = birthDate > today;
    const isOlderThan100 = age > 100;
    return !(isFutureDate || isOlderThan100);
  };

  return (
    <div className="grid grid-cols-gridContent">
      <div className="pt-8 pb-16 col-start-3 gap-3 flex flex-wrap items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-secondaryBgColor rounded-lg p-8 shadow-md shadow-primaryColor w-full max-w-md"
        >
          <fieldset className="space-y-6">
            <legend
              className={`${krona_one.className} large-size text-primaryTextColor`}
            >
              Personlig information
            </legend>

            {localPersonalInfo.map((info, index) => (
              <Disclosure key={index} defaultOpen={index === 0}>
                {({ open }) => (
                  <>
                    <div className="relative mb-2">
                      <Disclosure.Button
                        className={clsx(
                          "w-full py-2 text-center small-size rounded-lg bg-bgColor text-primaryTextColor shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor",
                          { "": open }
                        )}
                      >
                        Billet {index + 1} ({ticketType})
                      </Disclosure.Button>
                      {open ? (
                        <ChevronUpIcon
                          className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-primaryTextColor"
                          aria-hidden="true"
                        />
                      ) : (
                        <ChevronDownIcon
                          className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-primaryTextColor"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <Disclosure.Panel className="pb-2">
                      <div className="space-y-4">
                        <Field className="space-y-2">
                          <Label htmlFor={`firstName-${index}`}>Fornavn:</Label>
                          <input
                            id={`firstName-${index}`}
                            type="text"
                            value={info.firstName}
                            className="peer w-full p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor"
                            aria-label={`Fornavn for billet ${index + 1}`}
                            pattern="^[A-Za-z]+$"
                            title="Fornavn må kun indeholde bogstaver."
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "firstName",
                                e.target.value
                              )
                            }
                          />
                          <Description className="xsmall-size hidden peer-focus:block">
                            Fornavn må kun indeholde bogstaver
                          </Description>
                        </Field>

                        <Field className="space-y-2">
                          <Label htmlFor={`lastName-${index}`}>
                            Efternavn:
                          </Label>
                          <input
                            id={`lastName-${index}`}
                            type="text"
                            value={info.lastName}
                            className="peer w-full p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor"
                            aria-label={`Efternavn for billet ${index + 1}`}
                            pattern="^[A-Za-z]+$"
                            title="Efternavn må kun indeholde bogstaver."
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "lastName",
                                e.target.value
                              )
                            }
                          />
                          <Description className=" xsmall-size hidden peer-focus:block">
                            Efternavn må kun indeholde bogstaver
                          </Description>
                        </Field>

                        <Field className="space-y-2">
                          <Label htmlFor={`phoneNumber-${index}`}>
                            Telefon:
                          </Label>
                          <input
                            id={`phoneNumber-${index}`}
                            type="tel"
                            value={info.phoneNumber}
                            className="peer w-full p-2 border bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor"
                            aria-label={`Phone number for ticket ${index + 1}`}
                            pattern="^\+\d+$"
                            title="Telefonnummeret skal starte med et + og kun indeholde tal."
                            onKeyPress={handlePhoneKeyPress}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "phoneNumber",
                                e.target.value
                              )
                            }
                          />
                          <Description className=" xsmall-size hidden peer-focus:block">
                            Telefonnummeret skal starte med et + og kun
                            indeholde tal
                          </Description>
                        </Field>

                        <Field className="space-y-2">
                          <Label htmlFor={`dateOfBirth-${index}`}>
                            Fødselsdag:
                          </Label>
                          <input
                            id={`dateOfBirth-${index}`}
                            type="date"
                            value={info.dateOfBirth}
                            className="peer w-full p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor"
                            aria-label={`Fødelsdato for billet ${index + 1}`}
                            min="1923-01-01"
                            max={new Date().toISOString().split("T")[0]}
                            onChange={(e) => {
                              if (validateDateOfBirth(e.target.value)) {
                                handleInputChange(
                                  index,
                                  "dateOfBirth",
                                  e.target.value
                                );
                              } else {
                                alert(
                                  "Fødselsdatoen skal være en gyldig dato, som ikke ligger i fremtiden og er mindre end 100 år gammel."
                                );
                              }
                            }}
                          />
                          <Description className="xsmall-size hidden peer-focus:block">
                            Fødselsdatoen skal være en gyldig dato
                          </Description>
                        </Field>

                        <Field className="space-y-2">
                          <Label htmlFor={`email-${index}`}>Email:</Label>
                          <input
                            id={`email-${index}`}
                            type="email"
                            value={info.email}
                            className="peer w-full p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor"
                            aria-label={`Email for billet ${index + 1}`}
                            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                            title="Email skal være en gyldig emailadresse."
                            onChange={(e) =>
                              handleInputChange(index, "email", e.target.value)
                            }
                          />
                          <Description className="xsmall-size hidden peer-focus:block">
                            Email skal være en gyldig emailadresse
                          </Description>
                        </Field>
                      </div>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </fieldset>

          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={onBack}
              className="bg-bgColor border-2 rounded-lg border-inputFieldColor text-secondaryColor transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor"
            >
              Tilbage
            </button>
            <button
              type="submit"
              className="bg-bgColor border-2 rounded-lg border-inputFieldColor text-secondaryColor transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor"
            >
              Forsæt
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center w-full max-w-md md:w-44">
          <CartSummary
            ticketType={ticketType}
            ticketQuantity={ticketQuantity}
            campingOptions={campingOptions}
          />
        </div>
      </div>
    </div>
  );
}
