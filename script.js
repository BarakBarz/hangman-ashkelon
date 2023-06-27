const words = ['banana', 'strawberry', 'cat', 'plane', 'monkey', 'bridge'];

const puzzleWord = document.querySelector('#puzzle');
const myStatus = document.querySelector('#status');
const guessedLetters = document.querySelector('#guessed-letters');
const errorMessage = document.querySelector('#error-message');
const resetButton = document.querySelector('#reset-button');

class Hangman {
  #word;
  #remainingGuesses;
  #foundWord;

  constructor(word, remainingGuesses) {
    this.#word = word;
    this.#remainingGuesses = remainingGuesses;
    this.guessedLetters = [
      /* 'c', 'x' */
    ];
    this.status = 'playing';
    this.#foundWord = word.replace(/[a-z]/g, '*'); // ***
    this.errorMessage = '';
  }

  getPuzzle() {
    // take #word and split to wordArr
    const wordArr = this.#word.split(''); // ['c', 'a', 't']
    // for loop on wordArr
    for (let i = 0; i < this.#word.length; i++) {
      // inside loop if guessedLetters != wordArr[i]
      if (!this.guessedLetters.includes(wordArr[i])) {
        // turn that letter to '*'
        wordArr[i] = '*';
      }
    }
    // return splitted array
    this.#foundWord = wordArr.join(''); // 'c**'
    return this.#foundWord;
  }

  makeGuess(guess) {
    /*guess = c*/
    // is valid?

    if (!guess.match(/^[a-z]$/)) {
      this.errorMessage = 'Guess letter must be lower case letter only!';
      return;
    }

    // does letter exist in guessedLetters

    if (this.guessedLetters.includes(guess)) {
      this.errorMessage = 'This letter has already been guessed';
      return;
    }

    // if valid add to guessedLetters

    this.guessedLetters.push(guess);
    // if this guess is not a correct guess (does not occur in word) subtract remaining guesses
    if (!this.#word.includes(guess)) {
      this.#remainingGuesses--;
    }
    this.calculateStatus();
    this.errorMessage = '';
  }

  calculateStatus() {
    // לבדוק אם מצאתי את כל האותיות
    if (!this.getPuzzle().includes('*')) {
      //  אם במילה המנוחשת אין כוכבית זה אומר שמצאתי את כל האותיות
      return (this.status = 'finished');
    }
    //   האם נגמרו הניחושים (האם הניחושים הנותרים הגיעו לאפס)
    if (this.#remainingGuesses === 0) {
      return (this.status = 'failed');
    } else {
      // אחרת הגדר לעדיין משחק
      console.log(this.status);
      return this.status;
    }
  }

  getStatusMessage() {
    // אם סטטוס עדיין משחקים להחזיר מחרוזת שמציגה את הניחושים שנותרו
    if (this.status === 'playing') {
      return `Remaining guesses: ${this.#remainingGuesses}`;
    } else if (this.status === 'failed') {
      // אם הסטטוס "נכשל" אמור להחזיר מחרוזת שמודיעה על הפסד השחקן שגם אומרת מה הייתה המילה
      return `Nice try! The word was ${this.#word}`;
    } else {
      // אם הסטטוס "סיים" להחזיר מחרוזת של הצלחה!
      return `Great work! you guessed the word: ${this.#foundWord}`;
    }
  }
}

const word = randomWords();

let hangman = new Hangman(word, word.length + 2);

function render() {
  puzzleWord.textContent = hangman.getPuzzle();
  myStatus.textContent = hangman.getStatusMessage();
  guessedLetters.textContent = hangman.guessedLetters.join(', ');
  errorMessage.textContent = hangman.errorMessage;
}

function randomWords() {
  let randomIndex = Math.floor(Math.random() * words.length);

  return words[randomIndex];
}

window.addEventListener('keypress', function ({ key }) {
  if (hangman.status !== 'playing') return;
  // הכנס לguess
  const guess = key;

  hangman.makeGuess(guess);
  render();
});

resetButton.addEventListener('click', function () {
  const word = randomWords();
  hangman = new Hangman(word, word.length + 3);

  render();
});

render();

