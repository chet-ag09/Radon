document.addEventListener('DOMContentLoaded', () => {
    const wallpaperInput = document.getElementById('wallpaper');
    const shortcutNameInput = document.getElementById('shortcut-name');
    const shortcutUrlInput = document.getElementById('shortcut-url');
    const addShortcutButton = document.getElementById('add-shortcut');
    const saveButton = document.getElementById('save');
    const shortcutsContainer = document.createElement('div');
    const customCSSInput = document.getElementById('custom-css');
    const saveCSSButton = document.getElementById('save-css');

    document.body.appendChild(shortcutsContainer); // Place shortcuts below inputs

    function loadSettings() {
        chrome.storage.sync.get(['wallpaper', 'shortcuts'], (data) => {
            shortcutsContainer.innerHTML = ''; // Clear UI before updating

            chrome.storage.sync.get(['customCSS'], (data) => {
                if (data.customCSS) {
                    customCSSInput.value = data.customCSS;
                }
            });

            // Load wallpaper input field
            if (data.wallpaper) {
                wallpaperInput.value = data.wallpaper;
            }

            // Display delete wallpaper button if a wallpaper exists
            if (data.wallpaper) {
                const wallpaperDeleteBtn = document.createElement('button');
                wallpaperDeleteBtn.textContent = "Delete Wallpaper";
                wallpaperDeleteBtn.style.display = 'block';
                wallpaperDeleteBtn.style.marginTop = '10px';
                wallpaperDeleteBtn.style.cursor = 'pointer';
                wallpaperDeleteBtn.addEventListener('click', deleteWallpaper);
                shortcutsContainer.appendChild(wallpaperDeleteBtn);
            }

            // Load and display shortcuts
            const shortcuts = data.shortcuts || [];
            shortcuts.forEach((shortcut, index) => {
                const shortcutElement = document.createElement('div');
                shortcutElement.style.display = 'flex';
                shortcutElement.style.alignItems = 'center';
                shortcutElement.style.marginTop = '5px';

                // Shortcut text
                const shortcutText = document.createElement('span');
                shortcutText.textContent = `${shortcut.name} (${shortcut.url})`;
                shortcutText.style.flexGrow = '1';
                shortcutText.style.marginRight = '10px';

                // Delete button
                const deleteButtonShort = document.createElement('button');
                deleteButtonShort.textContent = '❌';
                deleteButtonShort.style.cursor = 'pointer';
                deleteButtonShort.addEventListener('click', () => deleteShortcut(index));

                shortcutElement.appendChild(shortcutText);
                shortcutElement.appendChild(deleteButtonShort);
                shortcutsContainer.appendChild(shortcutElement);
            });
        });
    }


    function saveCSS() {
        const newCSS = customCSSInput.value.trim();
        chrome.storage.sync.set({ customCSS: newCSS }, () => {
            alert('Custom CSS saved successfully!  Refresh to see changes!');
        });
    }

    saveCSSButton.addEventListener('click', saveCSS);



    function saveSettings() {
        const newWallpaper = wallpaperInput.value.trim();

        chrome.storage.sync.get(['wallpaper', 'shortcuts'], (data) => {
            let shortcuts = data.shortcuts || [];
            let wallpaper = data.wallpaper || '';

            // Only update wallpaper if a new one is provided
            if (newWallpaper) {
                wallpaper = newWallpaper;
            }

            chrome.storage.sync.set({ wallpaper, shortcuts }, () => {
                console.log('Settings saved');
                alert('Settings saved successfully!  Refresh to see changes!');
                loadSettings(); // Refresh UI after saving
            });
        });
    }

    function deleteWallpaper() {
        chrome.storage.sync.set({ wallpaper: '' }, () => {
            console.log('Wallpaper deleted');
            alert('Wallpaper has been removed. Refresh to see changes!');
            loadSettings(); // Refresh UI immediately
        });
    }

    function addShortcut() {
        const name = shortcutNameInput.value.trim();
        const url = shortcutUrlInput.value.trim();

        if (!name || !url) {
            alert("Please enter both a name and a URL.");
            return;
        }

        chrome.storage.sync.get(['shortcuts'], (data) => {
            let shortcuts = data.shortcuts || [];

            // Prevent duplicates
            if (!shortcuts.some(shortcut => shortcut.url === url)) {
                shortcuts.push({ name, url });

                chrome.storage.sync.set({ shortcuts }, () => {
                    shortcutNameInput.value = '';
                    shortcutUrlInput.value = '';
                    loadSettings(); // Refresh list
                });
            } else {
                alert("Shortcut already exists.");
            }
        });
    }

    function deleteShortcut(index) {
        chrome.storage.sync.get(['shortcuts'], (data) => {
            let shortcuts = data.shortcuts || [];
            shortcuts.splice(index, 1);

            chrome.storage.sync.set({ shortcuts }, () => {
                loadSettings(); // Refresh list
            });
        });
    }

    addShortcutButton.addEventListener('click', addShortcut);
    saveButton.addEventListener('click', saveSettings);

    loadSettings(); 
});
