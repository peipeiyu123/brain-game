/*數字點點名*/
let memoryStage = "easy";
let memoryIndex = 0;
let memoryScore = 0;
let memoryEasy = 0;
let memoryMedium = 0;
let memoryHard = 0;
let memoryQuestions = [];
let currentMemoryNumber = "";
let currentMemoryMode = "";
let memoryInputValue = "";
let memoryLocked = false;
let memoryTimer = null;
let alreadyAnswered = false;
const memoryArea = document.querySelector(".memoryArea");

const memoryConfig = {
  easy: { show: 2000, wait: 4000, answer: 6000, len: 3 },
  medium: { show: 3000, wait: 5000, answer: 8000, len: 4 },
  hard: { show: 4000, wait: 5000, answer: 11000, len: 5 }
};

document.getElementById("btnMemory").addEventListener("click", () => {
  memoryStage = "easy";
  memoryIndex = 0;
  memoryScore = 0;
  memoryEasy = 0;
  memoryMedium = 0;
  memoryHard = 0;
  showScreen(memoryArea);
  loadMemoryStage();
});

document.querySelectorAll(".keypad button").forEach(btn => {
  btn.addEventListener("click", () => {
    const v = btn.textContent;
    if (v === "⌫") {
      memoryInputValue = memoryInputValue.slice(0, -1);
    } else if (v === "✔") {
      checkMemoryAnswer();
      return;
    } else {
      memoryInputValue += v;
    }
    document.getElementById("memoryInput").textContent = memoryInputValue;
  });
});

document.getElementById("memorySubmit").addEventListener("click", () => {
  checkMemoryAnswer();
});

document.getElementById("memoryFinishBtn").addEventListener("click", () => {
  sendData();
  showScreen(control);
});


function enableAnswer(bool) {
  console.log("按鍵狀態:", bool);
  document.querySelectorAll(".keypad button").forEach(b => {
    b.disabled = !bool;
  });
}

function generateMemoryNumber(len) {
  let num = "";
  for (let i = 0; i < len; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

function getMemoryMode() {
  return Math.random() > 0.5 ? "forward" : "backward";
}

function showMemoryNumber(num, time, callback) {
  const box = document.getElementById("memoryDisplay");
  box.textContent = num;
  setTimeout(() => {
    box.textContent = "";
    callback();
  }, time);
}

function showMemoryStage() {
  document.getElementById("memoryDisplay").textContent = "";
  document.getElementById("memoryInstruction").textContent = "";
  document.getElementById("memoryResult").textContent = "";
  document.getElementById("memoryInput").textContent = "";
  loadMemoryStage();
}

function loadMemoryStage() {
  memoryQuestions = [];
  memoryIndex = 0;
  let count = 5;
  for (let i = 0; i < count; i++) {
    let len, time;
    if (memoryStage === "easy") {
      len = 3;
      time = 2000;
    } else if (memoryStage === "medium") {
      len = 4;
      time = 3000;
    } else {
      len = 5;
      time = 4000;
    }
    memoryQuestions.push({ number: generateMemoryNumber(len), mode: getMemoryMode(), time });
  }
  loadMemoryQuestion();
}

function runMemoryQuestion(q) {
  memoryLocked = false;
  alreadyAnswered = false;
  clearTimeout(memoryTimer);
  memoryInputValue = "";
  document.getElementById("memoryInput").textContent = "";
  document.getElementById("memoryResult").textContent = "";
  document.getElementById("memoryInstruction").textContent = "";
  enableAnswer(false);

  const box = document.getElementById("memoryDisplay");
  box.textContent = q.number;

  setTimeout(() => {
    box.textContent = "";
    document.getElementById("memoryInstruction").textContent = q.mode === "forward" ? "請正背" : "請逆背";
    setTimeout(() => {
      document.getElementById("memoryInstruction").textContent = "開始作答";
      enableAnswer(true);
      memoryTimer = setTimeout(() => {
        checkMemoryAnswer(true);
      }, memoryConfig[memoryStage].answer);
    }, memoryConfig[memoryStage].wait);
  }, memoryConfig[memoryStage].show);
}

function loadMemoryQuestion() {
  if (memoryIndex >= memoryQuestions.length) {
    nextMemoryStage();
    return;
  }
  runMemoryQuestion(memoryQuestions[memoryIndex]);
}

function checkMemoryAnswer(timeout = false) {
  if (memoryLocked || alreadyAnswered) return;
  memoryLocked = true;
  alreadyAnswered = true;
  enableAnswer(false);

  const q = memoryQuestions[memoryIndex];
  let correct = q.mode === "forward" ? q.number : q.number.split("").reverse().join("");
  let user = memoryInputValue;
  let isCorrect = !timeout && user === correct;

  document.getElementById("memoryResult").textContent = isCorrect ? "✔ 正確" : "✖ 錯誤";
  if (isCorrect) {
    memoryScore++;
    if (memoryStage === "easy") memoryEasy++;
    if (memoryStage === "medium") memoryMedium++;
    if (memoryStage === "hard") memoryHard++;
  }
  clearTimeout(memoryTimer);
  setTimeout(() => {
    memoryIndex++;
    loadMemoryQuestion();
  }, 800);
}

function nextMemoryStage() {
  if (memoryStage === "easy") {
    memoryStage = "medium";
    loadMemoryStage();
  } else if (memoryStage === "medium") {
    memoryStage = "hard";
    loadMemoryStage();
  } else {
    showMemoryResult();
  }
}

function showMemoryResult() {
  showScreen(memoryArea);
  document.getElementById("memoryResult").innerHTML = `
    <h2>記憶力結果</h2>
    易 ${memoryEasy}/5 <br>
    中 ${memoryMedium}/5 <br>
    難 ${memoryHard}/5 <br>
    <b>總 ${memoryScore}/15</b>
  `;
  gameScores.memory = memoryScore;
}