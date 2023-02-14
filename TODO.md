INTERVJU:
- Fixit leverer applikasjonen deres for timebestilling, hva mer gjør applikasjonen enn at kundene kan bestillte timer?
    (Vent på svar) deretter: Logge inn for å administrere bestillinger og andre ting i salongen? Registrerer hvem som har hatt 
    hvilke timer som har noe å si for lønna(eller gjøres det i kassen)? Skjer betalingen når de reserverer timen, eller varierer det?
    Hva ville vært den beste løsningen på det. 
    Er det noe som mangler på applikasjonen, for eksempel bekreftelse på SMS, og påminnelse på SMS dagen før timen?
    Noe som dere skulle ønske var annerledes? At kunde må logge seg på for å bestille time, at man kanskje ikke trenger det


BARE CLIENT:
- Admin.js: VIKTIG gi class til alle "pop-up" vinduer slik at de dekker hele skjermen. Dermed blir det vesentlig
                ryddigere og ikke helt uoversiktlig.
- Admin.js: Søkefelt for å søke etter spesifike timebestillinger
- Admin.js: Kunne slette timebestillinger (dersom kunde må avbestille eller flytte på timen). Kun fjerne, så må kunden eller frisøren
 legge inn ny
- DinReservasjon.js: Displaye bilde av frisøren
- Lage footer med info om: Meg, google icons, strex SMS gateway, personvernserklæring og brukervilkår

BARE SERVER:

SERVER OG CLIENT:
        APPLIKASJON
- model/env.js og configuration/createEnvironment: Legge inn ny property for sosialeMedier som er linken til for eksempel facebook siden
- routes/env.js og routes/login.js: Kunne slette frisører. Både oppdatere environment og brukeren
- Admin.js og env.js: Admin kan resette passord til frisørene slik at de får logget inn dersom de har glemt passord 
FØR PROD: 
- Sjekke clientside om bruker er logget inn fra før med cookies (path: /login/loggetinn)

MULIGE BUGS SOM KAN KOMME I PROD:
- Innloggingsforsøk. Test innloggingsfunksjonaliteten mtp antall innloggingsforsøk.

TODO:
- Sjekke ut hva Jest er
- Fikse patent?
- Fikse betalingsskjerm som kobles opp til en betalingsterminal https://aera.id/betalingsterminal/#module-9

Ideer:
Gavekort, betaling med stripe

Scenarioer:
- Kunde har bestilt time, men ønsker å endre tidspunkt
- Kunde har bestilt time, men ønsker å endre tidspunkt OG behandlinger. Hun vil ha både herreklipp og dameklipp, men hun hadde kun
    reservert for dameklipp

Før produksjon
Legge inn authorization som middleware for alle administrative routes (er lagt til for alle hvor admin er eneste autoriserte, men 
    må legge til for routes der vanlige ansatte kan gjøre endringer)
endre variabler i .env filen
endre request i Personinfo.js og Admin.js fra http://localhost til domenenavnet
slette unødvendige filer og fjerne unødvendig kode
endre tittel i index.html
sette NODE_ENV til "production" i .env filen
un-comment credentials i Login.js i client
bytt fra mercedes bildet til logo
bytte farge-variabler i App.css
har salongen åpent søndager? Da må det endres i Klokkeslett.js
Endre at når ansatt endrer tlf så endrer den på deres tlf og ikke elin sitt (routes/login.js /oppdaterTelefonnummer)

FÅ FRA KUNDE FØR PROD
- Logo og bakgrunnsvideo (må være mp4 H.264)
- Bilde til startside

MINE GARANTIER:
- Umulig å bli dobbeltbooket eller at timer krasjer, først på nettsiden, så sjekker den med tidligere bestillinger, men også på serveren i det bestillingen sendes, så sjekker den momentnant om det krasjer med andre bestillinger.