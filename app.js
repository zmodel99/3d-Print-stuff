const state = {
  roomCode: generateRoomCode(),
  players: [],
  scores: {},
  logs: [],
  currentGame: null,
  trivia: null,
  wordForge: null,
  storyChain: null,
};

const logList = document.querySelector('#log-entries');
const playerList = document.querySelector('#player-list');
const scoreList = document.querySelector('#score-list');
const stage = document.querySelector('#game-stage');
const stageSubtitle = document.querySelector('#stage-subtitle');
const roomCodeEl = document.querySelector('#room-code');
const joinForm = document.querySelector('#join-form');
const resetButton = document.querySelector('#reset-session');

const games = {
  trivia: {
    id: 'trivia',
    name: 'Trivia Blitz',
    description: 'Fast questions, faster answers.',
    init() {
      if (!state.trivia) {
        state.trivia = {
          questions: shuffleArray([
            {
              question: 'What planet in our solar system has the most moons?',
              choices: ['Earth', 'Jupiter', 'Saturn', 'Neptune'],
              answer: 2,
              fact: 'Saturn has more than 80 confirmed moons!',
            },
            {
              question: 'Which artist painted "The Persistence of Memory"?',
              choices: ['Salvador Dalí', 'Pablo Picasso', 'Claude Monet', 'Andy Warhol'],
              answer: 0,
              fact: 'Dalí finished it in just a few hours in 1931.',
            },
            {
              question: 'What is the rarest blood type?',
              choices: ['O-negative', 'AB-negative', 'A-positive', 'B-negative'],
              answer: 1,
              fact: 'Only about 0.6% of people have AB-negative blood.',
            },
            {
              question: 'Which mammal is known to have the most powerful bite?',
              choices: ['Grizzly bear', 'Hippopotamus', 'Gorilla', 'Jaguar'],
              answer: 1,
              fact: 'A hippo’s bite force can reach 2,000 psi.',
            },
            {
              question: 'What is the smallest country in the world?',
              choices: ['Monaco', 'Vatican City', 'Liechtenstein', 'San Marino'],
              answer: 1,
              fact: 'The Vatican is only about 0.2 square miles.',
            },
          ]),
          index: 0,
        };
      }
    },
    render(container) {
      this.init();
      const data = state.trivia;
      if (!data.questions.length) return;
      if (data.index >= data.questions.length) {
        data.index = 0;
      }
      const current = data.questions[data.index];

      const wrapper = document.createElement('div');
      wrapper.className = 'control-group';

      const question = document.createElement('h3');
      question.textContent = current.question;
      wrapper.appendChild(question);

      const form = document.createElement('form');
      form.className = 'control-group';

      const optionsFieldset = document.createElement('fieldset');
      const legend = document.createElement('legend');
      legend.textContent = 'Select an answer';
      optionsFieldset.appendChild(legend);

      current.choices.forEach((choice, idx) => {
        const label = document.createElement('label');
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.gap = '0.5rem';
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'trivia-option';
        radio.value = idx;
        label.appendChild(radio);
        const span = document.createElement('span');
        span.textContent = choice;
        label.appendChild(span);
        optionsFieldset.appendChild(label);
      });

      form.appendChild(optionsFieldset);

      const selectGroup = document.createElement('div');
      selectGroup.className = 'control-group';

      const selectLabel = document.createElement('label');
      selectLabel.textContent = 'Who answered?';
      selectGroup.appendChild(selectLabel);

      const playerSelect = createPlayerSelect('trivia-player');
      selectGroup.appendChild(playerSelect);

      form.appendChild(selectGroup);

      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Check Answer (+100 pts)';
      submitBtn.disabled = state.players.length === 0;
      form.appendChild(submitBtn);

      const fact = document.createElement('p');
      fact.textContent = 'Fun fact: ' + current.fact;
      fact.style.marginTop = '0.5rem';
      wrapper.appendChild(form);
      wrapper.appendChild(fact);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const chosen = form.querySelector('input[name="trivia-option"]:checked');
        const player = playerSelect.value;
        if (!player) {
          addLog('Pick a player before scoring the question.');
          return;
        }
        if (!chosen) {
          addLog('Pick an answer before scoring the question.');
          return;
        }
        const answerIndex = Number(chosen.value);
        if (answerIndex === current.answer) {
          addScore(player, 100);
          addLog(`${player} crushed the trivia: "${current.question}"`);
        } else {
          addLog(`${player} guessed ${current.choices[answerIndex]}, but it was ${current.choices[current.answer]}.`);
        }
        data.index = (data.index + 1) % data.questions.length;
        renderGameStage();
      });

      container.appendChild(wrapper);
    },
  },
  wordforge: {
    id: 'wordforge',
    name: 'Word Forge',
    description: 'Form the longest word out of the forge letters.',
    init() {
      if (!state.wordForge) {
        state.wordForge = {
          sets: shuffleArray([
            'A E R T L V',
            'S P L O O K',
            'M I R A C E',
            'N D T O I U',
            'B L A Z E R',
          ]),
          index: 0,
        };
      }
    },
    render(container) {
      this.init();
      const data = state.wordForge;
      if (data.index >= data.sets.length) {
        data.index = 0;
      }
      const letters = data.sets[data.index];

      const wrapper = document.createElement('div');
      wrapper.className = 'control-group';

      const headline = document.createElement('h3');
      headline.textContent = 'Letters in the forge';
      wrapper.appendChild(headline);

      const lettersDisplay = document.createElement('div');
      lettersDisplay.style.fontSize = '2rem';
      lettersDisplay.style.letterSpacing = '0.6rem';
      lettersDisplay.style.fontWeight = '700';
      lettersDisplay.textContent = letters;
      wrapper.appendChild(lettersDisplay);

      const form = document.createElement('form');
      form.className = 'control-group';

      const selectLabel = document.createElement('label');
      selectLabel.textContent = 'Who forged a word?';
      form.appendChild(selectLabel);
      const playerSelect = createPlayerSelect('wordforge-player');
      form.appendChild(playerSelect);

      const wordLabel = document.createElement('label');
      wordLabel.textContent = 'Enter the word they created';
      form.appendChild(wordLabel);
      const wordInput = document.createElement('input');
      wordInput.type = 'text';
      wordInput.placeholder = 'e.g. ALARM';
      wordInput.required = true;
      form.appendChild(wordInput);

      const buttonsRow = document.createElement('div');
      buttonsRow.style.display = 'flex';
      buttonsRow.style.gap = '0.5rem';

      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Score Word';
      submitBtn.disabled = state.players.length === 0;
      buttonsRow.appendChild(submitBtn);

      const refreshBtn = document.createElement('button');
      refreshBtn.type = 'button';
      refreshBtn.className = 'ghost-btn';
      refreshBtn.textContent = 'Refresh Letters';
      buttonsRow.appendChild(refreshBtn);

      form.appendChild(buttonsRow);
      wrapper.appendChild(form);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const player = playerSelect.value;
        const word = wordInput.value.trim().toUpperCase();
        if (!player) {
          addLog('Select a player to award Word Forge points.');
          return;
        }
        if (!word) {
          addLog('Enter a word before scoring.');
          return;
        }
        if (!canBuildWord(word, letters)) {
          addLog(`${word} cannot be forged from ${letters}. No points this time.`);
          wordInput.value = '';
          return;
        }
        const points = word.length * 10;
        addScore(player, points);
        addLog(`${player} forged "${word}" for ${points} points.`);
        wordInput.value = '';
      });

      refreshBtn.addEventListener('click', () => {
        data.index = (data.index + 1) % data.sets.length;
        addLog('The forge spat out a new batch of letters.');
        renderGameStage();
      });

      container.appendChild(wrapper);
    },
  },
  story: {
    id: 'story',
    name: 'Story Chain',
    description: 'Build a silly story line by line.',
    init() {
      if (!state.storyChain) {
        state.storyChain = {
          prompt: randomPrompt(),
          entries: [],
        };
      }
    },
    render(container) {
      this.init();
      const data = state.storyChain;

      const wrapper = document.createElement('div');
      wrapper.className = 'control-group';

      const prompt = document.createElement('h3');
      prompt.textContent = 'Prompt: ' + data.prompt;
      wrapper.appendChild(prompt);

      const storyList = document.createElement('ol');
      storyList.style.display = 'flex';
      storyList.style.flexDirection = 'column';
      storyList.style.gap = '0.5rem';
      data.entries.forEach((entry, idx) => {
        const item = document.createElement('li');
        item.innerHTML = `<strong>${idx + 1}. ${entry.player}:</strong> ${entry.text}`;
        storyList.appendChild(item);
      });
      if (data.entries.length === 0) {
        const item = document.createElement('p');
        item.textContent = 'No sentences yet. Get weird!';
        storyList.appendChild(item);
      }
      wrapper.appendChild(storyList);

      const form = document.createElement('form');
      form.className = 'control-group';

      const selectLabel = document.createElement('label');
      selectLabel.textContent = 'Who is adding the next line?';
      form.appendChild(selectLabel);
      const playerSelect = createPlayerSelect('story-player');
      form.appendChild(playerSelect);

      const sentenceLabel = document.createElement('label');
      sentenceLabel.textContent = 'Add their sentence';
      form.appendChild(sentenceLabel);
      const sentenceInput = document.createElement('textarea');
      sentenceInput.placeholder = 'e.g. Meanwhile, the llama learned to tap dance...';
      form.appendChild(sentenceInput);

      const pointsLabel = document.createElement('label');
      pointsLabel.textContent = 'Style bonus (10-200 pts)';
      form.appendChild(pointsLabel);
      const pointsInput = document.createElement('input');
      pointsInput.type = 'number';
      pointsInput.min = '10';
      pointsInput.max = '200';
      pointsInput.step = '10';
      pointsInput.value = '50';
      form.appendChild(pointsInput);

      const buttonsRow = document.createElement('div');
      buttonsRow.style.display = 'flex';
      buttonsRow.style.gap = '0.5rem';

      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = 'Add Line';
      submitBtn.disabled = state.players.length === 0;
      buttonsRow.appendChild(submitBtn);

      const resetBtn = document.createElement('button');
      resetBtn.type = 'button';
      resetBtn.className = 'ghost-btn';
      resetBtn.textContent = 'New Prompt';
      buttonsRow.appendChild(resetBtn);

      form.appendChild(buttonsRow);
      wrapper.appendChild(form);

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const player = playerSelect.value;
        const sentence = sentenceInput.value.trim();
        const points = Number(pointsInput.value) || 0;
        if (!player) {
          addLog('Pick a storyteller before adding lines.');
          return;
        }
        if (!sentence) {
          addLog('Type a sentence to add to the story.');
          return;
        }
        data.entries.push({ player, text: sentence });
        if (points > 0) {
          addScore(player, points);
          addLog(`${player} added a twist worth ${points} points.`);
        } else {
          addLog(`${player} added a sentence but no points were awarded.`);
        }
        sentenceInput.value = '';
        renderGameStage();
      });

      resetBtn.addEventListener('click', () => {
        data.prompt = randomPrompt();
        data.entries = [];
        addLog('Story prompt reset. Time for a fresh tale.');
        renderGameStage();
      });

      container.appendChild(wrapper);
    },
  },
};

function renderGameStage() {
  stage.innerHTML = '';
  if (!state.currentGame) {
    stageSubtitle.textContent = 'Select a game to get started.';
    const p = document.createElement('p');
    p.className = 'placeholder';
    p.textContent = 'Select any of the games above to light up the party screen.';
    stage.appendChild(p);
    return;
  }
  const game = games[state.currentGame];
  if (!game) return;
  stageSubtitle.textContent = game.description;
  game.render(stage);
}

function createPlayerSelect(id) {
  const select = document.createElement('select');
  select.id = id;
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = state.players.length ? 'Select player' : 'Add players first';
  select.appendChild(defaultOption);
  state.players.forEach((player) => {
    const option = document.createElement('option');
    option.value = player;
    option.textContent = player;
    select.appendChild(option);
  });
  return select;
}

function renderPlayers() {
  playerList.innerHTML = '';
  if (state.players.length === 0) {
    const empty = document.createElement('li');
    empty.textContent = 'No one in the room yet.';
    playerList.appendChild(empty);
    return;
  }
  state.players.forEach((player) => {
    const item = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = player;
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.textContent = 'Kick';
    removeBtn.addEventListener('click', () => removePlayer(player));
    item.appendChild(span);
    item.appendChild(removeBtn);
    playerList.appendChild(item);
  });
}

function renderScoreboard() {
  scoreList.innerHTML = '';
  const entries = Object.entries(state.scores);
  if (!entries.length) {
    const empty = document.createElement('li');
    empty.textContent = 'Scores will appear here.';
    scoreList.appendChild(empty);
    return;
  }
  entries
    .sort((a, b) => b[1] - a[1])
    .forEach(([player, score], index) => {
      const item = document.createElement('li');
      item.innerHTML = `<span>${index + 1}. ${player}</span><span>${score} pts</span>`;
      scoreList.appendChild(item);
    });
}

function renderLog() {
  logList.innerHTML = '';
  if (!state.logs.length) {
    const empty = document.createElement('li');
    empty.textContent = 'Game actions appear here.';
    logList.appendChild(empty);
    return;
  }
  state.logs.forEach((log) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${log.time}</strong> — ${log.message}`;
    logList.appendChild(item);
  });
}

function addScore(player, amount) {
  state.scores[player] = (state.scores[player] || 0) + amount;
  renderScoreboard();
}

function addLog(message) {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  state.logs.unshift({ message, time: timestamp });
  state.logs = state.logs.slice(0, 12);
  renderLog();
}

function addPlayer(name) {
  const cleaned = name.trim();
  if (!cleaned) return;
  if (state.players.includes(cleaned)) {
    addLog(`${cleaned} is already in the room.`);
    return;
  }
  state.players.push(cleaned);
  state.scores[cleaned] = state.scores[cleaned] || 0;
  addLog(`${cleaned} grabbed a spot in the lobby.`);
  renderPlayers();
  renderScoreboard();
  renderGameStage();
}

function removePlayer(name) {
  state.players = state.players.filter((player) => player !== name);
  delete state.scores[name];
  addLog(`${name} left the room.`);
  renderPlayers();
  renderScoreboard();
  renderGameStage();
}

function resetSession() {
  state.players = [];
  state.scores = {};
  state.logs = [];
  state.currentGame = null;
  state.trivia = null;
  state.wordForge = null;
  state.storyChain = null;
  state.roomCode = generateRoomCode();
  roomCodeEl.textContent = state.roomCode;
  stageSubtitle.textContent = 'Select a game to get started.';
  addLog('Session reset. Fresh vibes!');
  renderPlayers();
  renderScoreboard();
  renderGameStage();
}

function setGame(gameId) {
  state.currentGame = gameId;
  const game = games[gameId];
  if (game?.init) {
    game.init();
  }
  addLog(`${game.name} loaded into the party screen.`);
  renderGameStage();
}

function generateRoomCode() {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i += 1) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

function canBuildWord(word, lettersSet) {
  const available = lettersSet.replace(/\s+/g, '').toUpperCase();
  const counts = {};
  for (const letter of available) {
    counts[letter] = (counts[letter] || 0) + 1;
  }
  for (const char of word) {
    if (!counts[char]) {
      return false;
    }
    counts[char] -= 1;
  }
  return true;
}

function randomPrompt() {
  const prompts = [
    'A detective llama solving mysteries on Mars',
    'The day breakfast cereal gained sentience',
    'A world where people communicate using only dance moves',
    'A heist team composed entirely of mischievous grandmas',
    'Aliens trying to understand human game nights',
  ];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

function shuffleArray(arr) {
  const clone = [...arr];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(joinForm);
  const name = formData.get('player-name');
  addPlayer(name);
  joinForm.reset();
});

resetButton.addEventListener('click', resetSession);

roomCodeEl.textContent = state.roomCode;
renderPlayers();
renderScoreboard();
renderLog();
renderGameStage();

Array.from(document.querySelectorAll('.select-game')).forEach((button) => {
  const card = button.closest('.game-card');
  const gameId = card?.dataset.game;
  button.addEventListener('click', () => {
    if (gameId) {
      setGame(gameId);
    }
  });
});
