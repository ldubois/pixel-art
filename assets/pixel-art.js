/**
 * Pixel Art Editor JavaScript
 * Handles all the interactive functionality for the pixel art editor
 */

// Debug mode: only log in development
const DEBUG = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const debugLog = DEBUG ? console.log.bind(console) : () => {};
const debugWarn = DEBUG ? console.warn.bind(console) : () => {};
// Always log errors, even in production
const errorLog = console.error.bind(console);

let isDrawing = false;
let currentTool = 'draw'; // draw, eraser
let saveTimeout;
let toastTimeout;

// Global event listeners (run once)
document.addEventListener('mouseup', () => {
    isDrawing = false;
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const activeDropdown = document.querySelector('.export-dropdown.active');
    if (activeDropdown && !activeDropdown.contains(e.target)) {
        activeDropdown.classList.remove('active');
    }
});

const initApp = () => {
    const grid = document.getElementById('grid-container');
    // If grid is not present (e.g. on another page), stop
    if (!grid) return;

    const pixels = document.querySelectorAll('.pixel');
    const colorPicker = document.getElementById('color-picker');
    const btnDraw = document.getElementById('btn-draw');
    const btnEraser = document.getElementById('btn-eraser');
    const btnReset = document.getElementById('btn-reset');
    const btnRandom = document.getElementById('btn-random');
    const btnExport = document.getElementById('btn-export');
    const exportMenu = document.getElementById('export-menu');
    const exportDropdown = document.querySelector('.export-dropdown');
    const selectArt = document.getElementById('select-art');
    
    // Modal elements
    const resetModal = document.getElementById('reset-modal');
    const btnModalCancel = document.getElementById('modal-btn-cancel');
    const btnModalConfirm = document.getElementById('modal-btn-confirm');
    
    // Toast element
    const saveToast = document.getElementById('save-toast');
    
    // Verify all critical elements exist
    if (!pixels || pixels.length !== 256 || !colorPicker || !btnDraw || !btnEraser || !selectArt) {
        errorLog('Critical DOM elements missing, retrying...');
        setTimeout(initApp, 100);
        return;
    }
    
    // Get translations from data attributes
    const translations = {
        errorLoading: document.body.dataset.errorLoading || 'Error loading drawing.',
        loadPreset: document.body.dataset.loadPreset || '-- Load Preset --',
        colorPickerTitle: document.body.dataset.colorPickerTitle || 'Choose Color',
        toolsDraw: document.body.dataset.toolsDraw || 'Draw',
        toolsEraser: document.body.dataset.toolsEraser || 'Eraser',
        toolsRandom: document.body.dataset.toolsRandom || 'Random',
        toolsExport: document.body.dataset.toolsExport || 'Export',
        toolsReset: document.body.dataset.toolsReset || 'Reset',
        exportPng: document.body.dataset.exportPng || 'PNG',
        exportIco: document.body.dataset.exportIco || 'ICO',
        exportJson: document.body.dataset.exportJson || 'JSON',
        artTranslations: JSON.parse(document.body.dataset.artTranslations || '{}')
    };

    // Load saved state from localStorage AFTER ensuring pixels are ready
    const savedArt = localStorage.getItem('pixel_art_save');
    if (savedArt) {
        try {
            const colors = JSON.parse(savedArt);
            if (Array.isArray(colors) && colors.length === 256) {
                pixels.forEach((pixel, index) => {
                    if (colors[index] && colors[index] !== '#FFFFFF' && colors[index] !== 'rgb(255, 255, 255)') {
                        pixel.style.backgroundColor = colors[index];
                    }
                });
            }
        } catch (e) {
            errorLog('Failed to load save', e);
        }
    }

    // Show Toast Function
    const showToast = () => {
        if (!saveToast) return;
        clearTimeout(toastTimeout);
        saveToast.classList.add('show');
        toastTimeout = setTimeout(() => {
            saveToast.classList.remove('show');
        }, 2000);
    };

    // Save state to localStorage
    const saveState = () => {
        if (!pixels || pixels.length === 0) return;
        const colors = Array.from(pixels).map(p => p.style.backgroundColor || '#FFFFFF');
        localStorage.setItem('pixel_art_save', JSON.stringify(colors));
        
        // Debounce toast show to avoid spamming
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(showToast, 500);
    };

    // Create pixel explosion effect
    const createPixelExplosion = (pixel) => {
        const rect = pixel.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pixelColor = pixel.style.backgroundColor || '#FFFFFF';
        const particleCount = 12;
        
        for (let i = 0; i < particleCount; i++) {
            const pixelParticle = document.createElement('div');
            pixelParticle.className = 'pixel-particle';
            
            // Random angle and distance for explosion
            const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
            const distance = 25 + Math.random() * 20;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            const rotation = Math.random() * 360;
            
            pixelParticle.style.left = centerX + 'px';
            pixelParticle.style.top = centerY + 'px';
            pixelParticle.style.setProperty('--tx', tx + 'px');
            pixelParticle.style.setProperty('--ty', ty + 'px');
            pixelParticle.style.setProperty('--rot', rotation + 'deg');
            pixelParticle.style.backgroundColor = pixelColor;
            pixelParticle.style.border = '1px solid rgba(255, 255, 255, 0.3)';
            
            document.body.appendChild(pixelParticle);
            
            setTimeout(() => {
                pixelParticle.remove();
            }, 800);
        }
    };

    // Painting logic
    const paint = (pixel) => {
        const color = currentTool === 'eraser' ? '#FFFFFF' : colorPicker.value;
        const wasColored = pixel.style.backgroundColor && 
            pixel.style.backgroundColor !== '#FFFFFF' && 
            pixel.style.backgroundColor !== 'rgb(255, 255, 255)' &&
            pixel.style.backgroundColor !== 'transparent';
        
        if (pixel.style.backgroundColor !== color && (color !== '#FFFFFF' || wasColored)) {
            // If erasing and pixel was colored, add explosion animation
            if (currentTool === 'eraser' && wasColored) {
                pixel.classList.add('erasing');
                createPixelExplosion(pixel);
                
                setTimeout(() => {
                    pixel.style.backgroundColor = color;
                    pixel.classList.remove('erasing');
                }, 300);
            } else {
                pixel.style.backgroundColor = color;
            }
            saveState();
        }
    };

    // Grid Interaction (Click and Drag)
    grid.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('pixel')) {
            isDrawing = true;
            // Prevent default drag behavior to allow painting
            e.preventDefault();
            paint(e.target);
        }
    });

    grid.addEventListener('mouseover', (e) => {
        if (isDrawing && e.target.classList.contains('pixel')) {
            paint(e.target);
        }
    });

    grid.addEventListener('mouseleave', () => isDrawing = false);

    // Tool Switching
    const updateTools = () => {
        if (!btnDraw || !btnEraser || !grid) return;

        btnDraw.classList.toggle('active', currentTool === 'draw');
        btnEraser.classList.toggle('active', currentTool === 'eraser');
        
        // Update cursor on grid
        grid.classList.remove('mode-draw', 'mode-eraser');
        if (currentTool === 'draw') {
            grid.classList.add('mode-draw');
        } else if (currentTool === 'eraser') {
            grid.classList.add('mode-eraser');
        }
    };

    colorPicker.addEventListener('input', () => {
        currentTool = 'draw';
        updateTools();
    });

    colorPicker.addEventListener('click', () => {
        currentTool = 'draw';
        updateTools();
    });
    
    btnDraw.addEventListener('click', () => {
        currentTool = 'draw';
        updateTools();
    });
    
    btnEraser.addEventListener('click', () => {
        currentTool = 'eraser';
        updateTools();
    });

    // Initialize cursor on page load
    updateTools();

    // Custom Modal Logic
    btnReset.addEventListener('click', () => {
        resetModal.classList.add('show');
    });

    const closeModal = () => {
        resetModal.classList.remove('show');
    };

    btnModalCancel.addEventListener('click', closeModal);
    
    // Close modal on outside click
    resetModal.addEventListener('click', (e) => {
        if (e.target === resetModal) closeModal();
    });

    btnModalConfirm.addEventListener('click', () => {
        pixels.forEach(p => p.style.backgroundColor = '#FFFFFF');
        saveState();
        closeModal();
    });

    // API Integration
    const loadArt = async (name) => {
        try {
            btnRandom.disabled = true;
            document.body.style.cursor = 'wait';
            
            const res = await fetch(`/api/art/${name}`);
            if (!res.ok) throw new Error('API Error');
            
            const colors = await res.json();
            colors.forEach((color, index) => {
                if (pixels[index]) pixels[index].style.backgroundColor = color;
            });
            saveState();
            } catch (e) {
                errorLog('Error loading art', e);
                alert(translations.errorLoading);
            } finally {
            btnRandom.disabled = false;
            document.body.style.cursor = 'default';
        }
    };

    btnRandom.addEventListener('click', () => {
        // Pick random from the select list if populated
        const options = Array.from(selectArt.options).filter(o => o.value);
        if (options.length > 0) {
            const random = options[Math.floor(Math.random() * options.length)].value;
            loadArt(random);
        } else {
            // Fallback if list not loaded yet
            loadArt('mario');
        }
    });

    selectArt.addEventListener('change', (e) => {
        if (e.target.value) {
            loadArt(e.target.value);
        }
    });

    // Function to get art translations
    const getArtTranslations = () => {
        return translations.artTranslations;
    };
    
    // Art name translations
    let artTranslations = getArtTranslations();

    // Export functionality
    const exportToImage = (format) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 16;
        const pixelSize = format === 'ico' ? 16 : 32; // ICO typically 16x16 or 32x32, PNG can be larger
        
        canvas.width = size * pixelSize;
        canvas.height = size * pixelSize;
        
        // Draw each pixel (scaled up)
        pixels.forEach((pixel, index) => {
            const row = Math.floor(index / 16);
            const col = index % 16;
            const bgColor = pixel.style.backgroundColor;
            const color = bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent' 
                ? bgColor 
                : '#FFFFFF';
            
            ctx.fillStyle = color;
            ctx.fillRect(col * pixelSize, row * pixelSize, pixelSize, pixelSize);
        });
        
        if (format === 'png') {
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'pixel-art.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 'image/png');
        } else if (format === 'ico') {
            // Create ICO file
            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const pngData = new Uint8Array(reader.result);
                    const icoData = createICOFile(pngData, canvas.width, canvas.height);
                    const icoBlob = new Blob([icoData], { type: 'image/x-icon' });
                    const url = URL.createObjectURL(icoBlob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'pixel-art.ico';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                };
                reader.readAsArrayBuffer(blob);
            }, 'image/png');
        }
    };

    // Create ICO file format (simplified - embeds PNG)
    const createICOFile = (pngData, width, height) => {
        // ICO file header: 6 bytes
        const icoHeader = new ArrayBuffer(6);
        const headerView = new DataView(icoHeader);
        headerView.setUint16(0, 0, true); // Reserved (must be 0)
        headerView.setUint16(2, 1, true); // Type (1 = ICO)
        headerView.setUint16(4, 1, true); // Number of images
        
        // ICO directory entry: 16 bytes
        const dirEntry = new ArrayBuffer(16);
        const dirView = new DataView(dirEntry);
        const icoWidth = width === 256 ? 0 : Math.min(width, 255);
        const icoHeight = height === 256 ? 0 : Math.min(height, 255);
        dirView.setUint8(0, icoWidth); // Width
        dirView.setUint8(1, icoHeight); // Height
        dirView.setUint8(2, 0); // Color palette (0 = no palette)
        dirView.setUint8(3, 0); // Reserved
        dirView.setUint16(4, 1, true); // Color planes (1)
        dirView.setUint16(6, 32, true); // Bits per pixel (32 = RGBA)
        dirView.setUint32(8, pngData.length, true); // Size of image data
        dirView.setUint32(12, 22, true); // Offset of image data (6 + 16)
        
        // Combine header + directory + PNG data
        const icoFile = new Uint8Array(22 + pngData.length);
        icoFile.set(new Uint8Array(icoHeader), 0);
        icoFile.set(new Uint8Array(dirEntry), 6);
        icoFile.set(pngData, 22);
        
        return icoFile;
    };

    // Export dropdown toggle
    btnExport.addEventListener('click', (e) => {
        e.stopPropagation();
        if (exportDropdown) {
            exportDropdown.classList.toggle('active');
        }
    });

    // Export JSON functionality
    const exportToJson = () => {
        const pixelData = [];
        
        for (let row = 0; row < 16; row++) {
            for (let col = 0; col < 16; col++) {
                const index = row * 16 + col;
                const pixel = pixels[index];
                const bgColor = pixel.style.backgroundColor;
                const color = bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent' 
                    ? bgColor 
                    : '#FFFFFF';
                
                // Only store non-white pixels to save space
                if (color !== '#FFFFFF' && color !== 'rgb(255, 255, 255)') {
                    pixelData.push({
                        row: row,
                        col: col,
                        color: color
                    });
                }
            }
        }
        
        const jsonData = {
            name: 'pixel-art-' + new Date().toISOString().split('T')[0],
            width: 16,
            height: 16,
            pixels: pixelData,
        };
        
        const jsonString = JSON.stringify(jsonData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pixel-art.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Export option clicks
    document.querySelectorAll('.export-option').forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const format = option.dataset.format;
            if (format === 'json') {
                exportToJson();
            } else {
                exportToImage(format);
            }
            if (exportDropdown) {
                exportDropdown.classList.remove('active');
            }
        });
    });

    // Function to load art list with translations
    const loadArtList = () => {
        // Update translations first (in case locale changed)
        artTranslations = getArtTranslations();
        
        // Clear existing options except the first one
        while (selectArt.options.length > 1) {
            selectArt.remove(1);
        }
        
        // Update the placeholder option
        const placeholder = document.getElementById('select-art-placeholder');
        if (placeholder) {
            placeholder.textContent = translations.loadPreset;
        }
        
        // Reset select value
        selectArt.value = '';
        
        fetch('/api/art')
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch art list');
                }
                return res.json();
            })
                .then(list => {
                    if (!Array.isArray(list) || list.length === 0) {
                        debugWarn('Art list is empty or invalid');
                        return;
                    }
                
                list.forEach(name => {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = artTranslations[name] || name.charAt(0).toUpperCase() + name.slice(1);
                    selectArt.appendChild(opt);
                });
            })
            .catch(err => {
                errorLog('Failed to fetch art list', err);
                // Retry after a short delay
                setTimeout(() => {
                    debugLog('Retrying to load art list...');
                    loadArtList();
                }, 500);
            });
    };

    // Function to update tooltips
    const updateTooltips = () => {
        const tooltips = {
            'color-picker': translations.colorPickerTitle,
            'btn-draw': translations.toolsDraw,
            'btn-eraser': translations.toolsEraser,
            'btn-random': translations.toolsRandom,
            'select-art': translations.loadPreset,
            'btn-export': translations.toolsExport,
            'btn-reset': translations.toolsReset
        };
        
        Object.keys(tooltips).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.setAttribute('title', tooltips[id]);
            }
        });
        
        // Update export menu options
        if (exportMenu) {
            const exportOptions = exportMenu.querySelectorAll('.export-option');
            if (exportOptions.length >= 3) {
                exportOptions[0].innerHTML = `<i class="fa-solid fa-image"></i> ${translations.exportPng}`;
                exportOptions[1].innerHTML = `<i class="fa-solid fa-file-image"></i> ${translations.exportIco}`;
                exportOptions[2].innerHTML = `<i class="fa-solid fa-file-code"></i> ${translations.exportJson}`;
            }
        }
    };

    // Initialize: Update tooltips and load art list
    updateTooltips();
    loadArtList();
};

// Start initialization on Turbo load
document.addEventListener('turbo:load', initApp);
