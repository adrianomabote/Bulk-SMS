# Free Bet - Roleta da Sorte

## Overview
Uma aplicação web interativa de roleta da sorte onde os usuários podem girar e ganhar prêmios virtuais.

## Project Type
Full-stack web application com:
- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, JavaScript (served by Flask)

## Recent Changes
- **2025-12-10**: Removida funcionalidade de SMS, mantida apenas a roleta
  - Simplificado app.py para servir apenas a roleta
  - Interface de roleta com sistema de tentativas
  - Efeitos visuais com confetti
  - Sistema de compartilhamento social

## Project Architecture

### File Structure
```
.
├── app.py                 # Main Flask application
├── static/
│   ├── index.html        # Página principal da roleta
│   ├── css/
│   │   └── style.css     # Estilos da roleta
│   ├── js/
│   │   └── main.js       # Lógica da roleta
│   ├── images/
│   │   └── roleta.png    # Imagem da roleta
│   └── media/
│       ├── Roleta.mp3    # Som de giro
│       └── Celebration.mp3 # Som de vitória
├── requirements.txt      # Python dependencies
└── .gitignore           # Git ignore patterns
```

### Core Functionality

#### Backend (app.py)
- **`/`**: Serve a página da roleta
- **`/roleta`**: Rota alternativa para a roleta
- **`/api/health`**: Health check endpoint

#### Frontend
- Interface de roleta interativa
- 2 tentativas grátis por usuário
- Prêmios de 10 a 10.000 Meticais
- Timer de countdown (2 minutos)
- Sistema de compartilhamento social
- Efeitos visuais com confetti
- Sons de giro e vitória

### Dependencies
- **flask==3.0.0**: Web framework

## Development

### Running Locally
- Server: Flask development server
- Host: 0.0.0.0
- Port: 5000
- Debug mode: Enabled

### Deployment
Configurado para deployment com:
- Production server: Gunicorn
- Binding: 0.0.0.0:5000
- Port reuse enabled