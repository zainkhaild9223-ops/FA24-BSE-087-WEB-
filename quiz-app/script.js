const QUESTION_BANK = [
  {
    q: "What does HTML stand for?",
    options: ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Making Language"], answer: 0
  },
  {
    q: "Which tag creates the largest heading?",
    options: ["<h6>", "<head>", "<h1>", "<heading>"], answer: 2
  },
  {
    q: "Which tag is used to create a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<url>"], answer: 1
  },
  {
    q: "Which tag inserts an image into a page?",
    options: ["<image>", "<pic>", "<img>", "<src>"], answer: 2
  },
  {
    q: "Which tag creates an unordered (bulleted) list?",
    options: ["<ol>", "<ul>", "<li>", "<list>"], answer: 1
  },
  {
    q: "Which attribute gives an image alternative text?",
    options: ["title", "alt", "name", "text"], answer: 1
  },
  {
    q: "Which tag inserts a line break?",
    options: ["<br>", "<lb>", "<break>", "<hr>"], answer: 0
  },
  {
    q: "Which HTML element holds the visible page content?",
    options: ["<head>", "<title>", "<body>", "<html>"], answer: 2
  },
  {
    q: "Which tag is used to create a table row?",
    options: ["<td>", "<th>", "<tr>", "<table>"], answer: 2
  },
  {
    q: "Which input type creates a checkbox?",
    options: ["type=\"check\"", "type=\"checkbox\"", "type=\"tick\"", "type=\"box\""], answer: 1
  },
  {
    q: "What does CSS stand for?",
    options: ["Creative Style Sheets", "Computer Style Syntax", "Cascading Style Sheets", "Colorful Style Scripts"], answer: 2
  },
  {
    q: "Which CSS property changes the text colour?",
    options: ["font-color", "color", "text-style", "background-color"], answer: 1
  },
  {
    q: "Which CSS property changes the background colour?",
    options: ["bgcolor", "color", "background-color", "background-style"], answer: 2
  },
  {
    q: "Which symbol selects an element by its id in CSS?",
    options: [".", "#", "*", "&"], answer: 1
  },
  {
    q: "Which symbol selects elements by class in CSS?",
    options: [".", "#", "@", "%"], answer: 0
  },
  {
    q: "Which CSS property changes the font size?",
    options: ["text-size", "font-style", "font-size", "text-font"], answer: 2
  },
  {
    q: "Which CSS property adds space inside an element's border?",
    options: ["margin", "padding", "spacing", "gap-inner"], answer: 1
  },
  {
    q: "Which value of display makes an element a fle          xbox container?",
    options: ["flex", "block", "inline", "table"], answer: 0
  },
  {
    q: "Which method selects an element by its ID in JavaScript?",
    options: ["getElementById()", "querySelectorAll()", "getElementsByClassName()", "getElementByName()"], answer: 0
  },
  {
    q: "Which JS keyword declares a block-scoped variable?",
    options: ["var", "let", "function", "global"], answer: 1
  },
  {
    q: "Which method removes the last element of an array?",
    options: ["shift()", "push()", "pop()", "slice()"], answer: 2
  },
  {
    q: "Which array method adds an element to the end?",
    options: ["unshift()", "push()", "concat()", "pop()"], answer: 1
  },
  {
    q: "Which operator checks both value and type in JavaScript?",
    options: ["==", "===", "=", "!="], answer: 1
  },
  {
    q: "Which function shows a message in a pop-up box?",
    options: ["alert()", "print()", "msg()", "popup()"], answer: 0
  },
  {
    q: "Which method writes a message to the browser console?",
    options: ["console.log()", "log.console()", "print.console()", "document.write.log()"], answer: 0
  },
  {
    q: "What does DOM stand for?",
    options: ["Data Object Model", "Document Object Model", "Display Output Method", "Digital Order Markup"], answer: 1
  },
  {
    q: "Which method attaches an event handler to an element?",
    options: ["addEventListener()", "attachHandler()", "onEvent()", "bindEvent()"], answer: 0
  }
];

const startScreen = document.getElementById('startScreen');
const quizScreen = document.getElementById('quizScreen');
const resultScreen = document.getElementById('resultScreen');
const progressBox = document.getElementById('progressBox');
const form = document.getElementById('studentForm');

let student = {};
let questions = [];
let current = 0;
let score = 0;
let answers = [];
let answered = false;
let timePerQuestion = 15;
let timeLeft = 15;
let timer = null;

const segmentColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-danger', 'bg-purple'];

function show(screen) {
  startScreen.classList.add('d-none');
  quizScreen.classList.add('d-none');
  resultScreen.classList.add('d-none');
  screen.classList.remove('d-none');
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

function pickQuestions(count) {
  const chosen = shuffle(QUESTION_BANK).slice(0, count);
  const result = [];
  for (let i = 0; i < chosen.length; i++) {
    const rightText = chosen[i].options[chosen[i].answer];
    const mixed = shuffle(chosen[i].options);
    result.push({ q: chosen[i].q, options: mixed, correct: mixed.indexOf(rightText) });
  }
  return result;
}

const themeBtn = document.getElementById('themeBtn');
const themeText = document.getElementById('themeText');

function setTheme(theme) {
  document.documentElement.setAttribute('data-bs-theme', theme);
  themeText.textContent = theme === 'dark' ? 'Light' : 'Dark';
  themeBtn.querySelector('i').className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
  try { localStorage.setItem('quiz-theme', theme); } catch (e) { }
}

themeBtn.addEventListener('click', function () {
  const now = document.documentElement.getAttribute('data-bs-theme');
  setTheme(now === 'dark' ? 'light' : 'dark');
});

let savedTheme = null;
try { savedTheme = localStorage.getItem('quiz-theme'); } catch (e) { }
if (!savedTheme) {
  savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
setTheme(savedTheme);

form.addEventListener('submit', function (event) {
  event.preventDefault();
  form.classList.add('was-validated');          // Bootstrap shows red / green hints
  if (!form.checkValidity()) {
    return;                                     // some field is wrong - stay here
  }

  student = {
    name: document.getElementById('stuName').value.trim(),
    reg: document.getElementById('stuReg').value.trim().toUpperCase(),
    section: document.getElementById('stuSection').value,
    batch: document.getElementById('stuBatch').value
  };

  const count = Number(document.getElementById('countSelect').value);
  timePerQuestion = Number(document.getElementById('timeSelect').value);

  questions = pickQuestions(count);
  current = 0;
  score = 0;
  answers = [];

  buildSegments();
  progressBox.classList.remove('d-none');
  show(quizScreen);
  showQuestion();
});

function buildSegments() {
  const box = document.getElementById('segments');
  box.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const track = document.createElement('div');
    track.className = 'progress flex-fill';
    track.style.height = '12px';
    const bar = document.createElement('div');
    bar.className = 'progress-bar w-100 ' + segmentColors[i % segmentColors.length];
    track.appendChild(bar);
    box.appendChild(track);
  }
}

function updateSegments() {
  const bars = document.querySelectorAll('#segments .progress-bar');
  for (let i = 0; i < bars.length; i++) {
    let extra = 'opacity-25';                                   // not reached yet
    if (i < answers.length) {
      extra = '';                                               // answered
    } else if (i === current) {
      extra = 'progress-bar-striped progress-bar-animated';     // current question
    }
    bars[i].className = 'progress-bar w-100 ' + segmentColors[i % segmentColors.length] + ' ' + extra;
  }
  document.getElementById('progressText').textContent = answers.length + ' of ' + questions.length + ' answered';
  document.getElementById('liveScore').textContent = score;
}

function showQuestion() {
  const item = questions[current];
  answered = false;

  document.getElementById('qCounter').textContent = 'Question ' + (current + 1) + ' / ' + questions.length;
  document.getElementById('questionText').textContent = item.q;

  const optionsBox = document.getElementById('options');
  optionsBox.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  for (let i = 0; i < item.options.length; i++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'list-group-item list-group-item-action d-flex align-items-center gap-3 py-3';
    btn.innerHTML = '<span class="badge text-bg-secondary rounded-pill">' + letters[i] + '</span>' +
      '<span class="flex-grow-1 opt-text"></span><i class="bi"></i>';
    btn.querySelector('.opt-text').textContent = item.options[i];
    btn.addEventListener('click', makeChooseHandler(i));
    optionsBox.appendChild(btn);
  }

  const feedback = document.getElementById('feedback');
  feedback.className = 'alert d-none';
  document.getElementById('nextBtn').disabled = true;
  document.getElementById('nextLabel').textContent = (current === questions.length - 1) ? 'Finish' : 'Next';

  updateSegments();
  startTimer();
}

function makeChooseHandler(index) {
  return function () { chooseAnswer(index); };
}

function startTimer() {
  clearInterval(timer);
  timeLeft = timePerQuestion;
  showTime();
  timer = setInterval(function () {
    timeLeft = timeLeft - 1;
    showTime();
    if (timeLeft <= 0) {
      clearInterval(timer);
      timeIsUp();
    }
  }, 1000);
}

function showTime() {
  document.getElementById('timeLeft').textContent = timeLeft;
  const percent = (timeLeft / timePerQuestion) * 100;

  let color = 'success';
  if (percent <= 25) { color = 'danger'; }
  else if (percent <= 50) { color = 'warning'; }

  const bar = document.getElementById('timerBar');
  bar.style.width = percent + '%';
  bar.className = 'progress-bar bg-' + color;
  document.getElementById('timerText').className = 'badge fs-6 text-bg-' + color;
}

// ----- 4. Check the answer and highlight -----
function lockOptions(chosen) {
  const buttons = document.querySelectorAll('#options button');
  const right = questions[current].correct;
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].disabled = true;
    const icon = buttons[i].querySelector('i');
    if (i === right) {
      buttons[i].classList.add('list-group-item-success', 'border-success');
      icon.className = 'bi bi-check-circle-fill text-success fs-5';
    } else if (i === chosen) {
      buttons[i].classList.add('list-group-item-danger', 'border-danger', 'shake');
      icon.className = 'bi bi-x-circle-fill text-danger fs-5';
    } else {
      buttons[i].classList.add('dim');
    }
  }
}

function showFeedback(type, icon, text) {
  const feedback = document.getElementById('feedback');
  feedback.className = 'alert alert-' + type;
  feedback.innerHTML = '<i class="bi ' + icon + ' me-2"></i>' + text;
}

function chooseAnswer(index) {
  if (answered) { return; }
  answered = true;
  clearInterval(timer);

  if (index === questions[current].correct) {
    score = score + 1;
    answers.push({ chosen: index, status: 'correct' });
    showFeedback('success', 'bi-check-circle-fill', 'Correct! Well done.');
  } else {
    answers.push({ chosen: index, status: 'incorrect' });
    showFeedback('danger', 'bi-x-circle-fill', 'Incorrect. The right answer is highlighted in green.');
  }
  lockOptions(index);
  updateSegments();
  document.getElementById('nextBtn').disabled = false;
}

function timeIsUp() {
  if (answered) { return; }
  answered = true;
  answers.push({ chosen: null, status: 'timeout' });
  lockOptions(-1);
  showFeedback('warning', 'bi-hourglass-bottom', 'Time is up! The correct answer is highlighted.');
  updateSegments();
  document.getElementById('nextBtn').disabled = false;
}

document.getElementById('nextBtn').addEventListener('click', function () {
  if (current < questions.length - 1) {
    current = current + 1;
    showQuestion();
  } else {
    showResult();
  }
});


function answerText(i) {
  if (answers[i].chosen === null) { return 'Not Answered'; }
  return questions[i].options[answers[i].chosen];
}

function statusLabel(status) {
  if (status === 'correct') { return 'Correct'; }
  if (status === 'incorrect') { return 'Incorrect'; }
  return 'Timed out';
}

function showResult() {
  const total = questions.length;
  const percent = Math.round((score / total) * 100);
  let wrong = 0;
  let skipped = 0;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].status === 'incorrect') { wrong++; }
    if (answers[i].status === 'timeout') { skipped++; }
  }

  document.getElementById('scoreBig').textContent = score + '/' + total;
  document.getElementById('scorePct').textContent = percent + '%';
  document.getElementById('statCorrect').textContent = score;
  document.getElementById('statWrong').textContent = wrong;
  document.getElementById('statSkipped').textContent = skipped;

  let ring = 'danger';
  let title = 'Keep practising 💪';
  let message = 'Review the correct answers below and try again.';
  if (percent === 100) { ring = 'success'; title = 'Perfect score! 🏆'; message = 'You answered every question correctly.'; }
  else if (percent >= 70) { ring = 'success'; title = 'Great job! 🎉'; message = 'You have a solid grasp of the basics.'; }
  else if (percent >= 40) { ring = 'warning'; title = 'Good effort! 👍'; message = 'A little more practice and you will ace it.'; }
  document.getElementById('scoreCircle').className =
    'rounded-circle border border-5 border-' + ring + ' d-inline-flex flex-column align-items-center justify-content-center bg-body shadow';
  document.getElementById('resultTitle').textContent = title;
  document.getElementById('resultMsg').textContent = message;

  const info = document.getElementById('studentInfo');
  info.innerHTML = '';
  const details = [student.name, student.reg, 'Section ' + student.section, 'Batch ' + student.batch];
  for (let i = 0; i < details.length; i++) {
    const chip = document.createElement('span');
    chip.className = 'badge rounded-pill text-bg-primary fs-6 fw-medium';
    chip.textContent = details[i];
    info.appendChild(chip);
  }

  const body = document.getElementById('reviewBody');
  body.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const colors = { correct: 'success', incorrect: 'danger', timeout: 'warning' };
    const row = document.createElement('tr');
    row.innerHTML = '<td></td><td></td><td></td><td></td><td class="text-center"><span class="badge"></span></td>';
    const cells = row.querySelectorAll('td');
    cells[0].textContent = i + 1;
    cells[1].textContent = questions[i].q;
    cells[2].textContent = answerText(i);
    cells[3].textContent = questions[i].options[questions[i].correct];
    const badge = row.querySelector('.badge');
    badge.className = 'badge text-bg-' + colors[answers[i].status];
    badge.textContent = statusLabel(answers[i].status);
    body.appendChild(row);
  }

  updateSegments();
  show(resultScreen);
  window.scrollTo(0, 0);
}

document.getElementById('restartBtn').addEventListener('click', function () {
  clearInterval(timer);
  progressBox.classList.add('d-none');
  show(startScreen);
});

document.getElementById('downloadBtn').addEventListener('click', function () {
  const doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'a4' });
  const total = questions.length;
  const percent = Math.round((score / total) * 100);

  doc.setFontSize(22);
  doc.text('Quiz Result', 40, 56);

  doc.setFontSize(11);
  doc.text('Name: ' + student.name, 40, 80);
  doc.text('Reg. No: ' + student.reg, 320, 80);
  doc.text('Section: ' + student.section, 40, 98);
  doc.text('Batch: ' + student.batch, 320, 98);

  doc.setFontSize(14);
  doc.text('Score: ' + score + ' / ' + total + '  (' + percent + '%)', 40, 124);
  doc.setFontSize(10);
  doc.setTextColor(110);
  doc.text('CSC336 Web Technologies - Web Tech Quiz  |  ' + new Date().toLocaleString(), 40, 142);
  doc.setTextColor(0);

  const rows = [];
  for (let i = 0; i < questions.length; i++) {
    rows.push([i + 1, questions[i].q, answerText(i), questions[i].options[questions[i].correct], statusLabel(answers[i].status)]);
  }

  doc.autoTable({
    startY: 156,
    head: [['#', 'Question', 'Your Answer', 'Correct Answer', 'Status']],
    body: rows,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: [224, 224, 224], textColor: 20, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 247, 247] },
    columnStyles: { 0: { cellWidth: 24 }, 1: { cellWidth: 190 }, 4: { cellWidth: 62, halign: 'center', fontStyle: 'bold' } },
    margin: { left: 40, right: 40 },
    didParseCell: function (data) {
      if (data.section === 'body' && data.column.index === 4) {
        const text = data.cell.raw;
        data.cell.styles.textColor = 255;
        if (text === 'Correct') { data.cell.styles.fillColor = [25, 135, 84]; }
        else if (text === 'Incorrect') { data.cell.styles.fillColor = [220, 53, 69]; }
        else { data.cell.styles.fillColor = [184, 134, 11]; }
      }
    }
  });

  doc.save('Quiz_Result_' + student.reg + '.pdf');
});
