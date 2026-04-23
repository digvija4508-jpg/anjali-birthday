// ═══════════════════ NOTIFICATION LOGIC ═══════════════════
function showNotification(message, icon = '✨') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ═══════════════════ GIFT TEASER ═══════════════════
function giftClick() {
    showNotification("Anjali's special gift is being prepared! Revealed soon! ✨", "🎁");
}

// ═══════════════════ COUNTDOWN LOGIC ═══════════════════
const targetDate = new Date(2026, 3, 24, 0, 0, 0).getTime(); 

function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
        document.getElementById('days').innerText = "00";
        document.getElementById('hours').innerText = "00";
        document.getElementById('minutes').innerText = "00";
        document.getElementById('seconds').innerText = "00";
        const title = document.querySelector('.countdown-card h2');
        if (title) title.innerText = "🎉 HAPPY BIRTHDAY ANJALI! 🎉";
        if (!document.body.classList.contains('birthday-mode')) triggerGrandEvent();
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

// Use LocalStorage as primary database for stability
let notes = JSON.parse(localStorage.getItem('anjali_birthday_notes')) || [];

function renderNotes() {
    if (!stickyWall) return;
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

function addStickyNote() {
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
    localStorage.setItem('anjali_birthday_notes', JSON.stringify(notes));
    renderNotes();
    
    stickyNameInput.value = '';
    stickyMessageInput.value = '';
    showNotification("Wish posted to the wall! 🎉", "💖");
    confettiEffect();
}

function confettiEffect(isGrand = false) {
    const count = isGrand ? 30 : 10; 
    const particles = ['✨', '🌸', '💖'];
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.innerText = particles[Math.floor(Math.random() * particles.length)];
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-5vh';
        confetti.style.zIndex = '40000';
        confetti.style.pointerEvents = 'none';
        confetti.style.transition = `transform ${Math.random() * 2 + 3}s linear, opacity 1.5s`;
        document.body.appendChild(confetti);
        setTimeout(() => {
            confetti.style.transform = `translateY(110vh) rotate(360deg)`;
            confetti.style.opacity = '0';
        }, 50);
        setTimeout(() => confetti.remove(), 4500);
    }
}

function startFireworks(isGrand = false) {
    // Canvas-based particles are heavy, using a lighter simple burst logic
    const burst = document.createElement('div');
    burst.style.position = 'fixed';
    burst.style.top = Math.random() * 60 + 'vh';
    burst.style.left = Math.random() * 100 + 'vw';
    burst.style.fontSize = isGrand ? '3rem' : '1.5rem';
    burst.style.zIndex = '30000';
    burst.style.pointerEvents = 'none';
    burst.innerHTML = '✨';
    burst.style.transition = 'all 1s ease-out';
    document.body.appendChild(burst);
    
    setTimeout(() => {
        burst.style.transform = 'scale(3)';
        burst.style.opacity = '0';
    }, 50);
    setTimeout(() => burst.remove(), 1000);
    
    if (isGrand) {
        setTimeout(() => startFireworks(true), 1500);
    }
}

function triggerGrandEvent() {
    document.body.classList.add('birthday-mode');
    confettiEffect(true);
    startFireworks(true);
    
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'); 
    audio.volume = 0.3;
    audio.play().catch(() => {});

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

window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 800);
        }
        const now = new Date().getTime();
        if (targetDate - now <= 0) triggerGrandEvent();
        else {
            confettiEffect();
            startFireworks();
        }
    }, 2000);
    renderNotes();
});
