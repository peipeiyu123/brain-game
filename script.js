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