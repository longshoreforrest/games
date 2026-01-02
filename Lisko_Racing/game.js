// Lisko Racing Game 🦎
// A 3D endless runner starring a cute lizard!

// ============ LANGUAGE / TRANSLATIONS ============
const LANG_KEY = 'lisko_racing_language';
let currentLanguage = localStorage.getItem(LANG_KEY) || 'fi';

const TRANSLATIONS = {
    fi: {
        title: '🦎 LISKO RACING',
        subtitle: 'Väistele esteitä ja kerää kärpäsiä!',
        controls: 'Ohjaus: ← → tai A D',
        mobileHint: '📱 Pyyhkäise tai käytä nappeja',
        playerNameLabel: 'Pelaajan nimi:',
        playerNamePlaceholder: 'Nimesi',
        difficultyTitle: 'Valitse vaikeustaso:',
        easy: 'Helppo 🟢',
        normal: 'Normaali 🟡',
        hard: 'Vaikea 🔴',
        super: 'SUPER 🔥',
        startGame: 'ALOITA PELI',
        leaderboardTitle: '🏆 TOP 100',
        loading: 'Ladataan...',
        noScores: 'Ei tuloksia vielä - pelaa ensimmäisenä!',
        gameOver: '💥 PELI PÄÄTTYI!',
        collected: 'Keräsit',
        flies: 'kärpästä!',
        playAgain: 'PELAA UUDELLEEN',
        top10: '🏆 TOP 10',
        fliesHud: '🪰 Kärpäset:',
        speedHud: '⚡ Nopeus:',
        newRecord: '🎉 UUSI ENNÄTYS! Olet #1!',
        great: '🌟 Loistava! Sijoituksesi:',
        yourRank: 'Sijoituksesi:',
        unknown: 'Tuntematon',
        cheatNoMore: 'Ei enää huijauksia jäljellä! ❌',
        cheatPowerAdded: 'Supervoimia lisätty 10 sek! 🔥',
        cheatLeft: 'jäljellä',
        cheatEnded: 'Supervoimat loppuivat! 💨',
        tongueActivated: 'JÄTTIKIELI AKTIVOITU! 👅',
        tongueFlies: 'kärpästä',
        tongueEnded: 'Jättikieli loppui! 👅',
        // Friend system
        friendsTitle: '👥 KAVERIT',
        addFriend: 'Lisää kaveri',
        friendNamePlaceholder: 'Kaverin nimi',
        sendRequest: 'Lähetä pyyntö',
        pendingRequests: 'Odottavat pyynnöt',
        noFriends: 'Ei kavereita vielä',
        noPending: 'Ei odottavia pyyntöjä',
        accept: 'Hyväksy',
        reject: 'Hylkää',
        friendAdded: 'Kaveripyyntö lähetetty! 📨',
        friendAccepted: 'Kaveri hyväksytty! 🎉',
        friendRejected: 'Pyyntö hylätty',
        alreadyFriends: 'Olette jo kavereita!',
        requestExists: 'Pyyntö on jo lähetetty!',
        playerNotFound: 'Pelaajaa ei löytynyt!',
        enterYourName: 'Syötä ensin oma nimesi!',
        friendsLeaderboard: '👥 Kavereiden tulokset',
        vsYou: 'vs. sinä',
        noFriendScores: 'Kavereilla ei vielä tuloksia',
        // Multiplayer
        challenge: '⚔️ Haasta',
        waitingForOpponent: 'Odotetaan vastustajaa...',
        challengeReceived: '⚔️ Haaste!',
        acceptChallenge: 'Hyväksy',
        declineChallenge: 'Hylkää',
        opponentScore: 'Vastustaja:',
        youWin: '🏆 VOITIT!',
        youLose: '😢 HÄVISIT!',
        tie: '🤝 TASAPELI!',
        opponentLeft: 'Vastustaja poistui',
        getReady: 'Valmistaudu...',
        go: 'NYT!'
    },
    sv: {
        title: '🦎 ÖDLA RACING',
        subtitle: 'Undvik hinder och samla flugor!',
        controls: 'Styrning: ← → eller A D',
        mobileHint: '📱 Svep eller använd knapparna',
        playerNameLabel: 'Spelarnamn:',
        playerNamePlaceholder: 'Ditt namn',
        difficultyTitle: 'Välj svårighetsgrad:',
        easy: 'Lätt 🟢',
        normal: 'Normal 🟡',
        hard: 'Svår 🔴',
        super: 'SUPER 🔥',
        startGame: 'STARTA SPEL',
        leaderboardTitle: '🏆 TOP 100',
        loading: 'Laddar...',
        noScores: 'Inga resultat ännu - spela först!',
        gameOver: '💥 SPELET SLUT!',
        collected: 'Du samlade',
        flies: 'flugor!',
        playAgain: 'SPELA IGEN',
        top10: '🏆 TOP 10',
        fliesHud: '🪰 Flugor:',
        speedHud: '⚡ Hastighet:',
        newRecord: '🎉 NYTT REKORD! Du är #1!',
        great: '🌟 Utmärkt! Din placering:',
        yourRank: 'Din placering:',
        unknown: 'Okänd',
        cheatNoMore: 'Inga fler fusk kvar! ❌',
        cheatPowerAdded: 'Superkrafter tillagda 10 sek! 🔥',
        cheatLeft: 'kvar',
        cheatEnded: 'Superkrafter slut! 💨',
        tongueActivated: 'JÄTTETUNGA AKTIVERAD! 👅',
        tongueFlies: 'flugor',
        tongueEnded: 'Jättetungan slut! 👅',
        // Friend system
        friendsTitle: '👥 VÄNNER',
        addFriend: 'Lägg till vän',
        friendNamePlaceholder: 'Vännens namn',
        sendRequest: 'Skicka förfrågan',
        pendingRequests: 'Väntande förfrågningar',
        noFriends: 'Inga vänner ännu',
        noPending: 'Inga väntande förfrågningar',
        accept: 'Acceptera',
        reject: 'Avvisa',
        friendAdded: 'Vänförfrågan skickad! 📨',
        friendAccepted: 'Vän accepterad! 🎉',
        friendRejected: 'Förfrågan avvisad',
        alreadyFriends: 'Ni är redan vänner!',
        requestExists: 'Förfrågan har redan skickats!',
        playerNotFound: 'Spelaren hittades inte!',
        enterYourName: 'Ange först ditt eget namn!',
        friendsLeaderboard: '👥 Vänners resultat',
        vsYou: 'vs. du',
        noFriendScores: 'Vänner har inga resultat ännu'
    },
    en: {
        title: '🦎 LIZARD RACING',
        subtitle: 'Dodge obstacles and collect flies!',
        controls: 'Controls: ← → or A D',
        mobileHint: '📱 Swipe or use buttons',
        playerNameLabel: 'Player name:',
        playerNamePlaceholder: 'Your name',
        difficultyTitle: 'Select difficulty:',
        easy: 'Easy 🟢',
        normal: 'Normal 🟡',
        hard: 'Hard 🔴',
        super: 'SUPER 🔥',
        startGame: 'START GAME',
        leaderboardTitle: '🏆 TOP 100',
        loading: 'Loading...',
        noScores: 'No scores yet - be the first to play!',
        gameOver: '💥 GAME OVER!',
        collected: 'You collected',
        flies: 'flies!',
        playAgain: 'PLAY AGAIN',
        top10: '🏆 TOP 10',
        fliesHud: '🪰 Flies:',
        speedHud: '⚡ Speed:',
        newRecord: '🎉 NEW RECORD! You are #1!',
        great: '🌟 Great! Your rank:',
        yourRank: 'Your rank:',
        unknown: 'Unknown',
        cheatNoMore: 'No more cheats left! ❌',
        cheatPowerAdded: 'Superpowers added 10 sec! 🔥',
        cheatLeft: 'left',
        cheatEnded: 'Superpowers ended! 💨',
        tongueActivated: 'GIANT TONGUE ACTIVATED! 👅',
        tongueFlies: 'flies',
        tongueEnded: 'Giant tongue ended! 👅',
        // Friend system
        friendsTitle: '👥 FRIENDS',
        addFriend: 'Add friend',
        friendNamePlaceholder: 'Friend\'s name',
        sendRequest: 'Send request',
        pendingRequests: 'Pending requests',
        noFriends: 'No friends yet',
        noPending: 'No pending requests',
        accept: 'Accept',
        reject: 'Reject',
        friendAdded: 'Friend request sent! 📨',
        friendAccepted: 'Friend accepted! 🎉',
        friendRejected: 'Request rejected',
        alreadyFriends: 'You are already friends!',
        requestExists: 'Request already sent!',
        playerNotFound: 'Player not found!',
        enterYourName: 'Enter your name first!',
        friendsLeaderboard: '👥 Friends\' scores',
        vsYou: 'vs. you',
        noFriendScores: 'Friends have no scores yet'
    }
};

// Get translation for current language
function t(key) {
    return TRANSLATIONS[currentLanguage][key] || TRANSLATIONS['fi'][key] || key;
}

// Update all UI texts to current language
function updateLanguageUI() {
    // Start screen
    const titleEl = document.querySelector('#start-screen h1');
    if (titleEl) titleEl.textContent = t('title');

    const subtitleEl = document.querySelector('#start-screen .overlay-content > p:first-of-type');
    if (subtitleEl) subtitleEl.textContent = t('subtitle');

    const controlsEl = document.querySelector('#start-screen .controls:not(.mobile-hint)');
    if (controlsEl) controlsEl.textContent = t('controls');

    const mobileHintEl = document.querySelector('#start-screen .mobile-hint');
    if (mobileHintEl) mobileHintEl.textContent = t('mobileHint');

    const playerLabel = document.querySelector('label[for="player-name"]');
    if (playerLabel) playerLabel.textContent = t('playerNameLabel');

    const playerInput = document.getElementById('player-name');
    if (playerInput) playerInput.placeholder = t('playerNamePlaceholder');

    const diffTitle = document.querySelector('#difficulty-selection > p');
    if (diffTitle) diffTitle.textContent = t('difficultyTitle');

    const diffBtns = document.querySelectorAll('.diff-btn');
    diffBtns.forEach(btn => {
        const diff = btn.dataset.diff;
        if (diff) btn.textContent = t(diff);
    });

    const startBtn = document.getElementById('start-btn');
    if (startBtn) startBtn.textContent = t('startGame');

    const leaderboardTitle = document.querySelector('#leaderboard-section h2');
    if (leaderboardTitle) leaderboardTitle.textContent = t('leaderboardTitle');

    // Game over screen
    const gameOverTitle = document.querySelector('#game-over-screen h1');
    if (gameOverTitle) gameOverTitle.textContent = t('gameOver');

    const gameOverLeaderboardTitle = document.querySelector('#game-over-leaderboard h3');
    if (gameOverLeaderboardTitle) gameOverLeaderboardTitle.textContent = t('top10');

    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) restartBtn.textContent = t('playAgain');

    // HUD
    const scoreLabel = document.getElementById('score');
    if (scoreLabel) {
        const scoreValue = document.getElementById('score-value').textContent;
        scoreLabel.innerHTML = `${t('fliesHud')} <span id="score-value">${scoreValue}</span>`;
    }

    const speedLabel = document.getElementById('speed');
    if (speedLabel) {
        const speedValue = document.getElementById('speed-value').textContent;
        speedLabel.innerHTML = `${t('speedHud')} <span id="speed-value">${speedValue}</span>x`;
    }

    // Update language button states
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('selected', btn.dataset.lang === currentLanguage);
    });
}

// Set language and save to localStorage
function setLanguage(lang) {
    if (TRANSLATIONS[lang]) {
        currentLanguage = lang;
        localStorage.setItem(LANG_KEY, lang);
        updateLanguageUI();
        // Re-render leaderboard with new language
        renderLeaderboard('leaderboard-list');
    }
}

// Initialize language selector
function initLanguageSelector() {
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
    // Set initial button state
    updateLanguageUI();
}

// ============ GAME STATE ============
const state = {
    score: 0,
    speed: 1,
    difficulty: 'normal',
    isRunning: false,
    isGameOver: false,
    lizardLane: 0, // -1 = left, 0 = center, 1 = right
    targetLane: 0,
    obstacles: [],
    flies: [],
    powerups: [],
    groundTiles: [],
    time: 0,
    isInvincible: false,
    invincibleEndTime: 0,
    cheatMode: false, // Secret cheat mode for boosted power-ups
    tongueFliesLeft: 0 // Auto-catch flies with tongue
};

// Cheat code detection
let cheatBuffer = '';
let cheatTimer = null;
let cheatUsesLeft = 2; // Can only use cheat 2 times per game
document.addEventListener('keypress', (e) => {
    cheatBuffer += e.key;
    if (cheatBuffer.length > 15) cheatBuffer = cheatBuffer.slice(-15); // Longer buffer for paraslisko

    // matias1 cheat - boost power-ups
    if (cheatBuffer.includes('matias1')) {
        cheatBuffer = '';

        // Check if uses remaining
        if (cheatUsesLeft <= 0) {
            showCheatNotification(t('cheatNoMore'));
            return;
        }

        cheatUsesLeft--;
        state.cheatMode = true;
        showCheatNotification(`${t('cheatPowerAdded')} (${cheatUsesLeft} ${t('cheatLeft')})`);

        // Clear existing timer if any
        if (cheatTimer) clearTimeout(cheatTimer);

        // Cheat lasts 10 seconds
        cheatTimer = setTimeout(() => {
            state.cheatMode = false;
            showCheatNotification(t('cheatEnded'));
        }, 10000);
    }

    // paraslisko cheat - auto-catch 15 flies with tongue
    if (cheatBuffer.includes('paraslisko')) {
        cheatBuffer = '';
        state.tongueFliesLeft = 15;
        showCheatNotification(`${t('tongueActivated')} (15 ${t('tongueFlies')})`);
    }
});

function showCheatNotification(message) {
    const notif = document.createElement('div');
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #ff6b6b, #ffd93d);
        color: #000;
        padding: 20px 40px;
        border-radius: 15px;
        font-size: 24px;
        font-weight: bold;
        z-index: 9999;
        animation: cheatPop 2s forwards;
        box-shadow: 0 0 30px rgba(255, 107, 107, 0.8);
    `;
    document.body.appendChild(notif);

    // Add animation keyframes
    if (!document.getElementById('cheat-style')) {
        const style = document.createElement('style');
        style.id = 'cheat-style';
        style.textContent = `
            @keyframes cheatPop {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
                20% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => notif.remove(), 2000);
}

// ============ DIFFICULTY SETTINGS ============
const DIFFICULTIES = {
    easy: { startSpeed: 0.5, maxSpeed: 4, acceleration: 0.01, spawnIntervalMulti: 1.2 },
    normal: { startSpeed: 1.0, maxSpeed: 8, acceleration: 0.02, spawnIntervalMulti: 1.0 },
    hard: { startSpeed: 2.5, maxSpeed: 15, acceleration: 0.05, spawnIntervalMulti: 0.7 },
    super: { startSpeed: 5.0, maxSpeed: 30, acceleration: 0.1, spawnIntervalMulti: 0.4 } // INSANE MODE
};

// ============ CONSTANTS ============
const LANE_WIDTH = 4;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];
const SPAWN_DISTANCE = 160;
const DESPAWN_DISTANCE = -15;
const GROUND_LENGTH = 40;
const NUM_GROUND_TILES = 7;

// ============ LEADERBOARD SYSTEM (Firebase) ============
// Firebase Realtime Database URL
const FIREBASE_DB_URL = 'https://lisko-racing-default-rtdb.europe-west1.firebasedatabase.app';

// Local storage keys for caching
const LEADERBOARD_CACHE_KEY = 'lisko_racing_leaderboard_cache';
const OLD_LEADERBOARD_KEY = 'lisko_racing_leaderboard'; // Old key to migrate from
const PLAYER_NAME_KEY = 'lisko_racing_player_name';
let currentPlayerName = localStorage.getItem(PLAYER_NAME_KEY) || '';
let leaderboardData = [];
let isLoadingLeaderboard = false;

// Migrate old local leaderboard data to Firebase (one-time)
async function migrateOldLeaderboard() {
    const migrationKey = 'lisko_racing_migrated_v1';
    if (localStorage.getItem(migrationKey)) return; // Already migrated

    try {
        const oldData = localStorage.getItem(OLD_LEADERBOARD_KEY);
        if (oldData) {
            const entries = JSON.parse(oldData);
            console.log(`Migrating ${entries.length} old scores to Firebase...`);

            // Upload each old score to Firebase
            for (const entry of entries) {
                if (entry.name && entry.score) {
                    await fetch(`${FIREBASE_DB_URL}/leaderboard.json`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: entry.name,
                            score: entry.score,
                            date: entry.date || new Date().toISOString()
                        })
                    });
                }
            }
            console.log('Migration complete!');
        }

        // Mark as migrated and clear old data
        localStorage.setItem(migrationKey, 'true');
        localStorage.removeItem(OLD_LEADERBOARD_KEY);
        localStorage.removeItem(LEADERBOARD_CACHE_KEY); // Clear cache to force fresh load
    } catch (e) {
        console.log('Migration error:', e);
    }
}

// Load leaderboard from Firebase (with localStorage cache as fallback)
async function loadLeaderboard() {
    // First, try to migrate old data (one-time)
    await migrateOldLeaderboard();

    // Show loading state initially if no cache
    const cached = localStorage.getItem(LEADERBOARD_CACHE_KEY);
    if (cached) {
        try {
            leaderboardData = JSON.parse(cached);
            renderLeaderboard('leaderboard-list');
        } catch (e) {
            console.log('Could not parse cached leaderboard:', e);
        }
    }

    // Fetch from Firebase (always, to get latest data)
    if (isLoadingLeaderboard) return leaderboardData;
    isLoadingLeaderboard = true;

    try {
        const response = await fetch(`${FIREBASE_DB_URL}/leaderboard.json?orderBy="score"&limitToLast=100`);
        if (response.ok) {
            const data = await response.json();
            if (data) {
                // Convert Firebase object to array
                leaderboardData = Object.values(data);
                // Sort by score (highest first)
                leaderboardData.sort((a, b) => b.score - a.score);
                // Keep only top 100
                leaderboardData = leaderboardData.slice(0, 100);
                // Cache locally
                localStorage.setItem(LEADERBOARD_CACHE_KEY, JSON.stringify(leaderboardData));
                // Update display
                renderLeaderboard('leaderboard-list');
                console.log(`Loaded ${leaderboardData.length} scores from Firebase`);
            } else {
                // No data in Firebase yet
                leaderboardData = [];
                renderLeaderboard('leaderboard-list');
            }
        }
    } catch (e) {
        console.log('Could not fetch leaderboard from Firebase:', e);
    }

    isLoadingLeaderboard = false;
    return leaderboardData;
}

// Save score to Firebase
async function saveScoreToFirebase(entry) {
    try {
        const response = await fetch(`${FIREBASE_DB_URL}/leaderboard.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
        });
        if (response.ok) {
            console.log('Score saved to Firebase');
            // Refresh leaderboard to get updated rankings
            loadLeaderboard();
        }
    } catch (e) {
        console.log('Could not save score to Firebase:', e);
    }
}

// Add score to leaderboard
function addScore(name, score) {
    if (!name || name.trim() === '') {
        name = t('unknown');
    }

    const entry = {
        name: name.trim().substring(0, 15),
        score: score,
        date: new Date().toISOString()
    };

    // Add to local data immediately for instant feedback
    leaderboardData.push(entry);
    leaderboardData.sort((a, b) => b.score - a.score);
    leaderboardData = leaderboardData.slice(0, 100);

    // Cache locally
    try {
        localStorage.setItem(LEADERBOARD_CACHE_KEY, JSON.stringify(leaderboardData));
    } catch (e) {
        console.log('Could not cache leaderboard:', e);
    }

    // Save to Firebase (async, non-blocking)
    saveScoreToFirebase(entry);

    // Return rank (1-indexed)
    return leaderboardData.findIndex(e =>
        e.name === entry.name && e.score === entry.score
    ) + 1;
}

// Leaderboard pagination state
const ITEMS_PER_PAGE = 10;
let leaderboardPage = 0; // 0 = first page (1-10), 1 = second page (11-20), etc.

// Render leaderboard to an element with pagination
function renderLeaderboard(elementId, highlightName = null, highlightScore = null) {
    const container = document.getElementById(elementId);
    if (!container) return;

    const totalItems = leaderboardData.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Ensure page is within bounds
    if (leaderboardPage >= totalPages) leaderboardPage = Math.max(0, totalPages - 1);
    if (leaderboardPage < 0) leaderboardPage = 0;

    const startIndex = leaderboardPage * ITEMS_PER_PAGE;
    const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalItems);
    const pageItems = leaderboardData.slice(startIndex, endIndex);

    if (totalItems === 0) {
        container.innerHTML = `<p class="loading">${t('noScores')}</p>`;
        return;
    }

    let html = '';

    // Render entries for current page
    pageItems.forEach((entry, i) => {
        const rank = startIndex + i + 1;
        const isCurrentPlayer = highlightName && highlightScore &&
            entry.name === highlightName && entry.score === highlightScore;

        let classes = 'leaderboard-entry';
        if (rank === 1) classes += ' top-1';
        else if (rank === 2) classes += ' top-2';
        else if (rank === 3) classes += ' top-3';
        if (isCurrentPlayer) classes += ' current-player';

        const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;

        html += `
            <div class="${classes}">
                <span class="leaderboard-rank">${medal}</span>
                <span class="leaderboard-name">${escapeHtml(entry.name)}</span>
                <span class="leaderboard-score">🪰 ${entry.score}</span>
            </div>
        `;
    });

    // Add pagination controls if more than one page
    if (totalPages > 1) {
        const pageStart = startIndex + 1;
        const pageEnd = endIndex;

        html += `
            <div class="leaderboard-pagination">
                <button class="page-btn" onclick="changePage(-1)" ${leaderboardPage === 0 ? 'disabled' : ''}>◀</button>
                <span class="page-info">${pageStart}-${pageEnd} / ${totalItems}</span>
                <button class="page-btn" onclick="changePage(1)" ${leaderboardPage >= totalPages - 1 ? 'disabled' : ''}>▶</button>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Change leaderboard page
function changePage(delta) {
    const totalPages = Math.ceil(leaderboardData.length / ITEMS_PER_PAGE);
    leaderboardPage += delta;

    if (leaderboardPage < 0) leaderboardPage = 0;
    if (leaderboardPage >= totalPages) leaderboardPage = totalPages - 1;

    renderLeaderboard('leaderboard-list');
}

// Reset pagination when loading new data
function resetLeaderboardPage() {
    leaderboardPage = 0;
}

// ============ FRIEND SYSTEM (Firebase) ============
let friendsList = [];
let pendingRequests = [];
let friendsCache = {};

// Get player's unique ID (based on name, normalized)
function getPlayerId(name) {
    return name.trim().toLowerCase().replace(/[^a-z0-9äöåÄÖÅ]/gi, '_');
}

// Register player in Firebase (so they can be found by friends)
async function registerPlayer(name) {
    if (!name || !name.trim()) return;

    const playerId = getPlayerId(name);

    try {
        await fetch(`${FIREBASE_DB_URL}/players/${playerId}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name.trim(),
                lastSeen: new Date().toISOString()
            })
        });
        console.log('Player registered:', name);
    } catch (e) {
        console.log('Could not register player:', e);
    }
}

// Load friends list from Firebase
async function loadFriends() {
    if (!currentPlayerName) return;
    const playerId = getPlayerId(currentPlayerName);

    try {
        // Load accepted friends
        const friendsResponse = await fetch(`${FIREBASE_DB_URL}/friends/${playerId}/accepted.json`);
        if (friendsResponse.ok) {
            const data = await friendsResponse.json();
            friendsList = data ? Object.values(data) : [];
        }

        // Load pending requests (requests TO this player)
        const pendingResponse = await fetch(`${FIREBASE_DB_URL}/friends/${playerId}/pending.json`);
        if (pendingResponse.ok) {
            const data = await pendingResponse.json();
            pendingRequests = data ? Object.entries(data).map(([key, val]) => ({ ...val, requestId: key })) : [];
        }

        renderFriendsUI();
    } catch (e) {
        console.log('Could not load friends:', e);
    }
}

// Send friend request
async function sendFriendRequest(friendName) {
    if (!currentPlayerName || currentPlayerName.trim() === '') {
        showCheatNotification(t('enterYourName'));
        return;
    }

    if (!friendName || friendName.trim() === '') {
        return;
    }

    const myId = getPlayerId(currentPlayerName);
    const friendId = getPlayerId(friendName.trim());

    if (myId === friendId) {
        showCheatNotification('❌'); // Can't friend yourself
        return;
    }

    // Check if already friends
    const alreadyFriend = friendsList.some(f => getPlayerId(f) === friendId);
    if (alreadyFriend) {
        showCheatNotification(t('alreadyFriends'));
        return;
    }

    try {
        // Send request directly to Firebase - no existence check needed
        const response = await fetch(`${FIREBASE_DB_URL}/friends/${friendId}/pending.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: currentPlayerName.trim(),
                fromId: myId,
                date: new Date().toISOString()
            })
        });

        if (response.ok) {
            showCheatNotification(t('friendAdded'));
            // Clear input field
            const input = document.getElementById('friend-name-input');
            if (input) input.value = '';
        } else {
            console.error('Friend request failed:', response.status, await response.text());
            showCheatNotification('❌ Firebase virhe!');
        }
    } catch (e) {
        console.error('Could not send friend request:', e);
        showCheatNotification('❌ Yhteysvirhe!');
    }
}

// Accept friend request
async function acceptFriendRequest(request) {
    if (!currentPlayerName) return;

    const myId = getPlayerId(currentPlayerName);
    const friendId = request.fromId;
    const friendName = request.from;

    try {
        // Add to my accepted friends
        await fetch(`${FIREBASE_DB_URL}/friends/${myId}/accepted.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(friendName)
        });

        // Add me to their accepted friends
        await fetch(`${FIREBASE_DB_URL}/friends/${friendId}/accepted.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentPlayerName)
        });

        // Remove from pending
        await fetch(`${FIREBASE_DB_URL}/friends/${myId}/pending/${request.requestId}.json`, {
            method: 'DELETE'
        });

        showCheatNotification(t('friendAccepted'));
        loadFriends(); // Refresh

    } catch (e) {
        console.log('Could not accept friend request:', e);
    }
}

// Reject friend request
async function rejectFriendRequest(request) {
    if (!currentPlayerName) return;

    const myId = getPlayerId(currentPlayerName);

    try {
        await fetch(`${FIREBASE_DB_URL}/friends/${myId}/pending/${request.requestId}.json`, {
            method: 'DELETE'
        });

        showCheatNotification(t('friendRejected'));
        loadFriends(); // Refresh

    } catch (e) {
        console.log('Could not reject friend request:', e);
    }
}

// Get friends' best scores
function getFriendsScores() {
    const friendScores = [];
    const friendIds = friendsList.map(name => getPlayerId(name));

    // Find best score for each friend
    friendIds.forEach(friendId => {
        const friendEntries = leaderboardData.filter(e => getPlayerId(e.name) === friendId);
        if (friendEntries.length > 0) {
            const best = friendEntries.reduce((a, b) => a.score > b.score ? a : b);
            friendScores.push(best);
        }
    });

    // Add current player's best score
    if (currentPlayerName) {
        const myEntries = leaderboardData.filter(e => getPlayerId(e.name) === getPlayerId(currentPlayerName));
        if (myEntries.length > 0) {
            const myBest = myEntries.reduce((a, b) => a.score > b.score ? a : b);
            friendScores.push({ ...myBest, isMe: true });
        }
    }

    // Sort by score
    friendScores.sort((a, b) => b.score - a.score);
    return friendScores;
}

// Render friends UI
function renderFriendsUI() {
    const container = document.getElementById('friends-section');
    if (!container) return;

    let html = `<h2>${t('friendsTitle')}</h2>`;

    // Add friend form
    html += `
        <div class="add-friend-form">
            <input type="text" id="friend-name-input" placeholder="${t('friendNamePlaceholder')}" maxlength="15">
            <button onclick="sendFriendRequest(document.getElementById('friend-name-input').value)" class="small-btn">${t('sendRequest')}</button>
        </div>
    `;

    // Pending requests
    if (pendingRequests.length > 0) {
        html += `<h3>${t('pendingRequests')}</h3>`;
        html += '<div class="pending-requests">';
        pendingRequests.forEach(req => {
            html += `
                <div class="pending-request">
                    <span class="request-from">${escapeHtml(req.from)}</span>
                    <button onclick="acceptFriendRequest(${JSON.stringify(req).replace(/"/g, '&quot;')})" class="accept-btn">${t('accept')}</button>
                    <button onclick="rejectFriendRequest(${JSON.stringify(req).replace(/"/g, '&quot;')})" class="reject-btn">${t('reject')}</button>
                </div>
            `;
        });
        html += '</div>';
    }

    // Pending challenges (haasteet)
    if (pendingChallenges.length > 0) {
        html += `<h3>⚔️ Haasteet (${pendingChallenges.length})</h3>`;
        html += '<div class="pending-requests">';
        pendingChallenges.forEach((ch, idx) => {
            html += `
                <div class="pending-request challenge">
                    <span class="request-from">${escapeHtml(ch.from)}: <strong>${ch.score}</strong> 🪰</span>
                    <button onclick="acceptChallengeByIndex(${idx})" class="accept-btn">Pelaa!</button>
                    <button onclick="declineChallengeByIndex(${idx})" class="reject-btn">❌</button>
                </div>
            `;
        });
        html += '</div>';
    }

    // Friends leaderboard
    const friendScores = getFriendsScores();
    if (friendScores.length > 0) {
        html += `<h3>${t('friendsLeaderboard')}</h3>`;
        html += '<div class="friends-leaderboard">';
        friendScores.forEach((entry, i) => {
            const rank = i + 1;
            const isMe = entry.isMe;
            const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;
            html += `
                <div class="leaderboard-entry ${isMe ? 'current-player' : ''}">
                    <span class="leaderboard-rank">${medal}</span>
                    <span class="leaderboard-name">${escapeHtml(entry.name)} ${isMe ? `(${t('vsYou')})` : ''}</span>
                    <span class="leaderboard-score">🪰 ${entry.score}</span>
                </div>
            `;
        });
        html += '</div>';
    } else if (friendsList.length === 0) {
        html += `<p class="no-friends">${t('noFriends')}</p>`;
    } else {
        html += `<p class="no-friends">${t('noFriendScores')}</p>`;
    }

    container.innerHTML = html;
}

// ============ MULTIPLAYER SYSTEM ============
let multiplayerState = {
    isMultiplayer: false,
    roomId: null,
    opponentName: '',
    opponentScore: 0,
    opponentAlive: true,
    isHost: false,
    challengeScore: 0 // For challenge mode
};
let pendingChallenges = [];
let syncInterval = null;

// Load pending challenges
async function loadChallenges() {
    if (!currentPlayerName) return;
    const myId = getPlayerId(currentPlayerName);

    try {
        const response = await fetch(`${FIREBASE_DB_URL}/challenges/${myId}.json`);
        if (response.ok) {
            const data = await response.json();
            pendingChallenges = data ? Object.entries(data).map(([key, val]) => ({ ...val, challengeId: key })) : [];
            // Re-render friends UI to show challenges
            renderFriendsUI();
        }
    } catch (e) {
        console.log('Could not load challenges:', e);
    }
}

// Send challenge to friend
async function sendChallenge(friendName, score) {
    if (!currentPlayerName || !friendName) return;

    const friendId = getPlayerId(friendName);

    try {
        await fetch(`${FIREBASE_DB_URL}/challenges/${friendId}.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                from: currentPlayerName,
                fromId: getPlayerId(currentPlayerName),
                score: score,
                date: new Date().toISOString()
            })
        });
        showCheatNotification(`⚔️ Haaste lähetetty: ${score} kärpästä!`);
    } catch (e) {
        console.log('Could not send challenge:', e);
    }
}

// Accept challenge and start game
async function acceptChallenge(challenge) {
    multiplayerState.isMultiplayer = true;
    multiplayerState.challengeScore = challenge.score;
    multiplayerState.opponentName = challenge.from;
    multiplayerState.opponentScore = challenge.score;

    // Delete the challenge
    const myId = getPlayerId(currentPlayerName);
    try {
        await fetch(`${FIREBASE_DB_URL}/challenges/${myId}/${challenge.challengeId}.json`, {
            method: 'DELETE'
        });
    } catch (e) { }

    // Start the game!
    startGame();
}

// Decline challenge
async function declineChallenge(challenge) {
    const myId = getPlayerId(currentPlayerName);
    try {
        await fetch(`${FIREBASE_DB_URL}/challenges/${myId}/${challenge.challengeId}.json`, {
            method: 'DELETE'
        });
        loadChallenges();
    } catch (e) { }
}

// Helper functions for UI buttons (using index)
function acceptChallengeByIndex(index) {
    if (pendingChallenges[index]) {
        acceptChallenge(pendingChallenges[index]);
    }
}

function declineChallengeByIndex(index) {
    if (pendingChallenges[index]) {
        declineChallenge(pendingChallenges[index]);
    }
}

// Start real-time multiplayer room
async function startMultiplayerRoom(friendName) {
    if (!currentPlayerName) return;

    const roomId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const friendId = getPlayerId(friendName);

    multiplayerState.isMultiplayer = true;
    multiplayerState.roomId = roomId;
    multiplayerState.opponentName = friendName;
    multiplayerState.isHost = true;
    multiplayerState.opponentScore = 0;
    multiplayerState.opponentAlive = true;

    // Create room in Firebase
    try {
        await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                host: currentPlayerName,
                hostId: getPlayerId(currentPlayerName),
                guest: friendName,
                guestId: friendId,
                hostScore: 0,
                guestScore: 0,
                hostAlive: true,
                guestAlive: true,
                status: 'waiting',
                created: new Date().toISOString()
            })
        });

        // Send invite to friend
        await fetch(`${FIREBASE_DB_URL}/invites/${friendId}.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: roomId,
                from: currentPlayerName,
                date: new Date().toISOString()
            })
        });

        showCheatNotification(t('waitingForOpponent'));

        // Wait for guest to join
        waitForOpponent(roomId);

    } catch (e) {
        console.log('Could not create room:', e);
        multiplayerState.isMultiplayer = false;
    }
}

// Wait for opponent to join
function waitForOpponent(roomId) {
    const checkInterval = setInterval(async () => {
        try {
            const response = await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}/status.json`);
            if (response.ok) {
                const status = await response.json();
                if (status === 'ready') {
                    clearInterval(checkInterval);
                    startMultiplayerGame();
                }
            }
        } catch (e) { }
    }, 1000);

    // Timeout after 60 seconds
    setTimeout(() => {
        clearInterval(checkInterval);
        if (multiplayerState.roomId === roomId && !state.isRunning) {
            showCheatNotification(t('opponentLeft'));
            multiplayerState.isMultiplayer = false;
        }
    }, 60000);
}

// Start multiplayer game with countdown
function startMultiplayerGame() {
    showCountdown(() => {
        startGame();
        startScoreSync();
    });
}

// Show countdown before game
function showCountdown(callback) {
    const overlay = document.createElement('div');
    overlay.id = 'countdown-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        font-size: 120px;
        color: #4ade80;
        font-weight: bold;
    `;
    document.body.appendChild(overlay);

    let count = 3;
    overlay.textContent = count;

    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            overlay.textContent = count;
        } else if (count === 0) {
            overlay.textContent = t('go');
            overlay.style.color = '#ffd700';
        } else {
            clearInterval(interval);
            overlay.remove();
            callback();
        }
    }, 1000);
}

// Sync score during multiplayer game
function startScoreSync() {
    if (!multiplayerState.roomId) return;

    syncInterval = setInterval(async () => {
        if (!state.isRunning) {
            clearInterval(syncInterval);
            return;
        }

        const roomId = multiplayerState.roomId;
        const isHost = multiplayerState.isHost;
        const scoreKey = isHost ? 'hostScore' : 'guestScore';
        const aliveKey = isHost ? 'hostAlive' : 'guestAlive';

        try {
            // Update my score
            await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}/${scoreKey}.json`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.score)
            });

            // Get opponent's score
            const opponentScoreKey = isHost ? 'guestScore' : 'hostScore';
            const opponentAliveKey = isHost ? 'guestAlive' : 'hostAlive';

            const scoreRes = await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}/${opponentScoreKey}.json`);
            const aliveRes = await fetch(`${FIREBASE_DB_URL}/rooms/${roomId}/${opponentAliveKey}.json`);

            if (scoreRes.ok) {
                multiplayerState.opponentScore = await scoreRes.json() || 0;
            }
            if (aliveRes.ok) {
                multiplayerState.opponentAlive = await aliveRes.json();
            }

            updateMultiplayerHUD();

        } catch (e) { }
    }, 500);
}

// Update HUD with opponent score
function updateMultiplayerHUD() {
    let opponentHUD = document.getElementById('opponent-hud');

    if (!opponentHUD && multiplayerState.isMultiplayer) {
        opponentHUD = document.createElement('div');
        opponentHUD.id = 'opponent-hud';
        opponentHUD.style.cssText = `
            position: fixed;
            top: 60px;
            left: 20px;
            background: rgba(0,0,0,0.7);
            color: #ff6b6b;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 1000;
        `;
        document.body.appendChild(opponentHUD);
    }

    if (opponentHUD) {
        const status = multiplayerState.opponentAlive ? '' : ' 💀';
        opponentHUD.innerHTML = `${t('opponentScore')} ${multiplayerState.opponentName}: 🪰 ${multiplayerState.opponentScore}${status}`;
    }
}

// End multiplayer session
function endMultiplayerGame() {
    if (!multiplayerState.isMultiplayer) return;

    if (syncInterval) {
        clearInterval(syncInterval);
        syncInterval = null;
    }

    // Mark as dead in room
    if (multiplayerState.roomId) {
        const aliveKey = multiplayerState.isHost ? 'hostAlive' : 'guestAlive';
        fetch(`${FIREBASE_DB_URL}/rooms/${multiplayerState.roomId}/${aliveKey}.json`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(false)
        });
    }

    // Show result
    setTimeout(() => {
        let result = '';
        if (state.score > multiplayerState.opponentScore) {
            result = t('youWin');
        } else if (state.score < multiplayerState.opponentScore) {
            result = t('youLose');
        } else {
            result = t('tie');
        }

        const resultMessage = document.getElementById('rank-message');
        if (resultMessage) {
            resultMessage.innerHTML = `${result}<br>${t('opponentScore')} ${multiplayerState.opponentScore}`;
        }

        // Clean up HUD
        const opponentHUD = document.getElementById('opponent-hud');
        if (opponentHUD) opponentHUD.remove();

        // Reset state
        multiplayerState.isMultiplayer = false;
        multiplayerState.roomId = null;
    }, 1000);
}

// Render challenges UI
function renderChallengesUI() {
    if (pendingChallenges.length === 0) return;

    const container = document.getElementById('friends-section');
    if (!container) return;

    let html = container.innerHTML;
    html += `<h3>⚔️ Haasteet</h3><div class="pending-requests">`;

    pendingChallenges.forEach(ch => {
        html += `
            <div class="pending-request challenge">
                <span class="request-from">${escapeHtml(ch.from)}: ${ch.score} 🪰</span>
                <button onclick='acceptChallenge(${JSON.stringify(ch).replace(/'/g, "\\'")})'  class="accept-btn">Pelaa!</button>
                <button onclick='declineChallenge(${JSON.stringify(ch).replace(/'/g, "\\'")})' class="reject-btn">❌</button>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

// Helper to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}


// Initialize game UI on page load
function initGameUI() {
    loadLeaderboard();
    renderLeaderboard('leaderboard-list');

    // Initialize language selector
    initLanguageSelector();

    // Load saved player name
    const nameInput = document.getElementById('player-name');
    if (nameInput && currentPlayerName) {
        nameInput.value = currentPlayerName;
    }

    // Save name on input change (with debounce)
    let saveTimeout = null;
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            currentPlayerName = e.target.value;
            localStorage.setItem(PLAYER_NAME_KEY, currentPlayerName);

            // Debounce Firebase save (wait 500ms after last keystroke)
            if (saveTimeout) clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                if (currentPlayerName.trim()) {
                    // Register player in Firebase for friend system
                    registerPlayer(currentPlayerName);
                    // Show save confirmation
                    nameInput.style.borderColor = '#4ade80';
                    setTimeout(() => {
                        nameInput.style.borderColor = '';
                    }, 1000);
                }
                // Reload friends when name changes
                loadFriends();
            }, 500);
        });
    }

    // Load friends list
    loadFriends();

    // Load pending challenges
    loadChallenges();

    // Difficulty buttons handling
    const diffButtons = document.querySelectorAll('.diff-btn');
    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove selected from all
            diffButtons.forEach(b => b.classList.remove('selected'));
            // Add to clicked
            btn.classList.add('selected');
            // Set state
            state.difficulty = btn.dataset.diff;

            // Optional: Play click sound if available logic exists, or just valid JS
        });
    });
}

// Call init when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGameUI);
} else {
    initGameUI();
}


// ============ AUDIO/MUSIC SYSTEM ============
let audioContext = null;
let musicPlaying = false;
let musicNodes = [];

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

function playNote(frequency, startTime, duration, type = 'square') {
    const ctx = audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.08, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.9);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    musicNodes.push(oscillator);
}

function playBass(frequency, startTime, duration) {
    const ctx = audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(frequency, startTime);

    gainNode.gain.setValueAtTime(0.12, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.8);

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);

    musicNodes.push(oscillator);
}

function startMusic() {
    if (musicPlaying) return;
    initAudio();
    musicPlaying = true;

    const melody = [
        392, 440, 494, 523, 587, 523, 494, 440,  // G4 A4 B4 C5 D5 C5 B4 A4
        392, 330, 349, 392, 440, 392, 349, 330,  // G4 E4 F4 G4 A4 G4 F4 E4
        294, 330, 349, 392, 440, 494, 523, 587,  // D4 E4 F4 G4 A4 B4 C5 D5
        523, 494, 440, 392, 349, 330, 294, 330   // C5 B4 A4 G4 F4 E4 D4 E4
    ];

    const bass = [
        196, 196, 220, 220, 247, 247, 262, 262,  // G3 A3 B3 C4
        196, 165, 175, 196, 220, 196, 175, 165,  // G3 E3 F3 G3...
        147, 165, 175, 196, 220, 247, 262, 294,  // D3 E3 F3 G3...
        262, 247, 220, 196, 175, 165, 147, 165   // C4 B3 A3 G3...
    ];

    function playLoop() {
        if (!musicPlaying) return;

        const ctx = audioContext;
        const now = ctx.currentTime;
        const tempo = 0.15; // speed of each note

        melody.forEach((freq, i) => {
            playNote(freq, now + i * tempo, tempo * 0.9, 'square');
        });

        bass.forEach((freq, i) => {
            if (i % 2 === 0) { // Play bass every other beat
                playBass(freq / 2, now + i * tempo, tempo * 1.8);
            }
        });

        // Schedule next loop
        const loopDuration = melody.length * tempo * 1000;
        setTimeout(playLoop, loopDuration - 50);
    }

    playLoop();
}

function stopMusic() {
    musicPlaying = false;
    musicNodes.forEach(node => {
        try { node.stop(); } catch (e) { }
    });
    musicNodes = [];
}

function playCollectSound() {
    if (!audioContext) return;
    const ctx = audioContext;
    const now = ctx.currentTime;

    // Happy ding sound
    [880, 1108, 1318].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.15, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.05 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.2);
    });
}

function playCrashSound() {
    if (!audioContext) return;
    const ctx = audioContext;
    const now = ctx.currentTime;

    // Crash/boom sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
}

function playTongueCatchSound() {
    if (!audioContext) return;
    const ctx = audioContext;
    const now = ctx.currentTime;

    // Tongue slurp sound - quick ascending then descending
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.05);
    osc.frequency.linearRampToValueAtTime(400, now + 0.15);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
}

// ============ THREE.JS SETUP ============
const canvas = document.getElementById('game-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87a56e);  // Misty sky above jungle
scene.fog = new THREE.Fog(0x7a9a6a, 60, 190);  // Realistic depth fog

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 8, -12);
camera.lookAt(0, 2, 10);

// ============ REALISTIC SKY BACKGROUND ============
// Create layered background for depth

// Distant mountains/hills
const hillMaterial = new THREE.MeshBasicMaterial({ color: 0x4a6a4a, fog: true });
for (let i = 0; i < 8; i++) {
    const hillGeom = new THREE.ConeGeometry(15 + Math.random() * 20, 20 + Math.random() * 15, 6);
    const hill = new THREE.Mesh(hillGeom, hillMaterial);
    const side = i < 4 ? -1 : 1;
    hill.position.set(
        side * (35 + Math.random() * 30),
        -5,
        50 + i * 15 + Math.random() * 10
    );
    scene.add(hill);
}

// Distant tree line (silhouettes)
const distantTreeMaterial = new THREE.MeshBasicMaterial({ color: 0x3d5a3d, fog: true });
for (let z = 60; z < 250; z += 8) {
    for (let side = -1; side <= 1; side += 2) {
        const x = side * (25 + Math.random() * 15);

        // Tree trunk silhouette
        const trunkGeom = new THREE.CylinderGeometry(0.3, 0.5, 10 + Math.random() * 8, 6);
        const trunk = new THREE.Mesh(trunkGeom, distantTreeMaterial);
        trunk.position.set(x, 5, z + Math.random() * 5);
        scene.add(trunk);

        // Canopy silhouette
        const canopyGeom = new THREE.SphereGeometry(4 + Math.random() * 3, 6, 4);
        const canopy = new THREE.Mesh(canopyGeom, distantTreeMaterial);
        canopy.position.set(x, 12 + Math.random() * 4, z + Math.random() * 5);
        canopy.scale.y = 0.7;
        scene.add(canopy);
    }
}

// Sky gradient effect - large background plane
const skyGeom = new THREE.PlaneGeometry(300, 100);
const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
        topColor: { value: new THREE.Color(0x6b9bc3) },     // Blue sky
        bottomColor: { value: new THREE.Color(0x8fa87a) },  // Misty green
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec2 vUv;
        void main() {
            gl_FragColor = vec4(mix(bottomColor, topColor, vUv.y), 1.0);
        }
    `,
    side: THREE.BackSide,
    fog: false
});
const sky = new THREE.Mesh(skyGeom, skyMaterial);
sky.position.set(0, 30, 100);
scene.add(sky);

// ============ LIGHTING (Realistic Rainforest) ============
const ambientLight = new THREE.AmbientLight(0x7a9a7a, 0.6);  // Natural ambient
scene.add(ambientLight);

// Filtered sunlight through canopy
const sunLight = new THREE.DirectionalLight(0xfff8e7, 0.9);  // Warm sunlight
sunLight.position.set(30, 60, 20);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.left = -50;
sunLight.shadow.camera.right = 50;
sunLight.shadow.camera.top = 50;
sunLight.shadow.camera.bottom = -50;
scene.add(sunLight);

// Soft fill light (sky reflection)
const fillLight = new THREE.DirectionalLight(0x8ab5cf, 0.25);
fillLight.position.set(-20, 30, -10);
scene.add(fillLight);

// ============ LIZARD MODEL (REALISTIC SEGMENTED) ============
const lizardGroup = new THREE.Group();

// Materials
const skinColor = 0x2e8b57; // Seagreen
const bellyColor = 0x90ee90; // Light green
const scaleMaterial = new THREE.MeshStandardMaterial({
    color: skinColor,
    roughness: 0.6,
    metalness: 0.1,
    flatShading: true // Low-poly look but realistic lighting
});
const bellyMaterial = new THREE.MeshStandardMaterial({
    color: bellyColor,
    roughness: 0.8
});

// Body Segments for S-Curve Animation
const hips = new THREE.Group();
const chest = new THREE.Group();
const headGroup = new THREE.Group();

// Linking geometry to groups
// HIPS
const hipsGeom = new THREE.SphereGeometry(0.35, 12, 12);
const hipsMesh = new THREE.Mesh(hipsGeom, scaleMaterial);
hipsMesh.scale.set(1, 0.8, 1.2);
hips.add(hipsMesh);
const hipsBelly = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 12), bellyMaterial);
hipsBelly.position.y = -0.15;
hipsBelly.scale.set(0.9, 0.5, 1.1);
hips.add(hipsBelly);

// CHEST
const chestGeom = new THREE.SphereGeometry(0.38, 12, 12);
const chestMesh = new THREE.Mesh(chestGeom, scaleMaterial);
chestMesh.scale.set(1, 0.85, 1.3);
chest.add(chestMesh);
const chestBelly = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), bellyMaterial);
chestBelly.position.y = -0.15;
chestBelly.scale.set(0.95, 0.5, 1.2);
chest.add(chestBelly);

// Position segments
hips.position.set(0, 0.5, -0.4);
chest.position.set(0, 0.5, 0.6);

lizardGroup.add(hips);
lizardGroup.add(chest);

// Use a dummy "body" for legacy reference if needed
const body = chestMesh; // Alias for compatibility with simple bounce animations

// HEAD
// HEAD (Detailed)
// Skull (Back of head)
const skullGeom = new THREE.BoxGeometry(0.4, 0.3, 0.35);
// Round the box slightly by using a subdivision modifier concept or just scaling a sphere/box combo
// Let's use a Sphere for the main skull slightly flattened
const skullMesh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), scaleMaterial);
skullMesh.scale.set(1.1, 0.8, 1);
headGroup.add(skullMesh);

// Snout (Tapered front)
const snoutGeom = new THREE.CylinderGeometry(0.12, 0.22, 0.5, 12);
const snoutMesh = new THREE.Mesh(snoutGeom, scaleMaterial);
snoutMesh.rotation.x = -Math.PI / 2;
snoutMesh.position.set(0, -0.05, 0.45);
snoutMesh.scale.set(1, 1, 1.2); // Elongate snout
headGroup.add(snoutMesh);

// Jaw (Lower jaw)
const jawMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.18, 0.45, 12), new THREE.MeshStandardMaterial({ color: 0x8fbc8f, roughness: 0.8 })); // Slightly lighter blending into belly
jawMesh.rotation.x = -Math.PI / 2;
jawMesh.position.set(0, -0.15, 0.4);
headGroup.add(jawMesh);

// Nostrils
const nostrilGeom = new THREE.SphereGeometry(0.02, 6, 6);
const nostrilMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
[1, -1].forEach(side => {
    const n = new THREE.Mesh(nostrilGeom, nostrilMat);
    n.position.set(side * 0.08, 0.05, 0.7); // On tip of snout
    headGroup.add(n);
});

// Eyes (Bulging and distinct)
const eyeGeom = new THREE.SphereGeometry(0.09, 12, 12);
const pupilGeom = new THREE.SphereGeometry(0.045, 8, 8);
const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.5 }); // Shiny black eyes
const eyelidMat = new THREE.MeshStandardMaterial({ color: 0x4a6a4a }); // Darker than skin
const pupilMat = new THREE.MeshBasicMaterial({ color: 0xffd700 }); // Golden slit pupils

[1, -1].forEach(side => {
    // Eye Ridge/Socket (brow)
    const socket = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), scaleMaterial);
    socket.position.set(side * 0.2, 0.12, 0.1);
    socket.scale.set(1, 0.8, 1.1);
    headGroup.add(socket);

    // Eye
    const eye = new THREE.Mesh(eyeGeom, eyeMat);
    eye.position.set(side * 0.24, 0.12, 0.15);
    headGroup.add(eye);

    // Pupil (Slit)
    const pupil = new THREE.Mesh(pupilGeom, pupilMat);
    pupil.scale.set(0.5, 1.5, 0.5); // Vertical slit
    pupil.rotation.y = side * 0.3;
    pupil.position.set(side * 0.28, 0.12, 0.22);
    headGroup.add(pupil);
});

headGroup.position.set(0, 0.65, 1.4); // slightly above chest

// TONGUE (for jättikieli power)
const tongueMaterial = new THREE.MeshStandardMaterial({
    color: 0xff6b8a, // Pink tongue
    roughness: 0.8
});
const tongueGeometry = new THREE.CylinderGeometry(0.025, 0.015, 1, 8);
tongueGeometry.translate(0, 0.5, 0); // Pivot at base (so it extends from mouth)
const tongueMesh = new THREE.Mesh(tongueGeometry, tongueMaterial);
tongueMesh.rotation.x = Math.PI / 2; // Point FORWARD (z direction)
tongueMesh.position.set(0, -0.08, 0.75); // At front of snout/mouth
tongueMesh.scale.set(1, 0.01, 1); // Very small by default
tongueMesh.visible = false; // HIDDEN by default
headGroup.add(tongueMesh);

// Tongue tip (sticky ball)
const tongueTipGeom = new THREE.SphereGeometry(0.05, 8, 8);
const tongueTip = new THREE.Mesh(tongueTipGeom, tongueMaterial);
tongueTip.position.y = 1; // At end of tongue cylinder
tongueMesh.add(tongueTip);

// Track tongue animation state
let tongueAnimating = false;
let tonguePhase = 0; // 0 = idle, 0-1 = extending, 1-2 = retracting
let tongueMaxReach = 15;

function animateTongue(targetZ) {
    if (tongueAnimating) return;
    tongueAnimating = true;
    tonguePhase = 0;
    tongueMaxReach = Math.min(Math.max(targetZ, 5), 20); // Clamp reach
    tongueMesh.visible = true; // Show tongue!
}

function updateTongueAnimation(delta) {
    if (!tongueAnimating) {
        tongueMesh.visible = false; // Keep hidden
        tongueMesh.scale.y = 0.01;
        return;
    }

    tonguePhase += delta * 6; // Animation speed

    if (tonguePhase < 1) {
        // Extend phase (0 to 1)
        tongueMesh.scale.y = tonguePhase * tongueMaxReach;
    } else if (tonguePhase < 2) {
        // Retract phase (1 to 2)
        const retractProgress = tonguePhase - 1;
        tongueMesh.scale.y = (1 - retractProgress) * tongueMaxReach;
    } else {
        // Done - hide tongue
        tongueAnimating = false;
        tonguePhase = 0;
        tongueMesh.scale.y = 0.01;
        tongueMesh.visible = false;
    }
}

lizardGroup.add(headGroup);

// TAIL
const tail = new THREE.Group();
const tailSegments = [];
const numTailSegs = 10; // More smooth
for (let i = 0; i < numTailSegs; i++) {
    const s = 1 - (i / numTailSegs);
    const segGeom = new THREE.CylinderGeometry(0.25 * s, 0.15 * s, 0.4, 8);
    const seg = new THREE.Mesh(segGeom, scaleMaterial);
    seg.rotation.x = Math.PI / 2;
    seg.position.z = -0.2 - (i * 0.35);
    seg.position.y = 0.5 - (i * 0.02);

    // Add ridge
    if (i < numTailSegs - 2) {
        const ridge = new THREE.Mesh(new THREE.ConeGeometry(0.05 * s, 0.2 * s, 4), scaleMaterial);
        ridge.position.y = 0.2 * s;
        seg.add(ridge);
    }

    tail.add(seg);
    tailSegments.push(seg);
}
lizardGroup.add(tail);

// LEGS
var legs = [];
const legPos = [
    { x: -0.4, z: 0.6, group: chest, side: -1 }, // Front Left
    { x: 0.4, z: 0.6, group: chest, side: 1 },   // Front Right
    { x: -0.4, z: -0.4, group: hips, side: -1 }, // Back Left
    { x: 0.4, z: -0.4, group: hips, side: 1 }    // Back Right
];

legPos.forEach(data => {
    // Construct hierarchy
    // Pivot joint attached to body
    const shoulder = new THREE.Group();
    shoulder.position.set(data.side * 0.3, 0, 0); // Relative to body part center

    data.group.add(shoulder);

    // Leg parts
    const upperLen = 0.35;
    const lowerLen = 0.35;

    const upperLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.06, upperLen, 6), scaleMaterial);
    upperLeg.geometry.translate(0, -upperLen / 2, 0); // Pivot at top

    const lowerLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, lowerLen, 6), scaleMaterial);
    lowerLeg.geometry.translate(0, -lowerLen / 2, 0); // Pivot at top

    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.2), scaleMaterial);

    shoulder.add(upperLeg);
    upperLeg.add(lowerLeg);
    lowerLeg.position.y = -upperLen;
    lowerLeg.add(foot);
    foot.position.y = -lowerLen;
    foot.position.z = 0.05;

    // Fingers/Claws
    for (let f = 0; f < 3; f++) {
        const claw = new THREE.Mesh(new THREE.ConeGeometry(0.015, 0.1, 4), new THREE.MeshStandardMaterial({ color: 0x111111 }));
        claw.rotation.x = -1.0;
        claw.position.set((f - 1) * 0.04, 0, 0.1);
        foot.add(claw);
    }

    legs.push({
        shoulder: shoulder,
        upper: upperLeg,
        lower: lowerLeg,
        foot: foot,
        side: data.side,
        isFront: data.z > 0
    });
});

scene.add(lizardGroup);

// ============ GROUND (Realistic Colorful Rainforest Floor) ============
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a4a28,  // Rich forest floor
    roughness: 0.95
});

// Various ground cover materials
const groundMaterials = {
    moss1: new THREE.MeshStandardMaterial({ color: 0x5a8a4a, roughness: 0.85 }),  // Bright green moss
    moss2: new THREE.MeshStandardMaterial({ color: 0x6a9a3a, roughness: 0.85 }),  // Yellow-green moss
    moss3: new THREE.MeshStandardMaterial({ color: 0x4a7a5a, roughness: 0.85 }),  // Blue-green moss
    wetSoil: new THREE.MeshStandardMaterial({ color: 0x2a3a1a, roughness: 0.95 }),  // Dark wet soil
    fallenLeaf1: new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.8 }),  // Brown leaf
    fallenLeaf2: new THREE.MeshStandardMaterial({ color: 0xb8860b, roughness: 0.8 }),  // Golden leaf
    fallenLeaf3: new THREE.MeshStandardMaterial({ color: 0xa0522d, roughness: 0.8 }),  // Sienna leaf
    fallenLeaf4: new THREE.MeshStandardMaterial({ color: 0xcd853f, roughness: 0.8 }),  // Peru/tan leaf
    flower1: new THREE.MeshStandardMaterial({ color: 0xff6b6b, roughness: 0.6 }),  // Red fallen petals
    flower2: new THREE.MeshStandardMaterial({ color: 0xffd93d, roughness: 0.6 }),  // Yellow petals
    flower3: new THREE.MeshStandardMaterial({ color: 0xc084fc, roughness: 0.6 }),  // Purple petals
    flower4: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 }),  // White petals
};

function createGroundTile(zPosition) {
    const groundGeom = new THREE.PlaneGeometry(30, GROUND_LENGTH);
    const ground = new THREE.Mesh(groundGeom, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, zPosition);
    ground.receiveShadow = true;
    scene.add(ground);

    ground.userData.lines = [];

    // Just a few moss patches - not too many!
    const mossMats = [groundMaterials.moss1, groundMaterials.moss2, groundMaterials.moss3];
    for (let j = 0; j < 3; j++) {
        const mossGeom = new THREE.CircleGeometry(0.6 + Math.random() * 0.8, 8);
        const moss = new THREE.Mesh(mossGeom, mossMats[Math.floor(Math.random() * mossMats.length)]);
        moss.rotation.x = -Math.PI / 2;
        moss.position.set(
            (Math.random() - 0.5) * 10,
            0.02,
            zPosition + (Math.random() - 0.5) * GROUND_LENGTH
        );
        scene.add(moss);
        ground.userData.lines.push(moss);
    }

    // Just a few fallen leaves
    const leafMats = [groundMaterials.fallenLeaf1, groundMaterials.fallenLeaf2, groundMaterials.fallenLeaf3, groundMaterials.fallenLeaf4];
    for (let j = 0; j < 5; j++) {
        const leafGeom = new THREE.CircleGeometry(0.12 + Math.random() * 0.1, 6);
        const leaf = new THREE.Mesh(leafGeom, leafMats[Math.floor(Math.random() * leafMats.length)]);
        leaf.rotation.x = -Math.PI / 2;
        leaf.rotation.z = Math.random() * Math.PI * 2;
        leaf.position.set(
            (Math.random() - 0.5) * 12,
            0.03,
            zPosition + (Math.random() - 0.5) * GROUND_LENGTH
        );
        scene.add(leaf);
        ground.userData.lines.push(leaf);
    }

    // Just a couple of flower petals
    const flowerMats = [groundMaterials.flower1, groundMaterials.flower2, groundMaterials.flower3, groundMaterials.flower4];
    for (let j = 0; j < 2; j++) {
        const petalGeom = new THREE.CircleGeometry(0.06 + Math.random() * 0.06, 5);
        const petal = new THREE.Mesh(petalGeom, flowerMats[Math.floor(Math.random() * flowerMats.length)]);
        petal.rotation.x = -Math.PI / 2;
        petal.rotation.z = Math.random() * Math.PI * 2;
        petal.position.set(
            (Math.random() - 0.5) * 10,
            0.035,
            zPosition + (Math.random() - 0.5) * GROUND_LENGTH
        );
        scene.add(petal);
        ground.userData.lines.push(petal);
    }

    // One wet patch per tile
    if (Math.random() < 0.7) {
        const wetGeom = new THREE.CircleGeometry(0.8 + Math.random() * 0.6, 8);
        const wet = new THREE.Mesh(wetGeom, groundMaterials.wetSoil);
        wet.rotation.x = -Math.PI / 2;
        wet.position.set(
            (Math.random() - 0.5) * 10,
            0.015,
            zPosition + (Math.random() - 0.5) * GROUND_LENGTH
        );
        scene.add(wet);
        ground.userData.lines.push(wet);
    }

    return ground;
}

// Initialize ground tiles
for (let i = 0; i < NUM_GROUND_TILES; i++) {
    state.groundTiles.push(createGroundTile(i * GROUND_LENGTH));
}

// ============ RAINFOREST VEGETATION ============
// Materials for tropical plants - REALISTIC NATURAL COLORS

// Tree trunk materials - natural bark colors
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 0.95 });  // Natural brown bark
const darkTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x3d2817, roughness: 0.9 });  // Dark wet bark
const mossyTrunkMaterial = new THREE.MeshStandardMaterial({ color: 0x4a5c3d, roughness: 0.85 });  // Mossy bark

// Realistic leaf colors - natural variation found in rainforests
const leafMaterial = new THREE.MeshStandardMaterial({ color: 0x2e5a1c, roughness: 0.75 });  // Deep forest green
const darkLeafMaterial = new THREE.MeshStandardMaterial({ color: 0x1e3d14, roughness: 0.8 });  // Shaded leaf
const limeLeafMaterial = new THREE.MeshStandardMaterial({ color: 0x4a7c34, roughness: 0.7 });  // New growth lime
const emeraldLeafMaterial = new THREE.MeshStandardMaterial({ color: 0x3a6b4a, roughness: 0.75 });  // Emerald tone
const tealLeafMaterial = new THREE.MeshStandardMaterial({ color: 0x2f5a4a, roughness: 0.75 });  // Blue-green shade
const yellowGreenLeafMaterial = new THREE.MeshStandardMaterial({ color: 0x5a7a2a, roughness: 0.7 });  // Sunlit leaf

const vineMaterial = new THREE.MeshStandardMaterial({ color: 0x3d5a2e, roughness: 0.85 });  // Natural vine green
const fernMaterial = new THREE.MeshStandardMaterial({ color: 0x4a6a3a, roughness: 0.75 });  // Fern green

// Realistic tropical flower colors - actual rainforest flowers
const flowerColors = [
    { color: 0xc71585, emissive: 0x000000 },  // Orchid magenta
    { color: 0xff6b4a, emissive: 0x000000 },  // Heliconia orange-red
    { color: 0xe35a5a, emissive: 0x000000 },  // Hibiscus red
    { color: 0xffb347, emissive: 0x000000 },  // Bird of paradise orange
    { color: 0xda70d6, emissive: 0x000000 },  // Orchid lavender
    { color: 0xf08080, emissive: 0x000000 },  // Light coral
    { color: 0xff7f7f, emissive: 0x000000 },  // Soft red
    { color: 0xe6a8d7, emissive: 0x000000 },  // Pink orchid
    { color: 0xffd700, emissive: 0x000000 },  // Golden yellow
    { color: 0xffffff, emissive: 0x000000 },  // White orchid
];

function getRandomFlowerMaterial() {
    const fc = flowerColors[Math.floor(Math.random() * flowerColors.length)];
    return new THREE.MeshStandardMaterial({
        color: fc.color,
        emissive: fc.emissive,
        emissiveIntensity: 0.05,
        roughness: 0.6
    });
}

// Realistic mushroom colors - actual rainforest fungi
const mushroomColors = [
    { color: 0xd2691e, emissive: 0x000000 },  // Brown bracket fungus
    { color: 0xf5deb3, emissive: 0x000000 },  // Cream/tan
    { color: 0xcd853f, emissive: 0x000000 },  // Peru/tan
    { color: 0x8b4513, emissive: 0x000000 },  // Saddle brown
    { color: 0xdaa520, emissive: 0x000000 },  // Goldenrod
    { color: 0xffe4c4, emissive: 0x000000 },  // Bisque
    { color: 0x87ceeb, emissive: 0x4a6a8a },  // Rare bioluminescent blue (subtle glow)
];

function getRandomMushroomMaterial() {
    const mc = mushroomColors[Math.floor(Math.random() * mushroomColors.length)];
    return new THREE.MeshStandardMaterial({
        color: mc.color,
        emissive: mc.emissive,
        emissiveIntensity: mc.emissive ? 0.15 : 0,
        roughness: 0.7
    });
}

// Realistic tropical fruit colors
const fruitColors = [0xcc4400, 0xe6b800, 0xcc3333, 0xd98000, 0x8b0000, 0x556b2f];

// Create tropical palm tree
function createPalmTree(x, z) {
    const group = new THREE.Group();

    // Curved trunk
    const trunkHeight = 6 + Math.random() * 4;
    const trunkCurve = (Math.random() - 0.5) * 2;

    for (let i = 0; i < 8; i++) {
        const segHeight = trunkHeight / 8;
        const segGeom = new THREE.CylinderGeometry(0.25 - i * 0.02, 0.3 - i * 0.02, segHeight, 8);
        const seg = new THREE.Mesh(segGeom, trunkMaterial);
        seg.position.set(
            trunkCurve * Math.sin(i * 0.3),
            segHeight / 2 + i * segHeight,
            0
        );
        seg.rotation.z = Math.sin(i * 0.3) * 0.1;
        seg.castShadow = true;
        group.add(seg);
    }

    // Palm fronds
    const frondCount = 7 + Math.floor(Math.random() * 4);
    for (let i = 0; i < frondCount; i++) {
        const frondGroup = new THREE.Group();
        const angle = (i / frondCount) * Math.PI * 2;

        // Main frond stem
        const stemGeom = new THREE.CylinderGeometry(0.03, 0.05, 3, 6);
        const stem = new THREE.Mesh(stemGeom, leafMaterial);
        stem.position.y = 1.5;
        stem.rotation.z = Math.PI / 4;
        frondGroup.add(stem);

        // Leaflets
        for (let j = 0; j < 12; j++) {
            const leafGeom = new THREE.PlaneGeometry(0.15, 0.6 + Math.random() * 0.3);
            const leaf = new THREE.Mesh(leafGeom, j % 2 === 0 ? leafMaterial : darkLeafMaterial);
            leaf.position.set(0, 0.5 + j * 0.2, 0);
            leaf.rotation.x = -0.3;
            leaf.rotation.z = (j % 2 === 0 ? 1 : -1) * 0.4;
            frondGroup.add(leaf);
        }

        frondGroup.position.set(trunkCurve * 0.8, trunkHeight, 0);
        frondGroup.rotation.y = angle;
        frondGroup.rotation.x = 0.6 + Math.random() * 0.3;
        group.add(frondGroup);
    }

    group.position.set(x, 0, z);
    return group;
}

// Create jungle tree with vines
function createJungleTree(x, z) {
    const group = new THREE.Group();

    // Thick trunk with buttress roots
    const trunkGeom = new THREE.CylinderGeometry(0.5, 0.8, 8, 10);
    const trunk = new THREE.Mesh(trunkGeom, darkTrunkMaterial);
    trunk.position.y = 4;
    trunk.castShadow = true;
    group.add(trunk);

    // Buttress roots
    for (let i = 0; i < 4; i++) {
        const rootGeom = new THREE.ConeGeometry(0.4, 2, 4);
        const root = new THREE.Mesh(rootGeom, darkTrunkMaterial);
        root.position.set(
            Math.cos(i * Math.PI / 2) * 0.6,
            0.8,
            Math.sin(i * Math.PI / 2) * 0.6
        );
        root.rotation.z = Math.cos(i * Math.PI / 2) * 0.5;
        root.rotation.x = Math.sin(i * Math.PI / 2) * 0.5;
        group.add(root);
    }

    // Dense canopy with VARIED COLORS!
    const canopyMaterials = [leafMaterial, darkLeafMaterial, limeLeafMaterial, emeraldLeafMaterial, tealLeafMaterial, yellowGreenLeafMaterial];
    for (let i = 0; i < 5; i++) {
        const canopyGeom = new THREE.SphereGeometry(2 + Math.random(), 8, 6);
        const canopyMat = canopyMaterials[Math.floor(Math.random() * canopyMaterials.length)];
        const canopy = new THREE.Mesh(canopyGeom, canopyMat);
        canopy.position.set(
            (Math.random() - 0.5) * 2,
            8 + Math.random() * 2,
            (Math.random() - 0.5) * 2
        );
        canopy.scale.y = 0.6;
        canopy.castShadow = true;
        group.add(canopy);
    }

    // Colorful tropical fruits!
    for (let i = 0; i < 3; i++) {
        const fruitColor = fruitColors[Math.floor(Math.random() * fruitColors.length)];
        const fruitGeom = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 8, 8);
        const fruitMat = new THREE.MeshStandardMaterial({
            color: fruitColor,
            emissive: fruitColor,
            emissiveIntensity: 0.2
        });
        const fruit = new THREE.Mesh(fruitGeom, fruitMat);
        fruit.position.set(
            (Math.random() - 0.5) * 2,
            6 + Math.random() * 2,
            (Math.random() - 0.5) * 2
        );
        group.add(fruit);
    }

    // Hanging vines
    for (let i = 0; i < 6; i++) {
        const vineLength = 3 + Math.random() * 4;
        const vineGeom = new THREE.CylinderGeometry(0.02, 0.02, vineLength, 4);
        const vine = new THREE.Mesh(vineGeom, vineMaterial);
        vine.position.set(
            (Math.random() - 0.5) * 3,
            8 - vineLength / 2,
            (Math.random() - 0.5) * 3
        );
        vine.rotation.z = (Math.random() - 0.5) * 0.3;
        group.add(vine);
    }

    group.position.set(x, 0, z);
    return group;
}

// Create fern cluster
function createFern(x, z) {
    const group = new THREE.Group();
    const frondCount = 5 + Math.floor(Math.random() * 4);

    for (let i = 0; i < frondCount; i++) {
        const frondGeom = new THREE.ConeGeometry(0.3, 1.5, 4);
        const frond = new THREE.Mesh(frondGeom, fernMaterial);
        const angle = (i / frondCount) * Math.PI * 2;
        frond.position.set(
            Math.cos(angle) * 0.3,
            0.5,
            Math.sin(angle) * 0.3
        );
        frond.rotation.x = 0.8;
        frond.rotation.y = angle;
        group.add(frond);
    }

    group.position.set(x, 0, z);
    return group;
}

// Create glowing mushroom cluster - with random colors!
function createMushrooms(x, z) {
    const group = new THREE.Group();
    const count = 3 + Math.floor(Math.random() * 4);
    const mushroomMat = getRandomMushroomMaterial();  // Random color for this cluster

    for (let i = 0; i < count; i++) {
        const stemGeom = new THREE.CylinderGeometry(0.05, 0.07, 0.2 + Math.random() * 0.3, 6);
        const stem = new THREE.Mesh(stemGeom, new THREE.MeshStandardMaterial({ color: 0xf5f5dc }));
        const capGeom = new THREE.SphereGeometry(0.12 + Math.random() * 0.1, 8, 4, 0, Math.PI * 2, 0, Math.PI / 2);
        const cap = new THREE.Mesh(capGeom, mushroomMat);

        const mx = (Math.random() - 0.5) * 0.5;
        const mz = (Math.random() - 0.5) * 0.5;
        stem.position.set(mx, 0.1, mz);
        cap.position.set(mx, 0.25 + Math.random() * 0.15, mz);
        cap.rotation.x = Math.PI;

        group.add(stem);
        group.add(cap);
    }

    group.position.set(x, 0, z);
    return group;
}

// Create exotic flower - with random vivid colors!
function createFlower(x, z) {
    const group = new THREE.Group();
    const flowerMat = getRandomFlowerMaterial();  // Random color!

    // Stem
    const stemGeom = new THREE.CylinderGeometry(0.03, 0.04, 0.8, 6);
    const stem = new THREE.Mesh(stemGeom, vineMaterial);
    stem.position.y = 0.4;
    group.add(stem);

    // Petals - colorful!
    for (let i = 0; i < 5; i++) {
        const petalGeom = new THREE.SphereGeometry(0.15, 6, 4);
        const petal = new THREE.Mesh(petalGeom, flowerMat);
        const angle = (i / 5) * Math.PI * 2;
        petal.position.set(
            Math.cos(angle) * 0.12,
            0.85,
            Math.sin(angle) * 0.12
        );
        petal.scale.set(1, 0.3, 0.5);
        group.add(petal);
    }

    // Center
    const centerGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const centerMat = new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffaa00, emissiveIntensity: 0.4 });
    const center = new THREE.Mesh(centerGeom, centerMat);
    center.position.y = 0.85;
    group.add(center);

    group.position.set(x, 0, z);
    return group;
}

// Create colorful tropical butterfly
function createButterfly(x, y, z) {
    const group = new THREE.Group();

    // Random bright color
    const colors = [0xff1493, 0x00bfff, 0xffa500, 0x9932cc, 0x00ff00, 0xff4500, 0xffff00];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const wingMat = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        side: THREE.DoubleSide
    });

    // Body
    const bodyGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 6);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.rotation.x = Math.PI / 2;
    group.add(body);

    // Wings
    const wingGeom = new THREE.CircleGeometry(0.12, 8);
    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.position.set(-0.08, 0, 0);
    leftWing.rotation.y = -0.5;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.position.set(0.08, 0, 0);
    rightWing.rotation.y = 0.5;
    group.add(rightWing);

    group.position.set(x, y, z);
    group.userData.leftWing = leftWing;
    group.userData.rightWing = rightWing;
    group.userData.baseY = y;

    return group;
}

// Create colorful parrot
function createParrot(x, y, z) {
    const group = new THREE.Group();

    // Random parrot colors: scarlet macaw, blue-gold, green
    const parrotTypes = [
        { body: 0xff0000, wing: 0x0000ff, head: 0xffff00 },  // Scarlet macaw
        { body: 0x0066ff, wing: 0xffcc00, head: 0x0066ff },  // Blue-gold macaw
        { body: 0x00aa00, wing: 0xff0000, head: 0x00cc00 },  // Green parrot
        { body: 0xff6600, wing: 0x00ffff, head: 0xffff00 },  // Orange tropical
    ];
    const ptype = parrotTypes[Math.floor(Math.random() * parrotTypes.length)];

    const bodyMat = new THREE.MeshStandardMaterial({ color: ptype.body, roughness: 0.6 });
    const wingMat = new THREE.MeshStandardMaterial({ color: ptype.wing, roughness: 0.6 });
    const headMat = new THREE.MeshStandardMaterial({ color: ptype.head, roughness: 0.6 });

    // Body
    const bodyGeom = new THREE.SphereGeometry(0.15, 8, 8);
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    body.scale.set(0.8, 1, 1.2);
    group.add(body);

    // Head
    const headGeom = new THREE.SphereGeometry(0.1, 8, 8);
    const head = new THREE.Mesh(headGeom, headMat);
    head.position.set(0, 0.1, 0.12);
    group.add(head);

    // Beak
    const beakGeom = new THREE.ConeGeometry(0.03, 0.08, 6);
    const beakMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
    const beak = new THREE.Mesh(beakGeom, beakMat);
    beak.position.set(0, 0.08, 0.2);
    beak.rotation.x = Math.PI / 2;
    group.add(beak);

    // Wings
    const wingGeom = new THREE.SphereGeometry(0.1, 6, 6);
    const leftWing = new THREE.Mesh(wingGeom, wingMat);
    leftWing.scale.set(0.3, 0.8, 1);
    leftWing.position.set(-0.12, 0, -0.05);
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeom, wingMat);
    rightWing.scale.set(0.3, 0.8, 1);
    rightWing.position.set(0.12, 0, -0.05);
    group.add(rightWing);

    // Tail
    const tailGeom = new THREE.ConeGeometry(0.05, 0.3, 4);
    const tail = new THREE.Mesh(tailGeom, bodyMat);
    tail.position.set(0, -0.05, -0.25);
    tail.rotation.x = -Math.PI / 6;
    group.add(tail);

    group.position.set(x, y, z);
    group.userData.baseY = y;

    return group;
}

// Add rainforest decorations along the sides - EXTRA COLORFUL!
for (let z = 0; z < 250; z += 8) {
    // Left side vegetation
    const leftX = -10 - Math.random() * 6;
    if (Math.random() < 0.4) {
        scene.add(createPalmTree(leftX, z + Math.random() * 6));
    } else if (Math.random() < 0.6) {
        scene.add(createJungleTree(leftX - 2, z + Math.random() * 6));
    }

    // Understory plants - MORE COLORS!
    scene.add(createFern(-8 - Math.random() * 2, z + Math.random() * 6));

    // More mushrooms and flowers for color
    if (Math.random() < 0.5) {  // Increased from 0.3
        scene.add(createMushrooms(-7 - Math.random() * 3, z + Math.random() * 6));
    }
    if (Math.random() < 0.6) {  // Increased from 0.2 - LOTS OF FLOWERS!
        scene.add(createFlower(-6 - Math.random() * 2, z + Math.random() * 6));
    }
    if (Math.random() < 0.4) {  // Extra flowers!
        scene.add(createFlower(-7 - Math.random() * 2, z + Math.random() * 6));
    }

    // Colorful butterflies flying around!
    if (Math.random() < 0.4) {
        scene.add(createButterfly(
            -6 - Math.random() * 4,
            1.5 + Math.random() * 3,
            z + Math.random() * 6
        ));
    }

    // Colorful parrots in trees!
    if (Math.random() < 0.25) {
        scene.add(createParrot(
            leftX + Math.random() * 2,
            5 + Math.random() * 4,
            z + Math.random() * 6
        ));
    }

    // Right side vegetation
    const rightX = 10 + Math.random() * 6;
    if (Math.random() < 0.4) {
        scene.add(createPalmTree(rightX, z + Math.random() * 6));
    } else if (Math.random() < 0.6) {
        scene.add(createJungleTree(rightX + 2, z + Math.random() * 6));
    }

    // Right understory - MORE COLORS!
    scene.add(createFern(8 + Math.random() * 2, z + Math.random() * 6));

    if (Math.random() < 0.5) {  // Increased
        scene.add(createMushrooms(7 + Math.random() * 3, z + Math.random() * 6));
    }
    if (Math.random() < 0.6) {  // LOTS OF FLOWERS!
        scene.add(createFlower(6 + Math.random() * 2, z + Math.random() * 6));
    }
    if (Math.random() < 0.4) {  // Extra flowers!
        scene.add(createFlower(7 + Math.random() * 2, z + Math.random() * 6));
    }

    // Right side butterflies
    if (Math.random() < 0.4) {
        scene.add(createButterfly(
            6 + Math.random() * 4,
            1.5 + Math.random() * 3,
            z + Math.random() * 6
        ));
    }

    // Right side parrots
    if (Math.random() < 0.25) {
        scene.add(createParrot(
            rightX - Math.random() * 2,
            5 + Math.random() * 4,
            z + Math.random() * 6
        ));
    }
}

// ============ OBSTACLES ============
const rockMaterial = new THREE.MeshStandardMaterial({
    color: 0x808080,
    roughness: 0.8
});

function createRock(lane) {
    const group = new THREE.Group();

    // Main rock
    const geom = new THREE.DodecahedronGeometry(0.8 + Math.random() * 0.4, 0);
    const rock = new THREE.Mesh(geom, rockMaterial);
    rock.position.y = 0.6;
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    rock.scale.y = 0.7;
    rock.castShadow = true;
    group.add(rock);

    // Smaller rock
    const smallGeom = new THREE.DodecahedronGeometry(0.4, 0);
    const smallRock = new THREE.Mesh(smallGeom, rockMaterial);
    smallRock.position.set(0.5, 0.3, 0.3);
    smallRock.castShadow = true;
    group.add(smallRock);

    group.position.set(LANES[lane], 0, SPAWN_DISTANCE);
    group.userData.lane = lane;

    return group;
}

function createLog(lane) {
    const geom = new THREE.CylinderGeometry(0.5, 0.5, 3, 12);
    const material = new THREE.MeshStandardMaterial({
        color: 0x8B4513,
        roughness: 0.9
    });
    const log = new THREE.Mesh(geom, material);
    log.rotation.z = Math.PI / 2;
    log.position.set(LANES[lane], 0.5, SPAWN_DISTANCE);
    log.castShadow = true;
    log.userData.lane = lane;

    return log;
}

// ============ FLIES (COLLECTIBLES) ============
function createFly(lane) {
    const group = new THREE.Group();

    // Body
    const bodyGeom = new THREE.SphereGeometry(0.25, 8, 8);
    const flyMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        roughness: 0.4
    });
    const body = new THREE.Mesh(bodyGeom, flyMaterial);
    group.add(body);

    // Wings
    const wingGeom = new THREE.CircleGeometry(0.3, 8);
    const wingMaterial = new THREE.MeshStandardMaterial({
        color: 0xaaddff,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
    });

    const leftWing = new THREE.Mesh(wingGeom, wingMaterial);
    leftWing.position.set(-0.2, 0.1, 0);
    leftWing.rotation.y = -0.5;
    group.add(leftWing);

    const rightWing = new THREE.Mesh(wingGeom, wingMaterial);
    rightWing.position.set(0.2, 0.1, 0);
    rightWing.rotation.y = 0.5;
    group.add(rightWing);

    group.position.set(LANES[lane], 1.5, SPAWN_DISTANCE);
    group.userData.lane = lane;
    group.userData.leftWing = leftWing;
    group.userData.rightWing = rightWing;

    return group;
}

// ============ POWER-UPS ============
function createHelmet(lane) {
    const group = new THREE.Group();

    // Helmet dome
    const helmetGeom = new THREE.SphereGeometry(0.5, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const helmetMaterial = new THREE.MeshStandardMaterial({
        color: 0xffd700,
        roughness: 0.3,
        metalness: 0.8,
        emissive: 0xffa500,
        emissiveIntensity: 0.3
    });
    const helmet = new THREE.Mesh(helmetGeom, helmetMaterial);
    helmet.rotation.x = Math.PI;
    helmet.position.y = 0.3;
    group.add(helmet);

    // Helmet brim
    const brimGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 16);
    const brim = new THREE.Mesh(brimGeom, helmetMaterial);
    brim.position.y = 0.3;
    group.add(brim);

    // Star on top
    const starGeom = new THREE.OctahedronGeometry(0.15);
    const starMaterial = new THREE.MeshStandardMaterial({
        color: 0xffff00,
        emissive: 0xffff00,
        emissiveIntensity: 0.5
    });
    const star = new THREE.Mesh(starGeom, starMaterial);
    star.position.y = 0.8;
    group.add(star);

    group.position.set(LANES[lane], 1.2, SPAWN_DISTANCE);
    group.userData.lane = lane;
    group.userData.type = 'helmet';
    group.userData.star = star;

    return group;
}

function playPowerUpSound() {
    if (!audioContext) return;
    const ctx = audioContext;
    const now = ctx.currentTime;

    // Epic power-up sound
    [523, 659, 784, 1047].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
    });
}

// ============ SPAWNING ============
var lastSpawnZ = 20;

function spawnObjects() {
    if (state.time * state.speed * 10 > lastSpawnZ) {
        const lane = Math.floor(Math.random() * 3);

        // Calculate power-up spawn chance based on difficulty and time
        // On hard/super modes, power-ups become rarer as time goes on
        let powerUpChance = 0.15; // Base 15% chance

        if (state.cheatMode) {
            // Cheat mode: boosted power-ups!
            powerUpChance = 0.35;
        } else if (state.difficulty === 'hard') {
            // Hard mode: decreases from 15% to 5% over 60 seconds
            powerUpChance = Math.max(0.05, 0.15 - (state.time * 0.0017));
        } else if (state.difficulty === 'super') {
            // Super mode: decreases from 10% to 2% over 30 seconds
            powerUpChance = Math.max(0.02, 0.10 - (state.time * 0.0027));
        }

        if (Math.random() < 0.5) {
            // Spawn obstacle
            const obstacle = Math.random() < 0.5 ? createRock(lane) : createLog(lane);
            scene.add(obstacle);
            state.obstacles.push(obstacle);
        } else if (Math.random() < (1 - powerUpChance)) {
            // Spawn fly
            const fly = createFly(lane);
            scene.add(fly);
            state.flies.push(fly);
        } else {
            // Spawn power-up (helmet)
            const helmet = createHelmet(lane);
            scene.add(helmet);
            state.powerups.push(helmet);
        }

        // Adjust spawn distance based on difficulty
        const diff = DIFFICULTIES[state.difficulty || 'normal'];
        const spawnMulti = diff.spawnIntervalMulti || 1.0;
        lastSpawnZ += (8 + Math.random() * 12) * spawnMulti;
    }
}

// ============ COLLISION DETECTION ============
function checkCollisions(moveSpeed = 0) {
    const lizardX = lizardGroup.position.x;
    const lizardZ = lizardGroup.position.z; // Always 0

    // Check obstacles (skip if invincible)
    if (!state.isInvincible) {
        for (let i = state.obstacles.length - 1; i >= 0; i--) {
            const obs = state.obstacles[i];
            const dx = Math.abs(obs.position.x - lizardX);
            // Enhanced Z check to prevent tunneling at high speeds
            const z = obs.position.z;
            const collisionDepth = 1.2;
            const hitZ = z <= collisionDepth && z >= -(collisionDepth + moveSpeed); // Swept collision check

            if (dx < 1.2 && hitZ) {
                gameOver();
                return;
            }
        }
    }

    // Check flies
    for (let i = state.flies.length - 1; i >= 0; i--) {
        const fly = state.flies[i];
        const dx = Math.abs(fly.position.x - lizardX);
        // Enhanced Z check for collection
        const z = fly.position.z;
        const collectDepth = 1.5;
        const hitZ = z <= collectDepth && z >= -(collectDepth + moveSpeed);

        // Tongue mode: auto-catch flies from ALL lanes if within Z range
        const tongueActive = state.tongueFliesLeft > 0;
        const tongueRange = 25; // Tongue reaches further ahead
        const tongueHitZ = z <= tongueRange && z >= -2;

        if ((dx < 1.5 && hitZ) || (tongueActive && tongueHitZ)) {
            scene.remove(fly);
            state.flies.splice(i, 1);
            state.score++;

            if (tongueActive && (dx >= 1.5 || !hitZ)) {
                // Caught with tongue from distance!
                state.tongueFliesLeft--;
                animateTongue(z); // Trigger visual tongue animation!
                playTongueCatchSound();
                if (state.tongueFliesLeft <= 0) {
                    showCheatNotification(t('tongueEnded'));
                }
            } else {
                playCollectSound();
            }
            updateHUD();
        }
    }

    // Check power-ups
    for (let i = state.powerups.length - 1; i >= 0; i--) {
        const powerup = state.powerups[i];
        const dx = Math.abs(powerup.position.x - lizardX);
        // Enhanced Z check
        const z = powerup.position.z;
        const collectDepth = 1.5;
        const hitZ = z <= collectDepth && z >= -(collectDepth + moveSpeed);

        if (dx < 1.5 && hitZ) {
            scene.remove(powerup);
            state.powerups.splice(i, 1);
            activateInvincibility();
        }
    }
}

function activateInvincibility() {
    state.isInvincible = true;
    state.invincibleEndTime = state.time + 5; // 5 seconds
    playPowerUpSound();

    // Make lizard glow
    scaleMaterial.emissive.setHex(0xffd700);
    scaleMaterial.emissiveIntensity = 0.5;
}

function updateInvincibility() {
    if (state.isInvincible && state.time >= state.invincibleEndTime) {
        state.isInvincible = false;
        scaleMaterial.emissive.setHex(0x000000);
        scaleMaterial.emissiveIntensity = 0;
    }

    // Flashing effect when invincible
    if (state.isInvincible) {
        const flash = Math.sin(state.time * 20) > 0;
        scaleMaterial.emissiveIntensity = flash ? 0.6 : 0.3;
    }
}

// ============ GAME CONTROLS ============
function handleInput(e) {
    if (!state.isRunning) return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        state.targetLane = Math.min(1, state.targetLane + 1);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        state.targetLane = Math.max(-1, state.targetLane - 1);
    }
}

document.addEventListener('keydown', handleInput);

// ============ MOBILE TOUCH CONTROLS ============
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    touchStartTime = Date.now();
}

function handleTouchEnd(e) {
    if (!state.isRunning) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX;
    const deltaY = touch.clientY - touchStartY;
    const deltaTime = Date.now() - touchStartTime;

    // Minimum swipe distance and maximum time for swipe detection
    const minSwipeDistance = 30;
    const maxSwipeTime = 300;

    if (deltaTime < maxSwipeTime && Math.abs(deltaX) > minSwipeDistance) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                // Swipe right -> move right
                state.targetLane = Math.max(-1, state.targetLane - 1);
            } else {
                // Swipe left -> move left
                state.targetLane = Math.min(1, state.targetLane + 1);
            }
        }
    }
}

// Touch button handlers for mobile
function moveLeft() {
    if (!state.isRunning) return;
    state.targetLane = Math.min(1, state.targetLane + 1);
}

function moveRight() {
    if (!state.isRunning) return;
    state.targetLane = Math.max(-1, state.targetLane - 1);
}

// Add touch event listeners
document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchend', handleTouchEnd, { passive: true });

// Setup mobile button listeners
const leftBtn = document.getElementById('mobile-left-btn');
const rightBtn = document.getElementById('mobile-right-btn');
if (leftBtn) leftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveLeft(); });
if (rightBtn) rightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveRight(); });

// ============ GAME LOOP ============
function updateHUD() {
    document.getElementById('score-value').textContent = state.score;
    document.getElementById('speed-value').textContent = state.speed.toFixed(1);
}

function animateLizard(time) {
    const speed = state.speed;
    const stride = time * 15 * speed; // Speed of cycle

    // Spine Undulation (S-curve)
    // Hips and Chest rotate opposite to each other to create wiggle
    const wiggleAmp = 0.15;
    hips.rotation.y = Math.cos(stride) * wiggleAmp;
    chest.rotation.y = Math.cos(stride + Math.PI) * wiggleAmp;
    headGroup.rotation.y = Math.cos(stride + Math.PI * 1.5) * (wiggleAmp * 0.5); // Stabilization

    headGroup.position.z = 1.4 + Math.sin(stride * 2) * 0.02; // Slight head bob forward/back

    // Tail wave propagation
    tailSegments.forEach((seg, i) => {
        const lag = i * 0.3;
        seg.rotation.y = Math.cos(stride - lag) * 0.3;
        seg.position.x = Math.sin(stride - lag) * 0.1 * i;
    });

    // Leg Animation (IK-like)
    legs.forEach(leg => {
        // Phase: Front legs 180 out of phase, Diagonal pairs synced (trot gait)
        // FL(0) and BR(0) move together? No, lizard trot: FL & BR together.
        // FL side=-1 isFront=true. BR side=1 isFront=false.
        // Phase logic:
        let phase = 0;
        if (leg.isFront) {
            phase = leg.side === -1 ? 0 : Math.PI;
        } else {
            phase = leg.side === 1 ? 0 : Math.PI;
        }

        const cycle = stride + phase;

        // Lift and Swing
        // Shoulder rotation (yaw)
        leg.shoulder.rotation.y = Math.sin(cycle) * 0.5;
        // Upper leg lift (pitch)
        leg.upper.rotation.x = Math.sin(cycle) * 0.5 + 0.5; // Up/Down
        leg.upper.rotation.z = leg.side * 0.2; // Splay

        // Lower leg (knee)
        leg.lower.rotation.x = -Math.abs(Math.cos(cycle)) * 1.0 - 0.2;

        // Foot
        leg.foot.rotation.x = Math.max(0, Math.sin(cycle)) * 0.5;
    });

    // Whole body bob
    lizardGroup.position.y = Math.abs(Math.sin(stride)) * 0.05;
}

function animate() {
    requestAnimationFrame(animate);

    if (!state.isRunning) {
        renderer.render(scene, camera);
        return;
    }

    const delta = 0.016; // ~60fps
    state.time += delta;

    // Increase speed over time based on difficulty
    const diff = DIFFICULTIES[state.difficulty || 'normal'];
    state.speed = diff.startSpeed + state.time * diff.acceleration;
    if (state.speed > diff.maxSpeed) state.speed = diff.maxSpeed;

    // Move lizard smoothly between lanes
    const targetX = LANES[state.targetLane + 1];
    // Snappier movement for higher speeds
    const lerpFactor = state.difficulty === 'super' ? 0.35 : (state.difficulty === 'hard' ? 0.28 : 0.22);
    lizardGroup.position.x += (targetX - lizardGroup.position.x) * lerpFactor;

    // Animate lizard
    animateLizard(state.time);

    // Update tongue animation (for jättikieli power)
    updateTongueAnimation(delta);

    // Move obstacles and flies toward player
    const moveSpeed = 20 * state.speed * delta;

    state.obstacles.forEach((obs, i) => {
        obs.position.z -= moveSpeed;
        if (obs.position.z < DESPAWN_DISTANCE) {
            scene.remove(obs);
            state.obstacles.splice(i, 1);
        }
    });

    state.flies.forEach((fly, i) => {
        fly.position.z -= moveSpeed;
        fly.position.y = 1.5 + Math.sin(state.time * 5 + fly.position.z) * 0.3;
        fly.rotation.y += 0.1;

        // Wing flap
        fly.userData.leftWing.rotation.z = Math.sin(state.time * 30) * 0.5;
        fly.userData.rightWing.rotation.z = -Math.sin(state.time * 30) * 0.5;

        if (fly.position.z < DESPAWN_DISTANCE) {
            scene.remove(fly);
            state.flies.splice(i, 1);
        }
    });

    // Move power-ups
    state.powerups.forEach((powerup, i) => {
        powerup.position.z -= moveSpeed;
        powerup.position.y = 1.2 + Math.sin(state.time * 4) * 0.2;
        powerup.rotation.y += 0.05;
        if (powerup.userData.star) {
            powerup.userData.star.rotation.y += 0.15;
        }

        if (powerup.position.z < DESPAWN_DISTANCE) {
            scene.remove(powerup);
            state.powerups.splice(i, 1);
        }
    });

    // Move ground tiles
    state.groundTiles.forEach((tile, i) => {
        tile.position.z -= moveSpeed;
        if (tile.userData.lines) {
            tile.userData.lines.forEach(line => line.position.z -= moveSpeed);
        }

        if (tile.position.z < -GROUND_LENGTH) {
            const maxZ = Math.max(...state.groundTiles.map(t => t.position.z));
            tile.position.z = maxZ + GROUND_LENGTH;
            if (tile.userData.lines) {
                tile.userData.lines.forEach(line => line.position.z = tile.position.z);
            }
        }
    });

    // Spawn new objects
    spawnObjects();

    // Update invincibility
    updateInvincibility();

    // Check collisions - pass moveSpeed to prevent tunneling
    checkCollisions(moveSpeed);

    // Update HUD
    if (Math.floor(state.time * 10) % 5 === 0) {
        updateHUD();
    }

    renderer.render(scene, camera);
}

// ============ GAME STATE MANAGEMENT ============
function startGame() {
    state.score = 0;

    // Set speed based on difficulty
    const diff = DIFFICULTIES[state.difficulty || 'normal'];
    state.speed = diff.startSpeed;

    state.time = 0;
    state.isRunning = true;
    state.isGameOver = false;
    state.targetLane = 0;
    lastSpawnZ = 20;

    // Clear existing obstacles, flies, and power-ups
    state.obstacles.forEach(obs => scene.remove(obs));
    state.flies.forEach(fly => scene.remove(fly));
    state.powerups.forEach(p => scene.remove(p));
    state.obstacles = [];
    state.flies = [];
    state.powerups = [];

    // Reset invincibility
    state.isInvincible = false;
    state.invincibleEndTime = 0;
    scaleMaterial.emissive.setHex(0x000000);
    scaleMaterial.emissiveIntensity = 0;

    // Reset cheat uses
    cheatUsesLeft = 2;
    state.cheatMode = false;
    state.tongueFliesLeft = 0; // Reset tongue power
    if (cheatTimer) {
        clearTimeout(cheatTimer);
        cheatTimer = null;
    }

    // Reset lizard position
    lizardGroup.position.set(0, 0, 0);

    // Hide overlays
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');

    updateHUD();
    startMusic();
}

function gameOver() {
    state.isRunning = false;
    state.isGameOver = true;

    document.getElementById('final-score').textContent = state.score;

    // Update game over screen text with current language
    const gameOverScoreText = document.querySelector('#game-over-screen .overlay-content > p:first-of-type');
    if (gameOverScoreText) {
        gameOverScoreText.innerHTML = `${t('collected')} <span id="final-score">${state.score}</span> ${t('flies')}`;
    }

    // Handle multiplayer end
    if (multiplayerState.isMultiplayer) {
        endMultiplayerGame();
    }

    // Add score to leaderboard and get rank
    const playerName = currentPlayerName || t('unknown');
    const rank = addScore(playerName, state.score);

    // Show rank message
    const rankMessage = document.getElementById('rank-message');
    if (rankMessage) {
        if (multiplayerState.isMultiplayer) {
            // Multiplayer result will be shown by endMultiplayerGame
        } else if (rank === 1) {
            rankMessage.textContent = t('newRecord');
        } else if (rank <= 10) {
            rankMessage.textContent = `${t('great')} #${rank}`;
        } else {
            rankMessage.textContent = `${t('yourRank')} #${rank}`;
        }
    }

    // Render leaderboard on game over screen
    renderLeaderboard('game-over-leaderboard-list', playerName, state.score);

    // Add challenge friend button if we have friends
    const gameOverContent = document.querySelector('#game-over-screen .overlay-content');
    const existingChallengeSection = document.getElementById('challenge-section');
    if (existingChallengeSection) existingChallengeSection.remove();

    if (friendsList.length > 0 && state.score > 0) {
        const challengeSection = document.createElement('div');
        challengeSection.id = 'challenge-section';
        challengeSection.style.cssText = 'margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);';
        challengeSection.innerHTML = `
            <p style="margin-bottom: 10px;">⚔️ Haasta kaveri tuloksellasi!</p>
            <select id="challenge-friend-select" style="padding: 8px; border-radius: 5px; margin-right: 10px;">
                ${friendsList.map(f => `<option value="${escapeHtml(f)}">${escapeHtml(f)}</option>`).join('')}
            </select>
            <button onclick="sendChallenge(document.getElementById('challenge-friend-select').value, ${state.score})" class="small-btn">Lähetä haaste!</button>
        `;
        gameOverContent.insertBefore(challengeSection, document.getElementById('restart-btn'));
    }

    document.getElementById('game-over-screen').classList.remove('hidden');
    stopMusic();
    playCrashSound();
}

// ============ EVENT LISTENERS ============
document.getElementById('start-btn').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);

document.addEventListener('keydown', (e) => {
    if ((e.key === ' ' || e.key === 'Enter') && !state.isRunning) {
        startGame();
    }
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============ START ============

animate();
