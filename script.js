const loginAccount = document.getElementById("loginAccount");
const registerAccount = document.getElementById("registerAccount");

const firstScreen = document.querySelector(".first");
const secondScreenLogin = document.getElementById("loginForm");
const secondScreenRegister = document.getElementById("registerForm");
const backToFirstScreen = document.querySelectorAll(".back");

const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyxVThfYLEPU99PfadgKriME2bijyicBrtRPhYHUW95xERSWi-UgWre4a692AEE_pJO/exec";

const regSubmitButton = document.getElementById("regSubmitButton");
const logSubmitButton = document.getElementById("logSubmitButton");

const thirdScreen = document.querySelector(".third");

const btnSemantic = document.getElementById("btnSemantic");
const semBeginning = document.getElementById("semBeginning");
const semEasy = document.getElementById("semEasy");
const semMedium = document.getElementById("semMedium");
const semHard = document.getElementById("semHard");
const trySem = document.getElementById("trySem");
const startSem = document.getElementById("startSem");

const gameArea = document.querySelector(".gameArea");
const buttons = document.querySelector(".buttons");
const confirmAnswerBtn = document.getElementById("confirmAnswerBtn");
const backToSemBeginningBtn = document.getElementById("backToSemBeginningBtn"); 
const timeLeftSpan = document.getElementById("timeLeft");
const progressText = document.getElementById("progressText");
const questionInstruction = document.getElementById("questionInstruction");
const feedbackOverlay = document.getElementById("feedbackOverlay");
const feedbackIcon = document.getElementById("feedbackIcon");
const feedbackText = document.getElementById("feedbackText");

const scoreScreen = document.querySelector(".scoreScreen");
const finalScoreDetails = document.getElementById("finalScoreDetails");
const backToMenuFromScore = document.getElementById("backToMenuFromScore");

const images = {
    living: {
        mammal: ["images/mammal/cat.png", "images/mammal/dog.png", "images/mammal/elephant.png", "images/mammal/zebra.png", "images/mammal/horse.png", "images/mammal/kangaroo.png", "images/mammal/lion.png", "images/mammal/rabbit.png", "images/mammal/sheep.png"],
        insect: ["images/insect/ant.png", "images/insect/bee.png", "images/insect/big-butterfly.png", "images/insect/dragonfly.png", "images/insect/flea.png", "images/insect/fly.png", "images/insect/ladybug.png", "images/insect/mosquito.png", "images/insect/orthoptera.png", "images/insect/praying-mantis.png", "images/insect/stag-beetle.png", "images/insect/butterfly.png"],
        seaCreatures: ["images/seaCreatures/anglerfish.png", "images/seaCreatures/bream.png", "images/seaCreatures/dolphin.png", "images/seaCreatures/fish.png", "images/seaCreatures/seahorse.png", "images/seaCreatures/sea-turtle.png", "images/seaCreatures/shrimp.png", "images/seaCreatures/squid.png", "images/seaCreatures/whale.png"],
        bird: ["images/bird/bunting.png", "images/bird/king-fisher.png", "images/bird/parrot.png", "images/bird/pigeon.png", "images/bird/starling.png"]
    },
    nonliving: {
        transportation: ["images/transportation/bike.png", "images/transportation/car.png", "images/transportation/cargo-ship.png", "images/transportation/delivery-truck.png", "images/transportation/helicopter.png", "images/transportation/motorcycle.png", "images/transportation/plane.png", "images/transportation/school-bus.png", "images/transportation/train.png", "images/transportation/truck.png", "images/transportation/van.png"],
        instrument: ["images/instrument/cello.png", "images/instrument/drum-set.png", "images/instrument/flute.png", "images/instrument/guitar.png", "images/instrument/piano.png", "images/instrument/triangle.png", "images/instrument/trumpet.png"],
        stationery: ["images/stationery/pen.png", "images/stationery/pencil.png", "images/stationery/ruler.png", "images/stationery/scissors.png", "images/stationery/paper-clip.png"]
    }
};

const btnMemory = document.getElementById("btnMemory");
const memBeginning = document.getElementById("memBeginning");
const memEasy = document.getElementById("memEasy");
const memMedium = document.getElementById("memMedium");
const memHard = document.getElementById("memHard");
const tryMem = document.getElementById("tryMem");
const startMem = document.getElementById("startMem");
const backToMenuFromMem = document.getElementById("backToMenuFromMem");

let tryMode = false;
let currentQuestions = [];
let currentQuestionIndex = 0;
let stage = "easy";
let score = { easy: 0, medium: 0, hard: 0 };
let answeredCount = { easy: 0, medium: 0, hard: 0 };
let timer = null;
let timeLeft = 60;
let startTime = 0;
let selectedImages = [];

let memTryMode = false;
let memCurrentQuestions = [];
let memCurrentIndex = 0;
let memStage = "easy";
let memScore = { easy: 0, medium: 0, hard: 0 };
let memTimer = null;
let memTimeLeft = 60;
let memStartTime = 0;
let targetSequence = []; // 正確答案字串
let inputSequence = "";  // 玩家輸入的字串
let memDisplayTimer = null;

function showScreen(screen) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    screen.classList.remove("hidden");
}

loginAccount.addEventListener("click", () => showScreen(secondScreenLogin));
registerAccount.addEventListener("click", () => showScreen(secondScreenRegister));
backToFirstScreen.forEach(button => button.addEventListener("click", () => showScreen(firstScreen)));

function sendJsonpRequest(action, account, password, age, callbackName, onSuccess) {
    window[callbackName] = function(data) {
        onSuccess(data);
        delete window[callbackName];
        document.getElementById("jsonpScript").remove();
    };

    const script = document.createElement("script");
    script.id = "jsonpScript";
    script.src = `${WEB_APP_URL}?action=${action}&account=${encodeURIComponent(account)}&password=${encodeURIComponent(password)}&age=${encodeURIComponent(age || "")}&callback=${callbackName}`;
    document.body.appendChild(script);
}

regSubmitButton.addEventListener("click", () => {
    const account = document.getElementById("regAccount").value.trim();
    const password = document.getElementById("regPassword").value.trim();
    const age = document.getElementById("age").value.trim();

    if (!account || !password || !age) {
        alert("請填寫帳號、密碼與年齡！");
        return;
    }

    sendJsonpRequest("register", account, password, age, "regCallback", (result) => {
        alert(result.message);
        if (result.status === "success") showScreen(firstScreen);
    });
});

logSubmitButton.addEventListener("click", () => {
    const account = document.getElementById("logAccount").value.trim();
    const password = document.getElementById("logPassword").value.trim();

    if (!account || !password) {
        alert("請填寫帳號與密碼！");
        return;
    }

    sendJsonpRequest("login", account, password, null, "logCallback", (result) => {
        alert(result.message);
        if (result.status === "success") showScreen(thirdScreen);
    });
});

btnSemantic.addEventListener("click", () => showScreen(semBeginning));

semEasy.addEventListener("click", () => alert("易等級：4張圖片中選1張不同類別的圖片。"));
semMedium.addEventListener("click", () => alert("中等級：6張圖片中選1張不同類別的圖片。"));
semHard.addEventListener("click", () => alert("難等級：6張圖片中選2張不同類別的圖片。"));

trySem.addEventListener("click", () => {
    tryMode = true;
    stage = "easy";
    showScreen(gameArea);
    startTrialGame();
});

startSem.addEventListener("click", () => {
    tryMode = false;
    stage = "easy";
    score = { easy: 0, medium: 0, hard: 0 };
    answeredCount = { easy: 0, medium: 0, hard: 0 };
    showScreen(gameArea);
    startGameSession();
});

backToSemBeginningBtn.addEventListener("click", () => {
    clearInterval(timer);
    showScreen(semBeginning);
});

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(array) { return array.sort(() => Math.random() - 0.5); }

function generateQuestion(diff) {
    let isLiving = Math.random() > 0.5;
    let mainGroup = isLiving ? images.living : images.nonliving;
    let subKeys = Object.keys(mainGroup);

    let mainCat = getRandom(subKeys);
    let mainImages = mainGroup[mainCat];

    let qImages = [];
    let targetIndices = [];

    if (diff === "easy") {
        let otherGroup = Math.random() > 0.5 ? images.living : images.nonliving;
        let otherKeys = Object.keys(otherGroup);
        let otherCat = getRandom(otherKeys);
        if (otherCat === mainCat && otherKeys.length > 1) {
            otherCat = otherKeys.filter(k => k !== mainCat)[0];
        }

        let normalItems = shuffle([...mainImages]).slice(0, 3);
        let oddItem = getRandom(otherGroup[otherCat]);

        qImages = shuffle([...normalItems, oddItem]);
        qImages.forEach((img, idx) => {
            if (!mainImages.includes(img)) targetIndices.push(idx);
        });
    } else if (diff === "medium") {
        let otherGroup = Math.random() > 0.5 ? images.living : images.nonliving;
        let otherKeys = Object.keys(otherGroup);
        let otherCat = getRandom(otherKeys);
        if (otherCat === mainCat && otherKeys.length > 1) {
            otherCat = otherKeys.filter(k => k !== mainCat)[0];
        }

        let normalItems = shuffle([...mainImages]).slice(0, 5);
        let oddItem = getRandom(otherGroup[otherCat]);

        qImages = shuffle([...normalItems, oddItem]);
        qImages.forEach((img, idx) => {
            if (!mainImages.includes(img)) targetIndices.push(idx);
        });
    } else if (diff === "hard") {
        // 困難等級：4張正常圖 + 2張來自其他不同類別的不合群圖
        let normalItems = shuffle([...mainImages]).slice(0, 4);
        
        // 找出所有可用的其他子分類（排除主分類）
        let allCategories = [];
        Object.keys(images.living).forEach(k => allCategories.push({group: images.living, cat: k}));
        Object.keys(images.nonliving).forEach(k => allCategories.push({group: images.nonliving, cat: k}));
        
        // 過濾掉主分類的項目
        let validOtherCats = allCategories.filter(item => !(item.group === mainGroup && item.cat === mainCat));
        
        // 隨機選出 2 個完全不同的其他類別
        shuffle(validOtherCats);
        let cat1Info = validOtherCats[0];
        let cat2Info = validOtherCats[1];
        
        let odd1 = getRandom(cat1Info.group[cat1Info.cat]);
        let odd2 = getRandom(cat2Info.group[cat2Info.cat]);
        
        // 確保選出來的不合群圖片剛好都不一樣
        while (odd2 === odd1) {
            odd2 = getRandom(cat2Info.group[cat2Info.cat]);
        }

        qImages = shuffle([...normalItems, odd1, odd2]);
        qImages.forEach((img, idx) => {
            if (!mainImages.includes(img)) targetIndices.push(idx);
        });
    }

    return { images: qImages, targets: targetIndices };
}

function startTrialGame() {
    clearInterval(timer);
    timeLeftSpan.parentElement.style.display = "none";
    progressText.parentElement.style.display = "none";
    questionInstruction.innerText = "【試玩模式】請找出不合群的圖片";
    
    currentQuestions = [generateQuestion("easy")];
    currentQuestionIndex = 0;
    selectedImages = [];
    renderQuestion();
}

function startGameSession() {
    timeLeftSpan.parentElement.style.display = "block";
    progressText.parentElement.style.display = "block";
    timeLeft = 60;
    startTime = Date.now();
    
    currentQuestions = [];
    for (let i = 0; i < 5; i++) currentQuestions.push({ ...generateQuestion("easy"), difficulty: "easy" });
    for (let i = 0; i < 5; i++) currentQuestions.push({ ...generateQuestion("medium"), difficulty: "medium" });
    for (let i = 0; i < 5; i++) currentQuestions.push({ ...generateQuestion("hard"), difficulty: "hard" });

    currentQuestionIndex = 0;
    selectedImages = [];

    timer = setInterval(() => {
        timeLeft--;
        timeLeftSpan.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame("時間到！遊戲結束");
        }
    }, 1000);

    loadGameStep();
}

function loadGameStep() {
    if (currentQuestionIndex >= currentQuestions.length) {
        clearInterval(timer);
        endGame("恭喜完成所有題目！");
        return;
    }

    progressText.innerText = `${currentQuestionIndex + 1} / 15`;
    let q = currentQuestions[currentQuestionIndex];
    if (q.difficulty === "easy") questionInstruction.innerText = "【簡單等級】請選出 1 張不合群的圖片";
    else if (q.difficulty === "medium") questionInstruction.innerText = "【中等等級】請選出 1 張不合群的圖片";
    else questionInstruction.innerText = "【困難等級】請選出 2 張不合群的圖片";

    renderQuestion();
}

function renderQuestion() {
    buttons.innerHTML = "";
    let q = currentQuestions[currentQuestionIndex];

    // 依據當前題目的圖片數量（4張或6張），自動切換網格排版樣式
    buttons.className = "buttons " + (q.images.length === 4 ? "grid-4" : "grid-6");
    
    selectedImages = [];

    q.images.forEach((imgSrc, index) => {
        const btn = document.createElement("button");
        btn.classList.add("button");
        btn.style.border = "4px solid transparent";
        btn.style.background = "#fff";
        
        const img = document.createElement("img");
        img.src = imgSrc;
        
        btn.appendChild(img);
        
        btn.addEventListener("click", () => {
            let maxSelect = (q.difficulty === "hard") ? 2 : 1;
            let existsIndex = selectedImages.indexOf(index);

            if (existsIndex > -1) {
                selectedImages.splice(existsIndex, 1);
                btn.style.border = "4px solid transparent";
            } else {
                if (selectedImages.length >= maxSelect) {
                    let firstSelected = selectedImages.shift();
                    buttons.children[firstSelected].style.border = "4px solid transparent";
                }
                selectedImages.push(index);
                btn.style.border = "4px solid #007bff";
            }
        });

        buttons.appendChild(btn);
    });
}

/* 顯示大字大圖示回饋 (取代 alert) */
function showFeedback(isCorrect, callback) {
    feedbackIcon.innerText = isCorrect ? "✔" : "✖";
    feedbackIcon.style.color = isCorrect ? "#28a745" : "#dc3545";
    feedbackOverlay.style.display = "flex";

    setTimeout(() => {
        feedbackOverlay.style.display = "none";
        if (callback) callback();
    }, 500); // 停留 0.9 秒自動消失
}

confirmAnswerBtn.addEventListener("click", () => {
    let q = currentQuestions[currentQuestionIndex];
    let requiredCount = (q.difficulty === "hard") ? 2 : 1;

    if (selectedImages.length < requiredCount) {
        alert(`請選擇 ${requiredCount} 張圖片！`);
        return;
    }

    let isCorrect = selectedImages.length === q.targets.length && 
                    selectedImages.every(val => q.targets.includes(val));

    if (tryMode) {
        showFeedback(isCorrect, () => {
            if (isCorrect) {
                let goBack = confirm("太棒了！答對囉！要返回遊戲說明頁面嗎？（點擊「取消」則繼續在試玩練習）");
                if (goBack) {
                    showScreen(semBeginning);
                } else {
                    startTrialGame();
                }
            } else {
                startTrialGame();
            }
        });
        return;
    }

    let diff = q.difficulty;
    answeredCount[diff]++;
    if (isCorrect) {
        score[diff]++;
    }

    showFeedback(isCorrect, () => {
        currentQuestionIndex++;
        loadGameStep();
    });
});

function endGame(message) {
    let totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    if (tryMode) totalSeconds = 0;

    let totalScore = score.easy + score.medium + score.hard;
    
    finalScoreDetails.innerHTML = `
        <h3>${message}</h3>
        <p><b>簡單等級得分：</b> ${score.easy} / 5</p>
        <p><b>中等等級得分：</b> ${score.medium} / 5</p>
        <p><b>困難等級得分：</b> ${score.hard} / 5</p>
        <hr>
        <p><b>總得分：</b> ${totalScore} 分</p>
        <p><b>總作答時間：</b> ${tryMode ? "試玩模式不計時" : totalSeconds + " 秒"}</p>
    `;

    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    scoreScreen.classList.remove("hidden");
}

backToMenuFromScore.addEventListener("click", () => {
    showScreen(thirdScreen);
});

btnMemory.addEventListener("click", () => showScreen(memBeginning));
backToMenuFromMem.addEventListener("click", () => showScreen(thirdScreen));

memEasy.addEventListener("click", () => alert("易等級：隨機出現 3 個數字，依指示正背或逆背。"));
memMedium.addEventListener("click", () => alert("中等級：隨機出現 4 個數字，依指示正背或逆背。"));
memHard.addEventListener("click", () => alert("難等級：隨機出現 5 個數字，依指示正背或逆背。"));

// 在點擊「試玩」或「開始遊戲」時，隱藏下方確認按鈕並讓返回按鈕置中
tryMem.addEventListener("click", () => {
    memTryMode = true;
    showScreen(gameArea);
    setupMemGameLayout(); // 呼叫專屬遊戲二的排版設定
    startMemTrialGame();
});

startMem.addEventListener("click", () => {
    memTryMode = false;
    memScore = { easy: 0, medium: 0, hard: 0 };
    showScreen(gameArea);
    setupMemGameLayout(); // 呼叫專屬遊戲二的排版設定
    startMemGameSession();
});

// 專屬遊戲二的排版調整函式
function setupMemGameLayout() {
    const confirmBtn = document.getElementById("confirmAnswerBtn");
    const backBtn = document.getElementById("backToSemBeginningBtn");
    
    if (confirmBtn) {
        confirmBtn.style.display = "none"; // 遊戲二隱藏下方確認按鈕
    }
    if (backBtn) {
        backBtn.style.display = "inline-block";
        backBtn.style.width = ""; // 不要寫死，讓它保持預設大小
        backBtn.style.margin = "";
    }
    
    // 讓下方按鈕區域整體置中
    const btnContainer = backBtn ? backBtn.parentElement : null;
    if (btnContainer) {
        btnContainer.style.display = "flex";
        btnContainer.style.justifyContent = "center";
    }
}

// 產生遊戲二題目
function generateMemQuestion(diff) {
    let length = 3;
    let isBackward = false;

    if (diff === "easy") {
        length = 3;
        isBackward = false; // 正背
    } else if (diff === "medium") {
        length = 4;
        isBackward = false; // 正背
    } else if (diff === "hard") {
        length = 4; // 如果難度想維持 4 位數或改成 5 位數可以自行調整這裡
        isBackward = true;  // 逆背
    }

    // 隨機產生指定長度的數字 (0-9)
    let numbers = [];
    for (let i = 0; i < length; i++) {
        numbers.push(Math.floor(Math.random() * 10));
    }

    let modeText = isBackward ? "逆背（由右到左）" : "正背（由左到右）";
    
    let ansStr = "";
    if (isBackward) {
        ansStr = [...numbers].reverse().join("");
    } else {
        ansStr = numbers.join("");
    }

    return {
        numbersText: numbers.join(" "),
        modeText: modeText,
        answer: ansStr,
        difficulty: diff
    };
}

function startMemTrialGame() {
    clearInterval(memTimer);
    timeLeftSpan.parentElement.style.display = "none";
    progressText.parentElement.style.display = "none";
    questionInstruction.innerText = "【數字點點名 - 試玩模式】";
    
    memCurrentQuestions = [generateMemQuestion("easy")];
    memCurrentIndex = 0;
    inputSequence = "";
    renderMemGameScreen();
}

function startMemGameSession() {
    timeLeftSpan.parentElement.style.display = "block";
    progressText.parentElement.style.display = "block";
    memTimeLeft = 60;
    memStartTime = Date.now();
    
    memCurrentQuestions = [];
    for (let i = 0; i < 5; i++) memCurrentQuestions.push(generateMemQuestion("easy"));
    for (let i = 0; i < 5; i++) memCurrentQuestions.push(generateMemQuestion("medium"));
    for (let i = 0; i < 5; i++) memCurrentQuestions.push(generateMemQuestion("hard"));

    memCurrentIndex = 0;
    inputSequence = "";

    memTimer = setInterval(() => {
        memTimeLeft--;
        timeLeftSpan.innerText = memTimeLeft;
        if (memTimeLeft <= 0) {
            clearInterval(memTimer);
            endMemGame("時間到！遊戲結束");
        }
    }, 1000);

    loadMemGameStep();
}

function loadMemGameStep() {
    if (memCurrentIndex >= memCurrentQuestions.length) {
        clearInterval(memTimer);
        endMemGame("恭喜完成所有題目！");
        return;
    }

    progressText.innerText = `${memCurrentIndex + 1} / 15`;
    inputSequence = "";
    renderMemGameScreen();
}

function renderMemGameScreen() {
    let q = memCurrentQuestions[memCurrentIndex];
    targetSequence = q.answer;

    if (memDisplayTimer) {
        clearInterval(memDisplayTimer);
    }

    let displayDuration = 2;
    if (q.difficulty === "medium") displayDuration = 3;
    if (q.difficulty === "hard") displayDuration = 4;

    let diffTitle = q.difficulty === "easy" ? "簡單等級" : (q.difficulty === "medium" ? "中等等級" : "困難等級");
    
    // 注意：初始時把作答指示的容器設為 hidden 或不顯示，等時間到再出現
    questionInstruction.innerHTML = `
        <div style="text-align: center; margin-top: 10px;">
            <div style="font-size: 22px; color: #0066cc; margin-bottom: 10px;">
                【${diffTitle}】 請記憶以下數字（ <span id="countdownTimer" style="color: #d9534f; font-weight: bold;">${displayDuration}</span> 秒後隱藏數字 ）：
            </div>
            
            <div id="numberPool" style="font-size: 48px; color: #d9534f; letter-spacing: 15px; margin: 15px 0; height: 60px; display: flex; justify-content: center; align-items: center; visibility: visible;">
                ${q.numbersText}
            </div>
            
            <!-- 剛開始先隱藏作答指示，等數字消失後再顯示 -->
            <div id="modeInstruction" style="font-size: 24px; color: #333; margin-bottom: 30px; visibility: hidden;">
                作答指示：${q.modeText}
            </div>
            
            <div style="font-size: 26px; color: #007bff; margin-bottom: 25px;">
                您的輸入： <span id="inputDisplay" style="color: #007bff; border-bottom: 2px solid #007bff; padding: 0 15px; display: inline-block; min-width: 60px; text-align: center; height: 35px;">${inputSequence || ""}</span>
            </div>
        </div>
    `;

    buttons.className = "buttons mem-keypad";
    buttons.style.display = "grid";
    buttons.style.gridTemplateColumns = "repeat(3, 1fr)";
    buttons.style.gap = "15px";
    buttons.style.maxWidth = "320px";
    buttons.style.margin = "0 auto";
    buttons.innerHTML = "";

    // 建立 11 鍵盤 + 右下角「確認」
    let keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "確認"];
    let keypadButtons = [];
    
    keys.forEach(key => {
        const btn = document.createElement("button");
        btn.className = "button";
        btn.style.width = "100%";
        btn.style.height = "75px";
        btn.style.margin = "0";
        btn.style.fontSize = key === "確認" ? "22px" : "28px";
        btn.style.fontWeight = "bold";
        
        if (key === "確認") {
            btn.style.backgroundColor = "#007bff";
            btn.style.color = "#ffffff";
        } else {
            btn.style.backgroundColor = "#ffffff";
            btn.style.color = "#000000";
        }

        btn.style.border = "none";
        btn.style.borderRadius = "15px";
        btn.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
        btn.style.display = "flex";
        btn.style.justifyContent = "center";
        btn.style.alignItems = "center";
        btn.style.cursor = "pointer";
        
        btn.disabled = true;
        btn.style.opacity = "0.5";
        btn.innerText = key;

        btn.addEventListener("click", () => {
            if (!btn.disabled) {
                handleKeypadInput(key);
            }
        });

        buttons.appendChild(btn);
        keypadButtons.push(btn);
    });

    // 處理遊戲二排版：隱藏確認答案按鈕、讓返回按鈕正常顯示
    const confirmBtn = document.getElementById("confirmAnswerBtn");
    const backBtn = document.getElementById("backToSemBeginningBtn");
    
    if (confirmBtn) confirmBtn.style.display = "none";
    if (backBtn) {
        backBtn.style.display = "inline-block";
        backBtn.style.width = "";
        backBtn.style.margin = "";
    }

    let timeLeftForMem = displayDuration;
    memDisplayTimer = setInterval(() => {
        timeLeftForMem--;
        let timerSpan = document.getElementById("countdownTimer");
        if (timerSpan) {
            timerSpan.innerText = Math.max(0, timeLeftForMem);
        }

        if (timeLeftForMem <= 0) {
            clearInterval(memDisplayTimer);
            
            // 數字消失
            let numPool = document.getElementById("numberPool");
            if (numPool) {
                numPool.style.visibility = "hidden"; 
            }

            // 顯示作答指示（正背/逆背）並保持在畫面上
            let modeInst = document.getElementById("modeInstruction");
            if (modeInst) {
                modeInst.style.visibility = "visible";
            }

            // 啟用鍵盤
            keypadButtons.forEach(btn => {
                btn.disabled = false;
                btn.style.opacity = "1";
            });
        }
    }, 1000);
}

// 處理鍵盤點擊邏輯
function handleKeypadInput(key) {
    if (key >= "0" && key <= "9") {
        inputSequence += key;
    } else if (key === "⌫") {
        inputSequence = inputSequence.slice(0, -1);
    } else if (key === "確認") {
        checkMemAnswer();
        return; // 檢查完就直接返回
    }

    // 更新即時輸入顯示
    let displaySpan = document.getElementById("inputDisplay");
    if (displaySpan) {
        displaySpan.innerText = inputSequence || "_";
    }
}

// 檢查遊戲二答案
function checkMemAnswer() {
    if (!inputSequence) {
        alert("請先輸入數字！");
        return;
    }

    let isCorrect = (inputSequence === targetSequence);

    if (memTryMode) {
        showFeedback(isCorrect, () => {
            if (isCorrect) {
                let goBack = confirm("太棒了！答對囉！要返回遊戲說明頁面嗎？（點擊「取消」則繼續在試玩練習）");
                if (goBack) {
                    showScreen(memBeginning);
                } else {
                    startMemTrialGame();
                }
            } else {
                startMemTrialGame();
            }
        });
        return;
    }

    let diff = memCurrentQuestions[memCurrentIndex].difficulty;
    if (isCorrect) {
        memScore[diff]++;
    }

    showFeedback(isCorrect, () => {
        memCurrentIndex++;
        loadMemGameStep();
    });
}

function endMemGame(message) {
    let totalSeconds = Math.floor((Date.now() - memStartTime) / 1000);
    if (memTryMode) totalSeconds = 0;

    let totalScore = memScore.easy + memScore.medium + memScore.hard;
    
    finalScoreDetails.innerHTML = `
        <h3>${message}</h3>
        <p><b>簡單等級得分：</b> ${memScore.easy} / 5</p>
        <p><b>中等等級得分：</b> ${memScore.medium} / 5</p>
        <p><b>困難等級得分：</b> ${memScore.hard} / 5</p>
        <hr>
        <p><b>總得分：</b> ${totalScore} 分</p>
        <p><b>總作答時間：</b> ${memTryMode ? "試玩模式不計時" : totalSeconds + " 秒"}</p>
    `;

    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    scoreScreen.classList.remove("hidden");
}

// 修改返回遊戲說明按鈕的行為（讓它能分別對應遊戲一或遊戲二）
backToSemBeginningBtn.addEventListener("click", () => {
    clearInterval(timer);
    clearInterval(memTimer);
    
    // 恢復遊戲一的按鈕顯示與原本的大小樣式
    const confirmBtn = document.getElementById("confirmAnswerBtn");
    const backBtn = document.getElementById("backToSemBeginningBtn");
    
    if (confirmBtn) {
        confirmBtn.style.display = "inline-block";
    }
    if (backBtn) {
        backBtn.style.width = "";   // 清除遊戲二寫死的寬度
        backBtn.style.margin = "";  // 清除遊戲二寫死的邊距
    }

    if (currentQuestions.length > 0 && currentQuestions[0].numbersText === undefined) {
        showScreen(semBeginning);
    } else {
        showScreen(memBeginning);
    }
});