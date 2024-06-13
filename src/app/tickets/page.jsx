import Image from "next/image" 
import Link from "next/link";
import { krona_one } from "@/app/fonts";


export default function TicketPage(){
    return (
      <section className="min-h-screen md:px-2">
        <div>
          <h1 className={`${krona_one.className} text-center headliner`}>Billetter 2024</h1>
          <div className="normal-size text-left px-9 md:px-20 md:w-10/12">
            <p>Deltag i året festival - FooFest 2024!</p>
            <p>I år kan du købe to forskellige typer af billetter. Som altid kan du købe Regular og Vip billet, så du kan vælge hvad der passer til dine ønsker.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 p-8">
          <Link href="/booking" prefetch={false} className="focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor transform hover:rotate-2 transition-transform duration-300" aria-label="Køb billet">
            <Image src="tickets/TicketRegular.svg" width={100} height={50} alt="Normal billet" clas />
            <span class="sr-only">FooFest ticket type: Regular billet, price 799 DKK. Indeholder Full festival access og regular camping</span>
          </Link>

          <Link href="/booking" prefetch={false} className="focus: rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor transform hover:-rotate-2 transition-transform duration-300" aria-label="Køb billet">
            <Image src="tickets/TicketVip.svg" width={100} height={50} alt="VIP billet" />
            <span class="sr-only">FooFest ticket type: VIP billet, price 1299 DKK. Indeholder Full festival access, VIP camping, access to VIP area</span>
          </Link>
        </div>

        <div className="text-left ">
          <h2 className={`${krona_one.className} text-center scene-size pb-8`}>Camping områder</h2>
          <div className=" px-9 md:px-20 normal-size md:w-10/12">
            <p className="pb-8">Campingområdet er en FooFest oplevelse du ikke vil snydes for. Det er muligt at bo i fem forskellige områder under festivallen. Du kan vælge området når du køber din billet.</p>
            <p>Er det vigtigt for dig at ligge i et område der er rent og stille - Så skal du tilkøbe Grøn camping!</p>
          </div>
        </div>
        <div className=" grid grid-cols-2 lg:grid-cols-3 gap-5 p-8">
          <div className="focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor transform hover:-rotate-2 transition-transform duration-300">
            <Image src="tickets/TicketHelheim.svg" width={100} height={50} alt="Helheim Camping" className="w-full" />
            <span class="sr-only">FooFest camping område: Helheim</span>
          </div>

          <div className="focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor transform hover:rotate-2 transition-transform duration-300">
            <Image src="tickets/TicketMuspelheim.svg" width={100} height={50} alt="Muspelheim Camping" className="w-full" />
            <span class="sr-only">FooFest camping område: Muspelheim</span>
          </div>

          <div className="focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor transform hover:-rotate-2 transition-transform duration-300">
            <Image src="tickets/TicketNilfheim.svg" width={100} height={50} alt="Nilfheim Camping" className="w-full" />
            <span class="sr-only">FooFest camping område: Nilfheim</span>
          </div>

          <div className="focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor transform hover:rotate-2 transition-transform duration-300">
            <Image src="tickets/TicketAlfheim.svg" width={100} height={50} alt="Alfheim Camping" className="w-full" />
            <span class="sr-only">FooFest camping område: Alfheim</span>
          </div>

          <div className="focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor transform hover:-rotate-2 transition-transform duration-300">
            <Image src="tickets/TicketSvartheim.svg" width={100} height={50} alt="Svartheim Camping" className="w-full" />
            <span class="sr-only">FooFest camping område: Svartheim</span>
          </div>

          <div className="focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accentColor transform hover:rotate-2 transition-transform duration-300">
            <Image src="tickets/Ticketgreen.svg" width={100} height={50} alt="Grøn Camping" className="w-full" />
            <span class="sr-only">FooFest camping område: Grøn Camping. Pris: 249 DKK. Indeholder Clean camping area og stilhed fra 22-09.</span>
          </div>
        </div>
      </section>
    );
}