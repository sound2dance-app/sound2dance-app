# Dance Recognizer App - Benutzerhandbuch für Christoph

## Was ist diese App?

Dies ist ein **Labeling-Tool** zum Sammeln von Trainings-Daten für ein ML-Modell zur Tanzerkennung. Du bewertest Songs nach den 13 Standard-Ballroom-Tänzen, und die App speichert diese Daten. Später werden wir ein KI-Modell darauf trainieren, das automatisch Musik → Tanz vorhersagt.

## Quick Start (nach Deployment)

1. Gehe zur Live-URL (wird dir mitgeteilt, z.B. `https://sound2dance-app.vercel.app`)
2. Melde dich an (Email oder Anonymous)
3. Drücke "Play Song" um Musik von Spotify zu starten
4. Schieberegler für jeden Tanz bewegen (0-100%)
5. "Submit Rating" drücken
6. Nächster Song lädt automatisch

## Wie funktioniert das?

### Der Prozess
```
1. Spotify-Playlist wird geladen
   ↓
2. Du hörst eine Musik-Preview (30 Sekunden)
   ↓
3. Du bewertest auf Schiebereglern:
   - Waltz: 0-100%
   - Tango: 0-100%
   - ... (insgesamt 13 Tänze)
   ↓
4. Dein Rating wird im Backend gespeichert
   ↓
5. Nächster Song
```

### Die 13 Tänze (Ballroom Standard)

1. **Waltz** (Wiener Walzer) - 3/4 Takt, elegant, fließend
2. **Tango** - 2/4 Takt, dramatisch, leidenschaftlich
3. **Foxtrot** (Slowfox) - 4/4 Takt, geslide, elegant
4. **Quickstep** - Schnell, energetisch, verspielt
5. **Viennese Waltz** - Schneller 3/4 Takt, dreht sich
6. **Cha-Cha** - 4/4 Takt, verspielt, rhythmisch
7. **Samba** - Brasilianisch, schnelle Hüftbewegung
8. **Rumba** - Langsam, sinnlich, Hüftbewegung
9. **Paso Doble** - Spanisch, dramatisch, angespannt
10. **Jive** - Schnell, verspielt, fröhlich
11. **Salsa** - Lateinamerikanisch, lebhaft, rhythmisch
12. **Bachata** - Langsam, romantisch, sinnlich
13. **Discofox** - Modern, energetisch, Disco-basiert

## Gamification-Features

Während du ratings machst, verdienst du:

- **Points** (50 Punkte pro Song)
- **Streaks** (Bonus wenn du täglich spielst)
- **Levels** (Level 1-20, alle 50 Songs +1 Level)
- **Achievements** (Spezial-Trophäen für Milestones)

Das ist gamifiziert, damit es nicht langweilig wird!

## Ziel: Wie viele Songs?

**MVP-Training:** 50-100 Songs pro Tanz-Kategorie
- Das gibt uns genug Daten um ein ML-Modell zu trainieren
- Bei 30-60 Min/Tag sollten wir in 3 Wochen fertig sein

**Zeitschätzung:**
- 100 Tänze × 13 Kategorien = 1300 Ratings insgesamt
- Bei ~30 Sek pro Song + bewertung = ~10 Min für 20 Songs
- 30-60 Min/Tag = 40-80 Songs/Tag = ~2 Wochen fertig

## Local Development (Falls du es lokal testen willst)

### Installation

```bash
# Klone das Repo (nach GitHub push)
git clone https://github.com/sound2dance-app/sound2dance-app.git
cd sound2dance-app

# Installiere Dependencies
npm install

# Erstelle .env.local (siehe Template in .env.example)
cp .env.example .env.local
# Bearbeite .env.local mit Spotify Credentials
```

### Starten

```bash
npm run dev
```

Dann öffne `http://localhost:5173` im Browser.

### Build für Production

```bash
npm run build
npm run preview
```

## Wichtig: Environment Variablen

Die App braucht diese Variablen um zu funktionieren:

- `VITE_SPOTIFY_CLIENT_ID` = 422fdf951d294a9b8102792c47b1ac6c
- `VITE_SPOTIFY_CLIENT_SECRET` = 2c7887fa5caa4003b1fe496e0874871c
- `VITE_SPOTIFY_REDIRECT_URI` = https://sound2dance-app.vercel.app/callback (oder http://localhost:5173/callback für lokal)

**WICHTIG:** Nie diese Secrets in Code committen! Sie sind in `.env.local` (nicht gepusht) und in Vercel Dashboard.

## Tech-Stack (Für Neugierige)

- **Frontend:** React 18 + Vite (schneller Build)
- **Styling:** CSS (kein Framework, leicht)
- **Backend:** Firebase Realtime Database
- **Authentication:** Firebase Auth (Email + Anonymous)
- **API:** Spotify Web API (Music data)
- **Deployment:** Vercel (Auto-deploy bei Git Push)

## Troubleshooting

### "Song wird nicht abgespielt"
- Spotify API könnte langsam sein
- Versuche die Page zu neuladen
- Prüfe Console (F12) auf Fehler

### "Mein Rating wird nicht gespeichert"
- Prüfe ob du angemeldet bist
- Prüfe Internet-Verbindung
- Versuche Seite zu neuladen

### "Ich habe mein Passwort vergessen"
- Click "Forgot Password" auf Login-Screen
- Email wird dir zugeschickt

## Kontakt & Feedback

Falls du Bugs findest oder Ideen hast:
- Schreib die Idee in deine Daily Notes
- Claude wird dich kontaktieren um zu iterieren

---

**Viel Spaß beim Labelen!** 🎵💃
