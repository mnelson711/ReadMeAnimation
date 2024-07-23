function getURLParameter(name: string): string | null {
    return new URLSearchParams(window.location.search).get(name);
}

const wordsContainer = document.getElementById('animated-words');

interface Word {
    text: string;
    color: string;
}

const defaultWords: Word[] = [
    { text: 'so cool.', color: 'alizarin' },
    { text: 'gaming.', color: 'wisteria' },
    { text: 'creative.', color: 'peter-river' },
    { text: 'fabulous.', color: 'emerald' },
    { text: 'interesting.', color: 'sun-flower' },
];

let customWordsParam = getURLParameter('words');
let customWords: Word[] = customWordsParam ? JSON.parse(customWordsParam) : defaultWords;

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
