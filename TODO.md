CLIENT:
- Fjerne mulighet for å reservere klokkesletter samme dagen som har allerede vært
- Dersom man er på mobilen så skal kategoriene være nedrykksmenyer

- Lagre navn og nummer i localStorage for senere                                                         
SERVER:
- Dersom "FØRSTE LEDIGE FRISØR" velges, så skal den assignes til den første ledige frisøren, samtidig skal det telles opp en variabel  som ser hvem av frisørene som har fått minst "første ledige" slik at den frisøren alltid får timen

- Sende bekreftelse på timebestilling på epost 
- Sette opp env.js i databasen
- Sett opp protected route router.post('/login', async(req,res))
- Når de logger inn så får de tilgang til: 
    Reservere bort timer hvor de ikke skal jobbe
    Se og endre på reserverte timer (liksom hvis de ringer inn og endrer på timen sin)


Ideer:
Gavekort, betaling med stripe

Scenarioer:
- Kunde har bestilt time, men ønsker å endre tidspunkt
- Kunde har bestilt time, men ønsker å endre tidspunkt OG behandlinger. Hun vil ha både herreklipp og dameklipp, men hun hadde kun
    reservert for dameklipp