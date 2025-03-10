chrome.storage.sync.get(['wallpaper', 'shortcuts', 'customCSS'], (data) => {
    // Set wallpaper
    const wallpaper = data.wallpaper || 'https://cdn.pixabay.com/photo/2025/02/22/08/35/mountain-9423779_1280.jpg'; // default wallpaper
    document.getElementById('wallpaper').style.backgroundImage = `url(${wallpaper})`;

    // Set shortcuts
    const shortcuts = data.shortcuts || [
        { name: 'Google', url: 'https://www.google.com' }, // Default shortcuts
        { name: 'YouTube', url: 'https://www.youtube.com' }
    ];

    const shortcutsContainer = document.getElementById('shortcuts');
    shortcutsContainer.innerHTML = ''; // Clear before adding new shortcuts

    shortcuts.forEach(shortcut => {
        const shortcutElement = document.createElement('div');
        shortcutElement.classList.add('shortcut');

        // Create favicon image
        const iconImg = document.createElement('img');
        iconImg.src = `https://www.google.com/s2/favicons?sz=64&domain=${shortcut.url}`;
        iconImg.onerror = () => {
            iconImg.src = '../src/imgs/ico.png'; // Fallback if no favicon
        };

        // Shortcut text
        const shortcutText = document.createElement('span');
        shortcutText.textContent = shortcut.name;

        // Open URL on click
        shortcutElement.addEventListener('click', () => {
            window.open(shortcut.url, '_self');
        });

        shortcutElement.appendChild(iconImg);
        shortcutElement.appendChild(shortcutText);
        shortcutsContainer.appendChild(shortcutElement);
    });

    // Apply custom CSS if available
    if (data.customCSS) {
        const styleTag = document.createElement('style');
        styleTag.textContent = data.customCSS;
        document.head.appendChild(styleTag);
    }

    const clockElement = document.getElementById('clock');
    chrome.storage.sync.get(['showClock'], (data) => {
        clockElement.style.display = data.showClock ? 'block' : 'none';
    });

    const searchElement = document.getElementById('search_bar');
    chrome.storage.sync.get(['showSearch'], (data) => {
        searchElement.style.display = data.showSearch ? 'block' : 'none';
    });

    chrome.storage.sync.get(['tabBarColor'], (data) => {
        if (data.tabBarColor) {
            document.documentElement.style.setProperty('--tab-bar-color', data.tabBarColor);
        }
    });

    document.addEventListener("keydown", function(event) {
        chrome.storage.sync.get(["keyBindings"], (data) => {
            const keyBindings = data.keyBindings || {};
            const pressedKey = (event.ctrlKey ? "Ctrl+" : "") + (event.altKey ? "Alt+" : "") + (event.shiftKey ? "Shift+" : "") + event.key.toUpperCase();
    
            if (keyBindings[pressedKey]) {  
                window.open(keyBindings[pressedKey], "_self");
                event.preventDefault();
            }
        });
    }); 
});
