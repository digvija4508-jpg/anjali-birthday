const wall = document.getElementById('infinity-wall');
const lockScreen = document.getElementById('lock-screen');
const passInput = document.getElementById('pass-input');
const unlockBtn = document.getElementById('unlock-btn');
const errorMsg = document.getElementById('error-msg');
const bgMusic = document.getElementById('bg-music');

let currentX = 0, currentY = 0;
let currentScale = 1;
let isDragging = false;
let startX, startY, lastX, lastY, velocityX = 0, velocityY = 0;

const COLS = 25;
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

async function checkPass() {
    if (passInput.value === 'Anjali22!') {
        bgMusic.play().catch(e => console.log("Music blocked:", e));
        lockScreen.style.opacity = '0';
        setTimeout(() => { lockScreen.style.display = 'none'; }, 1000);
        
        const collectingScreen = document.getElementById('collecting-screen');
        const progressBar = document.getElementById('progress-bar');
        const progressText = document.getElementById('loading-progress');
        collectingScreen.style.display = 'flex';
        
        try {
            const res = await fetch('/unique_media.json');
            const items = await res.json();
            allMedia = items;
            
            const totalItems = allMedia.length;
            let loadedItems = 0;
            if(progressText) progressText.innerText = '0 / ' + totalItems + ' downloaded';

            const loadPromises = allMedia.map(item => {
                return new Promise(resolve => {
                    if (item.type === 'photo') {
                        const img = new Image();
                        img.onload = img.onerror = () => {
                            loadedItems++;
                            if(progressText) progressText.innerText = loadedItems + ' / ' + totalItems + ' downloaded';
                            if(progressBar) progressBar.style.width = ((loadedItems/totalItems)*100) + '%';
                            resolve();
                        };
                        img.src = '/media/' + item.name;
                    } else {
                        const video = document.createElement('video');
                        video.onloadeddata = video.onerror = () => {
                            loadedItems++;
                            if(progressText) progressText.innerText = loadedItems + ' / ' + totalItems + ' downloaded';
                            if(progressBar) progressBar.style.width = ((loadedItems/totalItems)*100) + '%';
                            resolve();
                        };
                        video.src = '/media/' + item.name;
                    }
                });
            });

            await Promise.all(loadPromises);
            
            collectingScreen.style.opacity = '0';
            setTimeout(() => { 
                collectingScreen.style.display = 'none'; 
                initQuantum(); 
            }, 1000);

        } catch (err) {
            if(progressText) progressText.innerText = "Error loading memories.";
            console.error(err);
        }
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
        const colHeights = new Array(COLS).fill(0);
        allMedia.sort(() => Math.random() - 0.5);

        allMedia.forEach((item, index) => {
            if (index > 0 && index % 25 === 0) {
                const theme = THEMES[Math.floor(index / 25) % THEMES.length];
                const col = colHeights.indexOf(Math.min(...colHeights));
                const entry = { x: col * (COL_WIDTH + GAP), y: colHeights[col], w: COL_WIDTH, h: 600, isTheme: true, theme, id: 't-' + index };
                layoutMap.push(entry);
                addToSector(entry);
                colHeights[col] += 600 + GAP;
            }
            const col = colHeights.indexOf(Math.min(...colHeights));
            const aspect = (item.height && item.width) ? (item.height / item.width) : 1.33;
            const entry = { x: col * (COL_WIDTH + GAP), y: colHeights[col], w: COL_WIDTH, h: Math.floor(COL_WIDTH * aspect), item, id: 'm-' + index };
            layoutMap.push(entry);
            addToSector(entry);
            colHeights[col] += entry.h + GAP;
            
            if (Math.random() > 0.9) {
                const colS = Math.floor(Math.random() * COLS);
                const sEntry = { x: colS * (COL_WIDTH + GAP) + (Math.random()*200-100), y: colHeights[colS] + (Math.random()*100), w: 120, h: 120, isSticker: true, type: Math.random() > 0.5 ? 'butterfly' : 'flower', id: 's-' + index };
                layoutMap.push(sEntry);
                addToSector(sEntry);
            }
        });
        totalWallHeight = Math.max(...colHeights);

        const scaleX = window.innerWidth / TOTAL_W;
        const scaleY = window.innerHeight / totalWallHeight;
        currentScale = Math.min(scaleX, scaleY) * 0.95; 
        
        currentX = (window.innerWidth / currentScale - TOTAL_W) / 2;
        currentY = (window.innerHeight / currentScale - totalWallHeight) / 2;

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
    const viewW = window.innerWidth / currentScale; 
    const viewH = window.innerHeight / currentScale;
    const worldX = -currentX / currentScale; 
    const worldY = -currentY / currentScale;
    const buffer = 1000 / currentScale;
    const visibleKeys = new Set();
    
    const startSx = Math.floor((worldX - buffer) / SECTOR_SIZE);
    const endSx = Math.floor((worldX + viewW + buffer) / SECTOR_SIZE);
    const startSy = Math.floor((worldY - buffer) / SECTOR_SIZE);
    const endSy = Math.floor((worldY + viewH + buffer) / SECTOR_SIZE);
    for (let sx = startSx; sx <= endSx; sx++) {
        for (let sy = startSy; sy <= endSy; sy++) {
            const sKey = sx + ',' + sy;
            if (sectors[sKey]) {
                sectors[sKey].forEach(entry => {
                    if (entry.x + entry.w > worldX - buffer && entry.x < worldX + viewW + buffer &&
                        entry.y + entry.h > worldY - buffer && entry.y < worldY + viewH + buffer) {
                        const key = entry.id; visibleKeys.add(key);
                        if (!renderedCards.has(key)) createCard(key, entry, entry.x, entry.y);
                    }
                });
            }
        }
    }
    
    for (const [key, card] of renderedCards.entries()) { if (!visibleKeys.has(key)) { card.remove(); renderedCards.delete(key); } }
    wall.style.transform = 'scale(' + currentScale + ') translate3d(' + currentX + 'px, ' + currentY + 'px, 0)';
    wall.style.transformOrigin = '0 0';
}

function createCard(key, entry, x, y) {
    const card = document.createElement('div');
    if (entry.isSticker) {
        card.className = `paper-sticker ${entry.type}`;
        card.innerHTML = entry.type === 'butterfly' ? '' : '\u1F338';
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
            video.src = '/media/' + entry.item.name; 
            video.muted = true; video.loop = true; video.playsInline = true;
            video.pause();
            video.draggable = false;
            wrapper.appendChild(video);
            
            card.addEventListener('mouseenter', () => video.play().catch(()=>{}));
            card.addEventListener('mouseleave', () => video.pause());
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
        // No wrapping to prevent duplicate loop
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


window.addEventListener('wheel', (e) => {
    e.preventDefault();
    const zoomFactor = 0.001;
    const delta = -e.deltaY * zoomFactor;
    
    const mouseX = e.pageX;
    const mouseY = e.pageY;
    
    // Convert mouse position to world coordinates
    const worldMouseX = (mouseX / currentScale) - currentX;
    const worldMouseY = (mouseY / currentScale) - currentY;
    
    const scaleChange = 1 + delta;
    let newScale = currentScale * scaleChange;
    if (newScale < 0.02) newScale = 0.02;
    if (newScale > 5) newScale = 5;
    
    // Adjust currentX and currentY to keep the mouse pointing at the same world coordinates
    currentX = (mouseX / newScale) - worldMouseX;
    currentY = (mouseY / newScale) - worldMouseY;
    
    currentScale = newScale;
    renderLoop();
}, { passive: false });
