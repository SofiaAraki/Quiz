let questions = [];
let score = 0;
let currentQuestion = 0;

const startBtn = document.querySelector(".start");
const category = document.querySelector("#category");
const tags = document.querySelector("#tags");
const difficulty = document.querySelector("#difficulty");
const limit = document.querySelector("#limit");
const quiz = document.querySelector(".quiz");
const startscreen = document.querySelector(".start-screen");

const startQuiz = () => {
    const apiKey = "8ejhebUUUT8Wy2peVVWK3KKdiUfMUxofo9KqeTLp";
    const selectedCategory = category.value;
    const selectedDifficulty = difficulty.value;
    const selectedLimit = limit.value;
    const selectedTags = tags.value;

    const url = `https://quizapi.io/api/v1/questions?apiKey=${apiKey}&category=${selectedCategory}&difficulty=${selectedDifficulty}&limit=${selectedLimit}&tags=${selectedTags}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            questions = data;
            startscreen.classList.add("hide");
            quiz.classList.remove("hide");
            showQuestion(questions[currentQuestion]);
        });
};

startBtn.addEventListener("click", startQuiz);

const showQuestion = (question) => {
    const questionText = document.querySelector(".question");
    const answersWrapper = document.querySelector(".answer-wrapper");
    const questionNumber = document.querySelector(".number");

    questionText.innerHTML = question.question;

    const answers = Object.entries(question.answers)
        .filter(([key, value]) => value !== null)
        .map(([key, value]) => ({ key, value }));

    answersWrapper.innerHTML = "";
    answers.forEach(({ key, value }) => {
        answersWrapper.innerHTML += `
            <div class="answer" data-key="${key}">
                <span class="text">${value}</span>
                <span class="checkbox"><i class="fas fa-check"></i></span>
            </div>
        `;
    });

    questionNumber.innerHTML = `Question <span class="current">${currentQuestion + 1}</span>
        <span class="total">/${questions.length}</span>`;

    const answersDiv = document.querySelectorAll(".answer");
    answersDiv.forEach((answer) => {
        answer.addEventListener("click", () => {
            answersDiv.forEach((ans) => ans.classList.remove("selected"));
            answer.classList.add("selected");
            submitBtn.disabled = false;
        });
    });
};

const submitBtn = document.querySelector(".submit");
const nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
    checkAnswer();
});

nextBtn.addEventListener("click", () => {
    nextQuestion();
    submitBtn.style.display = "block";
    nextBtn.style.display = "none";
});

const checkAnswer = () => {
    const selectedAnswer = document.querySelector(".answer.selected");
    const correctAnswers = questions[currentQuestion].correct_answers;
    const isMultipleCorrect = questions[currentQuestion].multiple_correct_answers === "true";

    if (selectedAnswer) {
        const selectedKey = selectedAnswer.getAttribute("data-key");

        if (isMultipleCorrect) {
            Object.keys(correctAnswers).forEach(key => {
                if (correctAnswers[key] === "true") {
                    const answerDiv = document.querySelector(`.answer[data-key='${key.replace('_correct', '')}']`);
                    if (answerDiv) answerDiv.classList.add("correct");
                }
            });

            if (correctAnswers[selectedKey + '_correct'] === "true") {
                score++;
                selectedAnswer.classList.add("correct");
            } else {
                selectedAnswer.classList.add("wrong");
            }
        } else {
            if (correctAnswers[selectedKey + '_correct'] === "true") {
                score++;
                selectedAnswer.classList.add("correct");
            } else {
                selectedAnswer.classList.add("wrong");
                Object.keys(correctAnswers).forEach(key => {
                    if (correctAnswers[key] === "true") {
                        const answerDiv = document.querySelector(`.answer[data-key='${key.replace('_correct', '')}']`);
                        if (answerDiv) answerDiv.classList.add("correct");
                    }
                });
            }
        }
    }

    document.querySelectorAll(".answer").forEach((answer) => {
        answer.classList.add("checked");
    });

    submitBtn.style.display = "none";
    nextBtn.style.display = "block";
};

const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        showQuestion(questions[currentQuestion]);
    } else {
        showScore();
    }
};

const endScreen = document.querySelector(".end-screen");
const finalScore = document.querySelector(".final-score");
const totalScore = document.querySelector(".total-score");

const showScore = () => {
    endScreen.classList.remove("hide");
    quiz.classList.add("hide");
    finalScore.innerHTML = score;
    totalScore.innerHTML = `/ ${questions.length}`;
};

const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
    window.location.reload();
});
