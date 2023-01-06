CLIENT:
- Fjerne mulighet for å reservere klokkesletter samme dagen som har allerede vært
- Få alle komponenter til å vente med å rendre inn

- Lagre navn og nummer i localStorage for senere  

SERVER:
- Sett opp protected route router.post('/login', async(req,res)). Pr salong så har vi én bruker for å se vakter, og én bruker for administrerende folk
- Dersom "førsye ledige frisør"(legg dette som default for alle frisørsalonger) velges, så skal den assignes til den første ledige frisøren, samtidig skal det telles opp en variabel  som ser hvem av frisørene som har fått minst "første ledige" slik at den frisøren alltid får timen

- Sende bekreftelse på timebestilling på SMS eller epost
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