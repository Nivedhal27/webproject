const tamilWords = ["வீடு", "நாய்", "மரம்", "தண்ணீர்", "மழை", "பூ", "பசு"];
let selectedWord = "";
let displayedWord = [];
let chances = 6;

const wordDisplay = document.getElementById("word-display");
const lettersDiv = document.getElementById("letters");
const message = document.getElementById("message");
const chancesSpan = document.getElementById("chances");

// Tamil letters (you can extend this)
const tamilLetters = ["அ","ஆ","இ","ஈ","உ","ஊ","எ","ஏ","ஐ","ஒ","ஓ","ஔ","க","ங","ச","ஞ","ட","ண","த","ந","ப","ம","ய","ர","ல","வ","ழ","ள","ற","ன","ஜ","ஷ","ஸ","ஹ","க்ஷ","ஶ","ஃ","வி","நா","மு","ரு","ஊ","ள"];

function startGame() {
  selectedWord = tamilWords[Math.floor(Math.random() * tamilWords.length)];
  displayedWord = Array(selectedWord.length).fill("_");
  chances = 6;
  updateDisplay();
  createLetterButtons();
  message.textContent = "";
  chancesSpan.textContent = chances;
}

function updateDisplay() {
  wordDisplay.textContent = displayedWord.join(" ");
}

function createLetterButtons() {
  lettersDiv.innerHTML = "";
  tamilLetters.forEach(letter => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.addEventListener("click", () => handleGuess(letter, btn));
    lettersDiv.appendChild(btn);
  });
}

function handleGuess(letter, button) {
  button.disabled = true;
  if (selectedWord.includes(letter)) {
    [...selectedWord].forEach((char, idx) => {
      if (char === letter) {
        displayedWord[idx] = letter;
      }
    });
    updateDisplay();
    if (!displayedWord.includes("_")) {
      message.textContent = "🎉 You Won!";
      disableAllButtons();
    }
  } else {
    chances--;
    chancesSpan.textContent = chances;
    if (chances === 0) {
      message.textContent = `💀 You Lost! Word was: ${selectedWord}`;
      wordDisplay.textContent = selectedWord.split("").join(" ");
      disableAllButtons();
    }
  }
}

function disableAllButtons() {
  document.querySelectorAll("#letters button").forEach(btn => btn.disabled = true);
}

function resetGame() {
  startGame();
}

startGame();
