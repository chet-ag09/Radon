This is a WORK IN PROGRESS THIS IS NOT THE FINAL VERSION
# Radon
Radon is a chrome extension that lets you customize the new tab page. You can use CSS to write code to customize it!

## How to install
As of now, this project has not been published to chrome web store.
So just clone this repo and import it into chrome.

## How to use
Below is an example code involving the main classes and id.
```
body {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
    color: white;
}

.custom-tab {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: flex-start;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.7);
    position: relative;
}

.wallpaper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    opacity: 0.5;
}

.shortcuts {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 15px;
    z-index: 1;
}

.shortcut {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease-in-out;
}

.shortcut:hover {
    background-color: rgba(0, 0, 0, 0.4);
}

.shortcut img {
    width: 36px;
    height: 36px;
    margin-right: 8px;
    border-radius: 3px;
}

#clock 
{
    font-size: 2em;
    margin-top: 10px;
    font-weight: 700;
}

```