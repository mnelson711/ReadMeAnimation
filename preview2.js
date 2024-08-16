document.addEventListener("DOMContentLoaded", function () {
  // Check for URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sentenceParam = urlParams.get("sentence");
    const wordsParam = urlParams.get("words");

    const fontParam = urlParams.get("font");
    const fontSizeParam = urlParams.get("fontSize");
    const letterSpacingParam = urlParams.get("letterSpacing");
    const intervalParam = urlParams.get("interval");
    const widthParam = urlParams.get("width");
    const heightParam = urlParams.get("height");
    
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
        intervalParam,
        widthParam,
        heightParam,
        sentenceColorParam,
        bgColorParam
    );
  } else {
    // Otherwise, show the full form for customization

    //default values:

    const defaultParams = {
      sentence: "Coding is super ",
      words: ["Cool", "Awesome", "Amazing"],
      colors: ["#FF0000", "#00FF00", "#DE12B8"],
      font: "Arial",
      fontSize: "24",
      letterSpacing: "2px",
      interval: 4000,
      sentenceColor: "#DE12B8",
      bgColor: "#FFFFFF",
      height: "300",
      width: "600",
    };

    const {
      sentence,
      words,
      colors,
      font,
      fontSize,
      letterSpacing,
      interval,
      sentenceColor,
      bgColor,
      height,
      width,
    } = defaultParams;

    // Set default values for text areas and inputs
    document.getElementById("sentence").value = sentence;

    // Function to load and apply the preview from the form inputs
    function loadPreviewFromForm(
      sentence,
      words,
      colors,
      font,
      fontSize,
      letterSpacing,
      interval,
      width,
      height,
      sentenceColor,
      bgColor
    ) {
      const previewSentence = document.getElementById("preview-sentence");
      const previewWordsContainer = document.getElementById("preview-words");
      const previewContainerPreview = document.getElementById(
        "preview-container-preview"
      );

      // Update the preview sentence
      let parsedFontSize = fontSize.toString() + "px";
      previewSentence.textContent = sentence;
      previewSentence.style.fontFamily = font || "inherit";
      previewSentence.style.fontSize = parsedFontSize || "inherit";
      previewSentence.style.letterSpacing = letterSpacing || "inherit";
      previewSentence.style.color = sentenceColor || "#000000";

      previewContainerPreview.style.backgroundColor = bgColor || "transparent";
      previewContainerPreview.style.height = height ? `${height}px` : "auto";
      previewContainerPreview.style.width = width ? `${width}px` : "auto";

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
      applyAnimationToWords(
        previewWordsContainer.querySelectorAll(".word"),
        interval
      );
    }

    // Function to generate the preview URL
    function generatePreviewURL(
      sentence,
      words,
      colors,
      font,
      fontSize,
      letterSpacing,
      interval,
      width,
      height,
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
        interval: interval,
        width: width,
        height: height,
        sentenceColor: sentenceColor,
        bgColor: bgColor,
      });

      return `${baseUrl}?${params.toString()}`;
    }

    // Function to generate Markdown link
    function generateMarkdownLink(url) {
      return `![Rotating Text Animation](${url})`;
    }

    function updatePreview() {
      const sentenceInput = document.getElementById("sentence").value;
      const wordsInputs = document.getElementsByName("word[]");
      const colorsInputs = document.getElementsByName("color[]");
      const fontInput = document.getElementById("font").value;
      const fontSizeInput = document.getElementById("fontSize").value;
      const letterSpacingInput = document.getElementById("letterSpacing").value;
      const intervalInput = document.getElementById("interval").value;
      const heightInput = document.getElementById("height").value;
      const widthInput = document.getElementById("width").value;
      const sentenceColorInput = document.getElementById(
        "sentenceColorPicker"
      ).value;
      const bgColorInput = document.getElementById("bgColorPicker").value;

      console.log("width on update: ", widthInput);
      console.log("font on update: ", fontInput);

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
        intervalInput,
        widthInput,
        heightInput,
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
        intervalInput,
        widthInput,
        heightInput,
        sentenceColorInput,
        bgColorInput
      );

      // Update the generated Markdown link
      const markdownLink = generateMarkdownLink(url);
      document.getElementById("generated-markdown").value = markdownLink;
    }

    // Populate words and colors fields
    // Function to initialize default word and color inputs

    function addWordField(word, color) {
      const wordsContainer = document.createElement("div");
      wordsContainer.className = "words-container";
      wordsContainer.innerHTML = `
            <label for="word-${
              document.querySelectorAll(".words-container").length + 1
            }" class="word-label">Word ${
        document.querySelectorAll(".words-container").length + 1
      }: </label>
            <input type="text" id="word-${
              document.querySelectorAll(".words-container").length + 1
            }" name="word[]" class="word-input" value="${word}">
            <input type="color" id="color-${
              document.querySelectorAll(".words-container").length + 1
            }" name="color[]" class="color-input" value="${color}">
            <button type="button" class="del-button" onclick="removeWord(this)">
                <i class="fa-solid fa-trash" style="color: #c10606;"></i>
            </button>
        `;
      document
        .querySelector(".add-button")
        .insertAdjacentElement("beforebegin", wordsContainer);

      // Add event listeners for the new inputs
      wordsContainer
        .querySelector(".word-input")
        .addEventListener("input", updatePreview);
      wordsContainer
        .querySelector(".color-input")
        .addEventListener("input", updatePreview);
    }
    function initializeWordFields() {
      words.forEach((word, index) => {
        addWordField(word, colors[index] || "#000000"); // Use default color if not provided
      });
      console.log("intializing words");
    }

    // wordInputs.forEach((input, index) => {
    //     if (index < words.length) {
    //         input.value = words[index];
    //     }
    // });

    // colorInputs.forEach((input, index) => {
    //     if (index < colors.length) {
    //         input.value = colors[index];
    //     }
    // });

    // Set default values
    document.getElementById("font").value = font;
    document.getElementById("fontSize").value = fontSize;
    document.getElementById("letterSpacing").value = letterSpacing;
    document.getElementById("interval").value = interval;
    document.getElementById("sentenceColorText").value = sentenceColor;
    document.getElementById("sentenceColorPicker").value = sentenceColor;
    document.getElementById("bgColorText").value = bgColor;
    document.getElementById("bgColorPicker").value = bgColor;
    document.getElementById("height").value = height;
    document.getElementById("width").value = width;

    // Trigger the update to apply these defaults

    initializeWordFields();
    updatePreview();

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
    interval,
    width,
    height,
    sentenceColor,
    bgColor,
  ) {
    // console.log(sentenceParam)
    const words = JSON.parse(decodeURIComponent(wordsParam));
    const sentence = sentenceParam.replace(/%20/g, " ");

    const previewContainerAnimation = document.getElementById(
    "preview-container-animation"
    );
    const previewSentence = document.getElementById("animation-sentence");
    const previewWordsContainer = document.getElementById("animation-words");

    console.log("width:", width);

    // Update the animation sentence
    let parsedFontSize = fontSize.toString() + "px";
    previewSentence.textContent = sentence;
    previewSentence.style.fontFamily = font || "inherit";
    previewSentence.style.fontSize = parsedFontSize || "inherit";
    previewSentence.style.letterSpacing = letterSpacing || "inherit";
    previewSentence.style.color = sentenceColor || "#000000";

    previewContainerAnimation.style.backgroundColor = bgColor || "transparent";
    previewContainerAnimation.style.height = height? `${height}px`: "auto";
    previewContainerAnimation.style.width = width ? `${width}px` : "auto";

    // Clear the current animation words
    previewWordsContainer.innerHTML = "";

    // Add new words to the animation with the specified colors
    words.forEach((wordObj) => {
      const span = document.createElement("span");
      span.style.color = wordObj.color;
      span.className = "word";
      span.style.fontFamily = font;
      span.style.letterSpacing = letterSpacing;
      wordObj.text.split("").forEach((letter) => {
        const letterSpan = document.createElement("span");
        letterSpan.textContent = letter;
        letterSpan.className = "letter";
        span.appendChild(letterSpan);
      });
      previewWordsContainer.appendChild(span);
    });

    // Apply the animation
    applyAnimationToWords(previewWordsContainer.querySelectorAll(".word"), interval);
  }

  // Function to apply animation to the words in the animation-only view
  function applyAnimationToWords(words, interval) {
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
            letter.className = "letter behind";
            setTimeout(() => {
              letter.className = "letter in";
            }, i * 80);
          });
        }, interval ? interval/8 : 500);

        currentWordIndex =
          currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
      };

      rotateText();
      setInterval(rotateText, interval ? interval : 4000); //use interval if passed
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
        addWordField("", "#FFFFFF");
        updateLabels(); // Update labels after adding a new word
      });

    // Function to remove a word input field
    window.removeWord = function (button) {
      const wordDiv = button.parentElement;
      wordDiv.remove();
      updateLabels(); // Update labels after removing a word
      updatePreview(); // Update the preview after removing a word
    };

    //copy clipboard button markdown
    document
      .getElementById("copyButtonMarkdown")
      .addEventListener("click", function () {
        const textarea = document.getElementById("generated-markdown");
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices

        try {
          document.execCommand("copy");
          alert("Text copied to clipboard!");
        } catch (err) {
          alert("Failed to copy text.");
        }
      });

    //copy clipboard button html
    document
      .getElementById("copyButtonHTML")
      .addEventListener("click", function () {
        const textarea = document.getElementById("generated-html");
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices

        try {
          document.execCommand("copy");
          alert("Text copied to clipboard!");
        } catch (err) {
          alert("Failed to copy text.");
        }
      });



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

    document.getElementById("font").addEventListener("input", updatePreview);
    document
      .getElementById("fontSize")
      .addEventListener("input", updatePreview);
    document
      .getElementById("letterSpacing")
      .addEventListener("input", updatePreview);
    document
    .getElementById("interval")
    .addEventListener("input", updatePreview);
    document
        .getElementById("width")
        .addEventListener("input", updatePreview);
    document
        .getElementById("height")
        .addEventListener("input", updatePreview);
    document
      .getElementById("sentenceColorPicker")
      .addEventListener("input", updatePreview);
    document
    .getElementById("sentenceColorText")
    .addEventListener("input", updatePreview);
    document
      .getElementById("bgColorPicker")
      .addEventListener("input", updatePreview);
    document
    .getElementById("bgColorText")
    .addEventListener("input", updatePreview);
    
    const sentenceColorPicker = document.getElementById("sentenceColorPicker");
    const sentenceColorText = document.getElementById("sentenceColorText");

    // Update the text input when the color picker changes
    sentenceColorPicker.addEventListener("input", function () {
      sentenceColorText.value = sentenceColorPicker.value.toUpperCase();
    });

    // Update the color picker when the text input changes
    sentenceColorText.addEventListener("input", function () {
      const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(sentenceColorText.value);
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

    // // Optional: Ensure valid input and format hex code correctly
    // colorText.addEventListener("blur", function () {
    //   let color = colorText.value;
    //   if (!color.startsWith("#")) {
    //     color = "#" + color;
    //   }
    //   if (color.length === 4 || color.length === 7) {
    //     colorText.value = color.toUpperCase();
    //   } else {
    //     // Reset to default if the input is invalid
    //     colorText.value = colorPicker.value.toUpperCase();
    //   }
    // });

    updatePreview(); // Initial preview generation
  }
});
