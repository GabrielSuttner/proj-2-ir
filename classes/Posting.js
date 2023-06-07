class Posting {
  DocId = null;
  FirstSentance = null;
  Count = 0;
  Max = 0;
  constructor(DocId) {
    this.DocId = DocId;
  }

  setFirstSentance(line) {
    if (!this.FirstSentance) this.FirstSentance = line;
  }

  increment() {
    this.Count++;
  }

  setMax(count) {
    this.Max = count;
  }
}

class Postings {
  postings = null;

  constructor() {
    this.postings = [];
  }

  /**
   * This function will either return the posting with the cooresponding DocId or it will create a new Posting with the provided DocId.
   * @param {Number} DocId
   * @returns Posting.
   */
  get(DocId) {
    for (let i = 0; i < this.postings.length; i++) {
      if (this.postings[i].DocId == DocId) return this.postings[i];
    }
    const posting = new Posting(DocId);
    this.postings.push(posting);
    return posting;
  }
}

exports.Posting = Posting;
exports.Postings = Postings;
