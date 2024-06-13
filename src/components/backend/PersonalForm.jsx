import { useState, useEffect } from "react";
import {
  Disclosure,
  DisclosurePanel,
  DisclosureButton,
  Field,
  Label,
  Description,
  Select,
} from "@headlessui/react";
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

  const landeKode = [
    { code: "+45", label: "DK" },
    { code: "+1", label: "US" },
    { code: "+44", label: "UK" },
    { code: "+49", label: "DE" },
    { code: "+33", label: "FR" },
    { code: "+34", label: "ES" },
  ];

  useEffect(() => {
    if (localPersonalInfo.length === 0) {
      const initialInfo = Array.from({ length: ticketQuantity }, () => ({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        dateOfBirth: "",
        email: "",
        landeKode: "+45",
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

  //ChatGpt prompt: Jeg arbejder på en React-komponent, hvor jeg har brug for hjælp til at implementere patterns i input felter. Kan du forklare, hvordan jeg kan tilføje patterns for at validere data som fornavn (kun bogstaver), efternavn (kun bogstaver), telefonnummer (starter med + og kun tal), og email (gyldig email format)? Jeg vil også gerne vide, hvordan jeg kan bruge ARIA-attributter for tilgængelighed.

const handlePhoneKeyPress = (e, index) => {
  const allowedChars = /^[0-9]+$/;
  const currentLength = localPersonalInfo[index].phoneNumber.length;

  if ((!allowedChars.test(e.key) && !e.ctrlKey && e.key !== "Backspace") || currentLength >= 8) {
    e.preventDefault();
  }
};


  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const allFieldsFilled = localPersonalInfo.every((info) =>
    Object.values(info).every((value) => value.trim() !== "")
  );

     if (!allFieldsFilled) {
       setError("* Husk at udfylde alle felter, for alle deltagere!");
       return;
     }

    setError(""); 

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

  return (
    <div className="grid grid-cols-gridContent">
      <div className="pt-8 pb-16 col-start-3 gap-3 flex flex-wrap items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-secondaryBgColor rounded-lg p-8 shadow-md shadow-primaryColor w-full max-w-md">
          <fieldset className="space-y-6">
            <legend className={`${krona_one.className} large-size text-primaryTextColor`}>Personlig information</legend>

            {localPersonalInfo.map((info, index) => (
              <Disclosure key={index} defaultOpen={index === 0}>
                {({ open }) => (
                  <>
                    <div className="relative mb-2">
                      <DisclosureButton
                        className={clsx("w-full py-2 text-center small-size rounded-lg bg-bgColor text-primaryTextColor shadow focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor", { "": open })}
                        aria-expanded={open}
                        //ChatGpt prompt: Jeg udvikler en formular i React og ønsker at forbedre tilgængeligheden ved at bruge ARIA-attributter. Kan du forklare, hvordan jeg kan tilføje ARIA labels for input felter som fornavn, efternavn, telefonnummer, fødselsdato, og email? Jeg vil gerne sikre, at skærmlæsere korrekt kan identificere hvert felt og dets formål.

                        aria-controls={`panel-${index}`}
                      >
                        Billet {index + 1} ({ticketType})
                      </DisclosureButton>
                      {open ? <ChevronUpIcon className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-primaryTextColor" aria-hidden="true" /> : <ChevronDownIcon className="pointer-events-none absolute top-2.5 right-2.5 size-5 fill-primaryTextColor" aria-hidden="true" />}
                    </div>
                    <DisclosurePanel className="pb-2" id={`panel-${index}`}>
                      <div className="space-y-4">
                        <Field className="space-y-2">
                          <Label htmlFor={`firstName-${index}`}>Fornavn:</Label>
                          <input id={`firstName-${index}`} type="text" value={info.firstName} className="peer w-full p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor" aria-label={`Fornavn for billet ${index + 1}`} pattern="^[A-Za-zæøåÆØÅ ]+$" title="Fornavn må kun indeholde bogstaver." required onChange={(e) => handleInputChange(index, "firstName", e.target.value)} />
                          <Description className="xsmall-size hidden peer-focus:block">Fornavn må kun indeholde bogstaver</Description>
                        </Field>

                        <Field className="space-y-2">
                          <Label htmlFor={`lastName-${index}`}>Efternavn:</Label>
                          <input id={`lastName-${index}`} type="text" value={info.lastName} className="peer w-full p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor" aria-label={`Efternavn for billet ${index + 1}`} pattern="^[A-Za-zæøåÆØÅ ]+$" title="Efternavn må kun indeholde bogstaver." required onChange={(e) => handleInputChange(index, "lastName", e.target.value)} />
                          <Description className=" xsmall-size hidden peer-focus:block">Efternavn må kun indeholde bogstaver</Description>
                        </Field>

                        <Field className="space-y-2">
                          <Label htmlFor={`phoneNumber-${index}`}>Telefonnummer:</Label>
                          <div className="flex h-fit gap-2">
                            <Select id={`landeKode-${index}`} value={info.landeKode} onChange={(e) => handleInputChange(index, "landeKode", e.target.value)} className="p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor">
                              {landeKode.map((code) => (
                                <option key={code.code} value={code.code}>
                                  {code.label} {code.code}
                                </option>
                              ))}
                            </Select>
                            <input 
                            id={`phoneNumber-${index}`} 
                            type="tel" 
                            value={info.phoneNumber} 
                            className="peer w-full p-2 border bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor" 
                            aria-label={`Telefonnummer for billet ${index + 1}`} 
                            pattern="^\d{8}$" 
                            title="Telefonnummeret skal indeholde 8 tal." 
                            onKeyPress={(e) => handlePhoneKeyPress(e, index)} required onChange={(e) => handleInputChange(index, "phoneNumber", e.target.value)} />
                          </div>
                          <Description className=" xsmall-size hidden peer-focus:block">
                            Telefonnummeret må kun indeholde tal
                          </Description>
                        </Field>

                        <Field className="space-y-2">
                          <Label htmlFor={`dateOfBirth-${index}`}>Fødselsdato:</Label>
                          <input id={`dateOfBirth-${index}`} type="date" value={info.dateOfBirth} className="peer w-full p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor" aria-label={`Fødselsdato for billet ${index + 1}`} min="1923-01-01" required onChange={(e) => handleInputChange(index, "dateOfBirth", e.target.value)} />
                          <Description className="xsmall-size hidden peer-focus:block">Du skal være mindst 18 år gammel</Description>
                        </Field>

                        <Field className="space-y-2">
                          <Label htmlFor={`email-${index}`}>Email:</Label>
                          <input id={`email-${index}`} type="email" value={info.email} className="peer w-full p-2 bg-inputFieldColor text-bgColor rounded-lg focus:outline-none focus:ring-2 focus:ring-accentColor" aria-label={`Email for billet ${index + 1}`} pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$" title="Email skal være en gyldig emailadresse." required onChange={(e) => handleInputChange(index, "email", e.target.value)} />
                          <Description className="xsmall-size hidden peer-focus:block">Email skal være en gyldig emailadresse og indeholde @</Description>
                        </Field>
                      </div>
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            ))}
          </fieldset>

          {error && (
            <p className="small-size mt-2 underline text-labelColor" role="alert">
              {error}
            </p>
          )}
          <div className="flex justify-between mt-8">
            <button type="button" onClick={onBack} className="bg-bgColor border-2 rounded-lg border-inputFieldColor text-secondaryColor transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor" aria-label="Tilbage">
              Tilbage
            </button>
            <button type="submit" className="bg-bgColor border-2 rounded-lg border-inputFieldColor text-secondaryColor transition-colors duration-100 ease-in-out hover:bg-secondaryColor hover:text-bgColor hover:border-bgColor px-5 py-3 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-accentColor" aria-label="Fortsæt">
              Forsæt
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center fixed w-full max-w-md md:w-44">
          <CartSummary ticketType={ticketType} ticketQuantity={ticketQuantity} campingOptions={campingOptions} />
        </div>
      </div>
    </div>
  );
}
