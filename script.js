'use strict';

const words = [
    {
        wordEng: 'popcorn',
        wordRus: 'попкорн',
        usageExample: 'его едят, при просмотре кино'
    },

    {
        wordEng: 'house',
        wordRus: 'дом',
        usageExample: 'жилое здание'
    },

    {
        wordEng: 'street',
        wordRus: 'улица',
        usageExample: 'дорога, имеющая индивидуальное название'
    },

    {
        wordEng: 'apple',
        wordRus: 'яблоко',
        usageExample: 'шаровидный сочный плод'
    },

    {
        wordEng: 'cat',
        wordRus: 'кот',
        usageExample: 'ласковое домашнее животное'
    },

    {
        wordEng: 'dog',
        wordRus: 'собака',
        usageExample: 'домашнее животное родственное волку'
    },

    {
        wordEng: 'pen',
        wordRus: 'ручка',
        usageExample: 'письменная принадлежность'
    },

    {
        wordEng: 'album',
        wordRus: 'альбом',
        usageExample: 'для рисования или для фотокарточек'
    },

    {
        wordEng: 'forest',
        wordRus: 'лес',
        usageExample: 'пространство, лостаточно густо поросшее деревьями'
    },

    {
        wordEng: 'sea',
        wordRus: 'море',
        usageExample: 'часть мирового океана'
    },

    {
        wordEng: 'table',
        wordRus: 'стол',
        usageExample: 'у него четыре ножки'
    },

    {
        wordEng: 'language',
        wordRus: 'язык',
        usageExample: 'всегда во рту, а не проглотишь'
    },

    {
        wordEng: 'sky',
        wordRus: 'небо',
        usageExample: 'над головой шар бескрайний голубой'
    },

    {
        wordEng: 'school',
        wordRus: 'школа',
        usageExample: 'там получают знания'
    },

    {
        wordEng: 'book',
        wordRus: 'книга',
        usageExample: 'носитель знаний'
    }];

let fiveWords = [];

const dataModeTraining = {};
const dataModeTest = {};
const wordStatistics = [];

const currentWord = document.querySelector('#current-word');
const studyMode = document.querySelector('#study-mode');
const wordsProgress = document.querySelector('#words-progress');
const shuffleWords = document.querySelector('#shuffle-words');
const examMode = document.querySelector('#exam-mode');
const correctPercent = document.querySelector('#correct-percent');
const examProgress = document.querySelector('#exam-progress');
const time = document.querySelector('#time');
const examCards = document.querySelector('#exam-cards');
const studyCards = document.querySelector('.study-cards');
const slider = document.querySelector('.slider');
const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front');
const cardFrontWord = cardFront.querySelector('h1');
const cardBack = document.querySelector('#card-back');
const cardBackWord = cardBack.querySelector('h1');
const cardBackExample = cardBack.querySelector('span');
const sliderControls = document.querySelector('.slider-controls');
const resultsModal = document.querySelector('.results-modal');
const resultsContent = document.querySelector('.results-content');
const timer = document.querySelector('#timer');
const wordStats = document.querySelector('#word-stats');

let mode = 'training';
let currentWords = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

function createArray() {
    while (fiveWords.length <= 4) {
        const randomWord = words[getRandomInt(words.length)];
        if (!fiveWords.includes(randomWord)) {
            fiveWords.push(randomWord);
        };
    };
    insertWord();
    setDataModeTraining();
    wordsProgress.value += 20;
    return fiveWords;
};

const arrayFiveWords = createArray();

function insertWord() {
    cardFrontWord.textContent = fiveWords[currentWords].wordEng;
    cardBackWord.textContent = fiveWords[currentWords].wordRus;
    cardBackExample.textContent = fiveWords[currentWords].usageExample;
};

slider.addEventListener('click', (event) => {
    const element = event.target.closest('.slider');

    if (element) {
        flipCard.classList.add('active');
        setTimeout(() => {
            flipCard.classList.remove('active');
        }, 1000);
    };
});

function shuffle() {
    fiveWords.sort(() => Math.random() - 0.5);
    insertWord();
    setDataModeTraining();
};

shuffleWords.addEventListener('click', shuffle);

function defineAttribute() {
    if (currentWords <= 0) {
        back.disabled = true;
        next.disabled = false;
    } else if (currentWords >= 4) {
        next.disabled = true;
    } else if (currentWords >= 1) {
        back.disabled = false;
    };
    setDataModeTraining();
};

function determineMode() {
    if (mode === 'checkOfKnowledge') {
        studyMode.classList.add('hidden');
        studyCards.classList.add('hidden');
        examMode.classList.remove('hidden');
    } else if (mode === 'statistics') {
        resultsModal.classList.remove('hidden');
    };
};

function insertCards() {
    const fragment = new DocumentFragment();

    fiveWords.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = item.wordEng;
        card.textContent = item.wordEng;
        fragment.append(card);
    });

    fiveWords.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = item.wordEng;
        card.textContent = item.wordRus;
        fragment.append(card);
    });

    Array.from(fragment.querySelectorAll('div')).sort(() => Math.random() - 0.5).forEach((item) => {
        examCards.append(item)
    });
};

sliderControls.addEventListener('click', (event) => {
    const button = event.target.id;

    if (button === 'back') {
        currentWords--;
        currentWord.textContent--;
        insertWord();
        defineAttribute();
        wordsProgress.value -= 20;
    };

    if (button === 'exam') {
        mode = 'checkOfKnowledge';
        determineMode();
        insertCards();
        startTimer();
    };

    if (button === 'next') {
        currentWords++;
        currentWord.textContent++;
        insertWord();
        defineAttribute();
        wordsProgress.value += 20;
    };
});

let timerId = 0;

function startTimer() {
    let minutes = +time.textContent.slice(0, 2);
    let seconds = +time.textContent.slice(3, 5);

    timerId = setInterval(() => {
        seconds++;
        if (seconds === 59) {
            minutes++;
            seconds = 0;
        };

        time.textContent = `${format(minutes)}:${format(seconds)}`;
    }, 1000);
};

function format(val) {
    if (val < 10) {
        return `0${val}`;
    };
    return val;
};

function stopTimer() {
    clearInterval(timerId);
};

let currentClick = 0;
let currentAttempts = 0;

let card1 = '';
let cardId1 = '';
let card2 = '';
let cardId2 = '';

let totalPercent = 0;

function testKnowledge(event) {
    currentClick++;

    const wordAttempts = wordStats.content.cloneNode(true);

    let card = event.target;
    let cardId = event.target.id;

    if (card.classList.contains('card')) {
        if (currentClick === 1) {
            card1 = card;
            cardId1 = cardId;
            card1.classList.add('correct');
        } else if (currentClick === 2) {
            card2 = card;
            cardId2 = cardId;
            currentAttempts++;
            if (cardId1 === cardId2) {
                card2.classList.add('correct');
                card2.classList.add('fade-out');
                card1.classList.add('fade-out');
                currentClick = 0;
                totalPercent += 20;
                correctPercent.textContent = `${totalPercent}%`;
                examProgress.value += 20;
                wordAttempts.querySelector('.word').querySelector('span').textContent = cardId1;
                wordAttempts.querySelector('.attempts').querySelector('span').textContent = currentAttempts;
                setDataModeTest();
                resultsContent.append(wordAttempts);
                currentAttempts = 0;
            } else {
                currentClick = 1;
                card2.classList.add('wrong');
                setTimeout(() => {
                    card2.classList.remove('wrong');
                }, 500);
            };
        };
    } else {
        if (currentClick === 1) {
            currentClick = 0;
        } else if (currentClick === 2) {
            currentClick = 1;
        };
    };

    if (totalPercent === 100) {
        setTimeout(() => {
            stopTimer();
        }, 0);
        examCards.innerHTML = '';
        mode = 'statistics';
        determineMode();
        timer.textContent = time.textContent;
    };
};

examCards.addEventListener('click', (event) => {
    testKnowledge(event);
});

function setDataModeTraining() {
    dataModeTraining.currentWordEng = cardFront.textContent;
    dataModeTraining.currentWordRus = cardBackWord.textContent;
    dataModeTraining.usageExample = cardBackExample.textContent;
    dataModeTraining.orderOfCards = fiveWords;
    localStorage.setItem('dataModeTraining', JSON.stringify(dataModeTraining));
};

function setDataModeTest() {
    dataModeTest.timeTest = time.textContent;
    const stats = {};
    stats.word = cardId1;
    stats.attempts = currentAttempts;
    wordStatistics.push(stats);
    dataModeTest.statistics = wordStatistics;
    localStorage.setItem('dataModeTest', JSON.stringify(dataModeTest));
};