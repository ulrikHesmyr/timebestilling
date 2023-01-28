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



CLIENT:
- Fri.js: Kunne slette fri elementer
- Vakter.js: Displaye fri elementer
- Klokkeslett.js: tilpasse ledige klokkeslett til frisører som har fri
- Fortsett i Admin.js med sende nytt env til database
- Gjør admin panel idiotsikkert m å gi kriterier til input felter
- Legg til pattern for Login.js pattern="[0-9a-fA-F]{4,8}" for passord, slik at det er mer sikkert
- Ikke tillatte input dersom det ikke er bokstaver eller bindestrek
- Lage footer med info om: Meg, google icons, personvernserklæring og brukervilkår,
- I Vakter.js, dersom view i Calendar er på "week", så fjern all tekst utenom navn på frisøren

- FØR PROD: Sjekke clientside om bruker er logget inn fra før med cookies (path: /login/loggetinn)


SERVER:
- schedule slette fri når sluttdatoen er datoen idag
- Admin panel - Ansatt må kunne reservere vekk timer når de ikke er på jobb eller har ferie
- Laste opp bilder for friøsrene
- app.use(express.json({limit:'1kb'}))

- Sende bekreftelse på timebestilling på SMS
- Når de logger inn så får de tilgang til: 
    Reservere bort timer hvor de ikke skal jobbe
    Se og endre på reserverte timer (liksom hvis de ringer inn og endrer på timen sin)

TODO:
- Sjekke ut hva Jest er

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