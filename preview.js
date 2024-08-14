console.log("Script is running");

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM is ready");
  const testElement = document.getElementById("sentence");
  console.log("Test element:", testElement);
});


// document.addEventListener("DOMContentLoaded", function () {
//   let wordCount = 1;

//   // Function to add a new word input field
//   document.querySelector(".add-button").addEventListener("click", function () {
//     wordCount++;
//     addWordField(wordCount);
//     updateLabels(); // Update labels after adding a new word
//   });

//   // Function to remove a word input field
//   window.removeWord = function (button) {
//     const wordDiv = button.parentElement;
//     wordDiv.remove();
//     updateLabels(); // Update labels after removing a word
//     updatePreview(); // Update the preview after removing a word
//   };

//   // Function to add a new word input field dynamically
//   function addWordField(count) {
//     const wordsContainer = document.createElement("div");
//     wordsContainer.className = "words-container";
//     wordsContainer.innerHTML = `
//             <label for="word-${count}" class="word-label">Word ${count}: </label>
//             <input type="text" id="word-${count}" name="word[]" class="word-input">
//             <input type="color" id="color-${count}" name="color[]" class="color-input">
//             <button type="button" class="del-button" onclick="removeWord(this)">
//                 <i class="fa-solid fa-trash" style="color: #c10606;"></i>
//             </button>
//         `;

//     // Insert the new word-container before the add button
//     document
//       .querySelector(".add-button")
//       .insertAdjacentElement("beforebegin", wordsContainer);

//     // Add event listeners for the new inputs to update the preview dynamically
//     wordsContainer
//       .querySelector(".word-input")
//       .addEventListener("input", updatePreview);
//     wordsContainer
//       .querySelector(".color-input")
//       .addEventListener("input", updatePreview);
//   }

//   // Function to update the labels to ensure they are in numeric order
//   function updateLabels() {
//     const wordLabels = document.querySelectorAll(".word-label");
//     wordLabels.forEach((label, index) => {
//       label.textContent = `Word ${index + 1}: `;
//     });
//   }

//   // Function to update the preview and simulate URL call
//   function updatePreview() {
//     console.error("attempting update preview");
//     const sentenceInput = document.getElementById("sentence").value;
//     const wordsInputs = document.getElementsByName("word[]");
//     const colorsInputs = document.getElementsByName("color[]");

//     console.log(sentenceInput); // Should log the sentence input element or null/undefined if not found.
//     console.log(wordsInputs); // Should log the NodeList of word inputs.
//     console.log(colorsInputs); // Should log the NodeList of color inputs.

//     if (
//       !wordsInputs ||
//       !colorsInputs ||
//       wordsInputs.length === 0 ||
//       colorsInputs.length === 0
//     ) {
//       console.error("Word or color inputs not found or are empty.");
//       return;
//     }

//     const words = [];
//     const colors = [];

//     for (let i = 0; i < wordsInputs.length; i++) {
//       if (wordsInputs[i].value && colorsInputs[i].value) {
//         words.push(wordsInputs[i].value);
//         colors.push(colorsInputs[i].value);
//       }
//     }

//     // Generate the URL with the current parameters
//     const url = generatePreviewURL(sentenceInput, words, colors);

//     // Simulate loading the URL within the preview area
//     loadPreviewFromURL(url);

//     // Update the generated Markdown link
//     const markdownLink = generateMarkdownLink(url);
//     document.getElementById("generated-markdown").value = markdownLink;
//   }

//   // Function to generate the preview URL
//   function generatePreviewURL(sentence, words, colors) {
//     const encodedSentence = encodeURIComponent(sentence);
//     const wordObjects = words.map((word, index) => {
//       return {
//         text: word,
//         color: colors[index] || "#000000", // Default to black if no color is set
//       };
//     });
//     const encodedWords = encodeURIComponent(JSON.stringify(wordObjects));
//     const baseUrl = "http://[::]:8000/";
//     // window.location.origin + window.location.pathname;

//     return `${baseUrl}?sentence=${encodedSentence}&words=${encodedWords}`;
//   }

//   // Function to load and apply the preview from the generated URL
//   function loadPreviewFromURL(url) {
//     const params = new URLSearchParams(url.split("?")[1]);
//     const sentence = params.get("sentence");
//     const wordsParam = params.get("words");
//     const words = JSON.parse(decodeURIComponent(wordsParam));

//     const previewSentence = document.getElementById("preview-sentence");
//     const previewWordsContainer = document.getElementById("preview-words");

//     // Update the preview sentence
//     previewSentence.textContent = sentence;
//     console.log(previewSentence.textContent);

//     // Clear the current preview words
//     previewWordsContainer.innerHTML = "";

//     // Add new words to the preview with animation
//     words.forEach((wordObj) => {
//       const span = document.createElement("span");
//       span.style.color = wordObj.color;
//       span.className = "word";
//       wordObj.text.split("").forEach((letter) => {
//         const letterSpan = document.createElement("span");
//         letterSpan.textContent = letter;
//         letterSpan.className = "letter";
//         span.appendChild(letterSpan);
//       });
//       previewWordsContainer.appendChild(span);
//     });

//     // Apply the animation classes
//     applyAnimation();
//   }

//   // Function to apply animation to the words
//   function applyAnimation() {
//     const words = document.querySelectorAll(".word");
//     let currentWordIndex = 0;
//     const maxWordIndex = words.length - 1;
//     if (words.length > 0) {
//       words[currentWordIndex].style.opacity = "1";

//       const rotateText = () => {
//         const currentWord = words[currentWordIndex];
//         const nextWord =
//           currentWordIndex === maxWordIndex
//             ? words[0]
//             : words[currentWordIndex + 1];

//         Array.from(currentWord.children).forEach((letter, i) => {
//           setTimeout(() => {
//             letter.className = "letter out";
//           }, i * 80);
//         });

//         nextWord.style.opacity = "1";
//         Array.from(nextWord.children).forEach((letter, i) => {
//           letter.className = "letter behind";
//           setTimeout(() => {
//             letter.className = "letter in";
//           }, 340 + i * 80);
//         });

//         currentWordIndex =
//           currentWordIndex === maxWordIndex ? 0 : currentWordIndex + 1;
//       };

//       rotateText();
//       setInterval(rotateText, 4000);
//     }
//   }

//   // Function to generate Markdown link
//   function generateMarkdownLink(url) {
//     return `!http://[::]:8000/(${url})`;
//   }

//   // Event listeners for the initial input elements to update the preview dynamically
//   document.getElementById("sentence").addEventListener("input", updatePreview);
//   document.querySelectorAll(".word-input").forEach((input) => {
//     input.addEventListener("input", updatePreview);
//   });
//   document.querySelectorAll(".color-input").forEach((input) => {
//     input.addEventListener("input", updatePreview);
//   });

//   updatePreview(); // Initial preview generation
// });
