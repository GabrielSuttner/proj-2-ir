const fs = require("fs");
const { stdin: input, stdout: output } = require("node:process");
const PortStemmer = require("./classes/PortStemmer.js");
const StopWords = require("./classes/StopWords.js");

const { Postings } = require("./classes/Posting.js");

let tokens = null;
let stopWords = null;
let dictionary = null;
let stemmer = null;
let totalFiles = 0;
let soundex = null;
let misspelledWords = null;
const runQuery = async (
  originalQuery,
  correctedQuery,
  soundex,
  possibleWords,
  index
) => {
  const temp = parseText(correctedQuery);
  const scoreWrapper = new Map();
  const queryTerms = [];
  for (const w of temp.split(" ")) {
    try {
      const word = cleanWord(w);
      if (!word) continue;
      const postings = tokens.get(word).postings;
      queryTerms.push(word);
      for (const posting of postings) {
        let s = {
          score: 0,
          scores: [],
          firstSentance: "",
        };
        if (scoreWrapper.has(posting.DocId)) {
          s = scoreWrapper.get(posting.DocId);
        }
        const val =
          (posting.Count / posting.Max) *
          Math.log2(totalFiles / postings.length);

        s.score += val;
        s.scores.push(val);
        s.firstSentance = posting.FirstSentance;
        scoreWrapper.set(posting.DocId, s);
      }
    } catch (error) {
      console.log(temp);
    }
  }

  const output = new Map(
    [...scoreWrapper.entries()]
      .sort((a, b) => b[1].score - a[1].score)
      .slice(0, 5)
  );
  const stemmedQuery = [];
  for (const w of correctedQuery.split(" ")) {
    if (!stopWords.has(w)) stemmedQuery.push(stemmer.stem(w));
  }

  for (const doc of output.entries()) {
    const rawText = await fs
      .readFileSync(`./lib/To_be_posted/Doc (${doc[0]}).txt`)
      .toString()
      .replace(/[\r\n]/g, "");

    const lengthOfDoc = rawText.length;
    let lines = [];
    for (let line of rawText.split(/[.!?]/g)) {
      let score = 0;

      let significantWordCount = 0;
      line = line.trim();
      for (const w of line.split(" ")) {
        if (!stopWords.has(w)) {
          significantWordCount++;
        }
        if (stemmedQuery.includes(stemmer.stem(w))) {
          line = line.replace(w, `*${w}*`);
          score += 5;
        }
      }
      score += significantWordCount / lengthOfDoc;
      lines.push({ line: line, score: score });
    }
    lines = lines.sort((a, b) => {
      a.score - b.score;
    });
    doc[1].a = lines[0].line;
    doc[1].b = lines[1].line;
  }

  printDocument(
    output,
    originalQuery,
    correctedQuery,
    soundex,
    possibleWords,
    index
  );
};

const printDocument = (
  documents,
  originalQuery,
  correctedQuery,
  soundex,
  possibleWords,
  index
) => {
  let data = `Original Query: ${originalQuery}  Corrected Query: ${correctedQuery}\nSoundex code: ${soundex}\nSuggested corrections: `;
  for (let j = 0; j < possibleWords.length; j++) {
    data += `${possibleWords[j].word}, `;
    if (j > 10) break;
  }
  data += "\n";

  for (const doc of documents.entries()) {
    data += `Doc: ${doc[0]}`;
    data += `\n\t${doc[1].a}.\n`;
    if (doc[1].b) {
      data += `${doc[1].b}.\n\n`;
    }
  }
  try {
    fs.writeFileSync(`./lib/output/query_${index}.txt`, data);
  } catch (error) {}
};

const cleanWord = (word) => {
  if (!word || stopWords.has(word) || word == "-") return null;

  //go through and remove hyphans if the non-hyphenated word is in the dictionary.
  if (word.match(/-/g)) {
    const temp = word.replace(/-/g, "");
    if (dictionary.has(temp)) {
      word = temp;
    }
  }
  word = stemmer.stem(word);
  if (word == "Invalid term" || word == "No term entered") return null;

  return word;
};

const parseText = (text) => {
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:£{}=\_`~()\"\']/g, "")
    .replace(/[\n\r\t]/g, " ");
};

const parseSoundex = (word) => {
  try {
    let newWord = word[0].toUpperCase();

    word = word.substring(1);

    newWord += word
      .replace(/([aeiouyhw])/gi, "-")
      .replace(/([bfpv])/gi, "1")
      .replace(/([cgjkqsxz])/gi, "2")
      .replace(/([dt])/gi, "3")
      .replace(/([l])/gi, "4")
      .replace(/([mn])/gi, "5")
      .replace(/([r])/gi, "6")
      .replace(/-/g, "")
      .replace(/(\d)\1+/g, "$1");

    newWord = newWord.substr(0, 4).padEnd(4, "0");
    return newWord;
  } catch (error) {
    console.log(word);
  }
};

const parseQueries = (lines) => {
  let queryLogs = new Map();

  for (const line of lines.toString().split("\r\n")) {
    const index = line.indexOf("\t");
    const id = line.substring(0, index);
    const queryText = line.substring(index + 1);
    if (queryText == "") continue;

    if (queryLogs.has(id)) {
      const query = queryLogs.get(id);
      query.push(queryText);
    } else {
      queryLogs.set(id, [queryText]);
    }
  }

  for (const queryLog of queryLogs.values()) {
    for (const query of queryLog) {
      for (const word of query.toLowerCase().split(" ")) {
        if (!dictionary.has(word)) {
          const q = misspelledWords.has(word)
            ? misspelledWords.get(word)
            : new Map();
          for (const query2 of queryLog) {
            for (const word2 of query2.toLowerCase().split(" ")) {
              if (dictionary.has(word2)) {
                const distance = levenshteinDistance(word, word2);
                if (distance > 0) {
                  if (
                    distance < 3 ||
                    parseSoundex(word) == parseSoundex(word2)
                  ) {
                    let count = q.has(word2) ? q.get(word2) : 0;
                    count++;
                    q.set(word2, count);
                  }
                }
              }
            }
          }

          misspelledWords.set(word, q);
        }
      }
    }
  }
};

function levenshteinDistance(str1, str2) {
  const m = str1.length;
  const n = str2.length;

  // Create a 2D array to store the distances
  const dp = [];
  for (let i = 0; i <= m; i++) {
    dp[i] = new Array(n + 1).fill(0);
  }

  // Initialize the first row and column of the matrix
  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  // Calculate the edit distance
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] =
          1 +
          Math.min(
            dp[i - 1][j - 1], // Replace
            dp[i][j - 1], // Insert
            dp[i - 1][j]
          ); // Delete
      }
    }
  }

  // Return the minimum edit distance
  return dp[m][n];
}

const main = async () => {
  stopWords = new StopWords();
  dictionary = new StopWords();
  stemmer = new PortStemmer();
  soundex = new Set();
  misspelledWords = new Map();

  await stopWords.initialize("./lib/stopwords.txt");
  await dictionary.initialize("./lib/dictionary.txt");
  const dictionaryText = (
    await fs.readFileSync("./lib/dictionary.txt")
  ).toString();

  for (let word of dictionaryText.split("\n")) {
    soundex.add(parseSoundex(word));
  }

  const files = await fs.readdirSync("./lib/To_be_posted/");
  totalFiles = files.length;
  const unsortedTokens = new Map();
  for (let i = 0; i < files.length; i++) {
    const docId = files[i].substring(
      files[i].indexOf("(") + 1,
      files[i].indexOf(")")
    );
    const rawText = await fs
      .readFileSync(`./lib/To_be_posted/${files[i]}`)
      .toString();
    const index =
      rawText.indexOf("\r\n") > -1
        ? rawText.indexOf("\r\n")
        : rawText.indexOf("\n") > -1
        ? rawText.indexOf("\n")
        : rawText.indexOf("\r");

    const firstLine = rawText.substring(0, index);
    let parsedText = "";
    const words = new Set();
    let max = -1;

    for (let word of parseText(rawText).split(" ")) {
      //go through the words and remove the stop words
      word = cleanWord(word);
      if (!word) {
        continue;
      }
      parsedText += `${word} `;

      let postings = null;
      //go through and add the posting.
      if (unsortedTokens.has(word)) {
        postings = unsortedTokens.get(word);
      } else {
        postings = new Postings();
      }
      const posting = postings.get(docId);
      posting.setFirstSentance(firstLine);
      posting.increment();

      if (max < posting.Count) max = posting.Count;

      unsortedTokens.set(word, postings);
      words.add(word);
    }

    parseQueries(await fs.readFileSync(`./lib/query_log.txt`));

    for (const word of words) {
      const postings = unsortedTokens.get(word);
      const posting = postings.get(docId);
      posting.setMax(max);
    }
  }
  tokens = new Map([...unsortedTokens.entries()].sort());
  unsortedTokens.clear();

  const queries = [
    "sentenced to prision",
    "open cuort case",
    "entretainment group",
    "tv axtor",
    "scheduled movie screning",
  ];
  for (let i = 0; i < queries.length; i++) {
    const originalQuery = queries[i];
    let correctedQuery = originalQuery.toLowerCase();
    let soundexWord = null;
    let possibleWords = [];
    for (const word of queries[i].toLowerCase().split(" ")) {
      if (!dictionary.has(word)) {
        soundexWord = parseSoundex(word);
        // Example usage
        let bestWord = word;
        let bestNum = 1;
        const q = misspelledWords.get(word);
        for (const w of dictionary.getStopWords) {
          const distance = levenshteinDistance(word, w);
          if (distance < 3 || soundexWord == parseSoundex(w)) {
            let ew = 0.01;
            let wn = 0.01;
            if (q.has(w)) {
              ew += q.get(w);
            }
            if (tokens.has(w)) {
              wn += tokens.get(w).postings.length;
            }
            const val = ew * wn;
            if (val > bestNum) {
              bestNum = val;
              bestWord = w;
            }

            possibleWords.push({ word: w, weight: val });
          }
        }
        correctedQuery = correctedQuery.replace(word, bestWord);
      }
    }
    possibleWords = possibleWords.sort((a, b) => b.weight - a.weight);
    runQuery(originalQuery, correctedQuery, soundexWord, possibleWords, i);
  }
};

main();
