INTERVJU:
- Fixit leverer applikasjonen deres for timebestilling, hva mer gjør applikasjonen enn at kundene kan bestillte timer?
    (Vent på svar) deretter: Logge inn for å administrere bestillinger og andre ting i salongen? Registrerer hvem som har hatt 
    hvilke timer som har noe å si for lønna(eller gjøres det i kassen)? Skjer betalingen når de reserverer timen, eller varierer det?
    Hva ville vært den beste løsningen på det. 
    Er det noe som mangler på applikasjonen, for eksempel bekreftelse på SMS, og påminnelse på SMS dagen før timen?
    Noe som dere skulle ønske var annerledes? At kunde må logge seg på for å bestille time, at man kanskje ikke trenger det

PROBLEMSTILLINGER:
- Gjøre det mulig å velge første ledige frisør. Dersom dette velges så kan de velge mellom alle klokkeslett. Da får de en tilfeldig
    frisør som er ledig på dette tidspunktet og som har tid til å gjennomføre alle behandlingene til kunden.

    Frisor.js: Velger "første ledige frisør" --> sFrisor(false). Finner også alle tilgjengelige frisører som gjør alle de valgte
                behandlingene. 
    Klokkeslett.js: Hvis frisør er false, så blir alle klokkeslett hvor det finnes frisører som både kan gjennomføre alle behandlingene
                og er ledig for totalTid for behandlingene som er i produkt (useState). Da bytter vi ut funksjonene for å finne ledige
                timer for én spesifikt valgt frisør med funksjon som sjekker dersom én av de egnede frisørene er ledige.



BARE CLIENT:
- App.js: "Bestill time" på startskjermen
- Vakter.js: Displaye fri elementer
- Klokkeslett.js: tilpasse ledige klokkeslett til frisører som har fri
- Admin.js: Kunne slette timebestillinger (dersom kunde må avbestille eller flytte på timen). Kun fjerne, så må kunden eller frisøren
 legge inn ny
- Fortsett i Admin.js med sende nytt env til database
- Gjør admin panel idiotsikkert m å gi kriterier til input felter
- Legg til pattern for Login.js pattern="[0-9a-fA-F]{4,8}" for passord, slik at det er mer sikkert
- Ikke tillatte input dersom det ikke er bokstaver eller bindestrek
- Lage footer med info om: Meg, google icons, strex SMS gateway, personvernserklæring og brukervilkår

BARE SERVER:
- scheduleJob index.js: slette fri når sluttdatoen er datoen idag

SERVER OG CLIENT:
        SIKKERHET
- routes/login.js: Begrense antall passord-forsøk. bruke cookies? (kan slette cookies, men må ha en spesifik cookie for at applikasjonen skal fungere) 
- routes/login.js: 2FA. Når man logger inn første gang, så sendes en SMS også lagres en cookie som signes med jwt,
    det sjekkes hver gang i /logginn routen om denne cookien finnes og kan verifies (jwt.verify), hvis ikke så sendes ny 2FA

        BRUKERFUNKSJONALITET
- model/brukere.js: Opprett denne modellen, hver frisør skal ha en bruker hver slik at man må logge inn med 2FA. Modellen skal ha     
    properties brukernavn, passord, produkter og telefon. 
- routes/login.js: Kunne logge inn på vakter-panelet med egen bruker Brukere.findOne({brukernavn: req.body.brukernavn}), samt bcrypt på 
    passord. Dersom brukernavnet er "admin" så setter brukertype til "admin". Så fjerne vakter_bruker, admin_bruker, vakter_pass og 
    admin_pass. (Sjekk andre filer for dette også. Dette erstattes med å hente brukernavn og passord fra brukere i databasen)
- routes/login.js: Lage route for å opprette bruker, sender inn navn på frisør og telefonnummer. Passordet settes til det samme som 
    navnet på frisøren "/opprettBruker". Denne funksjonaliteten gjøres samtidig som "/oppdaterEnv" (bare admin som kan bruke), redigere 
    passord og telefonnummer "/endreTlfPass"(bare frisøren selv), resette passord for en valgt bruker hvis de ikke husker passordet 
    sitt hvor passordet blir satt til samme som 
    brukernavn "/resetBruker" (bare admin som kan bruke) og slette bruker "/slettBruker" som må gjøres samtidig som "/oppdaterEnv" med 
    tanke på frisører osv (bare admin som kan bruke)
- Vakter.js: Frisøren kan selv endre passord og telefonnummer.
- Admin.js: Admin brukeren
- configuration/createEnvironment.js: Opprett første brukeren som er admin-brukeren. Her er brukernavn og passord "admin", og 
    telefonnummeret er bare mitt nummer. Første daglig leder gjør er å endre passordet og telefonnummeret inne på admin siden.
        APPLIKASJON
- Laste opp bilder for friøsrene


FØR PROD: 
- Sjekke clientside om bruker er logget inn fra før med cookies (path: /login/loggetinn)


TODO:
- Sjekke ut hva Jest er
- Fikse patent?

Ideer:
Gavekort, betaling med stripe

Scenarioer:
- Kunde har bestilt time, men ønsker å endre tidspunkt
- Kunde har bestilt time, men ønsker å endre tidspunkt OG behandlinger. Hun vil ha både herreklipp og dameklipp, men hun hadde kun
    reservert for dameklipp

Før produksjon
Legge inn authorization som middleware for alle administrative routes
endre variabler i .env filen
endre request i Personinfo.js og Admin.js fra http://localhost til domenenavnet
slette unødvendige filer og fjerne unødvendig kode
endre tittel i index.html
sette NODE_ENV til "production" i .env filen
un-comment credentials i Login.js i client
bytt fra mercedes bildet til logo
bytte farge-variabler i App.css
har salongen åpent søndager? Da må det endres i Klokkeslett.js

MINE GARANTIER:
- Umulig å bli dobbeltbooket eller at timer krasjer, først på nettsiden, så sjekker den med tidligere bestillinger, men også på serveren i det bestillingen sendes, så sjekker den momentnant om det krasjer med andre bestillinger.