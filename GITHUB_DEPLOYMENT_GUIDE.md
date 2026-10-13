# GitHub + Vercel Deployment Guide

## Status
- ✅ Code lokal vorbereitet in `/tmp/sound2dance-app/`
- ✅ Git repository initialisiert mit erstem Commit
- ✅ `.env.local` erstellt (bleibt lokal, NICHT gepusht)
- ⏳ GitHub Repo muss erstellt werden
- ⏳ Code zu GitHub pushen
- ⏳ Vercel deployment einrichten

## Schritt 1: GitHub Repository erstellen

1. Gehe zu https://github.com/new
2. Repository Name: `sound2dance-app`
3. Description: "Dance Recognizer Labeling Tool - Rate music by dance type for ML training"
4. **Visibility**: Wähle "Private" (sicherer für API Keys)
5. ❌ NICHT "Initialize with README" anhaken (du hast schon code)
6. Klicke "Create repository"

## Schritt 2: Code zu GitHub pushen

Nach dem du das Repo erstellt hast, wirst du Anweisungen sehen. Führe diese aus:

```bash
cd /tmp/sound2dance-app

# Remoteverbindung hinzufügen (GitHub zeigt dir die genaue URL)
git remote add origin https://github.com/sound2dance-app/sound2dance-app.git

# Alternativ mit SSH (wenn du SSH-Key eingerichtet hast):
# git remote add origin git@github.com:sound2dance-app/sound2dance-app.git

# Auf main branch wechseln (ist normalerweise schon der default)
git branch -M main

# Zu GitHub pushen (wird evtl. um GitHub login bitten)
git push -u origin main
```

## Schritt 3: Vercel Deployment

1. Gehe zu https://vercel.com/dashboard
2. Klicke "Add New Project"
3. "Import Git Repository"
4. Autorisiere GitHub (OAuth) wenn gefragt
5. Wähle `sound2dance-app` Repository aus
6. Framework: Erkannt als "Vite" (sollte automatisch sein)
7. Root Directory: `.` (default ist OK)
8. **Environment Variables** setzen:
   ```
   VITE_SPOTIFY_CLIENT_ID = 422fdf951d294a9b8102792c47b1ac6c
   VITE_SPOTIFY_CLIENT_SECRET = <your_client_secret_here>
   VITE_SPOTIFY_REDIRECT_URI = https://sound2dance-app.vercel.app/callback
   ```
   (Firebase Vars später wenn Firebase setup vorhanden ist)

9. Klicke "Deploy"
10. Warte auf Build completion (typisch 2-3 min)
11. Deine Live URL wird angezeigt (z.B. https://sound2dance-app.vercel.app)

## Schritt 4: Auto-Deployment einrichten

Vercel erstellt automatisch eine GitHub Action, die jedes Mal deployt wenn du `git push` machst. Du musst nichts tun – es ist standardmäßig aktiv.

## Local Development

Für lokale Tests:
```bash
cd /tmp/sound2dance-app

# Dependencies installieren
npm install

# Dev-Server starten
npm run dev
```

Die App ist dann unter `http://localhost:5173` erreichbar (Vite default port).

## Wichtig: Secrets sichern

- ❌ `.env.local` wird NICHT zu GitHub gepusht (in .gitignore)
- ✅ Environment Variables in Vercel Dashboard setzen (nicht in Code)
- ✅ GitHub Repo auf "Private" setzen
- ✅ Spotify Secrets nur in Vercel setzen, nie in Code committen

