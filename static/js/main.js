
let tentativas = 0;

// Iniciar countdown
function startCountdown() {
    let timeLeft = 120; // 2 minutos
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        
        if (timeLeft <= 0) {
            clearInterval(timer);
        }
        timeLeft--;
    }, 1000);
}

function girarRoleta() {
    const roleta = document.getElementById('roleta');
    const som = document.getElementById('roletaSom');
    let anguloFinal = 0;
    let tempoGiro = 0;
    tentativas++;

    if (tentativas === 1) {
        anguloFinal = 285 + 16 * 360;
        tempoGiro = 9;
    } else if (tentativas === 2) {
        anguloFinal = 320 + 24 * 360;
        tempoGiro = 8;
    }

    som.currentTime = 0;
    som.volume = 1;
    som.play();

    roleta.style.transition = `transform ${tempoGiro}s cubic-bezier(0.1, 0.8, 0.3, 1)`;
    roleta.style.transform = `rotate(${anguloFinal}deg)`;

    document.getElementById('girarBtn').disabled = true;

    let steps = 40;
    let delay = (tempoGiro * 1000) / steps;
    let stepCount = 0;

    const volumeFade = setInterval(() => {
        if (stepCount >= steps) {
            clearInterval(volumeFade);
        } else {
            som.volume = Math.max(0, 1 - stepCount / steps);
            stepCount++;
        }
    }, delay);

    setTimeout(() => {
        som.pause();
        setTimeout(showPopUp, 500);
    }, tempoGiro * 1000);
}

function showPopUp() {
    let texto = "";
    const botaoGirar = document.getElementById('girarNovamente');
    const botaoRegistro = document.getElementById('popupButton');

    if (tentativas === 1) {
        texto = "❌ Não foi dessa vez!<br>Você tem mais 1 chance.<br>Clique no botão abaixo e gire novamente!";
        botaoGirar.style.display = "inline-block";
        botaoRegistro.style.display = "none";
    } else if (tentativas === 2) {
        texto = `
            🤑 Parabéns! Você ganhou <b>5.000 Meticais!</b><br><br>
            Para receber, registre-se na plataforma clicando no botão abaixo e <b>deposite 1 ou 5 Meticais</b> para que possamos confirmar seu número e enviar o valor.<br><br>
            ⚠️ <b>O prêmio só será entregue para quem criar uma nova conta na plataforma.</b><br>
            Se já possui uma conta, é necessário criar uma nova para receber o valor na sua carteira móvel!
        `;
        botaoGirar.style.display = "none";
        botaoRegistro.style.display = "inline-block";

        const victory = document.getElementById('victorySom');
        victory.currentTime = 0;
        victory.play();

        startConfetti();
    }

    document.getElementById('popupText').innerHTML = texto;
    document.getElementById('popup').style.display = 'block';
}

function fecharPopUpEGirar() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('girarBtn').disabled = false;
    girarRoleta();
}

function startConfetti() {
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
        if (Date.now() < end) requestAnimationFrame(frame);
    })();
}

function copyText() {
    const copyText = document.getElementById("shareText");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    document.execCommand("copy");
    alert("Mensagem copiada! Agora cole no WhatsApp ou SMS.");
}

// Iniciar countdown ao carregar a página
document.addEventListener('DOMContentLoaded', startCountdown);
