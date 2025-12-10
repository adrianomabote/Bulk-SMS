
let tentativas = 0;
const premios = [10, 100, 500, 1000, 5000, 10000, "BOA SORTE", "BOA SORTE"];
const angulosPremios = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

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
    
    tentativas++;

    // Escolhe um prêmio aleatório
    const indiceAleatorio = Math.floor(Math.random() * premios.length);
    const premioAtual = premios[indiceAleatorio];
    const anguloSegmento = angulosPremios[indiceAleatorio];
    
    // Guarda o prêmio para usar no pop-up
    window.premioAtual = premioAtual;
    
    // Calcula o ângulo final (várias voltas + ângulo do prêmio)
    const voltasAdicionais = tentativas === 1 ? 16 : 24;
    const anguloFinal = anguloSegmento + voltasAdicionais * 360;
    const tempoGiro = tentativas === 1 ? 9 : 8;

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
    const premioAtual = window.premioAtual;

    if (premioAtual === "BOA SORTE") {
        if (tentativas === 1) {
            texto = "😅 Boa sorte próxima vez!<br>Você tem mais 1 chance.<br>Clique no botão abaixo e gire novamente!";
        } else {
            texto = "😅 Boa sorte!<br>Você esgotou suas 2 tentativas grátis.<br>Tente novamente mais tarde!";
        }
        botaoGirar.style.display = tentativas === 1 ? "inline-block" : "none";
        botaoRegistro.style.display = "none";
    } else {
        // Tem um prêmio em dinheiro
        const valorPremio = premioAtual;
        
        if (tentativas === 1) {
            texto = `
                🎉 Parabéns! Você ganhou <b>${valorPremio} Meticais!</b><br><br>
                Você tem mais 1 chance para girar e ganhar ainda mais!<br>
                Clique abaixo para fazer sua segunda tentativa!
            `;
            botaoGirar.style.display = "inline-block";
            botaoRegistro.style.display = "none";
        } else {
            texto = `
                🤑 Parabéns! Você ganhou <b>${valorPremio} Meticais!</b><br><br>
                Para receber, registre-se na plataforma clicando no botão abaixo e <b>deposite 1 ou 5 Meticais</b> para que possamos confirmar seu número e enviar o valor.<br><br>
                ⚠️ <b>O prêmio só será entregue para quem criar uma nova conta na plataforma.</b><br>
                Se já possui uma conta, é necessário criar uma nova para receber o valor na sua carteira móvel!
            `;
            botaoGirar.style.display = "none";
            botaoRegistro.style.display = "inline-block";

            const victory = document.getElementById('victorySom');
            victory.currentTime = 0;
            victory.volume = 0.5;
            victory.play();

            startConfetti();
        }
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
