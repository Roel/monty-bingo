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
    'topiary', 'bud', 'vegetable', 'fern', 'manure', 'nutrients', 'erica<wbr>ceous'
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

function getShareUrl() {
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
    const url = new URL(window.location)
    const urlParams = new URLSearchParams(url.search);
    urlParams.set('q', hash);
    url.search = urlParams;
    return url.toString();
}

function fromHash() {
    const url = new URL(window.location)
    const urlParams = new URLSearchParams(url.search);
    const hash = urlParams.get('q');

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
        urlParams.delete('q');
        url.search = urlParams;
        window.history.replaceState(window.history.state, document.title, url);

        return currentWords.reverse();
    }
}

function reset() {
    for (let row = 0; row < bingoSize; row++) {
        for (let col = 0; col < bingoSize; col++) {
            const el = bingoTable.children[row].children[col];
            el.classList.remove("selected");
        }
    }
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
    bingoDetect();
}

const wordsFromHash = fromHash();
const randomWords = [...words];
shuffleArray(randomWords);

for (let row = 0; row < bingoSize; row++) {
    let tr = document.createElement("tr");

    for (let col = 0; col < bingoSize; col++) {
        let td = document.createElement("td");
        if (wordsFromHash) {
            let word = wordsFromHash.pop();
            td.innerHTML = word.word;
            if (word.selected) { td.classList.add("selected"); }
        } else {
            td.innerHTML = randomWords.pop();
        }
        td.onclick = function () {
            this.classList.toggle("selected");
            bingoDetect();
        };
        tr.appendChild(td);
    }

    bingoTable.appendChild(tr);
}
bingoDetect();