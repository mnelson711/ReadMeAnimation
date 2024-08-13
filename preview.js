document.addEventListener("DOMContentLoaded", function () {
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
      span.style.color = word.color;
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
    document.getElementById("animation").style.display = "none";

    let wordCount = 1;

    document
      .getElementById("add-word-btn")
      .addEventListener("click", function () {
        wordCount++;
        const wordsContainer = document.getElementById("words-container");

        const newWordDiv = document.createElement("div");
        newWordDiv.className = "formbold-input-wrapp formbold-mb-3";

        newWordDiv.innerHTML = `
                <label for="word-${wordCount}" class="formbold-form-label"> Word ${wordCount} </label>
                <input type="text" id="word-${wordCount}" name="word[]" class="formbold-form-input">
                <label for="color-${wordCount}" class="formbold-form-label"> Color ${wordCount} </label>
                <input type="color" id="color-${wordCount}" name="color[]" class="formbold-form-input-color">
                <button type="button" class="formbold-btn remove-word-btn" onclick="removeWord(this)">Remove</button>
            `;

        wordsContainer.appendChild(newWordDiv);
      });

    document
      .getElementById("generate-preview")
      .addEventListener("click", function () {
        const sentenceInput = document.getElementById("sentence").value;
        const wordsInputs = document.getElementsByName("word[]");
        const colorsInputs = document.getElementsByName("color[]");

        const words = [];
        const colors = [];

        for (let i = 0; i < wordsInputs.length; i++) {
          if (wordsInputs[i].value && colorsInputs[i].value) {
            words.push(wordsInputs[i].value);
            colors.push(colorsInputs[i].value);
          }
        }

        const previewSentence = document.getElementById("preview-sentence");
        const previewWordsContainer = document.getElementById("preview-words");

        // Update the preview sentence
        previewSentence.textContent = sentenceInput;

        // Clear the current preview words
        previewWordsContainer.innerHTML = "";

        // Add new words to the preview
        words.forEach((word, index) => {
          const span = document.createElement("span");
          span.style.color = colors[index];
          word.split("").forEach((letter) => {
            const letterSpan = document.createElement("span");
            letterSpan.textContent = letter;
            letterSpan.className = "letter";
            span.appendChild(letterSpan);
          });
          previewWordsContainer.appendChild(span);
        });

        // Generate the Markdown link
        const markdownLink = generateMarkdownLink(sentenceInput, words, colors);
        document.getElementById("generated-markdown").value = markdownLink;

        // Reapply animation
        applyAnimation();
      });
  }
});

function getURLParameter(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function removeWord(button) {
  const wordDiv = button.parentElement;
  wordDiv.remove();
}

function generateMarkdownLink(sentence, words, colors) {
  const encodedSentence = encodeURIComponent(sentence);
  const wordObjects = words.map((word, index) => {
    return {
      text: word,
      color: colors[index] || "#000000", // Default to black if no color is set
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
