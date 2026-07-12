// ==========================================
// 全域共同變數與畫面切換
// ==========================================
const login = document.querySelector(".login");
const control = document.querySelector(".control");
const buttonType = document.querySelector(".buttonType");
const buttonLevel = document.querySelector(".buttonLevel");
const instructions = document.querySelector(".instructions");
const buttonGroup = document.querySelector(".buttonGroup");
const gameTitle = document.getElementById("gameTitle");
const instructionText = document.getElementById("instructionText");
const buttonsContainer = document.querySelector(".buttons");
const gameArea = document.querySelector(".gameArea");
const overlayContainer = document.getElementById("overlayContainer");
const btnMemory = document.getElementById("btnMemory"); 

let semanticMode = "picture";
let currentGame = null; // "semantic", "memory", "visual"
let isPracticeMode = false;
let totalQuestionAll = 0;
let gameScores = { semantic: 0, memory: 0, visualSearch: 0, spatial: 0, switching: 0 };
let currentUserId = "";

function showScreen(screen) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function resetInstructionsUI() {
  gameTitle.innerHTML = "";
  instructionText.textContent = "";
  buttonType.classList.add("hidden"); //圖片題 或 文字題
  buttonGroup.classList.add("hidden"); //試玩 或 開始遊戲
}

// ==========================================
// 切換登入/註冊帳號（完美修正版：點擊時會隱藏主選單大按鈕）
// ==========================================
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const mainMenuContainer = document.querySelector(".main-menu-container"); // 抓取主選單容器

tabLogin.addEventListener("click", () => {
  // 隱藏主選單的兩個大按鈕，顯示登入輸入框
  mainMenuContainer.classList.add("hidden");
  loginForm.classList.remove("hidden");
  registerForm.classList.add("hidden");
});

tabRegister.addEventListener("click", () => {
  // 隱藏主選單的兩個大按鈕，顯示註冊與問卷
  mainMenuContainer.classList.add("hidden");
  registerForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  
  const regAccount = document.getElementById("regAccount").value.trim();

  if (!regAccount) {
    alert("請先在上方設定好您的『帳號』與『密碼』，下方問卷調查就會自動帶入您的遊戲ID！");
    return;
  }

  currentUserId = regAccount;

  const finalFormUrl = `https://docs.google.com/forms/d/e/1FAIpQLSc_s_7OibN8XDhCuGzB4yxQNy8a80yO7YpKY4EiXhBl4TbQ_Q/viewform?embedded=true&usp=pp_url&entry.782011933=${encodeURIComponent(currentUserId)}`;

  document.getElementById("google-form-iframe").src = finalFormUrl;
});

// 貼心功能：回到主選單的函式，等一下按鈕會用到
function backToMainMenu() {
  mainMenuContainer.classList.remove("hidden");
  loginForm.classList.add("hidden");
  registerForm.classList.add("hidden");
}

document.getElementById("btnSubmitLogin").addEventListener("click", () => {
  const loginAccount = document.getElementById("loginAccount").value.trim();
  const loginPass = document.getElementById("loginPassword").value.trim();

  if (!loginAccount || !loginPass) { alert("請輸入帳號與密碼！"); return; }

  currentUserId = loginAccount;
  showScreen(control);
});

document.getElementById("btnSubmitRegister").addEventListener("click", () => {
  const regAccount = document.getElementById("regAccount").value.trim();
  const regPass = document.getElementById("regPassword").value.trim();

  if (!regAccount || !regPass) { alert("請輸入您要設定的帳號與密碼！"); return; }

  const confirmStart = confirm("提醒您：下方的問卷調查是否已經點擊『提交』按鈕了呢？填寫完提交後才能開始玩遊戲喔！");

  if (confirmStart) {
    currentUserId = regAccount;
    showScreen(control);
  }
});

// ==========================================
// 遊戲一：找出不合群 (Semantic Game)
// ==========================================
let difficulty = "easy"; 
let current = 0;

let imgEasyScore = 0, imgMediumScore = 0, imgHardScore = 0;
let textEasyScore = 0, textMediumScore = 0, textHardScore = 0;
let imgTotalQuestions = 0;
let textTotalQuestions = 0;

let easyScore = 0, mediumScore = 0, hardScore = 0; 
let currentQuestions = [];
let timer = null;
let timeLimit = 0;
let timeLeft = 0;
let selectedAnswers = [];
let isLocked = false;
let stage = "easy";

const categories = {
  images: {
    living: {
      mammal: ["mammal/cat.png", "mammal/dog.png", "mammal/elephant.png", "mammal/zebra.png", "mammal/horse.png", "mammal/kangaroo.png", "mammal/lion.png", "mammal/rabbit.png", "mammal/sheep.png"],
      insect: ["insect/ant.png", "insect/bee.png", "insect/big-butterfly.png", "insect/dragonfly.png", "insect/flea.png", "insect/fly.png", "insect/ladybug.png", "insect/mosquito.png", "insect/orthoptera.png", "insect/praying-mantis.png", "insect/stag-beetle.png", "insect/butterfly.png"],
      seaCreatures: ["seaCreatures/anglerfish.png", "seaCreatures/bream.png", "seaCreatures/dolphin.png", "seaCreatures/fish.png", "seaCreatures/seahorse.png", "seaCreatures/sea-turtle.png", "seaCreatures/shrimp.png", "seaCreatures/squid.png", "seaCreatures/whale.png"],
      bird: ["bird/bunting.png", "bird/king-fisher.png", "bird/parrot.png", "bird/pigeon.png", "bird/starling.png"]
    },
    nonliving: {
      transportation: ["transportation/bike.png", "transportation/car.png", "transportation/cargo-ship.png", "transportation/delivery-truck.png", "transportation/helicopter.png", "transportation/motorcycle.png", "transportation/plane.png", "transportation/school-bus.png", "transportation/train.png", "transportation/truck.png", "transportation/van.png"],
      instrument: ["instrument/cello.png", "instrument/drum-set.png", "instrument/flute.png", "instrument/guitar.png", "instrument/piano.png", "instrument/triangle.png", "instrument/trumpet.png"],
      stationery: ["stationery/pen.png", "stationery/pencil.png", "stationery/ruler.png", "stationery/scissors.png", "stationery/paper-clip.png"]
    }
  },
  texts: {
    living: {
      mammal: ["貓咪", "狗", "大象", "斑馬", "綿羊", "獅子", "兔子", "袋鼠", "馬"],
      insect: ["螞蟻", "蜜蜂", "蝴蝶", "蜻蜓", "蒼蠅", "蚊子", "瓢蟲", "螳螂", "鍬形蟲"],
      seaCreatures: ["海豚", "鯨魚", "章魚", "小丑魚", "螃蟹", "海龜", "蝦", "烏賊", "鯊魚"],
      bird: ["鴿子", "麻雀", "鸚鵡", "老鷹", "燕子", "烏鴉", "貓頭鷹"]
    },
    nonliving: {
      transportation: ["汽車", "火車", "飛機", "腳踏車", "機車", "公車", "卡車", "船", "直升機"],
      instrument: ["鋼琴", "吉他", "小提琴", "爵士鼓", "長笛", "豎琴", "古箏", "三角鐵"],
      stationery: ["鉛筆", "原子筆", "尺", "剪刀", "橡皮擦", "膠帶", "彩色筆", "筆記本", "迴紋針"]
    }
  }
};

document.getElementById("btnSemantic").addEventListener("click", () => {
  resetInstructionsUI();
  currentGame = "semantic";
  gameTitle.innerHTML = `<h2>找出不合群</h2>`;
  showInstructions("type");
});

function showInstructions(type) {
  showScreen(instructions);
  if(type === "type") {
    buttonType.classList.remove("hidden");
    buttonGroup.classList.add("hidden");
    instructionText.textContent = "";
  }
}

document.getElementById("picture").addEventListener("click", () => {
  semanticMode = "picture";
  stage = "easy";
  isPracticeMode = true;
  
  imgEasyScore = 0; 
  imgMediumScore = 0; 
  imgHardScore = 0;
  imgTotalQuestions = 0;
  
  showStageInstruction();
});

document.getElementById("character").addEventListener("click", () => {
  semanticMode = "character"; 
  stage = "easy";
  isPracticeMode = true;
  
  textEasyScore = 0; 
  textMediumScore = 0; 
  textHardScore = 0;
  textTotalQuestions = 0;
  
  showStageInstruction();
});

function showStageInstruction() {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  
  const instScreen = document.getElementById("instructionsScreen") || instructions;
  if (instScreen) instScreen.classList.remove("hidden");
  if (buttonGroup) buttonGroup.classList.remove("hidden"); 
  if (buttonType) buttonType.classList.add("hidden"); 

  let title = "";
  let text = "";

  const diffTxt = stage === "easy" ? "易" : stage === "medium" ? "中" : "難";
  title = `找出不合群–${diffTxt}`;

  if (semanticMode === "picture") {
    if (stage === "easy") {
      text = `每一題將呈現四張圖片，其中三張圖片屬於相同類別，另一張圖片屬於不同類別，請選出不同者。作答時間為6秒，超過則算錯誤。`;
    } else if (stage === "medium") {
      text = `每一題將呈現六張圖片，其中五張圖片屬於相同類別，另一張圖片屬於不同類別，請選出不同者。作答時間為8秒，超過則算錯誤。`;
    } else if (stage === "hard") {
      text = `每一題將呈現六張圖片，其中四張圖片屬於相同類別，另兩張圖片屬於不同類別，且兩張圖片彼此類別亦不同，請選出不同者。作答時間為12秒，超過則算錯誤。`;
    }
  } else {
    if (stage === "easy") {
      text = `每一題將呈現四個詞，其中三個詞屬於相同類別，另一個詞屬於不同類別，請選出不同者。作答時間為6秒，超過則算錯誤。`;
    } else if (stage === "medium") {
      text = `每一題將呈現六個詞，其中五個詞屬於相同類別，另一個詞屬於不同類別，請選出不同者。作答時間為8秒，超過則算錯誤。`;
    } else if (stage === "hard") {
      text = `每一題將呈現六個詞，其中四個詞屬於相同類別，另兩個詞屬於不同類別，且兩個詞彼此類別亦不同，請選出不同者。作答時間為12秒，超過則算錯誤。`;
    }
  }

  const titleEl = document.getElementById("gameTitle");
  const textEl = document.getElementById("instructionText");
  
  if (titleEl) {
    titleEl.innerHTML = `<h2>${title}</h2>`;
    titleEl.classList.remove("hidden"); 
  }
  if (textEl) {
    textEl.innerHTML = text;
    textEl.classList.remove("hidden");
  }

  const pracBtn = document.getElementById("practiceButton");
  const startBtn = document.getElementById("startButton");
  
  if (pracBtn) {
    pracBtn.onclick = () => {
      isPracticeMode = true;
      showScreen(gameArea);
      loadStageQuestions();
    };
  }
  if (startBtn) {
    startBtn.onclick = () => {
      isPracticeMode = false;
      showScreen(gameArea);
      loadStageQuestions();
    };
  }
}

function loadStageQuestions() {
  document.getElementById("progress").classList.remove("hidden");
  buttonsContainer.innerHTML = "";
  currentQuestions = [];
  let count = isPracticeMode ? 1 : 5;
  
  if (!isPracticeMode) {
    if (semanticMode === "picture") {
      imgTotalQuestions += count;
    } else {
      textTotalQuestions += count;
    }
  }

  for (let i = 0; i < count; i++) {
    const q = generateQuestion(stage);
    if (q) currentQuestions.push({ ...q, difficulty: stage });
  }
  current = 0;
  loadQuestion();
}

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function generateQuestion(diff) {
  const currentPool = categories[semanticMode === "picture" ? "images" : "texts"];
  const mainType = Math.random() > 0.5 ? "living" : "nonliving";
  const mainPool = currentPool[mainType];
  let cats = Object.keys(mainPool).sort(() => Math.random() - 0.5);
  
  if (diff === "hard" && cats.length < 3) {
    const otherType = mainType === "living" ? "nonliving" : "living";
    const otherCats = Object.keys(currentPool[otherType]).sort(() => Math.random() - 0.5);
    while (cats.length < 3 && otherCats.length > 0) {
      cats.push(otherCats.pop());
    }
  }

  const mainCat = cats[0]; 
  const count = diff === "easy" ? 4 : 6;
  let items = [];
  let correct;

  function getItemPool(catName) {
    if (currentPool.living[catName]) return [...currentPool.living[catName]];
    if (currentPool.nonliving[catName]) return [...currentPool.nonliving[catName]];
    return [];
  }

  if (diff !== "hard") {
    const wrongCat = cats[1];
    let mainSrcPool = getItemPool(mainCat).sort(() => Math.random() - 0.5);
    while (items.length < count - 1 && mainSrcPool.length > 0) {
      items.push({ content: mainSrcPool.pop(), category: mainCat });
    }
    let wrongSrcPool = getItemPool(wrongCat).sort(() => Math.random() - 0.5);
    if (wrongSrcPool.length > 0) {
      items.push({ content: wrongSrcPool.pop(), category: wrongCat });
    }
    correct = wrongCat;
  } else {
    const wrongCat1 = cats[1];
    const wrongCat2 = cats[2];
    let mainSrcPool = getItemPool(mainCat).sort(() => Math.random() - 0.5);
    while (items.length < count - 2 && mainSrcPool.length > 0) {
      items.push({ content: mainSrcPool.pop(), category: mainCat });
    }
    let wrongSrcPool1 = getItemPool(wrongCat1).sort(() => Math.random() - 0.5);
    if (wrongSrcPool1.length > 0) {
      items.push({ content: wrongSrcPool1.pop(), category: wrongCat1 });
    }
    let wrongSrcPool2 = getItemPool(wrongCat2).sort(() => Math.random() - 0.5);
    if (wrongSrcPool2.length > 0) {
      items.push({ content: wrongSrcPool2.pop(), category: wrongCat2 });
    }
    correct = [wrongCat1, wrongCat2];
  }
  
  items.sort(() => Math.random() - 0.5);
  return { items, correct };
}

function loadQuestion() {
  if (current >= currentQuestions.length) {
    if (isPracticeMode) {
      isPracticeMode = false;
      showStageInstruction();
    } else {
      goNextStage();
    }
    return;
  }
  const q = currentQuestions[current];
  selectedAnswers = [];
  buttonsContainer.innerHTML = "";
  
  const modeText = semanticMode === "picture" ? "圖片題" : "文字題";
  document.getElementById("progress").textContent = `${modeText}｜${stage.toUpperCase()}｜第 ${current + 1} / ${currentQuestions.length} 題`;
  
  difficulty = q.difficulty;
  if (difficulty === "easy") timeLimit = 6;
  else if (difficulty === "medium") timeLimit = 8;
  else timeLimit = 12;

  buttonsContainer.removeAttribute("style"); 
  buttonsContainer.classList.add("buttons-grid");
  
  q.items.forEach(itemData => {
    const btn = document.createElement("button");
    btn.dataset.category = itemData.category;
    
    if (semanticMode === "picture") {
      const img = document.createElement("img");
      img.src = "images/" + itemData.content; 
      btn.appendChild(img);
    } else {
      btn.textContent = itemData.content;
      btn.classList.add("text-mode-btn");
    }
    
    btn.addEventListener("click", () => {
      if (isLocked) return;
      const cat = itemData.category;
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

  clearInterval(timer);
  timeLeft = timeLimit;
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showOverlay("wrong");
      setTimeout(nextQuestion, 500);
    }
  }, 1000);
}

function checkAnswer(answer) {
  if (isLocked) return;
  isLocked = true;
  clearInterval(timer);
  const q = currentQuestions[current];
  let isCorrect = false;

  if (difficulty === "hard") {
    isCorrect = answer.length === 2 && q.correct.includes(answer[0]) && q.correct.includes(answer[1]);
  } else {
    isCorrect = answer[0] === q.correct;
  }

  if (isCorrect) {
    if (!isPracticeMode) {
      if (semanticMode === "picture") {
        if (difficulty === "easy") imgEasyScore++;
        if (difficulty === "medium") imgMediumScore++;
        if (difficulty === "hard") imgHardScore++;
      } else {
        if (difficulty === "easy") textEasyScore++;
        if (difficulty === "medium") textMediumScore++;
        if (difficulty === "hard") textHardScore++;
      }
    }
    showOverlay("correct");
  } else {
    showOverlay("wrong");
  }
  setTimeout(() => {
    isLocked = false;
    nextQuestion();
  }, 800);
}

function nextQuestion() {
  current++;
  loadQuestion();
}

function showOverlay(type) {
  const gameAreaEl = document.querySelector(".gameArea");
  const memoryAreaEl = document.querySelector(".memoryArea");
  const visualAreaEl = document.querySelector(".visualArea");
  let currentContainer = null;

  if (gameAreaEl && !gameAreaEl.classList.contains("hidden")) {
    currentContainer = document.getElementById("overlayContainer") || gameAreaEl;
  } 
  else if (memoryAreaEl && !memoryAreaEl.classList.contains("hidden")) {
    currentContainer = document.getElementById("memoryResult") || memoryAreaEl;
  }
  else if (visualAreaEl && !visualAreaEl.classList.contains("hidden")) {
    currentContainer = document.getElementById("visualOverlayContainer") || visualAreaEl;
  }

  if (!currentContainer) return;

  const div = document.createElement("div");
  div.className = `overlay ${type}`;
  div.textContent = type === "correct" ? "✔" : "✖";

  currentContainer.appendChild(div);
  setTimeout(() => div.remove(), 800);
}

function goNextStage() {
  if (stage === "easy") { stage = "medium"; showStageInstruction(); }
  else if (stage === "medium") { stage = "hard"; showStageInstruction(); }
  else { showSemanticResult(); }
}

function showSemanticResult() {
  showScreen(document.querySelector(".result"));
  
  easyScore = imgEasyScore + textEasyScore;
  mediumScore = imgMediumScore + textMediumScore;
  hardScore = imgHardScore + textHardScore;
  
  const totalScore = easyScore + mediumScore + hardScore;
  const combinedTotalQuestions = imgTotalQuestions + textTotalQuestions;
  
  const accuracy = combinedTotalQuestions ? ((totalScore / combinedTotalQuestions) * 100).toFixed(1) : 0;
  
  document.getElementById("playerScore").innerHTML = `
    <h2>找出不合群 測試完成</h2>
    易（圖片+文字）：${easyScore} 分<br>
    中（圖片+文字）：${mediumScore} 分<br>
    難（圖片+文字）：${hardScore} 分<br>
    <b>總得分：${totalScore} / ${combinedTotalQuestions} （正確率：${accuracy}%）</b>
  `;
  
  gameScores.semantic = totalScore;
  sendData();
}

document.getElementById("continueButton").addEventListener("click", () => showScreen(control));
document.getElementById("endButton").addEventListener("click", () => alert("即將呈現所有遊戲統計雷達圖"));

// ==========================================
// 遊戲二：數字點點名 (Memory Game)
// ==========================================
let memoryStage = "easy";
let memoryIndex = 0;
let memoryScore = 0;
let memoryEasy = 0, memoryMedium = 0, memoryHard = 0;
let memoryQuestions = [];
let memoryTimer = null;
let memoryInputValue = "";
let memoryLocked = false;
let alreadyAnswered = false;
let totalMemoryQuestionAll = 0;
const memoryAreaEl = document.querySelector(".memoryArea");

const memoryConfig = {
  easy: { show: 2000, wait: 4000, answer: 6000, len: 3 },
  medium: { show: 3000, wait: 5000, answer: 8000, len: 4 },
  hard: { show: 4000, margin: 7000, answer: 11000, len: 5 }
};

if (btnMemory) {
  btnMemory.addEventListener("click", () => {
    currentGame = "memory";
    memoryStage = "easy";
    memoryScore = 0;
    memoryEasy = 0;
    memoryMedium = 0;
    memoryHard = 0;
    totalMemoryQuestionAll = 0;
    showMemoryInstruction();
  });
}

function showMemoryInstruction() {
  showScreen(instructions);
  gameTitle.classList.remove("hidden");
  instructionText.classList.remove("hidden");
  document.querySelector(".buttonGroup").classList.remove("hidden");
  buttonType.classList.add("hidden");

  if (memoryStage === "easy") {
    gameTitle.innerHTML = `<h2>數字點點名–易</h2>`;
    instructionText.textContent = "每一題將給予3位隨機數字，並出現正背或逆背之提示訊息，請依照提示按順序輸入數字。數字出現2秒，提示與思考4秒，作答時間6秒。";
  } else if (memoryStage === "medium") {
    gameTitle.innerHTML = `<h2>數字點點名–中</h2>`;
    instructionText.textContent = "每一題將給予4位隨機數字，並出現正背或逆背之提示訊息，請依照提示按順序輸入數字。數字出現3秒，提示與思考5秒，作答時間8秒。";
  } else if (memoryStage === "hard") {
    gameTitle.innerHTML = `<h2>數字點點名–難</h2>`;
    instructionText.textContent = "每一題將給予5位隨機數字，並出現正背或逆背之提示訊息，請依照提示按順序輸入數字。數字出現4秒，提示與思考7秒，作答時間11秒。";
  }

  document.getElementById("practiceButton").onclick = () => { isPracticeMode = true; startMemoryGame(); };
  document.getElementById("startButton").onclick = () => { isPracticeMode = false; startMemoryGame(); };
}

function startMemoryGame() {
  if (memoryStage === "easy" && !isPracticeMode) {
    memoryScore = 0; memoryEasy = 0; memoryMedium = 0; memoryHard = 0;
  }
  showScreen(memoryAreaEl);
  loadMemoryStage();
}

function loadMemoryStage() {
  memoryQuestions = [];
  let count = isPracticeMode ? 1 : 5;
  let cfg = memoryConfig[memoryStage];

  if (!isPracticeMode) {
    totalMemoryQuestionAll += count;
  }

  for (let i = 0; i < count; i++) {
    let num = "";
    for (let j = 0; j < cfg.len; j++) num += Math.floor(Math.random() * 10);
    memoryQuestions.push({ number: num, mode: Math.random() > 0.5 ? "forward" : "backward" });
  }
  memoryIndex = 0;
  loadMemoryQuestion();
}

function loadMemoryQuestion() {
  if (memoryIndex >= memoryQuestions.length) {
    if (isPracticeMode) {
      isPracticeMode = false;
      showMemoryInstruction();
    } else {
      nextMemoryStage();
    }
    return;
  }
  runMemoryQuestion(memoryQuestions[memoryIndex]);
}

function runMemoryQuestion(q) {
  memoryLocked = false;
  alreadyAnswered = false;
  clearTimeout(memoryTimer);
  memoryInputValue = "";
  document.getElementById("memoryInput").textContent = "";
  document.getElementById("memoryResult").textContent = "";
  document.getElementById("memoryInstruction").textContent = `第 ${memoryIndex + 1} 題（${memoryStage.toUpperCase()}）`;
  
  enableKeypad(false);
  const box = document.getElementById("memoryDisplay");
  box.textContent = q.number;

  let cfg = memoryConfig[memoryStage];

  setTimeout(() => {
    box.textContent = "";
    document.getElementById("memoryInstruction").textContent = q.mode === "forward" ? "請正背" : "請逆背";
    
    setTimeout(() => {
      document.getElementById("memoryInstruction").textContent = "開始作答！";
      enableKeypad(true);
      
      memoryTimer = setTimeout(() => {
        checkMemoryAnswer(true);
      }, cfg.answer);
    }, cfg.wait || 5000); 
  }, cfg.show);
}

function enableKeypad(bool) {
  document.querySelectorAll(".keypad button").forEach(b => b.disabled = !bool);
}

const keypadButtons = document.querySelectorAll(".keypad button");
keypadButtons.forEach(btn => {
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
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

function checkMemoryAnswer(timeout = false) {
  if (memoryLocked || alreadyAnswered) return;
  memoryLocked = true;
  alreadyAnswered = true;
  
  enableKeypad(false); 

  const q = memoryQuestions[memoryIndex];
  let correct = q.mode === "forward" ? q.number : q.number.split("").reverse().join("");
  let user = memoryInputValue;
  let isCorrect = !timeout && user === correct;

  if (isCorrect) {
    showOverlay("correct"); 
    if (!isPracticeMode) { 
      memoryScore++;
      if (memoryStage === "easy") memoryEasy++;
      if (memoryStage === "medium") memoryMedium++;
      if (memoryStage === "hard") memoryHard++;
    }
  } else {
    showOverlay("wrong"); 
  }
  
  clearTimeout(memoryTimer);
  setTimeout(() => {
    memoryIndex++;
    loadMemoryQuestion();
  }, 800);
}

function nextMemoryStage() {
  if (memoryStage === "easy") { memoryStage = "medium"; showMemoryInstruction(); }
  else if (memoryStage === "medium") { memoryStage = "hard"; showMemoryInstruction(); }
  else { showMemoryResult(); }
}

function showMemoryResult() {
  showScreen(document.querySelector(".result"));
  document.getElementById("playerScore").innerHTML = `
    <h2>數字點點名 測試完成</h2>
    易：${memoryEasy} / 5<br>
    中：${memoryMedium} / 5<br>
    難：${memoryHard} / 5<br>
    <b>總得分：${memoryScore} / 15</b>
  `;
  gameScores.memory = memoryScore;
  sendData();
}

// ==========================================
// 遊戲三：抓出冒牌貨 (Visual Search Game)
// ==========================================
let visualEasyScore = 0, visualMediumScore = 0, visualHardScore = 0;
let visualTotalQuestions = 0;

const visualMediumPairs = [
  { target: "N", distractor: "M" },
  { target: "V", distractor: "W" },
  { target: "F", distractor: "H" },
  { target: "X", distractor: "Y" },
  { target: "R", distractor: "B" }
];
const visualHardPairs = [
  { target: "T", distractor: "I" },
  { target: "K", distractor: "X" },
  { target: "Q", distractor: "O" },
  { target: "R", distractor: "P" },
  { target: "F", distractor: "E" }
];

document.getElementById("btnVisualSearch").addEventListener("click", () => {
  resetInstructionsUI();
  
  currentGame = "visual";
  visualEasyScore = 0;
  visualMediumScore = 0;
  visualHardScore = 0;
  visualTotalQuestions = 0;
  stage = "easy";
  isPracticeMode = true;
  
  showVisualStageInstruction(); 
});

function showVisualStageInstruction() {
  showScreen(instructions);
  gameTitle.classList.remove("hidden");
  instructionText.classList.remove("hidden");
  buttonGroup.classList.remove("hidden");
  buttonType.classList.add("hidden"); 

  let title = "";
  let text = "";
  const diffTxt = stage === "easy" ? "易" : stage === "medium" ? "中" : "難";
  title = `抓出冒牌貨–${diffTxt}`;

  if (stage === "easy") {
    text = `每一題將呈現 4×4 的字母，其中有一個字母的特徵與其他不同，請從中找出那一個不同的字母。作答時間為 3 秒，超過算錯。`;
  } else if (stage === "medium") {
    text = `每一題將呈現 5×5 的字母，其中有一個字母的特徵與其他不同，請從中找出那一個不同的字母。作答時間為 6 秒，超過算錯。`;
  } else if (stage === "hard") {
    text = `每一題將呈現 6×6 的字母，其中有一個字母的特徵與其他不同，請從中找出那一個不同的字母。作答時間為 9 秒，超過算錯。`;
  }

  gameTitle.innerHTML = `<h2>${title}</h2>`;
  instructionText.innerHTML = text;

  document.getElementById("practiceButton").onclick = () => {
    isPracticeMode = true;
    showScreen(document.querySelector(".visualArea"));
    loadVisualStageQuestions();
  };
  
  document.getElementById("startButton").onclick = () => {
    isPracticeMode = false;
    showScreen(document.querySelector(".visualArea"));
    loadVisualStageQuestions();
  };
}

function generateVisualQuestion(diff) {
  let gridSize = 4; 
  let targetChar = "";
  let distractorChar = "";
  
  if (diff === "easy") {
    gridSize = 4; 
    const straight = ["A","E","F","H","I","K","L","M","N","T","V","W","X","Y","Z"];
    const curved = ["B","C","D","G","J","O","P","Q","R","S","U"];
    
    if (Math.random() > 0.5) {
      targetChar = getRandom(straight);
      distractorChar = getRandom(curved);
    } else {
      targetChar = getRandom(curved);
      distractorChar = getRandom(straight);
    }
  } 
  else if (diff === "medium") {
    gridSize = 5; 
    const pair = getRandom(visualMediumPairs);
    targetChar = Math.random() > 0.5 ? pair.target : pair.distractor;
    distractorChar = targetChar === pair.target ? pair.distractor : pair.target;
  } 
  else if (diff === "hard") {
    gridSize = 6; 
    const pair = getRandom(visualHardPairs);
    targetChar = Math.random() > 0.5 ? pair.target : pair.distractor;
    distractorChar = targetChar === pair.target ? pair.distractor : pair.target;
  }

  const totalCells = gridSize * gridSize;
  let items = [];
  
  items.push({ content: targetChar, isTarget: true });
  
  for (let i = 0; i < totalCells - 1; i++) {
    items.push({ content: distractorChar, isTarget: false });
  }
  
  items.sort(() => Math.random() - 0.5);
  return { gridSize, items };
}

function loadVisualStageQuestions() {
  document.getElementById("progress").classList.remove("hidden");
  const visualButtons = document.getElementById("visualButtons"); 
  visualButtons.innerHTML = "";
  currentQuestions = [];
  
  let count = isPracticeMode ? 1 : (stage === "easy" ? 15 : stage === "medium" ? 10 : 5);
  
  if (!isPracticeMode) visualTotalQuestions += count;

  for (let i = 0; i < count; i++) {
    const q = generateVisualQuestion(stage);
    currentQuestions.push(q);
  }
  current = 0;
  loadVisualQuestion();
}

function loadVisualQuestion() {
  if (current >= currentQuestions.length) {
    if (isPracticeMode) {
      isPracticeMode = false;
      showVisualStageInstruction(); 
    } else {
      goNextVisualStage(); 
    }
    return;
  }

  const q = currentQuestions[current];
  visualButtons.innerHTML = "";
  
  document.getElementById("progress").textContent = `視覺搜尋｜${stage.toUpperCase()}｜第 ${current + 1} / ${currentQuestions.length} 題`;
  
  // 🎯 完美修正：時間判定改為 3 / 6 / 9 秒
  if (stage === "easy") {
    timeLimit = 3;
  } else if (stage === "medium") {
    timeLimit = 6;
  } else if (stage === "hard") {
    timeLimit = 9;
  }

  visualButtons.removeAttribute("style"); 
  visualButtons.style.display = "grid";
  visualButtons.style.gridTemplateColumns = `repeat(${q.gridSize}, 1fr)`;
  visualButtons.style.gap = "8px";
  
  q.items.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.content;
    btn.classList.add("text-mode-btn"); 
    
    btn.addEventListener("click", () => {
      if (isLocked) return;
      isLocked = true;
      clearInterval(timer);
      
      if (item.isTarget) {
        if (!isPracticeMode) {
          if (stage === "easy") visualEasyScore++;
          if (stage === "medium") visualMediumScore++;
          if (stage === "hard") visualHardScore++;
        }
        showOverlay("correct"); 
      } else {
        showOverlay("wrong");
      }
      
      setTimeout(() => {
        isLocked = false;
        current++;
        loadVisualQuestion();
      }, 800);
    });
    
    visualButtons.appendChild(btn);
  });

  clearInterval(timer);
  timeLeft = timeLimit;
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showOverlay("wrong"); 
      setTimeout(() => {
        current++;
        loadVisualQuestion();
      }, 500);
    }
  }, 1000);
}

function goNextVisualStage() {
  if (stage === "easy") { 
    stage = "medium"; 
    showVisualStageInstruction(); 
  } else if (stage === "medium") { 
    stage = "hard"; 
    showVisualStageInstruction(); 
  } else { 
    showVisualResult(); 
  }
}

function showVisualResult() {
  showScreen(document.querySelector(".result"));
  
  const totalScore = visualEasyScore + visualMediumScore + visualHardScore;
  const accuracy = visualTotalQuestions ? ((totalScore / visualTotalQuestions) * 100).toFixed(1) : 0;
  
  document.getElementById("playerScore").innerHTML = `
    <h2>視覺搜尋 測試完成</h2>
    易：${visualEasyScore} / 15<br>
    中：${visualMediumScore} / 10<br>
    難：${visualHardScore} / 5<br>
    <b>總得分：${totalScore} / ${visualTotalQuestions} （正確率：${accuracy}%）</b>
  `;
  
  gameScores.visualSearch = totalScore;
  sendData();
}

// ==========================================
// 資料後端傳送 (Google Sheets API)
// ==========================================
function sendData() {
  const totalSemantic = easyScore + mediumScore + hardScore; 
  const accuracy = totalQuestionAll ? Number(((totalSemantic / totalQuestionAll) * 100).toFixed(1)) : 0;
  const memoryAccuracy = totalMemoryQuestionAll ? Number(((memoryScore / totalMemoryQuestionAll) * 100).toFixed(1)) : 0;
  
  const visualAccuracy = visualTotalQuestions ? Number(((gameScores.visualSearch / visualTotalQuestions) * 100).toFixed(1)) : 0;

  const payload = {
    userId: currentUserId,
    easyScore: easyScore,
    mediumScore: mediumScore,
    hardScore: hardScore,
    semanticScore: totalSemantic,
    accuracy: accuracy,
    memoryEasy: memoryEasy,
    memoryMedium: memoryMedium,
    memoryHard: memoryHard,
    memoryScore: memoryScore,
    memoryAccuracy: memoryAccuracy,
    visualEasy: visualEasyScore,
    visualMedium: visualMediumScore,
    visualHard: visualHardScore,
    visualScore: gameScores.visualSearch,
    visualAccuracy: visualAccuracy
  };

  fetch("https://script.google.com/macros/s/AKfycbxwU-QQT9RHJYTMT9anSbwOUVrFaJ9CTHrq17-76uoxtMb9Fa9HtkExEzPh_q-4Bsz3/exec", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain" 
    },
    body: JSON.stringify(payload)
  })
  .then(res => res.json())
  .then((resData) => {
    if (resData.result === "success") {
      console.log("資料已成功比對 ID 並填入對應欄位！");
    } else {
      console.warn("GAS 警告:", resData.message);
    }
  })
  .catch(err => console.error("送出失敗:", err));
}