const { open } = require("node:fs/promises");

class StopWords {
  words = null;

  constructor() {
    this.words = new Set();
  }

  async initialize(path) {
    try {
      const file = await open(path);
      for await (const line of file.readLines()) {
        this.words.add(line.trim());
      }
    } catch (error) {
      console.log(error);
    }
  }

  get getStopWords() {
    return this.words;
  }

  setStopWords(words) {
    this.words = words;
  }

  /**
   *
   * @param {*} words
   * @returns Boolean - true if the word is found, false if the word is not found
   */
  has(words) {
    return this.words.has(words.trim());
  }
}

module.exports = StopWords;
