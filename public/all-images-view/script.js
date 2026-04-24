const gridContainer = document.getElementById('mosaic-grid');
const preloader = document.getElementById('preloader');
const progressText = document.getElementById('loading-progress');

async function loadAllMedia() {
    try {
        const response = await fetch('/unique_media.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const items = await response.json();
        const totalItems = items.length;
        let loadedItems = 0;
        
        console.log(`Loading ${totalItems} items...`);
        progressText.innerText = `0 / ${totalItems} downloaded`;

        items.sort(() => Math.random() - 0.5);

        const fragment = document.createDocumentFragment();
        const loadPromises = [];

        items.forEach(item => {
            const cell = document.createElement('div');
            cell.className = 'media-cell';
            
            const aspect = (item.height && item.width) ? (item.width / item.height) : 1;
            if (aspect > 1.5) {
                cell.style.gridColumnEnd = 'span 2'; 
            } else if (aspect < 0.7) {
                cell.style.gridRowEnd = 'span 2'; 
            }

            let mediaElement;
            const loadPromise = new Promise((resolve) => {
                if (item.type === 'photo') {
                    mediaElement = document.createElement('img');
                    mediaElement.onload = () => {
                        loadedItems++;
                        progressText.innerText = `${loadedItems} / ${totalItems} downloaded`;
                        resolve();
                    };
                    mediaElement.onerror = () => {
                        loadedItems++;
                        progressText.innerText = `${loadedItems} / ${totalItems} downloaded (Error loading)`;
                        resolve(); // Resolve anyway so it doesn't block
                    };
                    mediaElement.src = `/media/${item.name}`;
                    // We don't use lazy loading because we want to preload everything
                } else {
                    mediaElement = document.createElement('video');
                    mediaElement.onloadeddata = () => {
                        loadedItems++;
                        progressText.innerText = `${loadedItems} / ${totalItems} downloaded`;
                        resolve();
                    };
                    mediaElement.onerror = () => {
                        loadedItems++;
                        progressText.innerText = `${loadedItems} / ${totalItems} downloaded (Error loading)`;
                        resolve();
                    };
                    mediaElement.src = `/media/${item.name}`;
                    mediaElement.muted = true;
                    mediaElement.loop = true;
                    mediaElement.playsInline = true;
                    // Do NOT autoplay to save massive amounts of CPU/RAM
                    mediaElement.pause();
                    
                    // Play only on hover
                    cell.addEventListener('mouseenter', () => {
                        mediaElement.play().catch(e => console.log("Play interrupted"));
                    });
                    cell.addEventListener('mouseleave', () => {
                        mediaElement.pause();
                    });
                }
            });

            loadPromises.push(loadPromise);
            cell.appendChild(mediaElement);
            fragment.appendChild(cell);
        });

        // Wait for all media to load
        await Promise.all(loadPromises);

        // Append everything to the DOM
        gridContainer.appendChild(fragment);

        // Hide preloader
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);

    } catch (error) {
        console.error("Failed to load media:", error);
        progressText.innerText = "Error loading memories.";
        gridContainer.innerHTML = '<p>Failed to load images. Make sure the server is running from the root directory.</p>';
        setTimeout(() => preloader.style.display = 'none', 2000);
    }
}

document.addEventListener('DOMContentLoaded', loadAllMedia);
