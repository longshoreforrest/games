/**
 * VIUHTIN HOITO - Koiranhoitopeli
 * Pelin logiikka ja toiminnallisuus
 */

// ============================================
// Game State
// ============================================
const gameState = {
    // Viuhtin tilat (0-100)
    stats: {
        hunger: 100,      // Nälkä/kylläisyys
        energy: 100,      // Energia
        cleanliness: 100, // Puhtaus
        happiness: 100,   // Onnellisuus
        nails: 100,       // Kynsien kunto
        exercise: 100,    // Liikunta
        bladder: 70       // Vessahätä - ALKAA KORKEALLA! (pakottaa viemään ulos)
    },

    // Pelin aika
    time: {
        hours: 8,
        minutes: 0,
        day: 1,
        speed: 1,  // 0 = pause, 1 = normal, 2 = fast
        isPaused: false
    },

    // Viuhtin tila
    viuhti: {
        currentMood: 'needsPotty',
        isAsleep: false,
        lastAction: null
    },

    // Huonejärjestelmä
    currentRoom: 'living', // living, kitchen, bathroom, bedroom, yard

    // Kakkatilanne
    poop: {
        onFloor: 0,       // Montako kakkaa lattialla
        maxPoops: 5       // Maksimi ennen katastrofia
    },

    // Cooldownit toimenpiteille (millisekunteina)
    cooldowns: {},

    // Tilastot
    statistics: {
        totalDays: 1,
        actionsPerformed: 0,
        treatsTaken: 0,
        accidentsHad: 0
    }
};

// ============================================
// DOM Elements
// ============================================
const elements = {
    viuhtiImage: document.getElementById('viuhti-image'),
    viuhtiStatus: document.getElementById('viuhti-status'),
    speechBubble: document.getElementById('viuhti-speech'),
    speechText: document.getElementById('speech-text'),
    actionAnimation: document.getElementById('action-animation'),
    poopFloor: document.getElementById('poop-floor'),

    // Stat bars
    hungerBar: document.getElementById('hunger-bar'),
    energyBar: document.getElementById('energy-bar'),
    cleanlinessBar: document.getElementById('cleanliness-bar'),
    happinessBar: document.getElementById('happiness-bar'),
    nailsBar: document.getElementById('nails-bar'),
    exerciseBar: document.getElementById('exercise-bar'),
    bladderBar: document.getElementById('bladder-bar'),

    // Stat values
    hungerValue: document.getElementById('hunger-value'),
    energyValue: document.getElementById('energy-value'),
    cleanlinessValue: document.getElementById('cleanliness-value'),
    happinessValue: document.getElementById('happiness-value'),
    nailsValue: document.getElementById('nails-value'),
    exerciseValue: document.getElementById('exercise-value'),
    bladderValue: document.getElementById('bladder-value'),

    // Time
    gameTime: document.getElementById('game-time'),
    gameDay: document.getElementById('game-day'),

    // Buttons
    btnFeed: document.getElementById('btn-feed'),
    btnWater: document.getElementById('btn-water'),
    btnSleep: document.getElementById('btn-sleep'),
    btnWash: document.getElementById('btn-wash'),
    btnBrush: document.getElementById('btn-brush'),
    btnWalk: document.getElementById('btn-walk'),
    btnPlay: document.getElementById('btn-play'),
    btnPet: document.getElementById('btn-pet'),
    btnNails: document.getElementById('btn-nails'),
    btnTreat: document.getElementById('btn-treat'),
    btnVet: document.getElementById('btn-vet'),
    btnTrain: document.getElementById('btn-train'),
    btnCleanup: document.getElementById('btn-cleanup'),
    btnMusic: document.getElementById('btn-music'),

    // Speed controls
    btnPause: document.getElementById('btn-pause'),
    btnNormal: document.getElementById('btn-normal'),
    btnFast: document.getElementById('btn-fast'),

    // Other
    activityLog: document.getElementById('activity-log'),
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notification-text')
};

// ============================================
// Viuhtin puheet ja reaktiot
// ============================================
const viuhtiSpeech = {
    happy: ['Hau hau! 🐕', 'Ihanaa! ❤️', 'Rakastan sinua!', 'Leikitään!', 'Paras päivä!'],
    hungry: ['Nälkä... 🥺', 'Ruokaa?', 'Vatsa kurnii...', 'Nam nam?'],
    tired: ['Olen väsynyt... 😴', 'Nukkumaan...', 'Haukotus~', 'Väsyttää...'],
    dirty: ['Tarvitsen kylpyä 🛁', 'Olen likainen...', 'Pesu olisi kiva'],
    sad: ['Olen surullinen 😢', 'Leiki kanssani...', 'Tylsää...'],
    walking: ['Ulkoilu! 🌳', 'Haju on hyvä!', 'Puistoon!', 'Lenkille!'],
    eating: ['Nam nam! 🍖', 'Herkullista!', 'Kiitos ruuasta!'],
    sleeping: ['Zzz... 💤', '*kuorsaa*', 'Hyvät unet...'],
    playing: ['Hauskaa! 🎾', 'Lisää!', 'Leikitään taas!'],
    bathing: ['Vesi on kivaa! 💦', 'Puhtaaksi!', 'Kylpy!'],
    petting: ['Mmm... rapsutuksia ❤️', 'Lisää!', 'Paras tunne!'],
    needsPotty: ['Pitäisi päästä ulos... 🚽', 'Vessahätä!', 'Pihalle?', 'Kiire!!'],
    accident: ['Anteeksi... 😳', 'En jaksanut pidätellä...', 'Hups...']
};

// ============================================
// Huonejärjestelmä (Room System)
// ============================================
const roomConfig = {
    living: {
        name: 'Olohuone',
        icon: '🏠',
        decor: '🛋️ 📺 🪴',
        allowedActions: ['pet', 'play', 'treat', 'train', 'nails']
    },
    kitchen: {
        name: 'Keittiö',
        icon: '🍳',
        decor: '🍽️ 🥣 🧊',
        allowedActions: ['feed', 'water', 'treat']
    },
    bathroom: {
        name: 'Kylpyhuone',
        icon: '🛁',
        decor: '🚿 🧴 🪥',
        allowedActions: ['wash', 'brush', 'nails']
    },
    bedroom: {
        name: 'Makuuhuone',
        icon: '🛏️',
        decor: '🛏️ 🌙 💤',
        allowedActions: ['sleep', 'pet']
    },
    yard: {
        name: 'Piha',
        icon: '🌳',
        decor: '🌲 🌻 🦋 🐿️ 🌳',
        allowedActions: ['walk', 'play', 'train']
    }
};

// ============================================
// Utility Functions
// ============================================

/**
 * Rajoita arvo välille 0-100
 */
function clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Valitse satunnainen elementti taulukosta
 */
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Formatoi aika HH:MM muotoon
 */
function formatTime(hours, minutes) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Lisää loki-merkintä
 */
function addLogEntry(message) {
    const entry = document.createElement('p');
    entry.className = 'log-entry';
    entry.textContent = `${formatTime(gameState.time.hours, gameState.time.minutes)} - ${message}`;

    // Lisää alkuun
    elements.activityLog.insertBefore(entry, elements.activityLog.firstChild);

    // Rajoita lokien määrä
    while (elements.activityLog.children.length > 20) {
        elements.activityLog.removeChild(elements.activityLog.lastChild);
    }
}

/**
 * Näytä ilmoitus
 */
function showNotification(message, duration = 3000) {
    elements.notificationText.textContent = message;
    elements.notification.classList.remove('hidden');

    setTimeout(() => {
        elements.notification.classList.add('hidden');
    }, duration);
}

/**
 * Näytä puhekupla
 */
function showSpeechBubble(text, duration = 2500) {
    elements.speechText.textContent = text;
    elements.speechBubble.classList.remove('hidden');

    setTimeout(() => {
        elements.speechBubble.classList.add('hidden');
    }, duration);
}

/**
 * Näytä toiminto-animaatio
 */
function showActionAnimation(emoji) {
    elements.actionAnimation.textContent = emoji;
    elements.actionAnimation.classList.remove('hidden');

    // Lisää kuvan animaatio
    elements.viuhtiImage.classList.add('action-active');

    setTimeout(() => {
        elements.actionAnimation.classList.add('hidden');
        elements.viuhtiImage.classList.remove('action-active');
    }, 800);
}

/**
 * Aseta cooldown napille
 */
function setCooldown(buttonId, duration = 2000) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.classList.add('cooldown');
    button.disabled = true;
    gameState.cooldowns[buttonId] = Date.now() + duration;

    setTimeout(() => {
        button.classList.remove('cooldown');
        button.disabled = false;
        delete gameState.cooldowns[buttonId];
    }, duration);
}

// ============================================
// Room System Functions
// ============================================

/**
 * Vaihda huone
 */
function changeRoom(roomId) {
    if (!roomConfig[roomId]) return;

    const previousRoom = gameState.currentRoom;
    gameState.currentRoom = roomId;
    const room = roomConfig[roomId];

    // Päivitä huonenapit
    document.querySelectorAll('.room-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.room === roomId) {
            btn.classList.add('active');
        }
    });

    // Päivitä huoneen tausta
    const viuhtiSection = document.getElementById('viuhti-section');
    viuhtiSection.setAttribute('data-room', roomId);

    // Päivitä koristeet
    const roomDecor = document.getElementById('room-decor');
    roomDecor.textContent = room.decor;

    // Päivitä huoneindikaattori
    const roomIndicator = document.getElementById('room-indicator');
    roomIndicator.textContent = `📍 ${room.name}`;

    // Näytä/piilota toimintoja huoneen mukaan
    updateActionVisibility();

    // Viuhti reagoi huoneenvaihtoon
    if (previousRoom !== roomId) {
        const reactions = {
            living: 'Kotona! 🏠',
            kitchen: 'Ruokaa? 🍖',
            bathroom: 'Pesulle? 🛁',
            bedroom: 'Lepäämään... 😴',
            yard: 'ULOS! 🌳🐕'
        };
        showSpeechBubble(reactions[roomId] || 'Hau!');
        addLogEntry(`🚪 Siirryttiin: ${room.name}`);
    }

    updateUI();
}

/**
 * Päivitä toimintonappien näkyvyys huoneen mukaan
 */
function updateActionVisibility() {
    const room = roomConfig[gameState.currentRoom];
    const allActions = ['feed', 'water', 'sleep', 'wash', 'brush', 'walk', 'play', 'pet', 'nails', 'treat', 'vet', 'train'];

    allActions.forEach(action => {
        const btn = document.getElementById(`btn-${action}`);
        if (btn) {
            // Vet ja cleanup ovat aina näkyvissä
            if (action === 'vet') {
                btn.style.display = '';
                btn.style.opacity = '1';
            } else if (room.allowedActions.includes(action)) {
                btn.style.display = '';
                btn.style.opacity = '1';
            } else {
                btn.style.opacity = '0.3';
                // Ei piiloteta kokonaan, mutta harmaannutetaan
            }
        }
    });
}

// ============================================
// UI Update Functions
// ============================================

/**
 * Päivitä kaikki tilapalkit
 */
function updateStatBars() {
    const stats = gameState.stats;

    // Päivitä palkit ja arvot
    updateStatBar('hunger', elements.hungerBar, elements.hungerValue, stats.hunger);
    updateStatBar('energy', elements.energyBar, elements.energyValue, stats.energy);
    updateStatBar('cleanliness', elements.cleanlinessBar, elements.cleanlinessValue, stats.cleanliness);
    updateStatBar('happiness', elements.happinessBar, elements.happinessValue, stats.happiness);
    updateStatBar('nails', elements.nailsBar, elements.nailsValue, stats.nails);
    updateStatBar('exercise', elements.exerciseBar, elements.exerciseValue, stats.exercise);
    updateStatBar('bladder', elements.bladderBar, elements.bladderValue, stats.bladder);
}

/**
 * Päivitä yksittäinen tilapalkki
 */
function updateStatBar(statName, barElement, valueElement, value) {
    const clampedValue = clamp(value);
    barElement.style.width = `${clampedValue}%`;
    valueElement.textContent = `${Math.round(clampedValue)}%`;

    // Lisää varoitus matalille/korkeille arvoille
    if (statName === 'bladder') {
        // Vessahätä: korkea = huono
        if (clampedValue > 70) {
            barElement.classList.add('low');
        } else {
            barElement.classList.remove('low');
        }
    } else {
        // Muut: matala = huono
        if (clampedValue < 30) {
            barElement.classList.add('low');
        } else {
            barElement.classList.remove('low');
        }
    }
}

/**
 * Päivitä Viuhtin kuva mielialan mukaan
 */
function updateViuhtiImage() {
    const stats = gameState.stats;
    const viuhti = gameState.viuhti;

    // Määritä mieliala tilojen perusteella
    let mood = 'happy';
    let imageSrc = 'assets/viuhti_happy.png';

    if (viuhti.isAsleep) {
        mood = 'sleeping';
        imageSrc = 'assets/viuhti_sleepy.png';
    } else if (stats.cleanliness < 30) {
        mood = 'dirty';
        imageSrc = 'assets/viuhti_dirty.png';
    } else if (stats.hunger < 30) {
        mood = 'hungry';
        imageSrc = 'assets/viuhti_hungry.png';
    } else if (stats.energy < 30) {
        mood = 'tired';
        imageSrc = 'assets/viuhti_sleepy.png';
    } else if (stats.bladder > 70) {
        mood = 'needsPotty';
        imageSrc = 'assets/viuhti_hungry.png'; // Käytetään huolestunut-kuvaa
    } else if (stats.happiness < 30) {
        mood = 'sad';
        imageSrc = 'assets/viuhti_hungry.png';
    } else if (viuhti.lastAction === 'walk') {
        mood = 'walking';
        imageSrc = 'assets/viuhti_walking.png';
    }

    viuhti.currentMood = mood;
    elements.viuhtiImage.src = imageSrc;
}

/**
 * Päivitä tilateksti
 */
function updateStatusText() {
    const stats = gameState.stats;
    const viuhti = gameState.viuhti;
    const poop = gameState.poop;

    let status = '';

    if (poop.onFloor > 0) {
        status = `💩 Lattialla on ${poop.onFloor} kakkaa! Siivoa!`;
    } else if (viuhti.isAsleep) {
        status = 'Viuhti nukkuu makeasti... 💤';
    } else if (stats.bladder > 80) {
        status = '🚨 VESSAHÄTÄ! Vie Viuhti ulos NYT!';
    } else if (stats.bladder > 60) {
        status = 'Viuhti pitäisi viedä ulos! 🚽';
    } else if (stats.hunger < 20) {
        status = 'Viuhti on tosi nälkäinen! 🍖';
    } else if (stats.energy < 20) {
        status = 'Viuhti on uupunut... 😴';
    } else if (stats.cleanliness < 20) {
        status = 'Viuhti tarvitsee kylvyn! 🛁';
    } else if (stats.happiness < 20) {
        status = 'Viuhti on surullinen... 😢';
    } else if (stats.exercise < 20) {
        status = 'Viuhti haluaa lenkille! 🏃';
    } else if (stats.nails < 20) {
        status = 'Viuhtin kynnet ovat pitkät! ✂️';
    } else if (getAverageStats() > 80) {
        status = 'Viuhti on onnellinen! 🐾❤️';
    } else if (getAverageStats() > 50) {
        status = 'Viuhti voi ihan hyvin 🐕';
    } else {
        status = 'Viuhti tarvitsee huomiota 🥺';
    }

    elements.viuhtiStatus.textContent = status;
}

/**
 * Laske tilojen keskiarvo
 */
function getAverageStats() {
    const stats = gameState.stats;
    return (stats.hunger + stats.energy + stats.cleanliness +
        stats.happiness + stats.nails + stats.exercise) / 6;
}

/**
 * Päivitä pelin aika UI:ssa
 */
function updateTimeDisplay() {
    elements.gameTime.textContent = formatTime(gameState.time.hours, gameState.time.minutes);
    elements.gameDay.textContent = `Päivä ${gameState.time.day}`;
}

/**
 * Päivitä kakat lattialla
 */
function updatePoopDisplay() {
    elements.poopFloor.innerHTML = '';

    for (let i = 0; i < gameState.poop.onFloor; i++) {
        const poop = document.createElement('div');
        poop.className = 'floor-poop';
        poop.textContent = '💩';
        poop.style.animationDelay = `${i * 0.2}s`;

        // Klikkaa siivotaksesi yksittäisen kakan
        poop.addEventListener('click', () => {
            cleanSinglePoop(poop);
        });

        elements.poopFloor.appendChild(poop);
    }

    // Näytä/piilota siivousnappi
    if (gameState.poop.onFloor > 0) {
        elements.btnCleanup.classList.remove('hidden');
    } else {
        elements.btnCleanup.classList.add('hidden');
    }
}

/**
 * Siivoa yksittäinen kakka
 */
function cleanSinglePoop(poopElement) {
    poopElement.classList.add('cleaning');
    gameMusic.playCleanup();

    setTimeout(() => {
        gameState.poop.onFloor = Math.max(0, gameState.poop.onFloor - 1);
        gameState.stats.cleanliness = clamp(gameState.stats.cleanliness + 5);
        updatePoopDisplay();
        updateUI();

        if (gameState.poop.onFloor === 0) {
            showNotification('✨ Lattia on puhdas!');
            addLogEntry('🧹 Kaikki kakat siivottu!');
        }
    }, 500);
}

// ============================================
// Poop/Accident System
// ============================================

/**
 * Viuhti tekee vahingon sisälle
 */
function haveAccident() {
    if (gameState.viuhti.isAsleep) return; // Ei vahinkoja nukkuessa

    gameState.poop.onFloor++;
    gameState.stats.bladder = 0; // Ei enää hätää
    gameState.stats.happiness = clamp(gameState.stats.happiness - 15);
    gameState.stats.cleanliness = clamp(gameState.stats.cleanliness - 20);
    gameState.statistics.accidentsHad++;

    // Ääni ja visuaalit
    if (typeof gameMusic !== 'undefined') {
        gameMusic.playPoop();
    }

    showActionAnimation('💩');
    showSpeechBubble(randomChoice(viuhtiSpeech.accident));
    addLogEntry('💩 Hups! Viuhti teki vahingon sisälle!');
    showNotification('⚠️ Viuhti teki vahingon! Muista viedä ulos ajoissa!', 4000);

    updatePoopDisplay();
    updateUI();
}

// ============================================
// Game Actions (with Mini-games)
// ============================================

/**
 * Ruoki Viuhtia (minipelillä)
 */
function feedViuhti() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Älä herätä häntä ruuan takia.');
        return;
    }

    // Käynnistä minipeli
    if (typeof miniGames !== 'undefined' && miniGames.feeding) {
        miniGameManager.currentGame = 'feeding';
        miniGames.feeding.start((success, bonus) => {
            if (success) {
                gameState.stats.hunger = clamp(gameState.stats.hunger + 30 + bonus);
                gameState.stats.happiness = clamp(gameState.stats.happiness + 5);
                gameState.stats.bladder = clamp(gameState.stats.bladder + 10); // Ruoka lisää vessahätää
                gameState.viuhti.lastAction = 'feed';

                if (typeof gameMusic !== 'undefined') gameMusic.playHappy();
                addLogEntry('🍖 Ruokittiin Viuhtia');
            }
            updateUI();
        });
    } else {
        // Fallback ilman minipeliä
        gameState.stats.hunger = clamp(gameState.stats.hunger + 30);
        gameState.stats.happiness = clamp(gameState.stats.happiness + 5);
        gameState.stats.bladder = clamp(gameState.stats.bladder + 10);
        gameState.viuhti.lastAction = 'feed';

        showActionAnimation('🍖');
        showSpeechBubble(randomChoice(viuhtiSpeech.eating));
        addLogEntry('🍖 Ruokittiin Viuhtia');
        setCooldown('btn-feed', 3000);
        updateUI();
    }
}

/**
 * Anna vettä
 */
function giveWater() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Anna vettä myöhemmin.');
        return;
    }

    gameState.stats.hunger = clamp(gameState.stats.hunger + 10);
    gameState.stats.happiness = clamp(gameState.stats.happiness + 3);
    gameState.stats.bladder = clamp(gameState.stats.bladder + 15); // Vesi lisää vessahätää!
    gameState.viuhti.lastAction = 'water';

    showActionAnimation('💧');
    showSpeechBubble('Raikasta! 💧');
    addLogEntry('💧 Annettiin vettä');
    setCooldown('btn-water', 2000);

    updateUI();
}

/**
 * Laita nukkumaan
 */
function putToSleep() {
    if (gameState.viuhti.isAsleep) {
        // Herätä
        gameState.viuhti.isAsleep = false;
        showSpeechBubble('Huomenta! 🌞');
        addLogEntry('🌞 Viuhti heräsi');
        elements.btnSleep.querySelector('.btn-text').textContent = 'Nukuta';
    } else {
        // Tarkista vessahätä ennen nukkumista
        if (gameState.stats.bladder > 50) {
            showNotification('⚠️ Vie Viuhti ensin ulos - hänellä on vessahätä!');
            return;
        }

        // Nukuta
        gameState.viuhti.isAsleep = true;
        showSpeechBubble(randomChoice(viuhtiSpeech.sleeping));
        addLogEntry('😴 Viuhti meni nukkumaan');
        elements.btnSleep.querySelector('.btn-text').textContent = 'Herätä';
    }

    showActionAnimation('💤');
    gameState.viuhti.lastAction = 'sleep';
    setCooldown('btn-sleep', 2000);

    updateUI();
}

/**
 * Pese Viuhti (minipelillä)
 */
function washViuhti() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Pese hänet myöhemmin.');
        return;
    }

    // Käynnistä minipeli
    if (typeof miniGames !== 'undefined' && miniGames.washing) {
        miniGameManager.currentGame = 'washing';
        miniGames.washing.start((success, bonus) => {
            if (success) {
                gameState.stats.cleanliness = clamp(gameState.stats.cleanliness + 40 + bonus);
                gameState.stats.happiness = clamp(gameState.stats.happiness + 5);
                gameState.viuhti.lastAction = 'wash';

                if (typeof gameMusic !== 'undefined') gameMusic.playSuccess();
                addLogEntry('🛁 Pestiin Viuhti');
            }
            updateUI();
        });
    } else {
        gameState.stats.cleanliness = clamp(gameState.stats.cleanliness + 40);
        gameState.stats.happiness = clamp(gameState.stats.happiness + 5);
        gameState.viuhti.lastAction = 'wash';

        showActionAnimation('🛁');
        showSpeechBubble(randomChoice(viuhtiSpeech.bathing));
        addLogEntry('🛁 Pestiin Viuhti');
        setCooldown('btn-wash', 5000);
        updateUI();
    }
}

/**
 * Harjaa turkki (minipelillä)
 */
function brushViuhti() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Harjaa myöhemmin.');
        return;
    }

    // Käynnistä minipeli
    if (typeof miniGames !== 'undefined' && miniGames.brushing) {
        miniGameManager.currentGame = 'brushing';
        miniGames.brushing.start((success, bonus) => {
            if (success) {
                gameState.stats.cleanliness = clamp(gameState.stats.cleanliness + 20 + bonus);
                gameState.stats.happiness = clamp(gameState.stats.happiness + 10);
                gameState.viuhti.lastAction = 'brush';

                if (typeof gameMusic !== 'undefined') gameMusic.playSuccess();
                addLogEntry('🪮 Harjattiin turkkia');
            }
            updateUI();
        });
    } else {
        gameState.stats.cleanliness = clamp(gameState.stats.cleanliness + 20);
        gameState.stats.happiness = clamp(gameState.stats.happiness + 10);
        gameState.viuhti.lastAction = 'brush';

        showActionAnimation('🪮');
        showSpeechBubble('Turkki kiiltää! ✨');
        addLogEntry('🪮 Harjattiin turkkia');
        setCooldown('btn-brush', 3000);
        updateUI();
    }
}

/**
 * Ulkoiluta Viuhtia (minipelillä)
 */
function walkViuhti() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Ulkoiluta myöhemmin.');
        return;
    }

    if (gameState.stats.energy < 20) {
        showNotification('Viuhti on liian väsynyt lenkille!');
        return;
    }

    // Käynnistä minipeli
    if (typeof miniGames !== 'undefined' && miniGames.walking) {
        miniGameManager.currentGame = 'walking';
        miniGames.walking.start((success, bonus) => {
            if (success) {
                gameState.stats.exercise = clamp(gameState.stats.exercise + 35 + bonus);
                gameState.stats.happiness = clamp(gameState.stats.happiness + 15);
                gameState.stats.energy = clamp(gameState.stats.energy - 15);
                gameState.stats.cleanliness = clamp(gameState.stats.cleanliness - 10);
                gameState.stats.bladder = 0; // Teki tarpeet ulkona!
                gameState.viuhti.lastAction = 'walk';

                if (typeof gameMusic !== 'undefined') gameMusic.playSuccess();
                addLogEntry('🚶 Käytiin lenkillä (ja tehtiin tarpeet!)');
                showNotification('✅ Viuhti teki tarpeet ulkona!');
            }
            updateUI();
        });
    } else {
        gameState.stats.exercise = clamp(gameState.stats.exercise + 35);
        gameState.stats.happiness = clamp(gameState.stats.happiness + 15);
        gameState.stats.energy = clamp(gameState.stats.energy - 15);
        gameState.stats.cleanliness = clamp(gameState.stats.cleanliness - 10);
        gameState.stats.bladder = 0;
        gameState.viuhti.lastAction = 'walk';

        showActionAnimation('🚶');
        showSpeechBubble(randomChoice(viuhtiSpeech.walking));
        addLogEntry('🚶 Käytiin lenkillä');
        setCooldown('btn-walk', 6000);

        elements.viuhtiImage.src = 'assets/viuhti_walking.png';
        setTimeout(() => {
            updateViuhtiImage();
        }, 5000);

        updateUI();
    }
}

/**
 * Leiki Viuhtin kanssa (minipelillä)
 */
function playWithViuhti() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Leiki myöhemmin.');
        return;
    }

    if (gameState.stats.energy < 15) {
        showNotification('Viuhti on liian väsynyt leikkimään!');
        return;
    }

    // Käynnistä minipeli
    if (typeof miniGames !== 'undefined' && miniGames.playing) {
        miniGameManager.currentGame = 'playing';
        miniGames.playing.start((success, bonus) => {
            if (success) {
                gameState.stats.happiness = clamp(gameState.stats.happiness + 25 + bonus);
                gameState.stats.exercise = clamp(gameState.stats.exercise + 15);
                gameState.stats.energy = clamp(gameState.stats.energy - 10);
                gameState.viuhti.lastAction = 'play';

                if (typeof gameMusic !== 'undefined') gameMusic.playHappy();
                addLogEntry('🎾 Leikittiin yhdessä');
            }
            updateUI();
        });
    } else {
        gameState.stats.happiness = clamp(gameState.stats.happiness + 25);
        gameState.stats.exercise = clamp(gameState.stats.exercise + 15);
        gameState.stats.energy = clamp(gameState.stats.energy - 10);
        gameState.viuhti.lastAction = 'play';

        showActionAnimation('🎾');
        showSpeechBubble(randomChoice(viuhtiSpeech.playing));
        addLogEntry('🎾 Leikittiin yhdessä');
        setCooldown('btn-play', 4000);
        updateUI();
    }
}

/**
 * Rapsuta Viuhtia
 */
function petViuhti() {
    if (gameState.viuhti.isAsleep) {
        gameState.stats.happiness = clamp(gameState.stats.happiness + 5);
        showSpeechBubble('*tyytyväinen huokaus* 😊');
    } else {
        gameState.stats.happiness = clamp(gameState.stats.happiness + 15);
        showSpeechBubble(randomChoice(viuhtiSpeech.petting));
    }

    gameState.viuhti.lastAction = 'pet';

    showActionAnimation('❤️');
    if (typeof gameMusic !== 'undefined') gameMusic.playHappy();
    addLogEntry('🤲 Rapsutettiin Viuhtia');
    setCooldown('btn-pet', 2000);

    updateUI();
}

/**
 * Leikkaa kynnet (minipelillä)
 */
function trimNails() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Leikkaa kynnet myöhemmin.');
        return;
    }

    // Käynnistä minipeli
    if (typeof miniGames !== 'undefined' && miniGames.nails) {
        miniGameManager.currentGame = 'nails';
        miniGames.nails.start((success, bonus) => {
            if (success) {
                gameState.stats.nails = 100;
                gameState.stats.happiness = clamp(gameState.stats.happiness - 5 + Math.floor(bonus / 3));
                gameState.viuhti.lastAction = 'nails';

                if (typeof gameMusic !== 'undefined') gameMusic.playSuccess();
                addLogEntry('✂️ Leikattiin kynnet');
            }
            updateUI();
        });
    } else {
        gameState.stats.nails = 100;
        gameState.stats.happiness = clamp(gameState.stats.happiness - 5);
        gameState.viuhti.lastAction = 'nails';

        showActionAnimation('✂️');
        showSpeechBubble('En tykkää tästä... 🥺');
        addLogEntry('✂️ Leikattiin kynnet');
        setCooldown('btn-nails', 10000);
        updateUI();
    }
}

/**
 * Anna herkku
 */
function giveTreat() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Anna herkku myöhemmin.');
        return;
    }

    gameState.stats.happiness = clamp(gameState.stats.happiness + 20);
    gameState.stats.hunger = clamp(gameState.stats.hunger + 10);
    gameState.statistics.treatsTaken++;
    gameState.viuhti.lastAction = 'treat';

    showActionAnimation('🦴');
    showSpeechBubble('HERKKU!! 🤩');
    if (typeof gameMusic !== 'undefined') gameMusic.playHappy();
    addLogEntry('🦴 Annettiin herkku');
    setCooldown('btn-treat', 5000);

    updateUI();
}

/**
 * Vie eläinlääkäriin
 */
function visitVet() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Herätä Viuhti ensin!');
        return;
    }

    gameState.stats.hunger = clamp(gameState.stats.hunger + 10);
    gameState.stats.energy = clamp(gameState.stats.energy + 10);
    gameState.stats.cleanliness = clamp(gameState.stats.cleanliness + 10);
    gameState.stats.happiness = clamp(gameState.stats.happiness - 10);
    gameState.stats.nails = clamp(gameState.stats.nails + 20);
    gameState.viuhti.lastAction = 'vet';

    showActionAnimation('🏥');
    showSpeechBubble('En tykkää lääkäristä 😰');
    addLogEntry('🏥 Käytiin eläinlääkärissä');
    showNotification('Eläinlääkäri tarkisti Viuhtin - kaikki kunnossa!');
    setCooldown('btn-vet', 15000);

    updateUI();
}

/**
 * Kouluta temppuja
 */
function trainViuhti() {
    if (gameState.viuhti.isAsleep) {
        showNotification('Viuhti nukkuu! Kouluta myöhemmin.');
        return;
    }

    if (gameState.stats.energy < 20) {
        showNotification('Viuhti on liian väsynyt harjoittelemaan!');
        return;
    }

    gameState.stats.happiness = clamp(gameState.stats.happiness + 10);
    gameState.stats.energy = clamp(gameState.stats.energy - 15);
    gameState.viuhti.lastAction = 'train';

    const tricks = ['istumaan', 'maahan', 'tassua', 'pyöri', 'hae'];
    const trick = randomChoice(tricks);

    showActionAnimation('🎓');
    showSpeechBubble(`Opin: ${trick}! 🌟`);
    addLogEntry(`🎓 Harjoiteltiin: "${trick}"`);
    setCooldown('btn-train', 5000);

    updateUI();
}

/**
 * Siivoa kaikki kakat (minipelillä)
 */
function cleanupPoop() {
    if (gameState.poop.onFloor === 0) {
        showNotification('Ei mitään siivottavaa!');
        return;
    }

    // Siivoa kaikki kerralla
    const poopsToClean = gameState.poop.onFloor;
    gameState.poop.onFloor = 0;
    gameState.stats.cleanliness = clamp(gameState.stats.cleanliness + poopsToClean * 5);

    showActionAnimation('🧹');
    showSpeechBubble('Kiitos siivoamisesta! 🙏');
    if (typeof gameMusic !== 'undefined') gameMusic.playCleanup();
    addLogEntry(`🧹 Siivottiin ${poopsToClean} kakkaa`);
    showNotification('✨ Lattia on puhdas!');

    updatePoopDisplay();
    updateUI();
}

// ============================================
// Game Loop
// ============================================

/**
 * Päivitä kaikki UI-elementit
 */
function updateUI() {
    updateStatBars();
    updateViuhtiImage();
    updateStatusText();
    updateTimeDisplay();
    updatePoopDisplay();
}

/**
 * Pelin päivityslooppi (kutsutaan joka sekunti)
 */
function gameLoop() {
    if (gameState.time.isPaused) return;

    // Päivitä aika
    const timeIncrement = gameState.time.speed === 2 ? 5 : 1;
    gameState.time.minutes += timeIncrement;

    if (gameState.time.minutes >= 60) {
        gameState.time.minutes = 0;
        gameState.time.hours++;

        // Tunnin vaihtuessa vähennä tiloja
        decreaseStats();
    }

    if (gameState.time.hours >= 24) {
        gameState.time.hours = 0;
        gameState.time.day++;
        gameState.statistics.totalDays++;
        addLogEntry('🌅 Uusi päivä alkoi!');
        showNotification(`Päivä ${gameState.time.day} alkoi!`);
    }

    // Jos Viuhti nukkuu, palauta energiaa
    if (gameState.viuhti.isAsleep) {
        gameState.stats.energy = clamp(gameState.stats.energy + 2);
        // Vessahätä kasvaa hitaammin nukkuessa
        gameState.stats.bladder = clamp(gameState.stats.bladder + 0.5);
    }

    // Tarkista vessahätä -> vahinko
    if (gameState.stats.bladder >= 100 && !gameState.viuhti.isAsleep) {
        haveAccident();
    }

    // Satunnainen kommentti Viuhtilta
    if (Math.random() < 0.02 && !gameState.viuhti.isAsleep) {
        const mood = gameState.viuhti.currentMood;
        if (viuhtiSpeech[mood]) {
            showSpeechBubble(randomChoice(viuhtiSpeech[mood]));
        }
    }

    updateUI();
    checkWarnings();
}

/**
 * Vähennä tiloja ajan myötä
 */
function decreaseStats() {
    // Peruskuopat joka tunti
    if (!gameState.viuhti.isAsleep) {
        gameState.stats.hunger = clamp(gameState.stats.hunger - 3);
        gameState.stats.energy = clamp(gameState.stats.energy - 2);
        gameState.stats.exercise = clamp(gameState.stats.exercise - 2);
        gameState.stats.bladder = clamp(gameState.stats.bladder + 8); // Vessahätä kasvaa!
    }

    gameState.stats.cleanliness = clamp(gameState.stats.cleanliness - 1);
    gameState.stats.happiness = clamp(gameState.stats.happiness - 1);
    gameState.stats.nails = clamp(gameState.stats.nails - 0.5);
}

/**
 * Tarkista varoitukset
 */
function checkWarnings() {
    const stats = gameState.stats;

    if (stats.hunger < 15 && !gameState.viuhti.isAsleep) {
        showNotification('⚠️ Viuhti on todella nälkäinen!', 4000);
    }

    if (stats.energy < 15 && !gameState.viuhti.isAsleep) {
        showNotification('⚠️ Viuhti on uupunut! Laita nukkumaan!', 4000);
    }

    if (stats.bladder > 85 && !gameState.viuhti.isAsleep) {
        showNotification('🚨 VESSAHÄTÄ! Vie Viuhti ulos välittömästi!', 4000);
        if (typeof gameMusic !== 'undefined') gameMusic.playSad();
    }
}

// ============================================
// Speed Controls
// ============================================

function pauseGame() {
    gameState.time.isPaused = true;
    gameState.time.speed = 0;
    updateSpeedButtons('btn-pause');
}

function normalSpeed() {
    gameState.time.isPaused = false;
    gameState.time.speed = 1;
    updateSpeedButtons('btn-normal');
}

function fastSpeed() {
    gameState.time.isPaused = false;
    gameState.time.speed = 2;
    updateSpeedButtons('btn-fast');
}

function updateSpeedButtons(activeId) {
    elements.btnPause.classList.remove('active');
    elements.btnNormal.classList.remove('active');
    elements.btnFast.classList.remove('active');
    document.getElementById(activeId).classList.add('active');
}

// ============================================
// Music Control
// ============================================

function toggleMusic() {
    if (typeof gameMusic !== 'undefined') {
        const isPlaying = gameMusic.toggle();
        elements.btnMusic.textContent = isPlaying ? '🔊' : '🔇';
        elements.btnMusic.classList.toggle('playing', isPlaying);
    }
}

// ============================================
// Event Listeners
// ============================================

function initEventListeners() {
    // Action buttons
    elements.btnFeed.addEventListener('click', feedViuhti);
    elements.btnWater.addEventListener('click', giveWater);
    elements.btnSleep.addEventListener('click', putToSleep);
    elements.btnWash.addEventListener('click', washViuhti);
    elements.btnBrush.addEventListener('click', brushViuhti);
    elements.btnWalk.addEventListener('click', walkViuhti);
    elements.btnPlay.addEventListener('click', playWithViuhti);
    elements.btnPet.addEventListener('click', petViuhti);
    elements.btnNails.addEventListener('click', trimNails);
    elements.btnTreat.addEventListener('click', giveTreat);
    elements.btnVet.addEventListener('click', visitVet);
    elements.btnTrain.addEventListener('click', trainViuhti);
    elements.btnCleanup.addEventListener('click', cleanupPoop);

    // Music control
    elements.btnMusic.addEventListener('click', toggleMusic);

    // Speed controls
    elements.btnPause.addEventListener('click', pauseGame);
    elements.btnNormal.addEventListener('click', normalSpeed);
    elements.btnFast.addEventListener('click', fastSpeed);

    // Click on Viuhti for random reaction
    elements.viuhtiImage.addEventListener('click', () => {
        if (!gameState.viuhti.isAsleep) {
            const mood = gameState.viuhti.currentMood;
            if (viuhtiSpeech[mood]) {
                showSpeechBubble(randomChoice(viuhtiSpeech[mood]));
            }
            if (typeof gameMusic !== 'undefined') gameMusic.playBark();
        } else {
            showSpeechBubble('Zzz... 💤');
        }
    });

    // Room navigation buttons
    document.querySelectorAll('.room-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const roomId = btn.dataset.room;
            changeRoom(roomId);
        });
    });
}

// ============================================
// Initialize Game
// ============================================

let musicStarted = false;

function startMusicOnFirstInteraction() {
    if (musicStarted) return;

    // Käynnistä musiikki ensimmäisellä interaktiolla
    if (typeof gameMusic !== 'undefined') {
        gameMusic.start();
        elements.btnMusic.textContent = '🔊';
        elements.btnMusic.classList.add('playing');
        musicStarted = true;

        // Poista kuuntelijat
        document.removeEventListener('click', startMusicOnFirstInteraction);
        document.removeEventListener('touchstart', startMusicOnFirstInteraction);
        document.removeEventListener('keydown', startMusicOnFirstInteraction);
    }
}

function initGame() {
    console.log('🐕 Viuhtin Hoito - Peli käynnistyy!');

    // Initialize room system
    changeRoom('living');

    // Initialize UI
    updateUI();

    // Set up event listeners
    initEventListeners();

    // Start game loop (every second)
    setInterval(gameLoop, 1000);

    // Auto-start music on first user interaction (browser requirement)
    document.addEventListener('click', startMusicOnFirstInteraction, { once: false });
    document.addEventListener('touchstart', startMusicOnFirstInteraction, { once: false });
    document.addEventListener('keydown', startMusicOnFirstInteraction, { once: false });

    // Welcome message with bladder warning!
    setTimeout(() => {
        showSpeechBubble('Hei! Minulla on VESSAHÄTÄ! 🚽🐕');
        showNotification('⚠️ Viuhtilla on kova vessahätä! Vie hänet PIHALLE heti!', 5000);
    }, 1000);

    console.log('✅ Peli käynnistetty!');
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', initGame);

