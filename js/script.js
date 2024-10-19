import { quizData } from './db.js';

let currentQuestion = 0;
let score = 0;
const totalQuestions = quizData.length;

document.getElementById('totalQuestions').textContent = totalQuestions;

function loadQuiz() {
    
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';

    
    const questionData = quizData[currentQuestion];
    const cardHTML = `
        <div class="card active">
            <img class="card-image" src="${questionData.image}" alt="Imagem da pergunta">
            <div class="question">${questionData.question}</div>
            <div class="options">
                ${questionData.options.map((option, index) => `
                    <div class="option" data-index="${index}">${option}</div>
                `).join('')}
            </div>
        </div>
    `;
    quizContainer.innerHTML = cardHTML;

   
    const options = document.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', function() {
            checkAnswer(parseInt(this.getAttribute('data-index')));
        });
    });

    updateProgressBar();
}

function checkAnswer(selectedOption) {
    const questionData = quizData[currentQuestion];
    const options = document.querySelectorAll('.option');
    
   
    if (selectedOption === questionData.correct) {
        options[selectedOption].classList.add('correct');
        score++;
        showConfetti(); 
    } else {
        options[selectedOption].classList.add('wrong');
        options[questionData.correct].classList.add('correct');
        showSadFace(); 
    }
    
    
    options.forEach(option => option.style.pointerEvents = 'none');

    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < totalQuestions) {
            loadQuiz();
        } else {
            showResults();
        }
        updateScore();
    }, 2000);
}

function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.classList.add('confetti-container');
    document.body.appendChild(confettiContainer);

    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.setProperty('--color', getRandomColor());
        confetti.style.left = Math.random() * 100 + 'vw';
        confettiContainer.appendChild(confetti);
    }

    
    setTimeout(() => {
        document.body.removeChild(confettiContainer);
    }, 3000);
}

function getRandomColor() {
    const colors = ['#ff0', '#0f0', '#f00', '#00f', '#f0f', '#0ff'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function showSadFace() {
    const sadFace = document.createElement('div');
    sadFace.classList.add('sad-face');
    sadFace.textContent = '😞'; 
    document.body.appendChild(sadFace);

   
    setTimeout(() => {
        document.body.removeChild(sadFace);
    }, 1000);
}

function updateScore() {
    document.getElementById('score').textContent = score;
    document.getElementById('questionNumber').textContent = currentQuestion + 1;
}

function updateProgressBar() {
    const progressPercent = ((currentQuestion + 1) / totalQuestions) * 100;
    document.getElementById('progress').style.width = `${progressPercent}%`;
}

function showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('result-screen').classList.add('active');
    document.getElementById('final-score').textContent = score;
    document.getElementById('total-questions').textContent = totalQuestions;
}


function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('result-screen').classList.remove('active');
    updateScore();
    loadQuiz();
}


loadQuiz();


document.getElementById('restart-btn').addEventListener('click', restartQuiz);