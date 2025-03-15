
const questions = [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "Hyperlinks and Text Markup Language", "Home Tool Markup Language", "High Text Machine Learning"], answer: "Hyper Text Markup Language" },

    { question: "Which CSS property controls text size?", options: ["text-style", "font-size", "text-size", "font-style"], answer: "font-size" },

    { question: "What is the correct syntax for referring to an external script in JavaScript?", options: ["<script href='script.js'>", "<script src='script.js'>", "<script ref='script.js'>", "<script link='script.js'>"], answer: "<script src='script.js'>" },

    { question: "Which tag is used to create a hyperlink in HTML?", options: ["<link>", "<href>", "<a>", "<url>"], answer: "<a>" },

    { question: "Which of the following is the correct way to apply CSS in an HTML file?", options: ["<style>", "<css>", "<stylesheet>", "<design>"], answer: "<style>" },

    { question: "Which JavaScript keyword is used to declare a variable?", options: ["var", "int", "string", "declare"], answer: "var" },

    { question: "Which of the following is a valid CSS unit for specifying font size?", options: ["px", "inch", "mb", "km"], answer: "px" },

    { question: "What does the 'document.getElementById' function do in JavaScript?", options: ["Gets an element by its class name", "Gets an element by its tag name", "Gets an element by its ID", "Gets an element by its attribute"], answer: "Gets an element by its ID" },

    { question: "Which property is used to change the background color in CSS?", options: ["color", "background", "background-color", "bgcolor"], answer: "background-color" },

    { question: "Which HTML element is used to specify the footer of a document?", options: ["<bottom>", "<footer>", "<end>", "<foot>"], answer: "<footer>" }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let timer;
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const submitBtn = document.getElementById("submit-btn");
const nameContainer = document.querySelector(".name-container");
const leaderboardContainer = document.querySelector(".leaderboard-container");
const startContainer = document.querySelector(".start-container");
const startBtn = document.getElementById("start-btn");
const totalQuestions = document.getElementById("total-questions");
const timerDisplay = document.getElementById("timer");
const timerCircle = document.querySelector('.timer-circle');
const totalTime = 20; // Total time in seconds

totalQuestions.innerText = questions.length;

startBtn.addEventListener("click", () => {
    startContainer.classList.add("hidden");
    document.querySelector(".quiz-container").classList.remove("hidden");
    loadQuestion();
});

document.getElementById("clear-leaderboard-btn").addEventListener("click", () => {
    localStorage.removeItem("leaderboard");
    document.getElementById("leaderboard-list").innerHTML = "";
    alert("Leaderboard has been cleared!");
});

document.getElementById("save-score-btn").addEventListener("click", () => {
    const username = document.getElementById("username").value;
    if (username.trim() !== "") {
        let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        leaderboard.push({ name: username, score });
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
        leaderboardContainer.classList.remove("hidden");
        document.getElementById("leaderboard-list").innerHTML = leaderboard
            .map(entry => `<li>${entry.name}: ${entry.score}</li>`)
            .join("");
        nameContainer.classList.add("hidden");
    }
});

// Set default leaderboard values if no data exists
if (!localStorage.getItem("leaderboard")) {
    localStorage.setItem("leaderboard", JSON.stringify([
        { name: "Alice", score: 900 },
        { name: "Bob", score: 850 }
    ]));
}

function loadQuestion() {
    clearTimeout(timer);
    timerDisplay.innerText = 20;
    startTimer();
    const currentQuestion = questions[currentQuestionIndex];

    document.getElementById("current-question-number").innerText = currentQuestionIndex + 1;

    questionText.innerText = currentQuestion.question;
    optionsContainer.innerHTML = "";
    selectedOption = null;
    nextBtn.classList.add("hidden");

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.classList.add("option");
        button.innerText = option;
        button.addEventListener("click", () => selectAnswer(button, option, currentQuestion.answer));
        optionsContainer.appendChild(button);
    });
}

document.getElementById("play-again-btn").addEventListener("click", () => {
    document.querySelector(".leaderboard-container").classList.add("hidden");
    document.querySelector(".start-container").classList.remove("hidden");
    currentQuestionIndex = 0;
    score = 0;
    submitBtn.classList.add("hidden"); // Hide the submit button when starting again
});

function startTimer() {
    let timeLeft = 20;
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);

        // Calculate the progress percentage
        let progress = (timeLeft / totalTime) * 360; // Rotate from 0 to 360 degrees

        // Update the progress circle (rotate and change color)
        timerCircle.style.background = `conic-gradient(
            #4caf50 0deg ${360 - progress}deg, 
            #f44336 ${360 - progress}deg 360deg
        )`;

        // Highlight the timer as it gets low (below 5 seconds)
        if (timeLeft <= 5) {
            timerDisplay.classList.add("low-time"); // Change text color to red
        } else {
            timerDisplay.classList.remove("low-time"); // Keep normal color
        }

        if (timeLeft === 0) {
            clearInterval(timer);
            disableOptions();
            nextBtn.classList.remove("hidden");
        }
    }, 1000);
}

function updateTimerDisplay(timeLeft) {
    // Update the text of the timer
    timerDisplay.innerText = timeLeft;
}

function disableOptions() {
    document.querySelectorAll(".option").forEach(button => {
        button.disabled = true;
        if (button.innerText === questions[currentQuestionIndex].answer) {
            button.classList.add("correct");
        }
    });
}

function selectAnswer(button, selectedAnswer, correctAnswer) {
    if (selectedOption) {
        selectedOption.classList.remove("selected");
    }
    button.classList.add("selected");
    selectedOption = button;
    clearInterval(timer);
    disableOptions();

    let timeRemaining = parseInt(timerDisplay.innerText);
    if (selectedAnswer === correctAnswer) {
        button.classList.add("correct");
        score += 100;
        score += timeRemaining * 2;
    } else {
        button.classList.add("wrong");
        document.querySelectorAll(".option").forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }
    nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        nextBtn.classList.add("hidden");
        submitBtn.classList.remove("hidden");
    }
});

submitBtn.addEventListener("click", () => {
    document.querySelector(".quiz-container").classList.add("hidden");
    nameContainer.classList.remove("hidden");
});
