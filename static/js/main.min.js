
let tentativas = 0;

// Sempre reseta as tentativas ao carregar a página
function resetarTentativas() {
    tentativas = 0;
}

function fecharPopupERegistrar() {
    document.getElementById('popup').style.display = 'none';
}

// Mapeamento da roleta (12 segmentos de 30° cada, começando do topo em sentido horário)
// A seta está na posição 3 horas (90° do topo)
// Centro de cada segmento a partir do topo (12h) em sentido horário
const SEGMENTOS = {
    '500_verde': 15,        // Segmento 1
    'BOA_SORTE_1': 45,      // Segmento 2 (vermelho superior) 
    '500_azul': 75,         // Segmento 3
    '10000': 105,           // Segmento 4
    '5000_azul': 135,       // Segmento 5 - ESTE É O 5.000!
    '1000_laranja': 165,    // Segmento 6
    'BOA_SORTE_2': 195,     // Segmento 7 (rosa)
    '5000_verde': 225,      // Segmento 8
    'BOA_SORTE_3': 255,     // Segmento 9 (vermelho inferior)
    '1000_vermelho': 285,   // Segmento 10
    '10': 315,              // Segmento 11
    '100': 345              // Segmento 12
};

// Audio Context para sons
let audioContext = null;

function getAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Som de spinning (cliques rápidos)
function playSpinSound(duration) {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime;
    const endTime = startTime + duration;
    
    let clickCount = 0;
    const maxClicks = 60;
    
    function scheduleClick(time, frequency, volume) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'square';
        osc.frequency.value = frequency;
        
        gain.gain.setValueAtTime(volume, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        
        osc.start(time);
        osc.stop(time + 0.05);
    }
    
    // Cria cliques que desaceleram
    for (let i = 0; i < maxClicks; i++) {
        const progress = i / maxClicks;
        const delay = Math.pow(progress, 2) * duration;
        const frequency = 800 - (progress * 400);
        const volume = 0.3 * (1 - progress * 0.7);
        
        if (startTime + delay < endTime) {
            scheduleClick(startTime + delay, frequency, volume);
        }
    }
}

// Som de vitória (fanfarra)
function playVictorySound() {
    const ctx = getAudioContext();
    const startTime = ctx.currentTime;
    
    const notes = [
        { freq: 523.25, time: 0, duration: 0.15 },
        { freq: 659.25, time: 0.15, duration: 0.15 },
        { freq: 783.99, time: 0.3, duration: 0.15 },
        { freq: 1046.50, time: 0.45, duration: 0.4 },
        { freq: 783.99, time: 0.55, duration: 0.15 },
        { freq: 1046.50, time: 0.7, duration: 0.5 }
    ];
    
    notes.forEach(note => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        
        const noteStart = startTime + note.time;
        gain.gain.setValueAtTime(0.3, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.duration);
        
        osc.start(noteStart);
        osc.stop(noteStart + note.duration);
    });
}

// Iniciar countdown
function startCountdown() {
    let timeLeft = 120;
    
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
    
    tentativas++;

    let premioAtual;
    let anguloSegmento;
    
    if (tentativas === 1) {
        // Primeira tentativa: BOA SORTE (segmento 2, centro em 45°)
        premioAtual = "BOA SORTE";
        anguloSegmento = SEGMENTOS.BOA_SORTE_1; // 45°
    } else {
        // Segunda tentativa: 5.000 (segmento 5, centro em 135°)
        premioAtual = 5000;
        anguloSegmento = SEGMENTOS['5000_azul']; // 135°
    }
    
    window.premioAtual = premioAtual;
    
    // Calcula o ângulo de rotação: seta está em 90°, queremos que o segmento fique lá
    // Fórmula: rotação = 90° - posição_do_segmento (+ voltas extras)
    const voltasAdicionais = tentativas === 1 ? 8 : 12;
    let offset = 90 - anguloSegmento;
    if (offset < 0) offset += 360;
    const anguloFinal = (voltasAdicionais * 360) + offset;
    const tempoGiro = tentativas === 1 ? 7 : 6;

    // Toca som de spinning
    playSpinSound(tempoGiro);

    roleta.style.transition = `transform ${tempoGiro}s cubic-bezier(0.1, 0.8, 0.3, 1)`;
    roleta.style.transform = `rotate(${anguloFinal}deg)`;

    document.getElementById('girarBtn').disabled = true;

    setTimeout(() => {
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
            texto = "❌ Não foi dessa vez!<br>Você tem mais 1 chance.<br>Clique no botão abaixo e gire novamente!";
        } else {
            texto = "😅 Boa sorte!<br>Você esgotou suas 2 tentativas grátis.<br>Tente novamente mais tarde!";
        }
        botaoGirar.style.display = tentativas === 1 ? "inline-block" : "none";
        botaoRegistro.style.display = "none";
    } else {
        const valorPremio = premioAtual.toLocaleString('pt-BR');
        
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

            // Toca som de vitória
            playVictorySound();
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
    if (typeof confetti === 'undefined') return;
    
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
document.addEventListener('DOMContentLoaded', function() {
    resetarTentativas();
    startCountdown();
    document.getElementById('girarBtn').disabled = false;
    document.getElementById('roleta').style.transition = 'none';
    document.getElementById('roleta').style.transform = 'rotate(0deg)';
});
