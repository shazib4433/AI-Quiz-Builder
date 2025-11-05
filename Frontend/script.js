let quizData = [];
let timerMode = false;
let intervalId;

function generateQuiz() {
  const topic = document.getElementById("topic").value.trim();
  const num = document.getElementById("num").value;
  timerMode = document.getElementById("timer-toggle").checked;

  if (!topic || num < 1) {
    alert("Please enter a valid topic and number.");
    return;
  }

  document.getElementById("loader").classList.remove("hidden");
  document.getElementById("quiz-container").innerHTML = "";
  document.getElementById("submit-btn").classList.add("hidden");
  document.getElementById("reset-btn").classList.add("hidden");

  fetch("http://127.0.0.1:5000/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic, num_questions: num }),
  })
    .then((res) => res.json())
    .then((data) => {
      quizData = data.questions;
      displayQuiz();
      document.getElementById("loader").classList.add("hidden");
    });
}

function displayQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  quizData.forEach((q, index) => {
    const questionHTML = `
      <div class="question" id="q${index}">
        <p><strong>Q${index + 1}:</strong> ${q.question}</p>
        ${q.options.map((opt, i) => `
          <label>
            <input type="radio" name="q${index}" value="${opt}" />
            ${opt}
          </label><br>
        `).join("")}
      </div>
    `;
    container.innerHTML += questionHTML;
  });

  document.getElementById("submit-btn").classList.remove("hidden");
  document.getElementById("reset-btn").classList.remove("hidden");

  if (timerMode) startTimer(quizData.length);
}

function submitQuiz() {
  let score = 0;

  quizData.forEach((q, index) => {
    const selected = document.querySelector(`input[name="q${index}"]:checked`);
    const questionBlock = document.getElementById(`q${index}`);

    if (selected && selected.value === q.answer) {
      score++;
      questionBlock.classList.add("correct");
    } else {
      questionBlock.classList.add("wrong");
    }
  });

  alert(`🎉 Your Score: ${score} / ${quizData.length}`);
  clearInterval(intervalId);
}

function resetQuiz() {
  quizData = [];
  document.getElementById("quiz-container").innerHTML = "";
  document.getElementById("submit-btn").classList.add("hidden");
  document.getElementById("reset-btn").classList.add("hidden");
}

function startTimer(totalQuestions) {
  let time = totalQuestions * 10;
  intervalId = setInterval(() => {
    if (time <= 0) {
      clearInterval(intervalId);
      submitQuiz();
    } else {
      document.getElementById("loader").textContent = `⏳ Time Left: ${time--}s`;
    }
  }, 1000);
  document.getElementById("loader").classList.remove("hidden");
}
