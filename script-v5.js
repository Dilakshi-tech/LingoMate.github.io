/* LINGO MATE COMPLETE INTERACTIVE JAVASCRIPT ENGINE */

// 1. DATABASE MODEL & STATE
const LINGO_MATE_DB = {
  user: {
    id: "user_101",
    name: "Ayodya Perera",
    avatar: "🎓",
    activeLanguage: "french",
    activePathway: "ol",
    activeLevel: 2,
    xp: 1250,
    streak: 7
  },

  // Database Sentences (Part 10 & 16.7 Specifications)
  sentences: [
    {
      id: "s1",
      lang: "french",
      level: 2,
      pathway: "ol",
      english: "I ate a croissant this morning.",
      sinhala: "මම අද උදේ කෲසෝන් එකක් කෑවෙමි.",
      components: ["J'ai", "mangé", "un", "croissant", "ce", "matin."],
      hint: "Past tense requires auxiliary 'J'ai' followed by past participle 'mangé'."
    },
    {
      id: "s2",
      lang: "french",
      level: 2,
      pathway: "ol",
      english: "We finished our homework.",
      sinhala: "අපි අපගේ ගෙදර වැඩ අවසන් කළෙමු.",
      components: ["Nous", "avons", "fini", "nos", "devoirs."],
      hint: "Subject 'Nous' pairs with auxiliary 'avons'."
    }
  ],

  // Lessons Data (5.1 & Part 6)
  lessons: [
    { id: 1, title: "Lesson 1: Greetings & Alphabet", category: "vocab", level: 1, duration: "10 mins", status: "completed" },
    { id: 2, title: "Lesson 2: Present Tense Verbs", category: "grammar", level: 1, duration: "15 mins", status: "completed" },
    { id: 3, title: "Lesson 3: Daily Conversation Audio", category: "listening", level: 2, duration: "12 mins", status: "completed" },
    { id: 4, title: "Lesson 4: Passé Composé with Avoir", category: "grammar", level: 2, duration: "20 mins", status: "active" },
    { id: 5, title: "Lesson 5: Paragraph & Story Reading", category: "reading", level: 2, duration: "15 mins", status: "pending" }
  ]
};

// Current active game state
let currentSentenceIdx = 0;
let selectedTileIds = [];

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSentenceBuilder();
  renderLessonsGrid();
  renderDailyTasksTimeline();
  console.log("Lingo Mate Application Engine Fully Initialized.");
});

// NAVIGATION ENGINE
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSecId = link.getAttribute('data-sec');
      
      // Update sidebar active link
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Update active section
      document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
      const targetSec = document.getElementById(targetSecId);
      if(targetSec) targetSec.classList.add('active');
    });
  });

  // Role Switcher Handler
  document.querySelectorAll('.btn-role').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.btn-role').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const role = btn.getAttribute('data-role');
      document.body.setAttribute('data-role', role);

      if(role === 'admin') {
        document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById('sec-admin').classList.add('active');
      } else {
        document.querySelectorAll('.app-section').forEach(sec => sec.classList.remove('active'));
        document.getElementById('sec-home').classList.add('active');
      }
    });
  });
}

// SENTENCE BUILDER ENGINE (PART 10 SPECIFICATIONS)
function initSentenceBuilder() {
  const sentData = LINGO_MATE_DB.sentences[currentSentenceIdx];
  if(!sentData) return;

  document.getElementById('sb-english-prompt').innerText = `"${sentData.english}"`;
  document.getElementById('sb-sinhala-prompt').innerText = `Sinhala: ${sentData.sinhala}`;
  
  // Clear drop zone
  const dropZone = document.getElementById('sb-drop-zone');
  dropZone.innerHTML = '<span class="sb-placeholder" id="sb-placeholder">Tap target words below to construct sentence...</span>';

  // Shuffle components
  const shuffled = [...sentData.components].sort(() => Math.random() - 0.5);
  const tilesContainer = document.getElementById('sb-tiles-container');
  tilesContainer.innerHTML = '';

  shuffled.forEach((comp, idx) => {
    const tile = document.createElement('span');
    tile.className = 'word-tile';
    tile.innerText = comp;
    tile.setAttribute('data-val', comp);
    tile.addEventListener('click', () => handleTileClick(tile, comp));
    tilesContainer.appendChild(tile);
  });
}

function handleTileClick(tileElem, compVal) {
  const dropZone = document.getElementById('sb-drop-zone');
  const placeholder = document.getElementById('sb-placeholder');
  if(placeholder) placeholder.style.display = 'none';

  if(tileElem.parentElement.id === 'sb-tiles-container') {
    // Move tile to drop zone
    dropZone.appendChild(tileElem);
  } else {
    // Return tile to pool
    document.getElementById('sb-tiles-container').appendChild(tileElem);
  }
}

function resetSentenceBuilder() {
  initSentenceBuilder();
  document.getElementById('sb-hint-banner').classList.add('hidden');
  document.getElementById('sb-feedback').classList.add('hidden');
}

function requestSentenceHint() {
  const sentData = LINGO_MATE_DB.sentences[currentSentenceIdx];
  const hintBanner = document.getElementById('sb-hint-banner');
  hintBanner.innerText = `💡 Level 5 Hint: ${sentData.hint}`;
  hintBanner.classList.remove('hidden');
}

function checkSentenceAnswer() {
  const dropZone = document.getElementById('sb-drop-zone');
  const userTiles = Array.from(dropZone.querySelectorAll('.word-tile')).map(t => t.getAttribute('data-val'));
  const targetSent = LINGO_MATE_DB.sentences[currentSentenceIdx].components;

  const feedback = document.getElementById('sb-feedback');
  feedback.classList.remove('hidden');

  if(JSON.stringify(userTiles) === JSON.stringify(targetSent)) {
    feedback.className = 'feedback-box success-box';
    feedback.innerHTML = '🎉 <strong>Correct!</strong> +50 XP Earned. Excellent grammar structure!';
    LINGO_MATE_DB.user.xp += 50;
    document.getElementById('header-xp-val').innerText = `${LINGO_MATE_DB.user.xp} XP`;
  } else {
    feedback.className = 'feedback-box error-box';
    feedback.innerHTML = `❌ <strong>Not quite right.</strong> Correct sentence: <em>${targetSent.join(' ')}</em>`;
  }
}

function playSentenceAudio() {
  const sentData = LINGO_MATE_DB.sentences[currentSentenceIdx];
  playAudio(sentData.components.join(' '));
}

// AUDIO SYNTHESIS ENGINE
function playAudio(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    window.speechSynthesis.speak(utterance);
  } else {
    alert(`[Audio Playback]: "${text}"`);
  }
}

// RENDER LESSONS GRID
function renderLessonsGrid() {
  const container = document.getElementById('lessons-grid-container');
  if(!container) return;
  container.innerHTML = '';

  LINGO_MATE_DB.lessons.forEach(l => {
    const card = document.createElement('div');
    card.className = `stat-card lesson-card ${l.status}`;
    card.innerHTML = `
      <div class="stat-header">
        <span>${l.category.toUpperCase()}</span>
        <span class="badge-status">${l.status.toUpperCase()}</span>
      </div>
      <h4>${l.title}</h4>
      <p class="text-muted">Duration: ${l.duration}</p>
      <button class="btn-primary btn-sm margin-top-sm" onclick="openLessonReader()">Start Lesson ▶</button>
    `;
    container.appendChild(card);
  });
}

function openLessonReader() {
  document.getElementById('lesson-reader-modal').classList.remove('hidden');
}

function closeLessonReader() {
  document.getElementById('lesson-reader-modal').classList.add('hidden');
}

function markLessonComplete() {
  alert('Lesson marked as completed! +50 XP awarded.');
  closeLessonReader();
}

// RENDER DAILY TASKS
function renderDailyTasksTimeline() {
  const container = document.getElementById('daily-tasks-timeline');
  if(!container) return;

  container.innerHTML = `
    <div class="card-box margin-bottom-sm">
      <h4>1. Learn 5 New French Verbs</h4>
      <p>Target: Vocabulary · XP: +20 XP</p>
      <span class="badge-status-completed">✓ Completed</span>
    </div>
    <div class="card-box margin-bottom-sm">
      <h4>2. Play Sentence Builder Challenge</h4>
      <p>Target: Sentence Structure · XP: +50 XP</p>
      <button class="btn-primary btn-sm" onclick="launchGame('sentence-builder')">Start Task ▶</button>
    </div>
  `;
}

// GAME LAUNCHER
function launchGame(gameId) {
  const modal = document.getElementById('gameplay-modal');
  modal.classList.remove('hidden');

  if(gameId === 'sentence-builder') {
    document.getElementById('sentence-builder-engine').classList.remove('hidden');
    document.getElementById('generic-game-engine').classList.add('hidden');
    document.getElementById('game-modal-title').innerText = "Mandatory Sentence Builder Engine";
  } else {
    document.getElementById('sentence-builder-engine').classList.add('hidden');
    document.getElementById('generic-game-engine').classList.remove('hidden');
    document.getElementById('game-modal-title').innerText = `Mini-Game: ${gameId}`;
    document.getElementById('gen-game-content').innerHTML = `<p>Playing ${gameId} arena...</p>`;
  }
}

function closeGameplayModal() {
  document.getElementById('gameplay-modal').classList.add('hidden');
}

// ADMIN FUNCTIONS
function saveAdminSentence() {
  const target = document.getElementById('admin-sent-target').value;
  const eng = document.getElementById('admin-sent-eng').value;
  const sin = document.getElementById('admin-sent-sin').value;
  const compStr = document.getElementById('admin-sent-comp').value;

  LINGO_MATE_DB.sentences.push({
    id: `s${LINGO_MATE_DB.sentences.length + 1}`,
    lang: "french",
    level: 2,
    pathway: "ol",
    english: eng,
    sinhala: sin,
    components: compStr.split(',').map(s => s.trim()),
    hint: "Admin added sentence"
  });

  alert("Sentence published to database successfully!");
}

// HELPERS
function selectLanguage(lang) { alert(`Language set to ${lang}`); }
function selectPathway(path) { alert(`Pathway set to ${path}`); }
function openLevel(lvl) { alert(`Opening Level ${lvl}`); }
function saveStudyGoals() { alert("Study goals saved!"); }
function selectAvatar(av) {
  document.getElementById('header-avatar-emoji').innerText = av;
  document.getElementById('home-avatar-display').innerText = av;
  document.getElementById('sidebar-avatar-display').innerText = av;
  alert("Avatar updated!");
}
function saveProfileDetails() { alert("Profile saved!"); }
function submitCommunityNote() { alert("Note submitted for teacher moderation review!"); }
