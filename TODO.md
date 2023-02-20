INTERVJU:
- Fixit leverer applikasjonen deres for timebestilling, hva mer gjør applikasjonen enn at kundene kan bestillte timer?
    (Vent på svar) deretter: Logge inn for å administrere bestillinger og andre ting i salongen? Registrerer hvem som har hatt 
    hvilke timer som har noe å si for lønna(eller gjøres det i kassen)? Skjer betalingen når de reserverer timen, eller varierer det?
    Hva ville vært den beste løsningen på det. 
    Er det noe som mangler på applikasjonen, for eksempel bekreftelse på SMS, og påminnelse på SMS dagen før timen?
    Noe som dere skulle ønske var annerledes? At kunde må logge seg på for å bestille time, at man kanskje ikke trenger det


BARE CLIENT:
- Login.js: RateLimiter på /auth route, så sjekk om response er json for å skrive om du har logget inn for mye 
https://stackoverflow.com/questions/37121301/how-to-check-if-the-response-of-a-fetch-is-a-json-object-in-javascript
- Når kunde bestiller time, så sjekkes det om kunden har bestilt fra før av. Da får kunden varsling dersom de har bestilt to timer med  
    feiltakelse

- DinReservasjon.js: Displaye bilde av frisøren
- Lage footer med info om: Meg, google icons, strex SMS gateway, personvernserklæring og brukervilkår

BARE SERVER:
- Legge inn limiter på alle resterende routes, 100 requests på 100 minutter

SERVER OG CLIENT:
        APPLIKASJON
- hjem.js og public/: Kunne displaye video på startside dersom !isMobile 

FØR PROD: 
- Sjekke clientside om bruker er logget inn fra før med cookies (path: /login/loggetinn) og 2FA

MULIGE BUGS SOM KAN KOMME I PROD:
- Innloggingsforsøk. Test innloggingsfunksjonaliteten mtp antall innloggingsforsøk.

TODO:
- Sjekke ut hva Jest er
- Fikse patent?
- Fikse betalingsskjerm som kobles opp til en betalingsterminal https://aera.id/betalingsterminal/#module-9
- Kontrakt som frilanser (for at arbeidsgiver kan sende a-melding)

TESTE:
- Legge inn oppsigelse på frisøren idag og prøve å bestille time fra han samtidig

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
fjerne http://localhost fra request i Personinfo.js og Admin.js 
slette unødvendige filer og fjerne unødvendig kode
endre tittel i index.html
sette NODE_ENV til "production" i .env filen
un-comment credentials i Login.js i client
bytt fra mercedes bildet til logo
bytte farge-variabler i App.css
har salongen åpent søndager? Da må det endres i Klokkeslett.js
Endre at når ansatt endrer tlf så endrer den på deres tlf og ikke elin sitt (routes/login.js /oppdaterTelefonnummer)

OM APPLIKASJONEN, PERSONVERN OG LOV:
- Data som lagres om de ansatte går under firmaets egne kontrakter om personvern osv.

FÅ FRA KUNDE FØR PROD
- Logo 
- Bakgrunnsvideo (må være mp4 H.264 codec)
- Bilde til startside

MINE GARANTIER:
- Umulig å bli dobbeltbooket eller at timer krasjer, først på nettsiden, så sjekker den med tidligere bestillinger, men også på serveren i det bestillingen sendes, så sjekker den momentnant om det krasjer med andre bestillinger.

new FormData() for bilder, ikke json