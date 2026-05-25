const login = document.querySelector(".login");
const control = document.querySelector(".control");
const buttonType = document.querySelector(".buttonType");
const buttonLevel = document.querySelector(".buttonLevel");
const instructions = document.querySelector(".instructions");
const buttonGroup = document.querySelector(".buttonGroup");
const gameTitle = document.getElementById("gameTitle");
const instructionText = document.getElementById("instructionText");

function setError(element, message){
    element.classList.add("error");
    document.getElementById(element.id + "Error").textContent = message;
}

function clearError(element){
    element.classList.remove("error");
    document.getElementById(element.id + "Error").textContent = "";
}

function validateName(){
    const n = document.getElementById("name");
    const value = n.value.trim();
    if(!value){
        setError(n, "請輸入姓名");
        return false;
    }
    clearError(n);
    return true;
}

function validateAge(){
    const a = document.getElementById("age");
    const value = a.value.trim();

    if(!value){
        setError(a, "請輸入年齡");
        return false;
    }
    if(isNaN(value) || value <= 0 || value > 130){
        setError(a, "請輸入正確年齡");
        return false;
    }
    clearError(a);
    return true;
}

function validateIdNumber(){
    const id = document.getElementById("idNumber");
    const value = id.value.trim();

    if(!value || value < 100 || value > 999){
        setError(id, "請輸入身分證後三碼");
        return false;
    }
    clearError(id);
    return true;
}

function validateMMSE(){
    const m = document.getElementById("MMSE");
    const value = m.value.trim();

    if(!value){
        setError(m, "請輸入MMSE");
        return false;
    }
    if(isNaN(value) || value < 0 || value > 30){
        setError(m, "MMSE為0～30分");
        return false;
    }
    clearError(m);
    return true;
}

function validateGender(){
    const g = document.getElementById("gender");
    const value = g.value;

    if(!value){
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
    showScreen(instructions);

    buttonType.classList.add("hidden");
    buttonLevel.classList.add("hidden");
    buttonGroup.classList.add("hidden");

    gameTitle.classList.remove("hidden");
    instructionText.classList.remove("hidden");

    if (step === "type") {
        gameTitle.innerHTML = "請選擇題型";
        buttonType.classList.remove("hidden");
    }

    if (step === "level") {
        gameTitle.innerHTML = "請選擇難度";
        buttonLevel.classList.remove("hidden");
    }

    if (step === "start") {
        gameTitle.innerHTML = "遊戲說明";
        buttonGroup.classList.remove("hidden");
    }
}

function setInstructionText(level) {
    instructionText.classList.remove("hidden");

    if (level === "easy") {
        instructionText.textContent =
            "每一題將呈現四張圖片，其中三張圖片屬於相同類別，另一張圖片屬於不同類別，請選出不同者。";
    }

    if (level === "medium") {
        instructionText.textContent =
            "每一題將呈現六張圖片，其中五張圖片屬於相同類別，另一張圖片屬於不同類別，請選出不同者。";
    }

    if (level === "hard") {
        instructionText.textContent =
            "每一題將呈現六張圖片，其中四張圖片屬於相同類別，另兩張圖片屬於不同類別，請選出不同者。";
    }
}

document.getElementById("name").addEventListener("input", validateName);
document.getElementById("age").addEventListener("input", validateAge);
document.getElementById("idNumber").addEventListener("input", validateIdNumber);
document.getElementById("MMSE").addEventListener("input", validateMMSE);
document.getElementById("gender").addEventListener("change", validateGender);

document.getElementById("loginButton").addEventListener("click", () => {
    const valid = validateName() && validateAge() && validateIdNumber() && validateMMSE() && validateGender();

    if(!valid){
        alert("請修正錯誤資料");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value.trim();
    const idNumber = document.getElementById("idNumber").value.trim();
    const MMSE = document.getElementById("MMSE").value.trim();
    const gender = document.getElementById("gender").value;
    const payload = new URLSearchParams({
        name,
        age,
        idNumber,
        MMSE,
        gender,
        easyScore,
        mediumScore,
        hardScore
    });

    /*前端送資料*/
    fetch("https://script.google.com/macros/s/AKfycbxwU-QQT9RHJYTMT9anSbwOUVrFaJ9CTHrq17-76uoxtMb9Fa9HtkExEzPh_q-4Bsz3/exec", {
        method: "POST",
        body: payload
    })
    .then(res => res.text())
    .then(data => {
        console.log("回傳內容:", data);

        if (data.trim() === "success") {
            console.log("成功");
            showScreen(control);
        } else {
            alert("送出失敗：" + data);
        }
    })
    .catch(err => {
        console.error("錯誤:", err);
        alert("網路錯誤！");
    });

    
})

document.getElementById("btnSemantic").addEventListener("click", () => {
    resetInstructionsUI();
    gameTitle.innerHTML = `<h2>有人不合群</h2>`;
    showInstructions("type");
});

document.getElementById("picture").addEventListener("click", () => {
    showInstructions("level");
});

document.getElementById("character").addEventListener("click", () => {
    document.getElementById("character").textContent = "文字題（未開放）";
    document.getElementById("character").disabled = true;
});

document.getElementById("easy").addEventListener("click", () => {
    difficulty = "easy";
    setInstructionText("easy");
    showInstructions("start");
});

document.getElementById("medium").addEventListener("click", () => {
    difficulty = "medium";
    setInstructionText("medium");
    showInstructions("start");
});

document.getElementById("hard").addEventListener("click", () => {
    difficulty = "hard";
    setInstructionText("hard");
    showInstructions("start");
});

document.getElementById("practiceButton").addEventListener("click", () => {
    startExperiment(true);
});

document.getElementById("startButton").addEventListener("click", () => {
    showScreen(instructions);
    buttonGroup.classList.add("hidden");
    gameArea.classList.remove("hidden");
    startExperiment(false);
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
        mammal: ["mammal/cat.png", "mammal/dog.png", "mammal/elephant.png", 
                "mammal/zebra.png", "mammal/horse.png", "mammal/kangaroo.png", 
                "mammal/lion.png", "mammal/rabbit.png", "mammal/sheep.png"],
        /*昆蟲*/
        insect: ["insect/ant.png", "insect/bee.png", "insect/big-butterfly.png", 
                 "insect/dragonfly.png", "insect/flea.png", "insect/fly.png", 
                 "insect/ladybug.png", "insect/mosquito.png", "insect/orthoptera.png", 
                 "insect/praying-mantis.png", "insect/stag-beetle.png", "insect/butterfly.png"],
        /*海洋生物*/
        seaCreatures: ["seaCreatures/anglerfish.png", "seaCreatures/bream.png", "seaCreatures/dolphin.png", 
                       "seaCreatures/fish.png", "seaCreatures/seahorse.png", "seaCreatures/sea-turtle.png", 
                       "seaCreatures/shrimp.png", "seaCreatures/squid.png", "seaCreatures/whale.png"],
        /*鳥類*/
        bird: ["bird/bunting.png", "bird/king-fisher.png", "bird/parrot.png", "bird/pigeon.png", "bird/starling.png"]
    },
    /*無生命*/
    nonliving: {
        /*交通工具*/
        transportation: ["transportation/bike.png", "transportation/car.png", "transportation/cargo-ship.png",
                         "transportation/delivery-truck.png", "transportation/helicopter.png", "transportation/motorcycle.png",
                         "transportation/plane.png", "transportation/school-bus.png", "transportation/train.png", 
                         "transportation/truck.png", "transportation/van.png"],
        /*樂器*/
        instrument: ["instrument/cello.png", "instrument/drum-set.png", "instrument/flute.png",
                     "instrument/guitar.png", "instrument/piano.png", "instrument/triangle.png", 
                     "instrument/trumpet.png"],
        /*文具*/
        stationery: ["stationery/pen.png", "stationery/pencil.png", "stationery/ruler.png", 
                     "stationery/scissors.png", "stationery/paper-clip.png"]

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
let gameScores = {
    semantic: 0,
    memory: 0,
    visualSearch: 0,
    spatial: 0,
    switching: 0
};

function getRandom(arr){
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
    const wrongType = mainType === "living" ? "nonliving" : "living";
    const mainPool = categories[mainType];
    const wrongPool = categories[wrongType];
    const mainCats = Object.keys(mainPool);
    const wrongCats = Object.keys(wrongPool);
    const count = difficulty === "easy" ? 4 : 6;
    const mainCat = getRandom(mainCats);
    let images = [];
    let used = new Set();

    if (difficulty !== "hard") {

        const wrongCat = getRandom(wrongCats);

        while (images.length < count - 1) {
            let img = getRandom(mainPool[mainCat]);

            if (!used.has(img)) {
                used.add(img);
                images.push({ src: "images/" + img, category: mainCat });
            }
        }

        let wrongImg;
        do {
            wrongImg = getRandom(wrongPool[wrongCat]);
        } while (used.has(wrongImg));

        images.push({ src: "images/" + wrongImg, category: wrongCat });
    }

    else {

        const wrongCat1 = getRandom(wrongCats);
        let wrongCat2;

        do {
            wrongCat2 = getRandom(wrongCats);
        } while (wrongCat2 === wrongCat1);

        while (images.length < count - 2) {
            let img = getRandom(mainPool[mainCat]);

            if (!used.has(img)) {
                used.add(img);
                images.push({ src: "images/" + img, category: mainCat });
            }
        }

        let wrongImg1, wrongImg2;

        do {
            wrongImg1 = getRandom(wrongPool[wrongCat1]);
        } while (used.has(wrongImg1));

        do {
            wrongImg2 = getRandom(wrongPool[wrongCat2]);
        } while (used.has(wrongImg2) || wrongImg2 === wrongImg1);

        images.push(
            { src: "images/" + wrongImg1, category: wrongCat1 },
            { src: "images/" + wrongImg2, category: wrongCat2 }
        );
    }

    images.sort(() => Math.random() - 0.5);

    return {
        images,
        correct: mainCat
    };
}

function loadQuestion() {
    selectedAnswers = [];
    buttonsContainer.innerHTML = "";

    if (current >= currentQuestions.length) {
        if (isPracticeMode) {
            endPractice();
        } else {
            showResult();
        }
        return;
    }

    setTime();

    const q = currentQuestions[current];
    const cols = q.images.length <= 2 ? q.images.length : 2;
    buttonsContainer.style.gridTemplateColumns = q.images.length === 6 ? "repeat(3, 1fr)" : "repeat(2, 1fr)";

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
                document.querySelectorAll(".buttons button")
                .forEach(b => b.classList.remove("selected"));

                btn.classList.add("selected");

                clearInterval(timer);
                checkAnswer([cat]);
            }
        });

        buttonsContainer.appendChild(btn);
    });

    startTimer(() => {
        showOverlay("wrong"); 
        current++;
        setTimeout(loadQuestion, 500);
    });
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

function checkAnswer(answers) {

    if (isLocked) return;
    isLocked = true;

    clearInterval(timer);

    const correct = currentQuestions[current].correct;

    let isCorrect = false;

    if (difficulty === "hard") {
        isCorrect = answers.every(a => a !== correct);
    } else {
        isCorrect = answers[0] !== correct;
    }

    if (isCorrect) {
        showOverlay("correct");
        score++;
    } else {
        showOverlay("wrong");
    }

    selectedAnswers = [];

    current++;

    setTimeout(() => {
        isLocked = false;
        loadQuestion();
    }, 500);
}

function startExperiment(isPractice = false) {

    isPracticeMode = isPractice;

    score = 0;
    current = 0;

    currentQuestions = [];

    const total = isPractice ? 1 : 5;

    for (let i = 0; i < total; i++) {
        currentQuestions.push(generateQuestion(difficulty));
    }

    buttonType.classList.add("hidden");
    buttonLevel.classList.add("hidden");
    buttonGroup.classList.add("hidden");
    gameTitle.classList.add("hidden");
    instructionText.classList.add("hidden");
    gameArea.classList.remove("hidden");

    loadQuestion();
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
    buttonLevel.classList.add("hidden");
    buttonGroup.classList.add("hidden");
}

function showResult() {
    gameScores.semantic = score;

    showScreen(document.querySelector(".result"));

    document.getElementById("playerScore").textContent =
        `你的分數：${score} / ${currentQuestions.length}`;
    
    if (difficulty === "easy") easyScore = score;
    if (difficulty === "medium") mediumScore = score;
    if (difficulty === "hard") hardScore = score;
}