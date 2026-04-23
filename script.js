// ═══════════════════ GLOBAL STORAGE (KeyValue.xyz) ═══════════════════
const KV_URL = 'https://keyvalue.xyz/v1/dcf345f4169e49e798e3/anjali_birthday_final'; 

// ═══════════════════ LOADING LOGIC ═══════════════════
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }
        confettiEffect();
        startFireworks();
    }, 2000);
});

// ═══════════════════ NOTIFICATION LOGIC ═══════════════════
function showNotification(message, icon = '✨') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 4000);
}

// ═══════════════════ GIFT TEASER ═══════════════════
function giftClick() {
    showNotification("Anjali's special gift is being prepared! Revealed soon! ✨", "🎁");
}

// ═══════════════════ COUNTDOWN LOGIC ═══════════════════
const targetDate = new Date(2026, 3, 24, 0, 0, 0).getTime(); // April 24, 2026 at 00:00:00 IST

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        document.querySelector('.countdown-card h2').innerText = "🎉 HAPPY BIRTHDAY ANJALI! 🎉";
        if (!document.body.classList.contains('birthday-mode')) {
            triggerGrandEvent();
        }
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = String(days).padStart(2, '0');
    document.getElementById('hours').innerText = String(hours).padStart(2, '0');
    document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
    document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ═══════════════════ STICKY NOTES LOGIC ═══════════════════
const stickyWall = document.getElementById('stickyWall');
const stickyNameInput = document.getElementById('stickyName');
const stickyMessageInput = document.getElementById('stickyMessage');
const noteColorInput = document.getElementById('noteColor');

let notes = [];

async function fetchNotes() {
    try {
        const response = await fetch(KV_URL);
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data)) {
                if (JSON.stringify(data) !== JSON.stringify(notes)) {
                    notes = data;
                    renderNotes();
                }
            }
        }
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
}

async function saveNotesToServer(notesToSave) {
    try {
        await fetch(KV_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(notesToSave)
        });
    } catch (error) {
        console.error("Error saving notes:", error);
    }
}

function renderNotes() {
    stickyWall.innerHTML = '';
    notes.forEach((note) => {
        const noteEl = document.createElement('div');
        noteEl.className = 'sticky-note';
        if (note.color.startsWith('images/')) {
            noteEl.classList.add('has-image');
            noteEl.style.backgroundImage = `url('${note.color}')`;
        } else {
            noteEl.style.backgroundColor = note.color;
        }
        noteEl.style.transform = `rotate(${note.rotation}deg)`;
        noteEl.innerHTML = `
            <p style="font-size: 1.4rem; margin-bottom: 1.5rem; line-height: 1.4; position: relative; z-index: 1;">"${note.message}"</p>
            <p style="font-size: 1rem; font-weight: bold; color: inherit; opacity: 0.8; text-align: right; position: relative; z-index: 1;">- ${note.name}</p>
        `;
        stickyWall.appendChild(noteEl);
    });
}

async function addStickyNote() {
    const name = stickyNameInput.value.trim();
    const message = stickyMessageInput.value.trim();
    const color = noteColorInput.value;

    if (!name || !message) {
        showNotification("Please write your name and a sweet wish! ✨", "⚠️");
        return;
    }

    const newNote = {
        name, message, color,
        rotation: Math.floor(Math.random() * 8) - 4,
        timestamp: Date.now()
    };

    notes.unshift(newNote);
    renderNotes();
    stickyNameInput.value = '';
    stickyMessageInput.value = '';
    await saveNotesToServer(notes);
    confettiEffect();
}

function confettiEffect(isGrand = false) {
    const count = isGrand ? 150 : 50;
    const particles = ['✨', '⭐', '⚪', '🟡', '🟠', '🔴', '🔵', '🟢', '🟣'];
    
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.innerText = particles[Math.floor(Math.random() * particles.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-5vh';
        confetti.style.fontSize = Math.random() * (isGrand ? 25 : 15) + 15 + 'px';
        confetti.style.zIndex = '40000';
        confetti.style.pointerEvents = 'none';
        confetti.style.transition = `transform ${Math.random() * 2 + 2}s linear, opacity 2s`;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            confetti.style.transform = `translateY(110vh) rotate(${Math.random() * 360}deg)`;
            confetti.style.opacity = '0';
        }, 10);
        
        setTimeout(() => confetti.remove(), 4000);
    }
}

// 🎆 GOOGLE-STYLE FIREWORKS 🎆
function startFireworks(isGrand = false) {
    const canvas = document.createElement('canvas');
    canvas.id = 'fireworksCanvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '30000'; // Higher than overlay
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor(x, y, color, sizeMultiplier = 1) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * (isGrand ? 12 : 8),
                y: (Math.random() - 0.5) * (isGrand ? 12 : 8)
            };
            this.alpha = 1;
            this.friction = 0.95;
            this.gravity = isGrand ? 0.05 : 0.1;
            this.size = (Math.random() * 2 + 1) * sizeMultiplier;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = isGrand ? 10 : 0;
            ctx.shadowColor = this.color;
            ctx.fill();
            ctx.restore();
        }

        update() {
            this.velocity.x *= this.friction;
            this.velocity.y *= this.friction;
            this.velocity.y += this.gravity;
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            this.alpha -= isGrand ? 0.005 : 0.01;
        }
    }

    let particles = [];
    const colors = ['#FF8E7E', '#FFD5D0', '#A9D6E5', '#B5C99A', '#FFD93D', '#FF6B9D', '#FFFFFF', '#FFD700'];

    function createFirework(x, y) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const pCount = isGrand ? 80 : 40;
        for (let i = 0; i < pCount; i++) {
            particles.push(new Particle(x, y, color, isGrand ? 1.5 : 1));
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((particle, index) => {
            if (particle.alpha > 0) {
                particle.update();
                particle.draw();
            } else {
                particles.splice(index, 1);
            }
        });

        if (particles.length > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }

    let count = 0;
    const maxCount = isGrand ? 999999 : 10; // Non-stop in Grand mode
    const intervalTime = isGrand ? 350 : 400;
    
    const interval = setInterval(() => {
        const x = Math.random() * width;
        const y = isGrand ? Math.random() * height : Math.random() * height * 0.7;
        
        createFirework(x, y);
        if (count === 0) animate();
        count++;
        if (count > maxCount) clearInterval(interval);
    }, intervalTime);
}

function triggerGrandEvent() {
    document.body.classList.add('birthday-mode');
    confettiEffect(true);
    startFireworks(true);
    
    // Play Celebration Sound (Party Horn & Cheers)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'); 
    audio.volume = 0.4;
    audio.play().catch(e => console.log("Audio play blocked by browser - requires interaction first"));

    // Create a special overlay
    const overlay = document.createElement('div');
    overlay.className = 'birthday-overlay';
    overlay.innerHTML = `
        <div class="overlay-content">
            <h1>HAPPY BIRTHDAY ANJALI! 🎂</h1>
            <p>Today is all about YOU! 💖✨</p>
            <button onclick="this.parentElement.parentElement.remove()" class="btn btn-primary">Let's Party! 🎉</button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Initial fetch and start polling every 5 seconds for new notes
fetchNotes();
setInterval(fetchNotes, 5000);

// TRIGGER ON LOAD (Normal Celebration)
window.addEventListener('load', () => {
    setTimeout(() => {
        confettiEffect();
        startFireworks();
    }, 1000);
});
