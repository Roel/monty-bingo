function showMenu() {
    const menu = document.getElementById("overlay");
    menu.style = "left: 0";
}

function hideMenu() {
    const menu = document.getElementById("overlay");
    menu.style = "left: -200vw";
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

document.addEventListener('keyup', function (ev) {
    if (ev.code === 'KeyM') {
        showMenu();
    }
});

let slideEnabled = false;

document.addEventListener('touchstart', function (ev) {
    let x = ev.targetTouches[0].pageX;
    let maxX = window.outerWidth;
    if (x < maxX / 5) {
        slideEnabled = true;
    } else {
        slideEnabled = false;
    }
});

document.addEventListener('touchmove', function (ev) {
    if (!slideEnabled) {
        return
    }
    let x = ev.targetTouches[0].pageX;
    let maxX = window.outerWidth;
    if (x < maxX) {
        document.getElementById("overlay").style = "left: calc(-100vw + " + x + "px)";
    }
});

document.addEventListener('touchend', function (ev) {
    if (!slideEnabled) {
        return
    }

    let x = document.getElementById("overlay").style.left;
    x = x.match(/([0-9]+)px/)[1];
    let maxX = window.outerWidth;

    if (x < maxX / 2) {
        document.getElementById("overlay").style = "left: -200vw";
    } else {
        document.getElementById("overlay").style = "left: 0";
    }
    slideEnabled = false;
});