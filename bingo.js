const bingoTable = document.getElementById("bingo");
const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');

const words = [
    'grit', 'peat-free', 'good girl', 'drainage', 'healthy root system', 'perlite',
    'potting mix', 'compost', 'leafmould', 'plugs', 'container', 'cold<wbr>frame', 'raised bed',
    'dead<wbr>head', 'pond', 'pollinators', 'seed', 'green<wbr>house', 'cut back',
    'wild<wbr>life', 'jewel garden', 'climber', 'delicious', 'frost', 'seed tray',
    'bacteria', 'nursery', 'liquid sea<wbr>weed', 'feed', 'harden off', 'perennial',
    'tomato feed', 'prune', 'flower', 'clump', 'germinate', 'organic', 'terra<wbr>cotta',
    'eco<wbr>system', 'harvest', 'moisture', 'really good soak', 'divide', 'border',
    'soil', 'fragrance', 'mulch', 'bulb', 'water', 'pot', 'sun<wbr>shine', 'scent', 'protect',
    'Long<wbr>meadow', 'healthy', 'bees', 'national collection', 'brassica',
    'annual', 'biennial', 'allotment', 'shed', 'texture', 'lawn', 'meadow', 'propagate',
    'seedling', 'foliage', 'firm it in', 'cuttings', 'fungi', 'mycor<wbr>rhizal powder',
    'topiary', 'bud', 'vegetable', 'fern', 'manure', 'nutrients', 'erica<wbr>ceous',
    'herbaceous', 'label it', 'garden', 'autumn', 'colour'
];

const bingoSize = 5;
const bingoLastIndex = bingoSize - 1;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function bingoDetect() {
    for (let row = 0; row < bingoSize; row++) {
        for (let col = 0; col < bingoSize; col++) {
            const el = bingoTable.children[row].children[col];
            let bingo = false;

            //check row
            let rowBingo = true;
            for (let colEl of bingoTable.children[row].children) {
                if (!colEl.classList.contains("selected")) {
                    rowBingo = false;
                    break;
                }
            }
            bingo = bingo || rowBingo;

            //check col
            let colBingo = true;
            for (let rowEl of bingoTable.children) {
                if (!rowEl.children[col].classList.contains("selected")) {
                    colBingo = false;
                    break;
                }
            }
            bingo = bingo || colBingo;

            //check diagonals
            if (row == col) {
                let diagBingo = true;
                let diagIndex = 0;
                for (let rowEl of bingoTable.children) {
                    if (!rowEl.children[diagIndex].classList.contains("selected")) {
                        diagBingo = false;
                        break;
                    }
                    diagIndex++;
                }
                bingo = bingo || diagBingo;
            }

            if (row + col == bingoLastIndex) {
                let diagBingo = true;
                let diagIndex = bingoLastIndex;
                for (let rowEl of bingoTable.children) {
                    if (!rowEl.children[diagIndex].classList.contains("selected")) {
                        diagBingo = false;
                        break;
                    }
                    diagIndex--;
                }
                bingo = bingo || diagBingo;
            }

            if (bingo) {
                el.classList.add("bingo");
            } else {
                el.classList.remove("bingo");
            }
        }
    }
}

function getHash() {
    let hash = "";

    for (let row = 0; row < bingoSize; row++) {
        for (let col = 0; col < bingoSize; col++) {
            const el = bingoTable.children[row].children[col];
            const wordIndex = words.indexOf(el.innerHTML);
            const selected = el.classList.contains("selected");

            let hashIndex = Math.floor(wordIndex / 26);
            let hashChar = letters[wordIndex % 26];
            if (selected) { hashChar = hashChar.toUpperCase(); }
            if (hashIndex < 10) { hashIndex = "0" + hashIndex; }
            hash += hashIndex + hashChar;
        }
    }
    return hash;
}

function getShareUrl() {
    const url = new URL(window.location)
    const urlParams = new URLSearchParams(url.search);
    urlParams.set('q', getHash());
    url.search = urlParams;
    return url.toString();
}

function parseHash(hash) {
    let currentWords = [];
    if (hash) {
        let currentWords = hash.match(/.{1,3}/g).map(function (str) {
            let index = parseInt(str.substr(0, 2));
            let char = str.substr(2, 1).toLowerCase();
            index = (index * 26) + letters.indexOf(char);
            let selected = str.substr(2, 1).toUpperCase() === str.substr(2, 1);
            return {
                "word": words[index],
                "selected": selected
            }
        });
        return currentWords.reverse();
    }
}

function fromHash() {
    const url = new URL(window.location)
    const urlParams = new URLSearchParams(url.search);
    const hash = urlParams.get('q');

    if (hash) {
        urlParams.delete('q');
        url.search = urlParams;
        window.history.replaceState(window.history.state, document.title, url);
        return parseHash(hash);
    }
}

function fromSaveGame() {
    const storageSaveGame = "mb_savegame";
    const saveGame = window.localStorage.getItem(storageSaveGame);

    if (saveGame) {
        return parseHash(saveGame);
    }
}

function isAutoSave() {
    const storageAutosave = "mb_autosave";
    return window.localStorage.getItem(storageAutosave) === "true" || false;
}

function toggleAutoSave() {
    const storageAutosave = "mb_autosave";
    window.localStorage.setItem(storageAutosave, !isAutoSave());
    if (isAutoSave()) {
        autoSaveButton.innerHTML = "Autosave off"
    } else {
        autoSaveButton.innerHTML = "Autosave on"
    }    
}

function save() {
    const storageSaveGame = "mb_savegame";
    window.localStorage.setItem(storageSaveGame, getHash());
}

function reset() {
    for (let row = 0; row < bingoSize; row++) {
        for (let col = 0; col < bingoSize; col++) {
            const el = bingoTable.children[row].children[col];
            el.classList.remove("selected");
        }
    }
    save();
    bingoDetect();
}

function startNew() {
    const randomWords = [...words];
    shuffleArray(randomWords);
    for (let row = 0; row < bingoSize; row++) {
        for (let col = 0; col < bingoSize; col++) {
            const el = bingoTable.children[row].children[col];
            el.classList.remove("selected");
            el.innerHTML = randomWords.pop();
        }
    }
    save();
    bingoDetect();
}

const bingoFromHash = fromHash();
const bingoFromSaveGame = isAutoSave() ? fromSaveGame() : null;
const randomWords = [...words];
shuffleArray(randomWords);

for (let row = 0; row < bingoSize; row++) {
    let tr = document.createElement("tr");

    for (let col = 0; col < bingoSize; col++) {
        let td = document.createElement("td");
        if (bingoFromHash) {
            let word = bingoFromHash.pop();
            td.innerHTML = word.word;
            if (word.selected) { td.classList.add("selected"); }
        } else if (bingoFromSaveGame) {
            let word = bingoFromSaveGame.pop();
            td.innerHTML = word.word;
            if (word.selected) { td.classList.add("selected"); }
        } else {
            td.innerHTML = randomWords.pop();
        }
        td.onclick = function () {
            this.classList.toggle("selected");
            save();
            bingoDetect();
        };
        tr.appendChild(td);
    }

    bingoTable.appendChild(tr);
}
save();
bingoDetect();