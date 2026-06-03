const login = document.querySelector(".login");
const control = document.querySelector(".control");
const buttonType = document.querySelector(".buttonType");
const buttonLevel = document.querySelector(".buttonLevel");
const instructions = document.querySelector(".instructions");
const buttonGroup = document.querySelector(".buttonGroup");
const gameTitle = document.getElementById("gameTitle");
const instructionText = document.getElementById("instructionText");

function setError(element, message) {
  element.classList.add("error");
  document.getElementById(element.id + "Error").textContent = message;
}

function clearError(element) {
  element.classList.remove("error");
  document.getElementById(element.id + "Error").textContent = "";
}

function validateName() {
  const n = document.getElementById("name");
  const value = n.value.trim();
  if (!value) {
    setError(n, "請輸入姓名");
    return false;
  }
  clearError(n);
  return true;
}

function validateAge() {
  const a = document.getElementById("age");
  const value = a.value.trim();
  if (!value) {
    setError(a, "請輸入年齡");
    return false;
  }
  if (isNaN(value) || value <= 0 || value > 130) {
    setError(a, "請輸入正確年齡");
    return false;
  }
  clearError(a);
  return true;
}

function validateIdNumber() {
  const id = document.getElementById("idNumber");
  const value = id.value.trim();
  if (!value || value < 0 || value > 999) {
    setError(id, "請輸入身分證後三碼");
    return false;
  }
  clearError(id);
  return true;
}

function validateMMSE() {
  const m = document.getElementById("MMSE");
  const value = m.value.trim();
  if (!value) {
    setError(m, "請輸入MMSE");
    return false;
  }
  if (isNaN(value) || value < 0 || value > 30) {
    setError(m, "MMSE為0～30分");
    return false;
  }
  clearError(m);
  return true;
}

function validateGender() {
  const g = document.getElementById("gender");
  const value = g.value;
  if (!value) {
    setError(g, "請選擇性別");
    return false;
  }
  clearError(g);
  return true;
}

function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => {
        s.classList.add("hidden");
    });
    screen.classList.remove("hidden");
}


function showInstructions(step) {
  document.getElementById("progress").style.display = "none";
  showScreen(instructions);
  buttonType.classList.add("hidden");
  buttonGroup.classList.add("hidden");
  gameTitle.classList.remove("hidden");
  instructionText.classList.remove("hidden");

  if (step === "type") {
    gameTitle.innerHTML = "請選擇題型";
    buttonType.classList.remove("hidden");
  }
  if (step === "start") {
    gameTitle.innerHTML = "遊戲說明";
    buttonGroup.classList.remove("hidden");
  }
}

function setInstructionText(level) {
  instructionText.classList.remove("hidden");
  if (level === "easy") {
    instructionText.textContent = "每一題將呈現四張圖片，其中三張圖片屬於相同類別，另一張圖片屬於不同類別，請選出不同者。作答時間為6秒，超過則算錯誤。";
  }
  if (level === "medium") {
    instructionText.textContent = "每一題將呈現六張圖片，其中五張圖片屬於相同類別，另一張圖片屬於不同類別，請選出不同者。作答時間為8秒，超過則算錯誤。";
  }
  if (level === "hard") {
    instructionText.textContent = "每一題將呈現六張圖片，其中四張圖片屬於相同類別，另兩張圖片屬於不同類別，且兩張圖片彼此類別亦不同，請選出不同者。作答時間為12秒，超過則算錯誤。";
  }
}

document.getElementById("name").addEventListener("input", validateName);
document.getElementById("age").addEventListener("input", validateAge);
document.getElementById("idNumber").addEventListener("input", validateIdNumber);
document.getElementById("MMSE").addEventListener("input", validateMMSE);
document.getElementById("gender").addEventListener("change", validateGender);

document.getElementById("loginButton").addEventListener("click", () => {
  const valid = validateName() && validateAge() && validateIdNumber() && validateMMSE() && validateGender();
  if (!valid) {
    alert("請修正錯誤資料");
    return;
  }
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const idNumber = document.getElementById("idNumber").value.trim();
  const MMSE = document.getElementById("MMSE").value.trim();
  const gender = document.getElementById("gender").value;
  showScreen(control);
});

document.getElementById("btnSemantic").addEventListener("click", () => {
  resetInstructionsUI();
  gameTitle.innerHTML = `<h2>有人不合群</h2>`;
  showInstructions("type");
});

document.getElementById("picture").addEventListener("click", () => {
  stage = "easy";
  isPracticeMode = true;
  showStageInstruction();
});

document.getElementById("character").addEventListener("click", () => {
  document.getElementById("character").textContent = "文字題（未開放）";
  document.getElementById("character").disabled = true;
});

document.getElementById("practiceButton").addEventListener("click", () => {
  isPracticeMode = true;
  current = 0;
  loadStageQuestions();
});

document.getElementById("startButton").addEventListener("click", () => {
  isPracticeMode = false;
  current = 0;
  loadStageQuestions();
});

document.getElementById("continueButton").addEventListener("click", () => {
  showScreen(control);
});

document.getElementById("endButton").addEventListener("click", () => {
  alert("這裡之後放雷達圖 + 所有遊戲分數統計");
});

const categories = {
  /*有生命*/
  living: {
    /*哺乳類*/
    mammal: ["mammal/cat.png", "mammal/dog.png", "mammal/elephant.png", "mammal/zebra.png", "mammal/horse.png", "mammal/kangaroo.png", "mammal/lion.png", "mammal/rabbit.png", "mammal/sheep.png"],
    /*昆蟲*/
    insect: ["insect/ant.png", "insect/bee.png", "insect/big-butterfly.png", "insect/dragonfly.png", "insect/flea.png", "insect/fly.png", "insect/ladybug.png", "insect/mosquito.png", "insect/orthoptera.png", "insect/praying-mantis.png", "insect/stag-beetle.png", "insect/butterfly.png"],
    /*海洋生物*/
    seaCreatures: ["seaCreatures/anglerfish.png", "seaCreatures/bream.png", "seaCreatures/dolphin.png", "seaCreatures/fish.png", "seaCreatures/seahorse.png", "seaCreatures/sea-turtle.png", "seaCreatures/shrimp.png", "seaCreatures/squid.png", "seaCreatures/whale.png"],
    /*鳥類*/
    bird: ["bird/bunting.png", "bird/king-fisher.png", "bird/parrot.png", "bird/pigeon.png", "bird/starling.png"]
  },
  /*無生命*/
  nonliving: {
    /*交通工具*/
    transportation: ["transportation/bike.png", "transportation/car.png", "transportation/cargo-ship.png", "transportation/delivery-truck.png", "transportation/helicopter.png", "transportation/motorcycle.png", "transportation/plane.png", "transportation/school-bus.png", "transportation/train.png", "transportation/truck.png", "transportation/van.png"],
    /*樂器*/
    instrument: ["instrument/cello.png", "instrument/drum-set.png", "instrument/flute.png", "instrument/guitar.png", "instrument/piano.png", "instrument/triangle.png", "instrument/trumpet.png"],
    /*文具*/
    stationery: ["stationery/pen.png", "stationery/pencil.png", "stationery/ruler.png", "stationery/scissors.png", "stationery/paper-clip.png"]
  }
};

const buttonsContainer = document.querySelector(".buttons");
const gameArea = document.querySelector(".gameArea");
const result = document.getElementById("result");
const overlayContainer = document.getElementById("overlayContainer");

let difficulty = "easy";
let current = 0;
let easyScore = 0;
let mediumScore = 0;
let hardScore = 0;
let currentQuestions = [];
let timer = null;
let timeLimit = 0;
let timeLeft = 0;
let isPracticeMode = false;
let selectedAnswers = [];
let isLocked = false;
let stage = "easy";
let totalAnswered = 0;
let totalQuestionAll = 0;
let gameScores = { semantic: 0, memory: 0, visualSearch: 0, spatial: 0, switching: 0 };

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function setTime() {
  if (difficulty === "easy") timeLimit = 6;
  else if (difficulty === "medium") timeLimit = 8;
  else timeLimit = 12;
}

function startTimer(onTimeout) {
  clearInterval(timer);
  timeLeft = timeLimit;
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      onTimeout();
    }
  }, 1000);
}

function generateQuestion(difficulty) {
  const mainType = Math.random() > 0.5 ? "living" : "nonliving";
  const mainPool = categories[mainType];
  if (!mainPool) return null;
  const mainCats = Object.keys(mainPool);
  const mainCat = getRandom(mainCats);
  if (!mainCat) return null;
  const count = difficulty === "easy" ? 4 : 6;
  let images = [];
  let used = new Set();
  let correct;

  if (difficulty !== "hard") {
    let wrongCat;
    do {
      wrongCat = getRandom(mainCats);
    } while (wrongCat === mainCat);

    while (images.length < count - 1) {
      let img = getRandom(mainPool[mainCat]);
      if (img && !used.has(img)) {
        used.add(img);
        images.push({ src: "images/" + img, category: mainCat });
      }
    }
    let wrongImg;
    do {
      wrongImg = getRandom(mainPool[wrongCat]);
    } while (used.has(wrongImg));

    images.push({ src: "images/" + wrongImg, category: wrongCat });
    correct = wrongCat;
  } else {
    let wrongCat1, wrongCat2;
    do {
      wrongCat1 = getRandom(mainCats);
    } while (wrongCat1 === mainCat);
    do {
      wrongCat2 = getRandom(mainCats);
    } while (wrongCat2 === mainCat || wrongCat2 === wrongCat1);

    while (images.length < count - 2) {
      let img = getRandom(mainPool[mainCat]);
      if (img && !used.has(img)) {
        used.add(img);
        images.push({ src: "images/" + img, category: mainCat });
      }
    }
    let wrongImg1, wrongImg2;
    do {
      wrongImg1 = getRandom(mainPool[wrongCat1]);
    } while (used.has(wrongImg1));
    do {
      wrongImg2 = getRandom(mainPool[wrongCat2]);
    } while (used.has(wrongImg2));

    images.push(
      { src: "images/" + wrongImg1, category: wrongCat1 },
      { src: "images/" + wrongImg2, category: wrongCat2 }
    );
    correct = [wrongCat1, wrongCat2];
  }
  images.sort(() => Math.random() - 0.5);
  return { images, correct };
}

function loadQuestion() {
  if (current >= currentQuestions.length) {
    if (isPracticeMode) {
      isPracticeMode = false;
      showStageInstruction();
      return;
    }
    goNextStage();
    return;
  }
  const q = currentQuestions[current];
  if (!q || !q.images) {
    console.error("❌ 題目不存在", q);
    return;
  }
  selectedAnswers = [];
  buttonsContainer.innerHTML = "";
  document.getElementById("progress").textContent = `${stage.toUpperCase()}｜第 ${current + 1} / ${currentQuestions.length} 題`;
  difficulty = q.difficulty;
  setTime();
  buttonsContainer.style.gridTemplateColumns = q.images.length === 6 ? "repeat(3, 180px)" : "repeat(2, 180px)";
  
  q.images.forEach(imgData => {
    const btn = document.createElement("button");
    const img = document.createElement("img");
    btn.dataset.category = imgData.category;
    img.src = imgData.src;
    btn.appendChild(img);
    btn.addEventListener("click", () => {
      if (isLocked) return;
      const cat = imgData.category;
      if (difficulty === "hard") {
        if (btn.classList.contains("selected")) {
          btn.classList.remove("selected");
          selectedAnswers = selectedAnswers.filter(a => a !== cat);
          return;
        }
        if (selectedAnswers.length >= 2) return;
        btn.classList.add("selected");
        selectedAnswers.push(cat);
        if (selectedAnswers.length === 2) {
          clearInterval(timer);
          checkAnswer(selectedAnswers);
        }
      } else {
        document.querySelectorAll(".buttons button").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        clearInterval(timer);
        checkAnswer([cat]);
      }
    });
    buttonsContainer.appendChild(btn);
  });
  startTimer(() => {
    showOverlay("wrong");
    nextQuestion();
  });
}

function nextQuestion() {
  current++;
  loadQuestion();
}

function showOverlay(type) {
  const div = document.createElement("div");
  div.classList.add("overlay");
  if (type === "correct") {
    div.classList.add("correct");
    div.textContent = "✔";
  } else {
    div.classList.add("wrong");
    div.textContent = "✖";
  }
  overlayContainer.appendChild(div);
  setTimeout(() => {
    div.remove();
  }, 800);
}

function checkAnswer(answer) {
  if (isLocked) return;
  isLocked = true;
  clearInterval(timer);
  const q = currentQuestions[current];
  const correct = q.correct;
  let isCorrect = false;

  if (difficulty === "hard") {
    isCorrect = answer.length === 2 && correct.includes(answer[0]) && correct.includes(answer[1]);
  } else {
    isCorrect = answer[0] === correct;
  }

  if (isCorrect) {
    if (difficulty === "easy") easyScore++;
    if (difficulty === "medium") mediumScore++;
    if (difficulty === "hard") hardScore++;
    showOverlay("correct");
  } else {
    showOverlay("wrong");
  }
  setTimeout(() => {
    isLocked = false;
    nextQuestion();
  }, 500);
}

function resetScores() {
  easyScore = 0;
  mediumScore = 0;
  hardScore = 0;
  totalQuestionAll = 0;
}

function startExperiment(isPractice = false) {
  resetScores();
  isPracticeMode = isPractice;
  current = 0;
  loadStageQuestions();
  showScreen(gameArea);
}

function goNextStage() {
  if (stage === "easy") {
    stage = "medium";
    showStageInstruction();
  } else if (stage === "medium") {
    stage = "hard";
    showStageInstruction();
  } else {
    showResult();
  }
}

function loadStageQuestions() {
  document.getElementById("progress").classList.remove("hidden");
  document.getElementById("progress").style.display = "block";
  buttonsContainer.innerHTML = "";
  currentQuestions = [];
  let count = isPracticeMode ? 1 : 5;
  if (!isPracticeMode) {
    totalQuestionAll += count;
  }
  for (let i = 0; i < count; i++) {
    const q = generateQuestion(stage);
    if (!q || !q.images) continue;
    currentQuestions.push({ ...q, difficulty: stage });
  }
  current = 0;
  if (currentQuestions.length === 0) {
    alert("題目載入失敗");
    return;
  }
  loadQuestion();
}

function showStageInstruction() {
  document.getElementById("progress").style.display = "none";
  showScreen(instructions);
  buttonType.classList.add("hidden");
  buttonGroup.classList.remove("hidden");
  gameTitle.classList.remove("hidden");
  instructionText.classList.remove("hidden");
  setInstructionText(stage);

  if (stage === "easy") {
    gameTitle.innerHTML = `<h2>有人不合群–易</h2>`;
  } else if (stage === "medium") {
    gameTitle.innerHTML = `<h2>有人不合群–中</h2>`;
  } else {
    gameTitle.innerHTML = `<h2>有人不合群–難</h2>`;
  }

  document.getElementById("startButton").onclick = () => {
    showScreen(gameArea);
    loadQuestion();
  };
  document.getElementById("practiceButton").onclick = () => {
    showScreen(gameArea);
    loadQuestion();
  };
}

function endPractice() {
  gameArea.classList.add("hidden");
  instructions.classList.remove("hidden");
  buttonGroup.classList.remove("hidden");
  gameTitle.classList.remove("hidden");
  instructionText.classList.remove("hidden");
}

function resetInstructionsUI() {
  gameTitle.innerHTML = "";
  instructionText.textContent = "";
  buttonType.classList.add("hidden");
  buttonGroup.classList.add("hidden");
}

function showResult() {
  if (difficulty === "easy") {
    console.log("easyScore set =", easyScore);
  }
  if (difficulty === "medium") {
    console.log("mediumScore set =", mediumScore);
  }
  if (difficulty === "hard") {
    console.log("hardScore set =", hardScore);
  }
  showScreen(document.querySelector(".result"));
  const totalScore = easyScore + mediumScore + hardScore;
  const totalQuestions = totalQuestionAll;
  const accuracy = ((totalScore / totalQuestions) * 100).toFixed(1);
  document.getElementById("playerScore").textContent = `總分：${totalScore} / ${totalQuestions} （正確率：${accuracy}%）`;
}

function sendData() {
  const name = document.getElementById("name").value.trim();
  const age = document.getElementById("age").value.trim();
  const idNumber = document.getElementById("idNumber").value.trim();
  const MMSE = document.getElementById("MMSE").value.trim();
  const gender = document.getElementById("gender").value;
  console.log(easyScore, mediumScore, hardScore);
  const totalScore = easyScore + mediumScore + hardScore;
  const totalQuestions = totalQuestionAll;
  const accuracy = totalQuestions ? ((totalScore / totalQuestions) * 100).toFixed(1) : 0;

  const payload = new URLSearchParams({
    name, age, idNumber, MMSE, gender,
    // 語意
    easyScore, mediumScore, hardScore, accuracy,
    // 記憶
    memoryScore, memoryEasy, memoryMedium, memoryHard
  });

  fetch("https://script.google.com/macros/s/AKfycbxwU-QQT9RHJYTMT9anSbwOUVrFaJ9CTHrq17-76uoxtMb9Fa9HtkExEzPh_q-4Bsz3/exec", {
    method: "POST",
    body: payload
  })
  .then(res => res.text())
  .then(data => {
    console.log("送出結果:", data);
  })
  .catch(err => {
    console.error(err);
    alert("送出失敗");
  });
}

function finishAllGames() {
  sendData();
}