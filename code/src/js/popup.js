document.addEventListener('DOMContentLoaded', () => {

    //VARS
    const wallpaperInput = document.getElementById('wallpaper');
    const shortcutNameInput = document.getElementById('shortcut-name');
    const shortcutUrlInput = document.getElementById('shortcut-url');
    const addShortcutButton = document.getElementById('add-shortcut');
    const saveButton = document.getElementById('save');
    const shortcutsContainer = document.createElement('div');
    const customCSSInput = document.getElementById('custom-css');
    const deleteWallpaperButton = document.querySelector('.delete_wallpaper');
    const toggleClockCheckbox = document.getElementById('toggle-clock');
    const toggleSearchCheckbox = document.getElementById('toggle-search');

    // Create Remove CSS Button
    let removeCSSButton = document.createElement('button');
    removeCSSButton.textContent = "Remove Custom CSS";
    removeCSSButton.style.marginTop = '10px';
    removeCSSButton.style.display = 'none'; // Hidden by default
    removeCSSButton.addEventListener('click', removeCustomCSS);
    
    document.body.appendChild(shortcutsContainer);
    document.body.appendChild(removeCSSButton); // Append to body

    deleteWallpaperButton.addEventListener('click', deleteWallpaper);   

    //FUNCTIONS
    function loadSettings() {
        chrome.storage.sync.get(['wallpaper', 'shortcuts', 'customCSS'], (data) => {
            shortcutsContainer.innerHTML = ''; // Clear UI before updating

            if (data.customCSS) {
                customCSSInput.value = data.customCSS;
                applyCustomCSS(data.customCSS);
                removeCSSButton.style.display = 'block'; // Show button when CSS is present
            } else {
                removeCSSButton.style.display = 'none'; // Hide button if no CSS
            }

            if (data.wallpaper) {
                wallpaperInput.value = data.wallpaper;
            }



            const shortcuts = data.shortcuts || [];
            shortcuts.forEach((shortcut, index) => {
                const shortcutElement = document.createElement('div');
                shortcutElement.style.display = 'flex';
                shortcutElement.style.alignItems = 'center';
                shortcutElement.style.marginTop = '5px';

                const favicon = document.createElement('img');
                const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${shortcut.url}`;
                favicon.src = faviconUrl;
                favicon.style.width = '16px';
                favicon.style.height = '16px';
                favicon.style.marginRight = '10px';

                favicon.onerror = () => {
                    favicon.src = '../src/imgs/ico.png';
                };

                const shortcutText = document.createElement('span');
                shortcutText.textContent = shortcut.name;
                shortcutText.style.flexGrow = '1';
                shortcutText.style.marginRight = '10px';

                const deleteButtonShort = document.createElement('button');
                deleteButtonShort.textContent = 'x';
                deleteButtonShort.style.cursor = 'pointer';
                deleteButtonShort.addEventListener('click', () => deleteShortcut(index));

                shortcutElement.appendChild(favicon);
                shortcutElement.appendChild(shortcutText);
                shortcutElement.appendChild(deleteButtonShort);
                shortcutsContainer.appendChild(shortcutElement);
            });
        });
    }

    function applyCustomCSS(css) {
        let existingStyle = document.getElementById('custom-css-style');
        if (!existingStyle) {
            existingStyle = document.createElement('style');
            existingStyle.id = 'custom-css-style';
            document.head.appendChild(existingStyle);
        }
        existingStyle.textContent = css;
    }

    function saveCSS() {
        const newCSS = customCSSInput.value.trim();
        chrome.storage.sync.set({ customCSS: newCSS }, () => {
            applyCustomCSS(newCSS);
            removeCSSButton.style.display = 'block'; // Show button when CSS is added
            alert('Custom CSS saved successfully! Refresh!');
        });
    }

    function removeCustomCSS() {
        chrome.storage.sync.remove('customCSS', () => {
            let existingStyle = document.getElementById('custom-css-style');
            if (existingStyle) {
                existingStyle.remove();
            }
            customCSSInput.value = ''; // Clear input field
            removeCSSButton.style.display = 'none'; // Hide button after removing CSS
            alert('Custom CSS removed successfully!');
        });
    }

    function saveSettings() {
        const newWallpaper = wallpaperInput.value.trim();
        const newCSS = customCSSInput.value.trim();

        chrome.storage.sync.get(['wallpaper', 'shortcuts'], (data) => {
            let shortcuts = data.shortcuts || [];
            let wallpaper = data.wallpaper || '';

            if (newWallpaper) {
                wallpaper = newWallpaper;
            }

            chrome.storage.sync.set({ wallpaper, shortcuts, customCSS: newCSS }, () => {
                console.log('Settings saved');
                alert('Settings saved successfully!');
                applyCustomCSS(newCSS);
                loadSettings();
            });
        });
    }

    function deleteWallpaper() {
        chrome.storage.sync.set({ wallpaper: '' }, () => {
            console.log('Wallpaper deleted');
            alert('Wallpaper has been removed.');
            loadSettings();
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

            if (!shortcuts.some(shortcut => shortcut.url === url)) {
                shortcuts.push({ name, url });

                chrome.storage.sync.set({ shortcuts }, () => {
                    shortcutNameInput.value = '';
                    shortcutUrlInput.value = '';
                    loadSettings();
                    alert("Shortcut Added, Refresh to see!")
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
                loadSettings();
            });
        });
    }

    //CLOCK------------
    chrome.storage.sync.get(['showClock'], (data) => {
        toggleClockCheckbox.checked = data.showClock ?? true; // Default to true
    });

    // Save setting when toggled
    toggleClockCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ showClock: toggleClockCheckbox.checked }, () => {
            alert('Clock visibility saved! Refresh page to see changes');
        });
    });


 //Search------------
    chrome.storage.sync.get(['showSearch'], (data) => {
        toggleSearchCheckbox.checked = data.showSearch ?? true; // Default to true
    });

    // Save setting when toggled
    toggleSearchCheckbox.addEventListener('change', () => {
        chrome.storage.sync.set({ showSearch: toggleSearchCheckbox.checked }, () => {
            alert('Search visibility saved! Refresh page to see changes');
        });
    });


    document.getElementById("saveBinding").addEventListener("click", () => {
        const keybinding = document.getElementById("keybinding").value.trim();
        const website = document.getElementById("website").value.trim();
    
        if (keybinding && website) {
            chrome.storage.sync.get(["keyBindings"], (data) => {
                const keyBindings = data.keyBindings || {};
                keyBindings[keybinding] = website;
    
                chrome.storage.sync.set({ keyBindings }, () => {
                    alert("Key binding saved!");
                    displayBindings();
                });
            });
        }
    });
    
    function displayBindings() {
        chrome.storage.sync.get(["keyBindings"], (data) => {
            const bindingsList = document.getElementById("bindingsList");
            bindingsList.innerHTML = ""; // Clear list
    
            const keyBindings = data.keyBindings || {};
            Object.entries(keyBindings).forEach(([key, url]) => {
                const item = document.createElement("div");
                item.innerHTML = `${key} → ${url} <button data-key="${key}" class="removeBinding">Remove</button>`;
                bindingsList.appendChild(item);
            });
    
            // Add event listeners to remove buttons
            document.querySelectorAll(".removeBinding").forEach(button => {
                button.addEventListener("click", (event) => {
                    const keyToRemove = event.target.getAttribute("data-key");
                    chrome.storage.sync.get(["keyBindings"], (data) => {
                        const keyBindings = data.keyBindings || {};
                        delete keyBindings[keyToRemove];
    
                        chrome.storage.sync.set({ keyBindings }, () => {
                            displayBindings();
                        });
                    });
                });
            });
        });
    }
    
    displayBindings();
    


    addShortcutButton.addEventListener('click', addShortcut);
    saveButton.addEventListener('click', saveSettings);

    loadSettings();
});