document.addEventListener('DOMContentLoaded', (event) => {
  // Attach input event listeners to the input fields
  document.getElementById('mustHaveLetter').addEventListener('input', loadAndFilterWords);
  document.getElementById('additionalLetters').addEventListener('input', loadAndFilterWords);
});


// Function to load and filter words based on user input
function loadAndFilterWords() {
  // Retrieve user input from the HTML input elements
  const mustHaveLetter = document.getElementById('mustHaveLetter').value;
  const additionalLetters = document.getElementById('additionalLetters').value;
  let isValid = true; // Flag to track input validation

  // Clear any previous error messages
  clearErrorMessages();

  // Validate the must-have letter input
  if (!/^[a-zA-Z]$/.test(mustHaveLetter)) {
      displayErrorMessage('mustHaveLetterError', 'Enter exactly one alphabetic must-have letter.');
      isValid = false;
  }

  // Validate the additional letters input for only alphabetic characters and no duplicates
  if (!/^[a-zA-Z]+$/.test(additionalLetters) || new Set(additionalLetters).size !== additionalLetters.length) {
      displayErrorMessage('additionalLettersError', 'Additional letters must be alphabetic and not contain duplicates.');
      isValid = false;
  }

  // Validate that the must-have letter is not included in the additional letters
  if (additionalLetters.includes(mustHaveLetter)) {
    displayErrorMessage('additionalLettersError', 'The must-have letter cannot be repeated in the additional letters.');
    isValid = false;
}

  // If inputs are valid, proceed to fetch and filter the word list
  if (isValid) {
      const allowedLetters = [mustHaveLetter, ...additionalLetters].join('');

      // Fetch the word list from the specified URL
      fetch(wordListURL)
        .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(text => {
          // Split the text into an array of words and filter based on criteria
          const wordList = text.split('\n');
          return wordList.filter(word => 
            word.includes(mustHaveLetter) && 
            word.length >= 4 &&
            word.split('').every(letter => allowedLetters.includes(letter))
          );
        })
        .then(filteredWordList => {
          // Display the filtered list of words
          displayWords(filteredWordList);
          updateButtonToClear(); // Update the button after displaying words
        })
        .catch(error => {
          // Log any errors that occur during the fetch process
          console.error('Failed to load the word list:', error);
        });
  }
}

// Function to display an error message below the respective input field
function displayErrorMessage(elementId, message) {
  document.getElementById(elementId).textContent = message;
}

// Function to clear all error messages
function clearErrorMessages() {
  document.getElementById('mustHaveLetterError').textContent = '';
  document.getElementById('additionalLettersError').textContent = '';
}

// Function to display the filtered words on the webpage
function displayWords(wordList) {
  // Get the container element where words will be displayed
  const container = document.getElementById('wordListContainer');
  container.innerHTML = ''; // Clear any existing content

  // Create and append a div for each word in the filtered list
  wordList.forEach(word => {
      const wordElement = document.createElement('div');
      wordElement.textContent = word;
      container.appendChild(wordElement);
  });
}

// Function to update the button to "Clear Words"
function updateButtonToClear() {
  const actionButton = document.getElementById('actionButton');
  actionButton.textContent = 'Clear Words';
  actionButton.onclick = clearWords; // Change the onclick event to clearWords function
}


// Function to reset the button to "Filter Words"
function resetButton() {
  const actionButton = document.getElementById('actionButton');
  actionButton.textContent = 'Filter Words';
  actionButton.onclick = loadAndFilterWords; // Change the onclick event back to loadAndFilterWords
}


// URL of the word list file
const wordListURL = 'enable1.txt';
