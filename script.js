function getURLParameter(name) {
    return new URLSearchParams(window.location.search).get(name);
}
var wordsContainer = document.getElementById('animated-words');
var sentenceContainer = document.querySelector('.rotating-text > p:first-child');
// Default sentence and words if no URL parameter is provided
var defaultSentence = 'Add Sentence';
var defaultWords = [
    { text: 'awesome.', color: 'alizarin' },
    { text: 'beautiful.', color: 'wisteria' },
    { text: 'creative.', color: 'peter-river' },
    { text: 'fabulous.', color: 'emerald' },
    { text: 'interesting.', color: 'sun-flower' },
];
// Fetch custom sentence and words from URL parameters
var customSentenceParam = getURLParameter('sentence');
var customWordsParam = getURLParameter('words');
var customSentence = customSentenceParam ? customSentenceParam : defaultSentence;
var customWords = customWordsParam ? JSON.parse(customWordsParam) : defaultWords;
// Set the custom sentence
sentenceContainer.textContent = customSentence;
// Add words to the DOM
customWords.forEach(function (word) {
    var span = document.createElement('span');
    span.className = "word ".concat(word.color);
    word.text.split('').forEach(function (letter) {
        var letterSpan = document.createElement('span');
        letterSpan.textContent = letter;
        letterSpan.className = 'letter';
        span.append(letterSpan);
    });
    wordsContainer === null || wordsContainer === void 0 ? void 0 : wordsContainer.append(span);
});
var words = document.querySelectorAll(".word");
var currentWordIndex = 0;
var maxWordIndex = words.length - 1;
words[currentWordIndex].style.opacity = "1";
var rotateText = function () {
    var currentWord = words[currentWordIndex];
    var nextWord = currentWordIndex === maxWordIndex ? words[0] : words[currentWordIndex + 1];
    Array.from(currentWord.children).forEach(function (letter, i) {
        setTimeout(function () {
            letter.className = "letter out";
        }, i * 80);
    });
    nextWord.style.opacity = "1";
    Array.from(nextWord.children).forEach(function (letter, i) {
        letter.className = "letter behind";
        setTimeout(function () {
            letter.className = "letter in";
        }, 340 + i * 80);
    });
    currentWordIndex = currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
};
rotateText();
setInterval(rotateText, 4000);
