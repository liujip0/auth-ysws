const API_BASE = 'https://authlyapi2.pythonanywhere.com';

const generateBtn = document.getElementById('generateBtn');
const ideaContainer = document.getElementById('ideaContainer');
const ideaText = document.getElementById('ideaText');
const ideaId = document.getElementById('ideaId');
const acceptIdeaBtn = document.getElementById('acceptIdeaBtn');
const confirmPopup = document.getElementById('confirmPopup');
const confirmContinue = document.getElementById('confirmContinue');
const confirmBack = document.getElementById('confirmBack');
const ideaDisclaimer = document.getElementById('ideaDisclaimer');
const localIdeas = {
  '1': { text: 'Beat a short, 10-second platformer level to grab a virtual key.', id: '1' },
  '2': { text: 'Hit notes in time with a song, like Guitar Hero, to unlock access.', id: '2' },
  '3': { text: 'Type a paragraph with a minimum WPM and accuracy.', id: '3' },
  '4': { text: 'Find a tiny character or object in a complex image.', id: '4' },
  '5': { text: 'Identify a random location on Google Maps Street View.', id: '5' },
  '6': { text: 'Solve a "mate in one" chess puzzle.', id: '6' },
  '7': { text: 'Get a score in a simple game like Flappy Bird.', id: '7' },
  '8': { text: 'Repeat a sequence of colours and sounds.', id: '8' },
  '9': { text: 'Get a ball into a basket by drawing lines.', id: '9' },
  '10': { text: 'Navigate a dot through a maze before the timer runs out.', id: '10' },
  '11': { text: 'Solve a five-letter word puzzle that changes daily.', id: '11' },
  '12': { text: 'Click a button the instant it changes colour.', id: '12' },
  '13': { text: 'Match musical notes with your voice.', id: '13' },
  '14': { text: 'Find a combo by listening to tumbler clicks.', id: '14' },
  '15': { text: "Find the 'key' item in a short text adventure.", id: '15' },
  '16': { text: 'Mix a specific drink from virtual ingredients.', id: '16' },
  '17': { text: "Only allowed if you've made a commit today.", id: '17' },
  '18': { text: 'Use your most-played artist of the week.', id: '18' },
  '19': { text: 'Allowed only if your streak is active.', id: '19' },
  '20': { text: 'Use the current price of a cryptocurrency.', id: '20' }
};

ideaDisclaimer.hidden = true;

let currentIdea = null;

async function tryFetchWithFallback(endpoint, options = {}) {
  const urls = [
    `https://corsproxy.io/?${API_BASE}${endpoint}`,
    `https://api.allorigins.win/raw?url=${API_BASE}${endpoint}`, 
    `https://thingproxy.freeboard.io/fetch/${API_BASE}${endpoint}`
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, options);
      if (res.ok) return res;
      console.warn(`❌ Proxy responded with status ${res.status}: ${url}`);
    } catch (err) {
      console.warn(`❌ Failed on ${url}`, err);
    }
  }
  throw new Error("All proxy attempts failed");
}

async function fetchRandomIdea() {
  generateBtn.disabled = true;
  generateBtn.textContent = 'Generating...';
  acceptIdeaBtn.style.display = 'none';
  ideaContainer.style.display = 'block';
  ideaText.textContent = 'Loading idea...';
  ideaId.textContent = '';

  try {
    const res = await tryFetchWithFallback('/random', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    const idea = await res.json();
    currentIdea = idea;
    ideaText.textContent = idea.text || idea.idea || 'Idea text missing';
    ideaId.textContent = `Idea ID: ${idea.id}`;
    acceptIdeaBtn.style.display = 'inline-block';
  } catch (e) {
    const ideaValues = Object.values(localIdeas);
    const idea = ideaValues[Math.floor(Math.random() * ideaValues.length)];
    console.error('❌ Error fetching idea:', e);
    ideaText.textContent = idea.text;
    ideaDisclaimer.hidden = false;
    currentIdea = idea;
  }

  generateBtn.disabled = false;
  generateBtn.textContent = 'Give me another idea!';
}

async function deleteCurrentIdea() {
  if (!currentIdea) return;

  acceptIdeaBtn.disabled = true;
  ideaText.textContent = 'Removing idea...';

  try {
    const res = await tryFetchWithFallback(`/delete/${currentIdea.id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) throw new Error(`Failed to delete idea (${res.status})`);

    await res.json();
    alert('Idea accepted and removed from database!');
    hideConfirmPopup();
    acceptIdeaBtn.style.display = 'none';
    currentIdea = null;
  } catch (error) {
    console.error('❌ Error deleting idea:', error);
    alert('Could not remove idea. Please try again later.');
  } finally {
    acceptIdeaBtn.disabled = false;
  }
}

function showConfirmPopup() {
  confirmPopup.classList.remove('hidden');
}

function hideConfirmPopup() {
  confirmPopup.classList.add('hidden');
}

generateBtn.addEventListener('click', fetchRandomIdea);

acceptIdeaBtn.addEventListener('click', () => {
  if (!currentIdea) return;
  showConfirmPopup();
});

confirmContinue.addEventListener('click', () => {
  deleteCurrentIdea();
});

confirmBack.addEventListener('click', () => {
  hideConfirmPopup();
});

confirmPopup.addEventListener('click', (e) => {
  if (e.target === confirmPopup) {
    hideConfirmPopup();
  }
});
