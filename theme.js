const storageTheme = "mb_theme";
const themeButton = document.getElementById("theme");

function setDarkTheme() {
    const head = document.head;
    const link = document.createElement("link");

    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = 'dark.css';

    head.appendChild(link);
    themeButton.innerHTML = "Light";
    window.localStorage.setItem(storageTheme, "dark");
}

function setLightTheme() {
    const head = document.head;
    for (el of head.getElementsByTagName("link")) {
        if (el.href.indexOf("dark.css") > -1) {
            el.remove();
        }
    }
    themeButton.innerHTML = "Dark";
    window.localStorage.setItem(storageTheme, "light");
}

function getCurrentTheme() {
    return window.localStorage.getItem(storageTheme) || 'light';
}

function toggleTheme() {
    getCurrentTheme() === 'light' ? setDarkTheme() : setLightTheme();
}

if (window.localStorage.getItem(storageTheme) === 'dark') {
    setDarkTheme();
} else {
    setLightTheme();
}

themeButton.onclick = function() {
    toggleTheme();
    hideMenu();
}