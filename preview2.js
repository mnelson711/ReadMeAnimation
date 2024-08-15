document.addEventListener("DOMContentLoaded", function () {
  // Check for URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sentenceParam = urlParams.get("sentence");
    const wordsParam = urlParams.get("words");

    const fontParam = urlParams.get("font");
    const fontSizeParam = urlParams.get("fontSize");
    const letterSpacingParam = urlParams.get("letterSpacing");
    const sentenceColorParam = urlParams.get("sentenceColor");
    const bgColorParam = urlParams.get("bgColor");
    console.log('sentence: ', sentenceParam);
    console.log("words: ", wordsParam);

  if (sentenceParam && wordsParam) {
    // If parameters are present, handle the animation-only view
    console.log("Params detected. Hiding generator, showing animation.");
    document.getElementById("generator").style.display = "none";
    document.getElementById("animation").style.display = "block";

    loadAnimationFromURL(
        sentenceParam,
        wordsParam,
        fontParam,
        fontSizeParam,
        letterSpacingParam,
        sentenceColorParam,
        bgColorParam
    );
  } else {
    // Otherwise, show the full form for customization
    console.log("No params detected. Showing generator form.");
    document.getElementById("generator").style.display = "flex";
    document.getElementById("animation").style.display = "none";

    setupFormInteractions();
  }

  // Function to load and apply the animation from the URL parameters
  function loadAnimationFromURL(
    sentenceParam,
    wordsParam,
    font,
    fontSize,
    letterSpacing,
    sentenceColor,
    bgColor,
  ) {
    console.log(sentenceParam)
    const words = JSON.parse(decodeURIComponent(wordsParam));
    const sentence = sentenceParam.replace(/%20/g, " ");
    console.log(sentence);
    const previewSentence = document.getElementById("animation-sentence");
    const previewWordsContainer = document.getElementById("animation-words");

    // Update the animation sentence
    previewSentence.textContent = sentence;
    previewSentence.style.fontFamily = font || "inherit";
    previewSentence.style.fontSize = fontSize || "inherit";
    previewSentence.style.letterSpacing = letterSpacing || "inherit";
    previewSentence.style.color = sentenceColor || "#000000";
    previewWordsContainer.style.backgroundColor = bgColor || "transparent";

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
      setInterval(rotateText, 4000); //TO UPDATE SPEED TODO
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
        const fontInput = document.getElementById("font").value;
        const fontSizeInput = document.getElementById("fontSize").value;
        const letterSpacingInput =
            document.getElementById("letterSpacing").value;
        const sentenceColorInput = document.getElementById(
            "sentenceColorPicker"
        ).value;
        const bgColorInput = document.getElementById("bgColorPicker").value;

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
      const url = generatePreviewURL(
        sentenceInput,
        words,
        colors,
        fontInput,
        fontSizeInput,
        letterSpacingInput,
        sentenceColorInput,
        bgColorInput
      );

      // Simulate loading the URL within the preview area
      loadPreviewFromForm(
        sentenceInput,
        words,
        colors,
        fontInput,
        fontSizeInput,
        letterSpacingInput,
        sentenceColorInput,
        bgColorInput
      );

      // Update the generated Markdown link
      const markdownLink = generateMarkdownLink(url);
      document.getElementById("generated-markdown").value = markdownLink;
    }

    // Function to load and apply the preview from the form inputs
    function loadPreviewFromForm(
      sentence,
      words,
      colors,
      font,
      fontSize,
      letterSpacing,
      sentenceColor,
      bgColor
    ) {
      const previewSentence = document.getElementById("preview-sentence");
      const previewWordsContainer = document.getElementById("preview-words");

      // Update the preview sentence
        previewSentence.textContent = sentence;
        previewSentence.style.fontFamily = font || "inherit";
        previewSentence.style.fontSize = fontSize || "inherit";
        previewSentence.style.letterSpacing = letterSpacing || "inherit";
        previewSentence.style.color = sentenceColor || "#000000";
        previewWordsContainer.style.backgroundColor =
            bgColor || "transparent";

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
    function generatePreviewURL(
      sentence,
      words,
      colors,
      font,
      fontSize,
      letterSpacing,
      sentenceColor,
      bgColor
    ) {
      const encodedSentence = encodeURIComponent(sentence);
      const wordObjects = words.map((word, index) => {
        return {
          text: word,
          color: colors[index] || "#000000", // Default to black if no color is set
        };
      });
      const encodedWords = encodeURIComponent(JSON.stringify(wordObjects));
      const baseUrl = window.location.origin + window.location.pathname;

      
      const params = new URLSearchParams({
        sentence: encodedSentence,
        words: encodedWords,
        font: font,
        fontSize: fontSize,
        letterSpacing: letterSpacing,
        sentenceColor: sentenceColor,
        bgColor: bgColor,
      });

      return `${baseUrl}?${params.toString()}`;
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

    document
        .getElementById("font")
        .addEventListener("input", updatePreview);
    document
        .getElementById("fontSize")
        .addEventListener("input", updatePreview);
    document
        .getElementById("letterSpacing")
        .addEventListener("input", updatePreview);
    document
        .getElementById("sentenceColorPicker")
        .addEventListener("input", updatePreview);
    document
        .getElementById("bgColorPicker")
        .addEventListener("input", updatePreview);

      const sentenceColorPicker = document.getElementById(
        "sentenceColorPicker"
      );
      const sentenceColorText = document.getElementById("sentenceColorText");

      // Update the text input when the color picker changes
      sentenceColorPicker.addEventListener("input", function () {
        sentenceColorText.value = sentenceColorPicker.value.toUpperCase();
      });

      // Update the color picker when the text input changes
      sentenceColorText.addEventListener("input", function () {
        const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(
          sentenceColorText.value
        );
        if (isValidHex) {
          sentenceColorPicker.value = sentenceColorText.value;
        }
      });

        const bgColorPicker = document.getElementById("bgColorPicker");
        const bgColorText = document.getElementById("bgColorText");

        // Update the text input when the color picker changes
        bgColorPicker.addEventListener("input", function () {
          bgColorText.value = bgColorPicker.value.toUpperCase();
        });

        // Update the color picker when the text input changes
        bgColorText.addEventListener("input", function () {
          const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(bgColorText.value);
          if (isValidHex) {
            bgColorPicker.value = bgColorText.value;
          }
        });

      // Optional: Ensure valid input and format hex code correctly
      colorText.addEventListener("blur", function () {
        let color = colorText.value;
        if (!color.startsWith("#")) {
          color = "#" + color;
        }
        if (color.length === 4 || color.length === 7) {
          colorText.value = color.toUpperCase();
        } else {
          // Reset to default if the input is invalid
          colorText.value = colorPicker.value.toUpperCase();
        }
      });


    updatePreview(); // Initial preview generation
  }
});
