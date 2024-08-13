function getURLParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

const sentenceParam = getURLParameter("sentence");
const wordsParam = getURLParameter("words");

if (sentenceParam && wordsParam) {
  // Animation mode
  document.getElementById("generator").style.display = "none";
  document.getElementById("animation").style.display = "block";

  const animationSentence = document.getElementById("animation-sentence");
  const animationWordsContainer = document.getElementById("animation-words");

  const words = JSON.parse(decodeURIComponent(wordsParam));

  animationSentence.textContent = sentenceParam;

  words.forEach((word) => {
    const span = document.createElement("span");
    span.className = `word ${word.color}`;
    word.text.split("").forEach((letter) => {
      const letterSpan = document.createElement("span");
      letterSpan.textContent = letter;
      letterSpan.className = "letter";
      span.appendChild(letterSpan);
    });
    animationWordsContainer.appendChild(span);
  });

  applyAnimation();
} else {
  // Generator mode
  document.getElementById("generator").style.display = "block";

  document
    .getElementById("generate-preview")
    .addEventListener("click", function () {
      const sentenceInput = document.getElementById("sentence").value;
      const wordsInput = document.getElementById("words").value.split(",");
      const colorsInput = document.getElementById("colors").value.split(",");

      const previewSentence = document.getElementById("preview-sentence");
      const previewWordsContainer = document.getElementById("preview-words");

      // Update the preview sentence
      previewSentence.textContent = sentenceInput;

      // Clear the current preview words
      previewWordsContainer.innerHTML = "";

      // Add new words to the preview
      wordsInput.forEach((word, index) => {
        const span = document.createElement("span");
        span.className = `word ${colorsInput[index] || "alizarin"}`;
        word.split("").forEach((letter) => {
          const letterSpan = document.createElement("span");
          letterSpan.textContent = letter;
          letterSpan.className = "letter";
          span.appendChild(letterSpan);
        });
        previewWordsContainer.appendChild(span);
      });

      // Generate the Markdown link
      const markdownLink = generateMarkdownLink(
        sentenceInput,
        wordsInput,
        colorsInput
      );
      document.getElementById("generated-markdown").value = markdownLink;

      // Reapply animation
      applyAnimation();
    });
}

function generateMarkdownLink(sentence, words, colors) {
  const encodedSentence = encodeURIComponent(sentence);
  const wordObjects = words.map((word, index) => {
    return {
      text: word,
      color: colors[index] || "alizarin",
    };
  });
  const encodedWords = encodeURIComponent(JSON.stringify(wordObjects));
  const baseUrl = window.location.origin + window.location.pathname;
  return `![Rotating Text Animation](${baseUrl}?sentence=${encodedSentence}&words=${encodedWords})`;
}

function applyAnimation() {
  const words = document.querySelectorAll(".word");
  let currentWordIndex = 0;
  const maxWordIndex = words.length - 1;
  words[currentWordIndex].style.opacity = "1";

  const rotateText = () => {
    const currentWord = words[currentWordIndex];
    const nextWord =
      currentWordIndex === maxWordIndex
        ? words[0]
        : words[currentWordIndex + 1];

    Array.prototype.slice.call(currentWord.children).forEach((letter, i) => {
      setTimeout(() => {
        letter.className = "letter out";
      }, i * 80);
    });

    nextWord.style.opacity = "1";
    Array.prototype.slice.call(nextWord.children).forEach((letter, i) => {
      letter.className = "letter behind";
      setTimeout(() => {
        letter.className = "letter in";
      }, 340 + i * 80);
    });

    currentWordIndex =
      currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
  };

  rotateText();
  setInterval(rotateText, 4000);
}

if (!sentenceParam || !wordsParam) {
  applyAnimation(); // Apply animation initially for the default preview
}
