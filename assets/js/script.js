var questions = [
    "Which of these is the correct way to print something to the console?",
    "Which of these is a comment in JavaScript?",
    "Which of these will not display an alert statement to the console",
    "What is the correct way to generate a random integer in the interval [a,b)?",
    "Which of these functions will not return the value of a+b?",
]
var answerChoices = [
    ["window.print()", "console.print()", "window.log()", "console.log()"],
    ["// comment", "<!-- comment -->", "/* comment */", "# comment"],
    ["alert()", "confirm()", "prompt()", "print()"],
    ["Math.floor(Math.random()*b+a)", "Math.floor(Math.random()*(b-a)+a)", "Math.floor(Math.random()*a+b)", "Math.floor(Math.random()*(a-b)+a)"],
    ["var add = (a, b) => a+b;", "function add(a, b) {return a+b}", "function(a, b) {a+b}","var add = function(a, b) {return a+b}"]
]

var correctAnswers = [3, 0, 3, 1, 2];

var highScores;
getScores();

var currentQuestion = 0;
const maxTime = 75;
var currentTime = maxTime;

const quizContainer = document.getElementById("quiz-container");
const timerMessage = document.getElementById("timer-message");
const timerNumber = document.getElementById("timer-number");
const correct = document.getElementById("correct");
const scoreScreen = document.getElementById("score-screen");
const scoreSpan = document.getElementById("score");
const initialEntry = document.getElementById("initial-entry");
const scoreList = document.getElementById("score-list");

try {
    // hide error when opening score screen as they do not have these elements
    timerMessage.style.display = "none";
    scoreScreen.style.visibility = "hidden";
}
catch {}


function startGame() {
    // hide start elements
    document.querySelector("#start-screen").style.display = "none";
    timerMessage.style.display = "inline";
    createAnswerSlots();
    startTimer();
    showQuestions();
}

function startTimer() {
    console.log("startTimer called")
    timerNumber.innerHTML = maxTime;
    timerInterval = setInterval(function() {
        if(currentTime <= 0) {
            endGame();
        }
        else {
            currentTime--;
            timerNumber.innerHTML = currentTime;
        }
    }, 1000);
}

function showQuestions() {
    const questionDiv = document.querySelector("#question");
    // show question
    questionDiv.innerHTML = questions[currentQuestion];
    //show answer choices
    showAnswerChoices();
}

const ul = document.getElementById("answer-choice-container");
var liEls = [];

function createAnswerSlots() {
    for(var j=0; j<answerChoices[0].length; j++) {
        var li = document.createElement("li");
        li.classList.add("answer-choice");
        li.id = `answer-choice-${j}`;
        li.addEventListener("click", (event) => {checkAnswer(event.target.id)});
        liEls.push(li);
    }
}

function showAnswerChoices() {
    for(var i=0; i<answerChoices[currentQuestion].length; i++) {
        var li = liEls[i]
        li.textContent = answerChoices[currentQuestion][i];
        ul.appendChild(li);
    }
}

function checkAnswer(id) {
    var idNum = id[id.length-1];
    if(idNum == correctAnswers[currentQuestion]) {
        correct.textContent = "Correct!";
    }
    else {
        correct.textContent = "Wrong";
        if(currentTime < 10) {
            currentTime = 0;
            endGame();
        } else {
            currentTime -= 10;
        }
        timerNumber.innerHTML = currentTime;
    }
    if(currentQuestion === questions.length-1) {
        endGame();
    }
    else {
        currentQuestion++;
        showQuestions();
    }
}

function endGame() {
    quizContainer.style.display = "none";
    clearInterval(timerInterval);
    showScoreScreen();
}

function showScoreScreen() {
    scoreScreen.style.visibility = "visible";
    scoreSpan.textContent = currentTime;
}

function enterScore() {
    const initials = initialEntry.value;
    if(initials !== "") {
        highScores[initials] = currentTime;
        setScores();
        window.location.href = "highscores.html";
    }
    
}

function setScores() {
    localStorage.setItem("highscores", JSON.stringify(highScores));
}

function getScores() {
    scores = localStorage.getItem("highscores");
    if(scores !== null)
        highScores = JSON.parse(scores);
    else
        highScores = {};
}

function showHighScores() {
    getScores();
    // console.log("high score function", highScores);
    sortScores();
    scoreList.innerHTML = "";
    for(var [key, value] of Object.entries(highScores)) {
        // console.log(key, value);
        const li = document.createElement("li");
        li.classList.add("score-list-item");
        li.textContent = key+' - '+value;
        scoreList.appendChild(li);
    }
}

function sortScores() {
    highScores = Object.fromEntries(Object.entries(highScores).sort((a,b) => b[1]-a[1]));
}

function confirmResetScores() {
    if(confirm("Are you sure you want to reset all scores?"))
        resetScores();
}

function resetScores() {
    highScores = {};
    setScores();
    showHighScores();
}