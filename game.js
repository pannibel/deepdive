/* fetching the database */
const urlParams = new URLSearchParams(window.location.search);

const urlClues = "https://murdermystery-a1e7.restdb.io/rest/clues";
const urlOptions = "https://murdermystery-a1e7.restdb.io/rest/options";

const apikey = {
    headers: {
        "x-apikey": "6231ffc1dced170e8c83a2ea",
    },
};

const id = urlParams.get("id");
const text = urlParams.get("text");
const optionText = urlParams.get("optionText");
const options = urlParams.get("options");
const nextText = urlParams.get("nextText");
const setState = urlParams.get("setState");
const requiredState = urlParams.get("requiredState");

// fetch the data
fetch(urlClues, apikey)
    .then((res) => res.json())
    .then((data) => showClue(data));

fetch(urlOptions, apikey)
    .then((res) => res.json())
    .then((data) => showOption(data));

/* selecting the text element in the html*/
const textElement = document.getElementById("text");
/* selecting the option buttons container */
const optionButtonsElement = document.getElementById("option-buttons");
/* this is going to keep track of where our character is */
let state = {}

/* this is going to start the game */
function startGame() {
    state = {};
    showClue(32);
}

/* this is going to display whichever option we're on
it's going to take a particular index from the database */
function showClue(clueIndex) {
    const clue = urlClues.find(clue => clue.id === clueIndex)
    textElement.innerText = clue.text;

    /* this is removing the options */
    while (optionButtonsElement.firstChild) {
        optionButtonsElement.removeChild(optionButtonsElement.firstChild)
    }

    /* adding the current options */
    clue.forEach(option => {
        if (showOption(option)) {
            const button = document.createElement("button")
            button.innerText = option.optionText
            button.classList.add("btn")
            button.addEventListener("click", () => selectOption(option))
            optionButtonsElement.appendChild(button)
        }
    })
}

/* this is going to show our current options*/
function showOption(option) {
    return option.requiredState == null || option.requiredState(state)
}

/* this is going to happen every time we select an option */
function selectOption(option) {
    const nextTextNodeId = option.nextText;
    state = Object.assign(state, option.setState)
    showClue(nextText)
}

/* calling the startGame function as soon as the page loads */
startGame()