const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

const AUTH_KEYWORDS = [
    'auth', 'authentication', 'authorize', 'authly', 'login', 'logout',
    'password', 'passphrase', 'key', 'token', '2FA', 'MFA',
    'credential', 'signon', 'signin', 'signup', 'identity',
    'verify', 'validation', 'session', 'user', 'username',
    'security', 'unlock', 'lock', 'biometric', 'fingerprint',
    'faceid', 'captcha', 'challenge', 'trust', 'handshake'
];

let floatingWords = [];
let startTime = null;
let duration = 2000;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createFloatingWords() {
    floatingWords = AUTH_KEYWORDS.map(word => ({
        text: word,
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 15,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.5 + 0.2
    }));
}

function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
}

function animate(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);


    floatingWords.forEach(word => {
        ctx.save();
        ctx.globalAlpha = word.opacity * (1 - progress);
        ctx.fillStyle = "#FF6347";
        ctx.font = `${word.size}px Courier New`;
        ctx.textAlign = "center";
        ctx.fillText(word.text, word.x, word.y);

        
        word.y -= word.speed;
        ctx.restore();
    });

    
    if (progress > 0.6) {
        const fade = easeOutCubic((progress - 0.6) / 0.4);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        ctx.save();
        ctx.globalAlpha = fade;

        
        const gradient = ctx.createLinearGradient(cx - 150, cy, cx + 150, cy);
        gradient.addColorStop(0, "#FF4500"); 
        gradient.addColorStop(1, "#FF6347"); 

        ctx.fillStyle = gradient;
        ctx.font = `bold ${Math.floor(80 + fade * 20)}px Oswald, sans-serif`;
        ctx.textAlign = "center";
        ctx.shadowColor = "#FF4500";
        ctx.shadowBlur = 25;
        ctx.fillText("Authly", cx, cy);
        ctx.restore();
    }


    overlay.innerText = progress < 1 ? "Authenticating..." : "Ready!";


    if (progress < 1) {
        requestAnimationFrame(animate);
    } else {
        setTimeout(() => {
            window.location.href = "/home.html";
        }, 100);
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
createFloatingWords();
requestAnimationFrame(animate);
