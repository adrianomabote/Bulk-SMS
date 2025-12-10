# Roleta da Sorte (Lucky Roulette)

## Overview

A web-based roulette wheel game called "Roleta da Sorte" (Lucky Roulette) designed for Mozambique users. Players get 2 free spins to win prizes in Meticais (MT), with a 2-minute countdown timer.

## Project Type
Static web application with Flask backend for serving files.

**Languages**: HTML, CSS, JavaScript (frontend), Python (backend)

## Recent Changes
- **2025-12-10**: Removed all SMS/Bulk SMS functionality
  - Removed app.py (SMS version), templates/, test files
  - Created new lightweight Flask app to serve roulette game
  - Configured "Roleta da Sorte" workflow on port 5000
  - Updated requirements.txt with minimal dependencies

## Project Architecture

### File Structure
```
.
├── app.py              # Simple Flask app serving static files
├── requirements.txt    # Minimal dependencies (Flask + Gunicorn)
├── .gitignore         # Git ignore patterns
└── static/
    ├── index.html      # Main roulette game page
    ├── css/
    │   └── style.css   # Roulette styling
    ├── js/
    │   ├── main.js     # Game logic & animations
    │   └── confetti.browser.min.js  # Celebration effects
    ├── images/
    │   └── roleta.png  # Roulette wheel image (Meticais prizes)
    └── media/
        ├── Roleta.mp3  # Spinning sound
        └── Celebration.mp3  # Victory sound
```

### Core Features

#### Frontend (static/index.html)
- Beautiful roulette wheel with 16 color-coded prize segments
- Prize amounts: 10 MT, 100 MT, 500 MT, 1.000 MT, 5.000 MT, 10.000 MT
- "BOA SORTE" (Good Luck) segments for fun variety
- 2 free spin attempts with countdown timer (2 minutes)
- Animated spin with realistic physics
- Sound effects (spin + celebration)
- Confetti explosion on winning
- Pop-up result display with registration CTA
- WhatsApp share functionality
- Mobile responsive design

#### Backend (app.py)
- Lightweight Flask app
- Serves static files from `/static` folder
- Simple health check endpoint at `/api/health`
- Runs on 0.0.0.0:5000 (accessible via Replit preview)

### Dependencies
- **flask==3.0.0**: Web framework for serving files
- **gunicorn==21.2.0**: Production WSGI server

## Development

### Running Locally
The application runs via the "Roleta da Sorte" workflow:
- Server: Flask development server
- Host: 0.0.0.0
- Port: 5000
- Debug mode: Enabled

### Deployment
Configured for autoscale deployment with Gunicorn:
- Production server: Gunicorn
- Binding: 0.0.0.0:5000
- Port reuse enabled

## Game Mechanics

### Spinning Logic
- Users get exactly 2 free spins (tracked in client-side JavaScript)
- Each spin rotates the wheel to a random prize
- Pre-defined rotation angles ensure specific outcomes
- 2-minute countdown timer for sense of urgency
- After 2 spins or timeout, button is disabled

### Prize Distribution
The roulette has 16 segments:
- 6 segments with cash prizes (10 MT, 100 MT, 500 MT, 1.000 MT, 5.000 MT, 10.000 MT)
- 10 segments with "BOA SORTE" (Good Luck) messages for engagement

### User Flow
1. User sees intro message about 2 free spins
2. User clicks "GIRAR" (SPIN) button
3. Wheel rotates with sound effect
4. Result displays in pop-up with prize amount
5. Pop-up includes "Registre-se Agora" (Register Now) CTA
6. User can spin again or share on WhatsApp

## User Preferences
- Portuguese language (Brazilian/Mozambican)
- Engaging, colorful design with gold accents
- Mobile-first responsive layout
- Gamification elements (confetti, sounds, emojis)
- Regional relevance (Meticais, WhatsApp integration, Placard link)

## Notes
- Game is purely frontend-based simulation (no backend logic for winners)
- Prêmios mostrados não são efetivamente creditados (simulation only)
- All game logic runs in browser
- No user data collected or stored
- Production link in game points to external platform (Placard)
