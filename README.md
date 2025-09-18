# Memory Spel 🎮

Dit is een interactieve web applicatie van het klassieke Memory kaartspel, gebouwd met Node.js en Express. Het spel daagt spelers uit om paren van identieke kaarten te vinden door ze om te draaien en te onthouden waar ze liggen.

## 📑 Inhoudsopgave

- [🎯 Over dit project](#-over-dit-project)
- [✨ Features](#-features)
- [🎮 Hoe speel je Memory?](#-hoe-speel-je-memory)
- [📥 Hoe het te installeren](#-hoe-het-te-installeren)
- [📁 Hoe het project is opgebouwd](#-hoe-het-project-is-opgebouwd)

## 🎯 Over dit project

Dit Memory spel is ontwikkeld als schoolproject en biedt een moderne twist op het traditionele kaartspel. Spelers kunnen kiezen uit 8 verschillende thema's (dieren, voedsel, gezichten, voertuigen, planten, symbolen, activiteiten en objecten) en verschillende moeilijkheidsgraden. Het spel houdt je score bij, heeft een timer, en bevat geluideffecten voor een betere spelervaring.

## ✨ Features

- 🎨 **8 verschillende thema's**: Dieren, voedsel, gezichten, voertuigen, planten, symbolen, activiteiten en objecten
- 🎚️ **Meerdere moeilijkheidsgraden**: Van easy tot extreme
- ⏱️ **Timer functie**: Houd bij hoe snel je het spel kunt voltooien
- 🔊 **Geluideffecten**: Verschillende geluiden voor kaart omdraaien, succes en falen
- 📱 **Responsive design**: Speelbaar op desktop, tablet en mobiel
- 🎊 **Confetti animatie**: Viering wanneer je het spel wint
- 💾 **Score bijhouden**: Zie hoeveel zetten je nodig had
- 🎵 **Audio feedback**: Verschillende geluiden voor verschillende acties

## 🎮 Hoe speel je Memory?

1. **Kies een thema** dat je leuk vindt uit de 8 beschikbare opties
2. **Selecteer moeilijkheidsgraad** die past bij jouw niveau
3. **Klik op kaarten** om ze om te draaien en de afbeelding te zien
4. **Onthoud de locaties** van de verschillende afbeeldingen
5. **Vind de paren** door twee identieke kaarten na elkaar om te draaien
6. **Win het spel** door alle paren te vinden in zo min mogelijk zetten!

## 📥 Hoe het te installeren

Volg deze stappen om het project op te zetten nadat je het hebt gedownload van Git:

### 📋 Wat je nodig hebt

- [Node.js](https://nodejs.org/en/download/current)

### 🔧 Stappen

1. **Download het project**

   ```
   git clone https://github.com/robodin08/semester-1-game.git
   cd semester-1-game
   ```

2. **Installeer alle benodigde packages**

   ```
   npm ci
   ```

3. **Build de CSS (TailwindCSS)**

   ```
   npm run build:tailwind
   ```

4. **Start de applicatie**

   Voor development (herstart automatisch als je iets verandert):

   ```
   npm run dev
   ```

   Of gewoon starten:

   ```
   npm start
   ```

5. **Open het spel**
   Ga in je browser naar:
   ```
   http://localhost:3000
   ```

## 📁 Hoe het project is opgebouwd

```
Memory/
├── public/                # Client-side bestanden (statisch)
│   ├── assets/            # Media bestanden
│   │   ├── icons/         # App icoontjes (favicon, etc.)
│   │   ├── images/        # Spel afbeeldingen (kaart achterkanten)
│   │   ├── sounds/        # Audio bestanden (flip, success, fail, win)
│   │   └── themes/        # 8 thema mappen met SVG pictogrammen
│   │       ├── animals/   # Dieren thema
│   │       ├── food/      # Voedsel thema
│   │       ├── faces/     # Gezichten thema
│   │       └── ...        # Andere thema's
│   ├── css/               # Gecompileerde CSS bestanden
│   └── js/                # Client-side JavaScript
│       ├── home.js        # Homepage logica
│       ├── play.js        # Spel logica
│       └── components/    # Herbruikbare JS modules
├── src/                   # Server-side code (Node.js)
│   ├── app.js             # Express server setup
│   ├── memory.js          # Spel API endpoints
│   ├── config.js          # App configuratie
│   ├── sessions.js        # Sessie management
│   └── styles/            # TailwindCSS bronbestanden
├── views/                 # HTML templates (Nunjucks)
│   ├── home.html          # Homepage template
│   ├── play.html          # Spel pagina template
│   └── components/        # Template componenten
```

---

Veel plezier met spelen! 🎮✨
