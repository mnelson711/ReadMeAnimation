function getURLParameter(name: string): string | null {
    return new URLSearchParams(window.location.search).get(name);
}

const wordsContainer = document.getElementById('animated-words');
const sentenceContainer = document.querySelector('.rotating-text > p:first-child') as HTMLElement;

interface Word {
    text: string;
    color: string;
}

// Default sentence and words if no URL parameter is provided
const defaultSentence = 'Add Sentence';
const defaultWords: Word[] = [
    { text: 'awesome.', color: 'alizarin' },
    { text: 'beautiful.', color: 'wisteria' },
    { text: 'creative.', color: 'peter-river' },
    { text: 'fabulous.', color: 'emerald' },
    { text: 'interesting.', color: 'sun-flower' },
];

// Fetch custom sentence and words from URL parameters
let customSentenceParam = getURLParameter('sentence');
let customWordsParam = getURLParameter('words');

let customSentence = customSentenceParam ? customSentenceParam : defaultSentence;
let customWords: Word[] = customWordsParam ? JSON.parse(customWordsParam) : defaultWords;

// Set the custom sentence
sentenceContainer.textContent = customSentence;

// Add words to the DOM
customWords.forEach(word => {
    let span = document.createElement('span');
    span.className = `word ${word.color}`;
    word.text.split('').forEach(letter => {
        let letterSpan = document.createElement('span');
        letterSpan.textContent = letter;
        letterSpan.className = 'letter';
        span.append(letterSpan);
    });
    wordsContainer?.append(span);
});

let words = document.querySelectorAll(".word");
let currentWordIndex = 0;
let maxWordIndex = words.length - 1;
(words[currentWordIndex] as HTMLElement).style.opacity = "1";

let rotateText = () => {
    let currentWord = words[currentWordIndex];
    let nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];

    Array.from(currentWord.children).forEach((letter, i) => {
        setTimeout(() => {
            letter.className = "letter out";
        }, i * 80);
    });

    (nextWord as HTMLElement).style.opacity = "1";
    Array.from(nextWord.children).forEach((letter, i) => {
        letter.className = "letter behind";
        setTimeout(() => {
            letter.className = "letter in";
        }, 340 + i * 80);
    });

    currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};

rotateText();
setInterval(rotateText, 4000);
