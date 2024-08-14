document.addEventListener("DOMContentLoaded", function () {
  // Check for URL Parameters
  const urlParams = new URLSearchParams(window.location.search);
  const sentenceParam = urlParams.get("sentence");
  const wordsParam = urlParams.get("words");

  if (sentenceParam && wordsParam) {
    // If parameters are present, handle the animation-only view
    console.log("Params detected. Hiding generator, showing animation.");
    document.getElementById("generator").style.display = "none";
    document.getElementById("animation").style.display = "block";

    loadAnimationFromURL(sentenceParam, wordsParam);
  } else {
    // Otherwise, show the full form for customization
    console.log("No params detected. Showing generator form.");
    document.getElementById("generator").style.display = "flex";
    document.getElementById("animation").style.display = "none";

    setupFormInteractions();
  }

  // Function to load and apply the animation from the URL parameters
  function loadAnimationFromURL(sentence, wordsParam) {
    const words = JSON.parse(decodeURIComponent(wordsParam));

    const previewSentence = document.getElementById("animation-sentence");
    const previewWordsContainer = document.getElementById("animation-words");

    // Update the animation sentence
    previewSentence.textContent = sentence;
    console.log(previewSentence.textContent);

    // Clear the current animation words
    previewWordsContainer.innerHTML = "";

    // Add new words to the animation with the specified colors
    words.forEach((wordObj) => {
      const span = document.createElement("span");
      span.style.color = wordObj.color;
      span.className = "word";
      wordObj.text.split("").forEach((letter) => {
        const letterSpan = document.createElement("span");
        letterSpan.textContent = letter;
        letterSpan.className = "letter";
        span.appendChild(letterSpan);
      });
      previewWordsContainer.appendChild(span);
    });

    // Apply the animation
    applyAnimationToWords(previewWordsContainer.querySelectorAll(".word"));
  }

  // Function to apply animation to the words in the animation-only view
  function applyAnimationToWords(words) {
    let currentWordIndex = 0;
    const maxWordIndex = words.length - 1;

    // Reset all words to the initial state
    words.forEach((word) => {
      word.style.opacity = "0"; // Hide all words initially
      Array.from(word.children).forEach((letter) => {
        letter.className = "letter"; // Reset class names to remove any previous animation state
      });
    });

    if (words.length > 0) {
      words[currentWordIndex].style.opacity = "1"; // Show the first word

      const rotateText = () => {
        const currentWord = words[currentWordIndex];
        const nextWord =
          currentWordIndex === maxWordIndex
            ? words[0]
            : words[currentWordIndex + 1];

        // Animate the current word out
        Array.from(currentWord.children).forEach((letter, i) => {
          setTimeout(() => {
            letter.className = "letter out"; // Rotate out the letters of the current word
          }, i * 80);
        });

        // After a short delay, animate the next word in
        setTimeout(() => {
          nextWord.style.opacity = "1";
          Array.from(nextWord.children).forEach((letter, i) => {
            letter.className = "letter behind"; // Prepare the letters of the next word
            setTimeout(() => {
              letter.className = "letter in"; // Rotate in the letters of the next word
            }, i * 80);
          });
        }, 500);

        currentWordIndex =
          currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
      };

      rotateText(); // Start the initial rotation
      setInterval(rotateText, 4000); // Continue rotating every 4 seconds
    }
  }

  // Function to set up form interactions on the preview page
  function setupFormInteractions() {
    let wordCount = 1;

    // Function to add a new word input field
    document
      .querySelector(".add-button")
      .addEventListener("click", function () {
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

    // Function to update the preview and simulate URL call
    function updatePreview() {
      const sentenceInput = document.getElementById("sentence").value;
      const wordsInputs = document.getElementsByName("word[]");
      const colorsInputs = document.getElementsByName("color[]");

      if (
        !wordsInputs ||
        !colorsInputs ||
        wordsInputs.length === 0 ||
        colorsInputs.length === 0
      ) {
        console.error("Word or color inputs not found or are empty.");
        return;
      }

      const words = [];
      const colors = [];

      for (let i = 0; i < wordsInputs.length; i++) {
        if (wordsInputs[i].value && colorsInputs[i].value) {
          words.push(wordsInputs[i].value);
          colors.push(colorsInputs[i].value);
        }
      }

      // Generate the URL with the current parameters
      const url = generatePreviewURL(sentenceInput, words, colors);

      // Simulate loading the URL within the preview area
      loadPreviewFromForm(sentenceInput, words, colors);

      // Update the generated Markdown link
      const markdownLink = generateMarkdownLink(url);
      document.getElementById("generated-markdown").value = markdownLink;
    }

    // Function to load and apply the preview from the form inputs
    function loadPreviewFromForm(sentence, words, colors) {
      const previewSentence = document.getElementById("preview-sentence");
      const previewWordsContainer = document.getElementById("preview-words");

      // Update the preview sentence
      previewSentence.textContent = sentence;

      // Clear the current preview words
      previewWordsContainer.innerHTML = "";

      // Add new words to the preview with animation
      words.forEach((word, index) => {
        const span = document.createElement("span");
        span.style.color = colors[index];
        span.className = "word";
        word.split("").forEach((letter) => {
          const letterSpan = document.createElement("span");
          letterSpan.textContent = letter;
          letterSpan.className = "letter";
          span.appendChild(letterSpan);
        });
        previewWordsContainer.appendChild(span);
      });

      // Apply the animation
      applyAnimationToWords(previewWordsContainer.querySelectorAll(".word"));
    }

    // Function to generate the preview URL
    function generatePreviewURL(sentence, words, colors) {
      const encodedSentence = encodeURIComponent(sentence);
      const wordObjects = words.map((word, index) => {
        return {
          text: word,
          color: colors[index] || "#000000", // Default to black if no color is set
        };
      });
      const encodedWords = encodeURIComponent(JSON.stringify(wordObjects));
      const baseUrl = window.location.origin + window.location.pathname;

      return `${baseUrl}?sentence=${encodedSentence}&words=${encodedWords}`;
    }

    // Function to generate Markdown link
    function generateMarkdownLink(url) {
      return `![Rotating Text Animation](${url})`;
    }

    // Event listeners for the initial input elements to update the preview dynamically
    document
      .getElementById("sentence")
      .addEventListener("input", updatePreview);
    document.querySelectorAll(".word-input").forEach((input) => {
      input.addEventListener("input", updatePreview);
    });
    document.querySelectorAll(".color-input").forEach((input) => {
      input.addEventListener("input", updatePreview);
    });

    updatePreview(); // Initial preview generation
  }
});
