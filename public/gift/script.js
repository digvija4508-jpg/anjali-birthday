const wall = document.getElementById('infinity-wall');
const lockScreen = document.getElementById('lock-screen');
const passInput = document.getElementById('pass-input');
const unlockBtn = document.getElementById('unlock-btn');
const errorMsg = document.getElementById('error-msg');
const bgMusic = document.getElementById('bg-music');

let currentX = -1000, currentY = -1000;
let isDragging = false;
let startX, startY, lastX, lastY, velocityX = 0, velocityY = 0;

const COLS = 12;
const COL_WIDTH = 400;
const GAP = 15;
const TOTAL_W = COLS * (COL_WIDTH + GAP);

let allMedia = [];
let layoutMap = [];
let totalWallHeight = 0;
let renderedCards = new Map();
const SECTOR_SIZE = 2000;
let sectors = {};

// BLOCK ALL STEALING ACTIONS
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

unlockBtn.addEventListener('click', checkPass);
passInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkPass(); });

function checkPass() {
    if (passInput.value === 'Anjali22!') {
        bgMusic.play().catch(e => console.log("Music blocked:", e));
        lockScreen.style.opacity = '0';
        setTimeout(() => { lockScreen.style.display = 'none'; }, 1000);
        
        // START LOADING SEQUENCE
        const collectingScreen = document.getElementById('collecting-screen');
        const progressBar = document.getElementById('progress-bar');
        collectingScreen.style.display = 'flex';
        
        setTimeout(() => { progressBar.style.width = '100%'; }, 100);
        
        setTimeout(() => {
            collectingScreen.style.opacity = '0';
            setTimeout(() => { 
                collectingScreen.style.display = 'none'; 
                initQuantum(); // LOAD WALL AFTER PRE-LOAD
            }, 1000);
        }, 4500);
    } else {
        errorMsg.style.display = 'block';
        passInput.value = '';
    }
}

const THEMES = [
    { title: "LEISURE TIME", bg: "rgba(255, 240, 245, 0.4)" },
    { title: "CUTIE VIBES", bg: "rgba(240, 255, 240, 0.4)" },
    { title: "TRAVEL DIARIES", bg: "rgba(240, 248, 255, 0.4)" },
    { title: "FAMILY LOVE", bg: "rgba(255, 250, 240, 0.4)" },
    { title: "MAGIC MOMENTS", bg: "rgba(245, 245, 255, 0.4)" }
];

async function initQuantum() {
    try {
        const res = await fetch('/media/index.json');
        const occasions = await res.json();
        allMedia = occasions.flatMap(o => o.items);
        const colHeights = new Array(COLS).fill(0);
        
        allMedia.forEach((item, index) => {
            if (index > 0 && index % 25 === 0) {
                const theme = THEMES[Math.floor(index / 25) % THEMES.length];
                const col = colHeights.indexOf(Math.min(...colHeights));
                const entry = { x: col * (COL_WIDTH + GAP), y: colHeights[col], w: COL_WIDTH, h: 600, isTheme: true, theme, id: `t-${index}` };
                layoutMap.push(entry);
                addToSector(entry);
                colHeights[col] += 600 + GAP;
            }
            const col = colHeights.indexOf(Math.min(...colHeights));
            const aspect = (item.height && item.width) ? (item.height / item.width) : 1.33;
            const entry = { x: col * (COL_WIDTH + GAP), y: colHeights[col], w: COL_WIDTH, h: Math.floor(COL_WIDTH * aspect), item, id: `m-${index}` };
            layoutMap.push(entry);
            addToSector(entry);
            colHeights[col] += entry.h + GAP;
            
            if (Math.random() > 0.9) {
                const colS = Math.floor(Math.random() * COLS);
                const sEntry = { x: colS * (COL_WIDTH + GAP) + (Math.random()*200-100), y: colHeights[colS] + (Math.random()*100), w: 120, h: 120, isSticker: true, type: Math.random() > 0.5 ? 'butterfly' : 'flower', id: `s-${index}` };
                layoutMap.push(sEntry);
                addToSector(sEntry);
            }
        });
        totalWallHeight = Math.max(...colHeights);
        renderLoop();
    } catch (err) { console.error(err); }
}

function addToSector(entry) {
    const sx = Math.floor(entry.x / SECTOR_SIZE);
    const sy = Math.floor(entry.y / SECTOR_SIZE);
    const key = `${sx},${sy}`;
    if (!sectors[key]) sectors[key] = [];
    sectors[key].push(entry);
}

function renderLoop() {
    const viewW = window.innerWidth; const viewH = window.innerHeight;
    const worldX = -currentX; const worldY = -currentY;
    const buffer = 1000;
    const visibleKeys = new Set();
    for (let tx = -1; tx <= 1; tx++) {
        for (let ty = -1; ty <= 1; ty++) {
            const offsetX = tx * TOTAL_W; const offsetY = ty * totalWallHeight;
            const startSx = Math.floor((worldX - buffer - offsetX) / SECTOR_SIZE);
            const endSx = Math.floor((worldX + viewW + buffer - offsetX) / SECTOR_SIZE);
            const startSy = Math.floor((worldY - buffer - offsetY) / SECTOR_SIZE);
            const endSy = Math.floor((worldY + viewH + buffer - offsetY) / SECTOR_SIZE);
            for (let sx = startSx; sx <= endSx; sx++) {
                for (let sy = startSy; sy <= endSy; sy++) {
                    const sKey = `${sx},${sy}`;
                    if (sectors[sKey]) {
                        sectors[sKey].forEach(entry => {
                            const realX = entry.x + offsetX; const realY = entry.y + offsetY;
                            if (realX + entry.w > worldX - buffer && realX < worldX + viewW + buffer &&
                                realY + entry.h > worldY - buffer && realY < worldY + viewH + buffer) {
                                const key = `${entry.id}-${tx}-${ty}`; visibleKeys.add(key);
                                if (!renderedCards.has(key)) createCard(key, entry, realX, realY);
                            }
                        });
                    }
                }
            }
        }
    }
    for (const [key, card] of renderedCards.entries()) { if (!visibleKeys.has(key)) { card.remove(); renderedCards.delete(key); } }
    wall.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
}

function createCard(key, entry, x, y) {
    const card = document.createElement('div');
    if (entry.isSticker) {
        card.className = `paper-sticker ${entry.type}`;
        card.innerHTML = entry.type === 'butterfly' ? '🦋' : '🌸';
        card.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
    } else if (entry.isTheme) {
        card.className = 'theme-card';
        card.style.background = entry.theme.bg;
        card.innerHTML = `<div class="theme-content"><h2 class="theme-title">${entry.theme.title}</h2></div>`;
    } else {
        card.className = 'memory-card';
        const wrapper = document.createElement('div');
        wrapper.className = 'image-wrapper';
        if (entry.item.type === 'photo') {
            const img = new Image(); img.src = `/media/${entry.item.name}`; img.loading = 'lazy'; 
            img.draggable = false; // ANTI-DRAG
            wrapper.appendChild(img);
        } else {
            const video = document.createElement('video');
            video.src = `/media/${entry.item.name}`; video.autoplay = true; video.muted = true; video.loop = true; video.playsInline = true;
            video.draggable = false; // ANTI-DRAG
            wrapper.appendChild(video);
        }
        card.appendChild(wrapper);
        if (Math.random() > 0.5) {
            const tape = document.createElement('div'); tape.className = 'washi-tape';
            tape.style.top = `${Math.random() > 0.5 ? '-15px' : 'auto'}`;
            tape.style.bottom = `${tape.style.top === '-15px' ? 'auto' : '-15px'}`;
            tape.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
            card.appendChild(tape);
        }
    }
    card.style.left = `${x}px`; card.style.top = `${y}px`;
    if (!entry.isSticker) { card.style.width = `${entry.w}px`; card.style.height = `${entry.h}px`; }
    wall.appendChild(card); renderedCards.set(key, card);
}

function applyMomentum() {
    if (!isDragging) {
        currentX += velocityX; currentY += velocityY;
        velocityX *= 0.95; velocityY *= 0.95;
        if (currentX > 0) currentX -= TOTAL_W;
        if (currentX < -TOTAL_W) currentX += TOTAL_W;
        if (currentY > 0) currentY -= totalWallHeight;
        if (currentY < -totalWallHeight) currentY += totalWallHeight;
        renderLoop();
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) requestAnimationFrame(applyMomentum);
    }
}

function startDrag(e) {
    isDragging = true;
    const pos = e.touches ? e.touches[0] : e;
    startX = pos.pageX - currentX; startY = pos.pageY - currentY;
    lastX = pos.pageX; lastY = pos.pageY;
    velocityX = 0; velocityY = 0;
}

function moveDrag(e) {
    if (!isDragging) return;
    const pos = e.touches ? e.touches[0] : e;
    velocityX = pos.pageX - lastX; velocityY = pos.pageY - lastY;
    lastX = pos.pageX; lastY = pos.pageY;
    currentX = pos.pageX - startX; currentY = pos.pageY - startY;
    renderLoop();
}

function endDrag() { isDragging = false; requestAnimationFrame(applyMomentum); }

window.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', moveDrag);
window.addEventListener('mouseup', endDrag);
window.addEventListener('touchstart', startDrag, { passive: false });
window.addEventListener('touchmove', (e) => { moveDrag(e); e.preventDefault(); }, { passive: false });
window.addEventListener('touchend', endDrag);

