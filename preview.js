document.addEventListener("DOMContentLoaded", function () {
  let wordCount = 1;

  // Function to add a new word input field
  document.querySelector(".add-button").addEventListener("click", function () {
    wordCount++;
    addWordField(wordCount);
    updateLabels(); // Update labels after adding a new word
  });

  // Function to remove a word input field
  window.removeWord = function (button) {
    const wordDiv = button.parentElement;
    wordDiv.remove();
    updateLabels(); // Update labels after removing a word
    updatePreview(); // Update the preview after removing a word
  };

  // Function to add a new word input field dynamically
  function addWordField(count) {
    const wordsContainer = document.createElement("div");
    wordsContainer.className = "words-container";
    wordsContainer.innerHTML = `
            <label for="word-${count}" class="word-label">Word ${count}: </label>
            <input type="text" id="word-${count}" name="word[]" class="word-input">
            <input type="color" id="color-${count}" name="color[]" class="color-input">
            <button type="button" class="del-button" onclick="removeWord(this)">
                <i class="fa-solid fa-trash" style="color: #c10606;"></i>
            </button>
        `;

    // Insert the new word-container before the add button
    document
      .querySelector(".add-button")
      .insertAdjacentElement("beforebegin", wordsContainer);

    // Add event listeners for the new inputs to update the preview dynamically
    wordsContainer
      .querySelector(".word-input")
      .addEventListener("input", updatePreview);
    wordsContainer
      .querySelector(".color-input")
      .addEventListener("input", updatePreview);
  }

  // Function to update the labels to ensure they are in numeric order
  function updateLabels() {
    const wordLabels = document.querySelectorAll(".word-label");
    wordLabels.forEach((label, index) => {
      label.textContent = `Word ${index + 1}: `;
    });
  }

  // Function to update the preview and generate Markdown
  function updatePreview() {
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
  }

  // Function to generate Markdown link
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

  // Event listeners for the initial input elements to update the preview dynamically
  document.getElementById("sentence").addEventListener("input", updatePreview);
  document.querySelectorAll(".word-input").forEach((input) => {
    input.addEventListener("input", updatePreview);
  });
  document.querySelectorAll(".color-input").forEach((input) => {
    input.addEventListener("input", updatePreview);
  });

  updatePreview(); // Initial preview generation
});
