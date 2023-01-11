CLIENT:
- Legg til pattern for Login.js pattern="[0-9a-fA-F]{4,8}" for passord, slik at det er mer sikkert
- Legg til toggle checkbox sånn de kan se hva de har skrevet inn
- Lage footer med info om: Meg, google icons, personvernserklæring og brukervilkår, 

- Vise første ledige frisør for valgte behandlinger dersom en av frisørene er ledig før de andre

SERVER:

- Laste opp bilder for friøsrene

- Sende bekreftelse på timebestilling på SMS
- Når de logger inn så får de tilgang til: 
    Reservere bort timer hvor de ikke skal jobbe
    Se og endre på reserverte timer (liksom hvis de ringer inn og endrer på timen sin)


Ideer:
Gavekort, betaling med stripe

Scenarioer:
- Kunde har bestilt time, men ønsker å endre tidspunkt
- Kunde har bestilt time, men ønsker å endre tidspunkt OG behandlinger. Hun vil ha både herreklipp og dameklipp, men hun hadde kun
    reservert for dameklipp

Før produksjon
endre variabler i .env filen
endre request fra http://localhost til domenenavnet
slette unødvendige filer og fjerne unødvendig kode
endre tittel i index.html
sette NODE_ENV til "production" i .env filen
un-comment credentials i Login.js i client
bytt fra mercedes bildet til logo
bytte farge-variabler i App.css
har salongen åpent søndager? Da må det endres i Klokkeslett.js