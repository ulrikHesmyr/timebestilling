INTERVJU:
- Fixit leverer applikasjonen deres for timebestilling, hva mer gjør applikasjonen enn at kundene kan bestillte timer?
    (Vent på svar) deretter: Logge inn for å administrere bestillinger og andre ting i salongen? Registrerer hvem som har hatt 
    hvilke timer som har noe å si for lønna(eller gjøres det i kassen)? Skjer betalingen når de reserverer timen, eller varierer det?
    Hva ville vært den beste løsningen på det. 
    Er det noe som mangler på applikasjonen, for eksempel bekreftelse på SMS, og påminnelse på SMS dagen før timen?
    Noe som dere skulle ønske var annerledes? At kunde må logge seg på for å bestille time, at man kanskje ikke trenger det


BARE CLIENT:
BARE SERVER:
SERVER OG CLIENT:


MULIGE BUGS SOM KAN KOMME I PROD:
- Innloggingsforsøk. Test innloggingsfunksjonaliteten mtp antall innloggingsforsøk.
- 2FA, sjekk om alt stemmer med 2FA

TODO:
- Sjekke ut hva Jest er
- Fikse patent?
- Fikse betalingsskjerm som kobles opp til en betalingsterminal https://aera.id/betalingsterminal/#module-9
- Kontrakt som frilanser (for at arbeidsgiver kan sende a-melding)
- Sjekke uutilsynet.no for universell utforming
- Google tilbakemeldinger API


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
Legge inn riktig link for google reviews https://developers.google.com/my-business/content/review-data#list_all_reviews

OM APPLIKASJONEN, PERSONVERN OG LOV:
- Data som lagres om de ansatte går under firmaets egne kontrakter om personvern osv.

FÅ FRA KUNDE FØR PROD
- Logo?
- Bilde til startside

MINE GARANTIER:
- Umulig å bli dobbeltbooket eller at timer krasjer, først på nettsiden, så sjekker den med tidligere bestillinger, men også på serveren i det bestillingen sendes, så sjekker den momentnant om det krasjer med andre bestillinger.

new FormData() for bilder, ikke json
body: formData

font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;