HEIHEI

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

TODO:
- Sjekke ut hva Jest er
- Fikse patent?
- Fikse betalingsskjerm som kobles opp til en betalingsterminal https://aera.id/betalingsterminal/#module-9
- Kontrakt som frilanser (for at arbeidsgiver kan sende a-melding)
- Sjekke uutilsynet.no for universell utforming
- Google tilbakemeldinger API


TESTE:

Ideer:
Gavekort, betaling med stripe

Scenarioer:

Før produksjon
    FILER
endre variabler i .env filen
fjerne http://localhost:1226 fra request \
endre tittel i index.html
sette NODE_ENV til "production" i .env filen
un-comment credentials i Login.js, Vakter.js og Admin.js i client
bytte farge-variabler i App.css
Legge inn riktig link for google reviews https://developers.google.com/my-business/content/review-data#list_all_reviews
Endre bedriftens navn i personvernserklæringen
    SERVER
Opprette nytt env
apt-get update && apt-get install npm
npm i -g n
n latest
opprette .env på serveren
npm uninstall uuid
npm install uuid
endre på domenenavn i /etc/nginx/sites-available

OM APPLIKASJONEN, PERSONVERN OG LOV:
- Data som lagres om de ansatte går under firmaets egne kontrakter om personvern osv.


new FormData() for bilder, ikke json
body: formData

font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;