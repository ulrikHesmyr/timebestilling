import React from 'react'

function PB({env}){
    return(
        <div style={{margin:"1rem", marginTop:"6rem", paddingLeft:"10%", paddingRight:"10%"}}> 
<p>Sist oppdatert 19.04.2023</p>
<h1>Personvernerklæring for {window.location.hostname}</h1>
<p>
Ditt personvern er viktig for oss, og vi legger derfor stor vekt på at opplysningene håndteres på en ansvarlig 
måte og å sørge for at vår bruk av personopplysninger er i samsvar med gjeldende personvernregler.
</p>
<p>
Nedenfor kan du lese hvordan {env.bedrift} - som heretter refereres til som "oss" og "vi" - behandler personopplysninger om deg. 
Du kan også lese om hvilke rettigheter du har i forbindelse med behandlingen vår.
</p>
<h2>
Databehandler
</h2>
<p>
Hesmyr Web Technologies - heretter "databehandler" - drifter nettstedet vårt og fungerer i den sammenheng som databehandler 
som behandler personopplysninger om deg på vegne av oss som behandlingsansvarlig. 
</p>
<p>
Vi inngår en databehandleravtale med Hesmyr Web Technologies som fastsetter vilkår og instrukser 
for behandling av personopplysninger. Avtalene inngås i henhold til personvernforordningen artikkel 28 nr. 3.
</p>

<h2>
Rammene for behandling av personopplysninger</h2>
<p>
Vi behandler personopplysninger innenfor rammene av gjeldende lovverk og denne personvernerklæringen.
 Personopplysninger hentes inn når det er nødvendig for at vi skal kunne utføre de oppgaver og tjenester 
 vi er pålagt å utføre i henhold til lov og/eller avtale, eller når du på annen måte gir personopplysninger til oss.
</p>
<p>
Personopplysninger er opplysninger som direkte eller indirekte kan knyttes til deg som enkeltperson.

Vi behandler personopplysninger som navn og telefonnummer og øvrige opplysninger som du gir til oss som innebærer sted og tid for
 timereservasjon. 

Vårt grunnlag for behandlingen er avtalen med deg (personvernforordningen artikkel 6 nr. 1 bokstav b) eller
 våre rettmessige interesser (personvernforordningen artikkel 6 nr. 1 bokstav f).
</p>
<h2>
Formål med lagring og behandling av personopplysninger.
</h2>

<p>
Formålet med at personopplysningene lagres og behandles er på grunnlag av applikasjonens hensikt 
med å kunne effektivisere timereservasjoner.
Dette er for å kunne danne et pålitelig forhold mellom deg som kunde og oss som leverandør av tjenester.
</p>

<h2>
Lagringsperiode, personvern, risiko og sikkerhet</h2>
<p>
Personopplysningene som inngår i timereservasjonen lagres ikke lenger enn det som er nødvendig for å oppfylle formålene 
de ble samlet inn for. Dette vil si samme kveld som timereservasjon har vært utført. Unntak her er lagring av 
telefonnummeret i cookies, som står mer om lenger ned på siden. Når opplysningene ikke lenger 
er nødvendige, vil vi sikre at de slettes på en sikkerhetsmessig forsvarlig måte.
</p>

<p>
Det er vår politikk å beskytte personopplysninger ved å treffe tilstrekkelige tekniske og organisatoriske sikkerhetstiltak.
 Ved lagring av personopplysningene tar vi hensyn til sikkerhet og risiko. Vi har etablert rutiner for å sikre at
    personopplysningene lagres på en sikker måte og at de ikke kommer på avveie. Vi har også etablert rutiner for risikovurdering 
    med bruk av offentlige rammeverk for vurdering av alvorlighetsgrad av sårbarhet og risiko for systemet brukt i nettapplikasjonen.
    På denne måten kan vi selv evaluere om det er forsvarlig med de nåværende sikkerhetstiltakene, eller om det må gjøres endringer.
    Dette er for å sikre at personopplysningene ikke kommer på avveie.

</p>

<h2>
Deling av dine opplysninger med andre</h2>
<p>
  
Vi gir personopplysningene dine videre til databehandleren i forbindelse med den vanlige driften og administrasjon 
av {window.location.hostname}. Vår databehandler behandler bare personopplysningene til våre formål og 
instrukser i henhold til inngått databehandleravtale.

</p>
<p>
Grunnlaget for behandlingen er våre legitime interesser (personvernforordningen artikkel 6, nr. 1, bokstav f) og/eller 
avtalen med deg (personvernforordningen artikkel 6 nr. 1 bokstav b).
</p>

<h2>
Overføring av personopplysninger til land utenfor EU/EØS
</h2>

<p>
Vi kan i forbindelse med behandlingen av personopplysningene overføre opplysningene til 
land utenfor EU/EØS. Personvernlovgivningen i disse landene kan være mindre streng enn den er i 
Norge og EU/EØS for øvrig. I visse land har EU-kommisjonen imidlertid fastsatt at personvernnivået er 
på høyde med det vernenivået som er i EU/EØS. Hvis vi overfører personopplysninger til land der dette ikke er 
tilfelle, vil overføringen av personopplysningene til disse landene utenfor EU/EØS skje på bakgrunn av standardkontraktene 
utarbeidet av EU-kommisjonen, eller annet lignende overføringsgrunnlag som er spesielt utarbeidet for å sikre et 
tilstrekkelig vernenivå.
</p>

<p>
Du kan lese mer om overføring av personopplysninger til land utenfor EU/EØS på EU-kommisjonens hjemmeside: www.ec.europa.eu.
</p>

<h2>
Innsyn, retting og sletting
</h2>
<p>
Som registrert har du en rekke rettigheter i henhold til personvernforordningen.
</p>

<p>
Hvis du vil benytte deg av rettighetene, må du kontakte oss på e-post: {env.kontakt_epost} eller tlf.: {env.kontakt_tlf}. 
</p>

<p>
Du kan dessuten - ubetinget og til enhver tid - gjøre innsigelser mot vår behandling når den skjer på bakgrunn 
av vår rettmessige interesse.
</p>

<h3>Dine rettigheter omfatter også følgende:</h3>
<ul>
<li>Rett til innsikt: Du har rett til å få innsikt i de personopplysninger vi behandler om deg.</li>
<li>Rett til korrigering: Du har rett til å få uriktige personopplysninger om deg selv korrigert og ufullstendige personopplysninger utfylt.</li>
<li>Rett til sletting (retten til å bli glemt): I særlige tilfeller har du rett til å få slettet personopplysninger om deg innen det tidspunktet vi vanligvis vil slette dine opplysninger.</li>
<li>Rett til begrensning av behandling: Du har i visse tilfeller rett til å få behandlingen av dine personopplysninger begrenset. Hvis du har rett til å få begrenset behandlingen, kan vi heretter bare behandle opplysningene - bortsett fra lagring - med ditt samtykke, eller med tanke på at lovkrav kan fastsettes, gjøres gjeldende eller forsvares, eller for å beskytte en person eller viktige samfunnsinteresser.</li>
<li>Rett til å gjøre innsigelse: Du har i visse tilfeller rett til å gjøre innsigelse mot vår behandling av dine personopplysninger, og alltid hvis behandlingen er med tanke på direkte markedsføring.</li>
<li>Rett til dataportabilitet: Du har i visse tilfeller rett til å motta dine personopplysninger i et strukturert, alminnelig anvendt og maskinlesbart format og få overført disse personopplysningene fra én behandlingsansvarlig til en annen.</li>
<li>Rett til å inngi klage: Du kan til enhver tid inngi klage til Datatilsynet på vår behandling av personopplysninger. Se mer på datatilsynet.no, der du også kan finne mer informasjon om dine rettigheter som registrert.</li>
</ul>

<p>
Du har rett til innsyn i dine personopplysninger. Ta kontakt med oss. Vår kontaktinformasjon finner du ovenfor 
eller på {window.location.hostname}.
</p>

<h2>
Klage
</h2>

<p>
Hvis du er uenig eller misfornøyd med måten vi behandler dine personopplysninger på, 
kan du klage til oss. Vår kontaktinformasjon finner du overnfor eller på {window.location.hostname}.
</p>

<p>
Du har rett til å sende inn en klage til Datatilsynet dersom du er misfornøyd
 med måten vi behandler dine personopplysninger på. Du finner Datatilsynets
  kontaktinformasjon på www.datatilsynet.no.
</p>

<h2>
Oppdateringer
</h2>
<p>
Vi evaluerer og oppdaterer løpende denne personvernerklæringen. Det er derfor en god idé å holde deg 
regelmessig oppdatert. Øverst kan du se når den sist ble oppdatert. Den siste versjonen vil alltid være
 tilgjengelig på våre hjemmesider.
</p>
<h2>
Bruk av cookies på {window.location.hostname}
</h2>

<p>
Vi ønsker at ditt besøk på {window.location.hostname} skal være en god opplevelse. Derfor bruker vi 
informasjonskapsler (cookies) til funksjonelle mål. En informasjonskapsel, også kalt cookie, er 
små filer som nettleseren din mottar fra nettsider du besøker. Filene lagres på datamaskinen eller mobilenheten din, men de 
er krypterte og vil ikke kunne identifisere deg for uvedkommende. Ved å benytte deg av {window.location.hostname} 
samtykker du i at vi kan sette informasjonskapsler (cookies) i din nettleser, og de fleste nettlesere er innstilt slik at de automatisk 
aksepterer informasjonskapsler. Dersom du ikke samtykker til bruk av informasjonskapsler, må du selv trekke tilbake samtykket 
ved å endre innstillingene i nettleseren din. Les mer om hvordan du gjør dette lenger ned på siden.
</p>

<p>
For å bestille time på {window.location.hostname}/timebestilling, så må vi ta cookies (informasjonskapsler) i bruk. Når du 
har fylt ut din bestilling, så vil vi lagre telefonnummeret ditt i en cookie slik at du ikke trenger å verifisere telefonnummeret ditt
 til neste gang. Samtidig bruker vi midlertidige funksjonelle cookies for pin og verifisering, som slettes når verifiseringen er 
 gjennomført, eller når du lukker nettleseren.
Når du trykker på knappen som sier "send inn reservasjon", så blir du informert om at du samtykker til at vi lagrer informasjonen 
din i en cookie. Informasjonen vil være lagret i 6 måneder før den slettes fra cookies.
 Samtykket er frivillig, men også nødvendig for å kunne fullføre bestillingen.  

</p>

<p>
Målet er å gi deg en god brukeropplevelse og fordeler neste gang du besøker nettsiden 
ved at du slipper å forholde deg til å verifisere telefonnummeret ditt på nytt.
</p>

<h2>
Fjerning og lagring av cookies
</h2>

<p>
Du kan til enhver tid trekke samtykket ditt tilbake ved enten å slette, 
avvise eller fravelge bruken av cookies på din enhet. Dette gjør du ved å endre 
innstillingene i din nettleser. Hvor du finner innstillingene kan avhenge av hvilken nettleser du bruker.
</p>

<p>
Vær oppmerksom på at hvis du trekker samtykket ditt, kan det være funksjoner og 
tjenester på hjemmesiden som ikke fungerer fordi de krever at nettstedet husker valgene du har gjort.
</p>

<p>
Vedvarende cookies sletter seg selv etter forskjellige intervaller, men oppdateres automatisk når du besøker nettstedet igjen.
</p>
<p>
Du kan slette cookies som du tidligere har akseptert. Hvordan du sletter cookies avhenger av hvilken nettleser du bruker. Hvis du bruker en enhet med en nyere nettleser, kan du slette cookies ved hjelp av hurtigtastene: CTRL + SHIFT + Delete.
</p>

<p>
Hvis hurtigtastene ikke virker, og/eller hvis du bruker en Apple-enhet, må du finne ut hvilken nettleser du bruker, og deretter klikke på den relevante lenken:
</p>

<section style={{display:"flex", flexDirection:"column"}}>
  
<a rel='noreferrer' target='_blank' href='https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox?redirectslug=delete-cookies-remove-info-websites-stored&redirectlocale=en-US'>
Guidance - Firefox</a>
<a rel='noreferrer' target='_blank' href='https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DDesktop&hl=en'>
Guidance - Google Chrome</a>
<a rel='noreferrer' target='_blank' href="https://support.apple.com/no-no/guide/safari/sfri11471/mac">Guidance - Safari</a>
<a rel='noreferrer' target='_blank' href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" >Guidance - Explorer</a>

</section>
<p>Merk at hvis du bruker flere nettlesere, må du slette cookies i alle nettleserne dine.</p>
        </div>
    )
}

export default React.memo(PB);