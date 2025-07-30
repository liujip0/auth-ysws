
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


async function fetchRandomIdea() {
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating...';
    acceptIdeaBtn.style.display = 'none';
    ideaContainer.style.display = 'block';
    ideaText.textContent = 'Loading idea...';
    ideaId.textContent = '';

    try {
        const res = await fetch(`${API_BASE}/random`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        
        if (!res.ok) {
            if (res.status === 404) {
                ideaText.textContent = 'No more ideas left!';
            } else {
                ideaText.textContent = `Failed to fetch idea (${res.status}). Try again.`;
            }
            currentIdea = null;
            generateBtn.disabled = false;
            generateBtn.textContent = 'Give me an idea!';
            return;
        }
        
        const idea = await res.json();
        currentIdea = idea;
        ideaText.textContent = idea.text || idea.idea || 'Idea text missing';
        ideaId.textContent = `Idea ID: ${idea.id}`;
        acceptIdeaBtn.style.display = 'inline-block';
    } catch (e) {
        console.error('Error fetching idea:', e);
        if (e.name === 'TypeError' && e.message.includes('Failed to fetch')) {
            ideaText.textContent = 'CORS Error: Please serve this file from a web server or use a CORS proxy.';
        } else {
            ideaText.textContent = 'Error fetching idea. Please try again.';
        }
        currentIdea = null;
    }

    generateBtn.disabled = false;
    generateBtn.textContent = 'Give me another idea!';
}


function showConfirmPopup() {
    confirmPopup.classList.remove('hidden');
}

function hideConfirmPopup() {
    confirmPopup.classList.add('hidden');
}


async function deleteCurrentIdea() {
    if (!currentIdea) return;

    acceptIdeaBtn.disabled = true;
    ideaText.textContent = 'Removing idea...';

    try {
        const res = await fetch(`${API_BASE}/delete/${currentIdea.id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            mode: 'cors'
        });
        if (!res.ok) {
            throw new Error(`Failed to delete idea (${res.status})`);
        }
        await res.json();
        alert('Idea accepted and removed from database!');
        hideConfirmPopup();
        acceptIdeaBtn.style.display = 'none';
        currentIdea = null;
    } catch (error) {
        console.error('Error deleting idea:', error);
        if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
            alert('CORS Error: Please serve this file from a web server.');
        } else {
            alert('Could not remove idea. Please try again later.');
        }
    } finally {
        acceptIdeaBtn.disabled = false;
    }
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