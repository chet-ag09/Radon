// Retrieve stored preferences or use defaults
chrome.storage.sync.get(['wallpaper', 'shortcuts'], (data) => {
    // Set wallpaper
    const wallpaper = data.wallpaper || 'https://cdn.pixabay.com/photo/2025/02/22/08/35/mountain-9423779_1280.jpg'; // default wallpaper
    document.getElementById('wallpaper').style.backgroundImage = `url(${wallpaper})`;

    // Set shortcuts
    const shortcuts = data.shortcuts || [
        { name: 'Google', url: 'https://www.google.com' },//defaults
        { name: 'YouTube', url: 'https://www.youtube.com' },
    ];
    const shortcutsContainer = document.getElementById('shortcuts');
    shortcuts.forEach(shortcut => {
        const shortcutElement = document.createElement('div');
        shortcutElement.classList.add('shortcut');
        shortcutElement.textContent = shortcut.name;
        shortcutElement.addEventListener('click', () => {
            window.open(shortcut.url, '_self');
        });
        shortcutsContainer.appendChild(shortcutElement);
    });

    chrome.storage.sync.get(['customCSS'], (data) => {
        if (data.customCSS) {
            const styleTag = document.createElement('style');
            styleTag.textContent = data.customCSS;
            document.head.appendChild(styleTag);
        }
    });
});

