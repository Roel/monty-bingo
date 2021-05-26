const overlay = document.getElementById("overlay");

function showMenu() {
    overlay.style = "transform: translate(150vw)";
}

function hideMenu() {
    overlay.style = "";
}

const cancelButton = document.getElementById("cancel");
cancelButton.onclick = function () { hideMenu(); }

const newBingoButton = document.getElementById("new");
newBingoButton.onclick = function () {
    startNew();
    hideMenu();
}

const resetButton = document.getElementById("reset");
resetButton.onclick = function () {
    reset();
    hideMenu();
}

const shareButton = document.getElementById("share");
shareButton.onclick = async function () {
    if (navigator.share) {
        try {
            await navigator.share({
                "title": "Monty Bingo",
                "url": getShareUrl(),
                "text": "My Monty Bingo"
            });
        } catch (err) { }
        hideMenu();
    } else {
        await navigator.clipboard.writeText(getShareUrl());
        shareButton.innerHTML = "Copied"
        setTimeout(function () {
            hideMenu();
            const shareButton = document.getElementById("share");
            shareButton.innerHTML = "Share"
        }, 2000);
    }
}

const autoSaveButton = document.getElementById("autosave");
if (isAutoSave()) {
    autoSaveButton.innerHTML = "Autosave off"
} else {
    autoSaveButton.innerHTML = "Autosave on"
}
autoSaveButton.onclick = function() {
    toggleAutoSave();
    hideMenu();
}

document.addEventListener('keyup', function (ev) {
    if (ev.code === 'KeyM') {
        showMenu();
    }
});

let slideEnabled = false;
let currentSlideX = 0;

document.addEventListener('touchstart', function (ev) {
    currentSlideX = ev.targetTouches[0].pageX;
    let maxX = window.outerWidth;
    if (currentSlideX < maxX / 5) {
        slideEnabled = true;
        overlay.classList.remove("slideAnimation");
    } else {
        slideEnabled = false;
    }
});

document.addEventListener('touchmove', function (ev) {
    if (!slideEnabled) {
        return
    }
    currentSlideX = ev.targetTouches[0].pageX;
    let maxX = window.outerWidth;
    if (currentSlideX < maxX) {
        overlay.style = "transform: translate(calc(50vw + " + currentSlideX + "px))";
    }
});

document.addEventListener('touchend', function (ev) {
    if (!slideEnabled) {
        return
    }

    let maxX = window.outerWidth;

    overlay.classList.add("slideAnimation");

    if (currentSlideX < maxX / 3) {
        hideMenu();
    } else {
        showMenu();
    }
    slideEnabled = false;
    currentSlideX = 0;
});