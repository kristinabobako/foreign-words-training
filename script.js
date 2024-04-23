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

const testModeData = {};
const examModeData = {};
const examStatistics = [];

const resultTestMode = JSON.parse(localStorage.getItem('testModeData'));
const resultExamMode = JSON.parse(localStorage.getItem('examModeData'));

const mode = localStorage.getItem('mode');
const savedTimer = localStorage.getItem('timer');

const logo = document.querySelector('.logo');
const testMode = document.querySelector('#study-mode');
const numberCurrentWord = document.querySelector('#current-word');
const wordsProgress = document.querySelector('#words-progress');
const shuffleWords = document.querySelector('#shuffle-words');
const examMode = document.querySelector('#exam-mode');
const correctPercent = document.querySelector('#correct-percent');
const examProgress = document.querySelector('#exam-progress');
const examTimer = document.querySelector('#time');
const boxTestCards = document.querySelector('.study-cards');
const sliderTestCard = document.querySelector('.slider');
const flipCard = document.querySelector('.flip-card');
const cardFront = document.querySelector('#card-front');
const cardFrontWord = cardFront.querySelector('h1');
const cardBack = document.querySelector('#card-back');
const cardBackWord = cardBack.querySelector('h1');
const cardBackExample = cardBack.querySelector('span');
const sliderControls = document.querySelector('.slider-controls');
const examCards = document.querySelector('#exam-cards');
const resultsModal = document.querySelector('.results-modal');
const boxResultsContent = document.querySelector('.results-content');
const resultExamTime = document.querySelector('#timer');
const templateWordStats = document.querySelector('#word-stats');

let studyMode = 'testing';
let wordCounter = 0;

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
};

function createArray() {
    if (resultTestMode) {
        fiveWords = resultTestMode.orderOfCards;
        numberCurrentWord.textContent = resultTestMode.numberWord;
        wordsProgress.value = resultTestMode.progressWord;
        wordCounter = resultTestMode.counter;
        back.disabled = testModeData.btnBack;
        next.disabled = testModeData.btnNext;
        defineAttribute();
    } else {
        while (fiveWords.length <= 4) {
            const randomWord = words[getRandomInt(words.length)];
            if (!fiveWords.includes(randomWord)) {
                fiveWords.push(randomWord);
            };
        };
        wordsProgress.value += 20;
    };
    insertWord();
    setTestModeData();
    return fiveWords;
};

const arrayFiveWords = createArray();

function insertWord() {
    cardFrontWord.textContent = fiveWords[wordCounter].wordEng;
    cardBackWord.textContent = fiveWords[wordCounter].wordRus;
    cardBackExample.textContent = fiveWords[wordCounter].usageExample;
};

sliderTestCard.addEventListener('click', (event) => {
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
    setTestModeData();
};

shuffleWords.addEventListener('click', shuffle);

function defineAttribute() {
    if (wordCounter <= 0) {
        back.disabled = true;
        next.disabled = false;
    } else if (wordCounter >= 4) {
        next.disabled = true;
    } else if (wordCounter >= 1) {
        back.disabled = false;
        next.disabled = false;
    };

    setTestModeData();
};

sliderControls.addEventListener('click', (event) => {
    const button = event.target.id;

    if (button === 'back') {
        wordCounter--;
        numberCurrentWord.textContent--;
        insertWord();
        defineAttribute();
        wordsProgress.value -= 20;
        setTestModeData();
    };

    if (button === 'exam') {
        studyMode = 'examination';
        determineMode();
        insertCards();
        startTimer();
        localStorage.setItem('mode', 'examMode');
    };

    if (button === 'next') {
        wordCounter++;
        numberCurrentWord.textContent++;
        insertWord();
        defineAttribute();
        wordsProgress.value += 20;
        setTestModeData();
    };
});

function switchExamMode() {
    testMode.classList.add('hidden');
    boxTestCards.classList.add('hidden');
    examMode.classList.remove('hidden');
};

function determineMode() {
    if (studyMode === 'examination') {
        switchExamMode();
    } else if (studyMode === 'statistics') {
        resultsModal.classList.remove('hidden');
    } else if (studyMode === 'testing') {
        testMode.classList.remove('hidden');
        boxTestCards.classList.remove('hidden');
        resultsModal.classList.add('hidden');
    };
};

if (mode === 'examMode') { 
    switchExamMode();
    examTimer.textContent = savedTimer ? savedTimer : '00:00';
    startTimer();
};

if (mode === 'statistics') { 
    resultsModal.classList.remove('hidden');
    switchExamMode();

    const fragment = new DocumentFragment();
    resultExamMode.statistics.forEach(({ word, attempts }) => {
        const wordStats = templateWordStats.content.cloneNode(true);
        wordStats.querySelector('.word').querySelector('span').textContent = word;
        wordStats.querySelector('.attempts').querySelector('span').textContent = attempts;
        fragment.append(wordStats);
    });
    boxResultsContent.append(fragment);

    resultExamTime.textContent = savedTimer;
    examTimer.textContent = savedTimer;
};

function insertCards() {
    const fragment = new DocumentFragment();

    fiveWords.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('drac');
        card.id = item.wordEng;
        card.textContent = item.wordEng;
        fragment.append(card);
    });

    fiveWords.forEach((item) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('drac');
        card.id = item.wordEng;
        card.textContent = item.wordRus;
        fragment.append(card);
    });

    Array.from(fragment.querySelectorAll('div')).sort(() => Math.random() - 0.5).forEach((item) => {
        examCards.append(item)
    });
};

let timerId = 0;

function startTimer() {
    let minutes = +examTimer.textContent.slice(0, 2);
    let seconds = +examTimer.textContent.slice(3, 5);

    timerId = setInterval(() => {
        seconds++;
        if (seconds === 59) {
            minutes++;
            seconds = 0;
        };

        const time = `${format(minutes)}:${format(seconds)}`;
        examTimer.textContent = time;
        localStorage.setItem('timer', time);
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

let clickCounter = 0;
let attemptCounter = 0;

let firstCard = '';
let firstCardId = '';
let secondCard = '';
let secondCardId = '';

let totalPercent = resultExamMode ? resultExamMode.percent : 0;
correctPercent.textContent = `${totalPercent}%`;
examProgress.value = totalPercent;

function testKnowledge(event) {
    clickCounter++;

    let card = event.target;
    let cardId = event.target.id;

    if (card.classList.contains('drac')) {
        if (clickCounter === 1) {
            firstCard = card;
            firstCardId = cardId;
            firstCard.classList.add('correct');
            firstCard.classList.remove('drac');
        } else if (clickCounter === 2) {
            secondCard = card;
            secondCardId = cardId;
            attemptCounter++;
            if (firstCardId === secondCardId) {
                secondCard.classList.add('correct');
                secondCard.classList.add('fade-out');
                secondCard.classList.remove('drac');
                firstCard.classList.add('fade-out');
                clickCounter = 0;
                totalPercent += 20;
                correctPercent.textContent = `${totalPercent}%`;
                examProgress.value += 20;
                const fragment = new DocumentFragment();
                const wordStats = templateWordStats.content.cloneNode(true);
                wordStats.querySelector('.word').querySelector('span').textContent = firstCardId;
                wordStats.querySelector('.attempts').querySelector('span').textContent = attemptCounter;
                setExamModeData();
                fragment.append(wordStats);
                boxResultsContent.append(fragment);
                attemptCounter = 0;
            } else {
                clickCounter = 0;
                secondCard.classList.add('wrong');
                setTimeout(() => {
                    secondCard.classList.remove('wrong');
                    firstCard.classList.remove('correct');
                }, 500);
                firstCard.classList.add('drac');
            };
        };
    } else {
        if (clickCounter === 1) {
            clickCounter = 0;
        } else if (clickCounter === 2) {
            clickCounter = 1;
        };
    };

    if (totalPercent === 100) {
        setTimeout(() => {
            stopTimer();
        }, 0);
        examCards.innerHTML = '';
        studyMode = 'statistics';
        determineMode();
        localStorage.setItem('mode', 'statistics');
        resultExamTime.textContent = examTimer.textContent;
    };
};

examCards.addEventListener('click', (event) => {
    testKnowledge(event);
});

function setTestModeData() {
    testModeData.numberWord = numberCurrentWord.textContent;
    testModeData.progressWord = wordsProgress.value;
    testModeData.counter = wordCounter;
    testModeData.btnBack = back.disabled;
    testModeData.btnNext = next.disabled;
    testModeData.orderOfCards = fiveWords;
    localStorage.setItem('testModeData', JSON.stringify(testModeData));
};

function setExamModeData() {
    examModeData.percent = totalPercent;
    const stats = {};
    stats.word = firstCardId;
    stats.attempts = attemptCounter;
    examStatistics.push(stats);
    examModeData.statistics = examStatistics;
    localStorage.setItem('examModeData', JSON.stringify(examModeData));
};

logo.addEventListener('click', () => {
    localStorage.clear();
    studyMode = 'testing';
    determineMode();
});