const API_BASE = 'https://authlyapi2.pythonanywhere.com';

const generateBtn = document.getElementById('generateBtn');
const ideaContainer = document.getElementById('ideaContainer');
const ideaText = document.getElementById('ideaText');
const ideaId = document.getElementById('ideaId');
const acceptIdeaBtn = document.getElementById('acceptIdeaBtn');
const confirmPopup = document.getElementById('confirmPopup');
const confirmContinue = document.getElementById('confirmContinue');
const confirmBack = document.getElementById('confirmBack');

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
        console.error('❌ Error fetching idea:', e);
        ideaText.textContent = 'Error fetching idea. Please try again.';
        currentIdea = null;
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
