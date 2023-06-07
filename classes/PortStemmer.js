class PortStemmer {
  constructor() {}

  stem(str) {
    // check for zero length
    if (str.length > 0) {
      if (/[^a-z]/i.test(str)) {
        return "Invalid term";
      }
    } else {
      return "No term entered";
    }
    str = this.step1a(str);
    str = this.step1b(str);
    str = this.step1c(str);
    str = this.step2(str);
    str = this.step3(str);
    str = this.step4(str);
    str = this.step5a(str);
    str = this.step5b(str);
    return str;
  } // end stem

  step1a(str) {
    // SSES -> SS
    if (str.endsWith("sses")) {
      return str.substring(0, str.length - 2);
      // IES -> I
    } else if (str.endsWith("ies")) {
      return str.substring(0, str.length - 2);
      // SS -> S
    } else if (str.endsWith("ss")) {
      return str;
      // S ->
    } else if (str.endsWith("s")) {
      return str.substring(0, str.length - 1);
    } else {
      return str;
    }
  } // end step1a

  step1b(str) {
    // (m > 0) EED -> EE
    if (str.endsWith("eed")) {
      if (this.stringMeasure(str.substring(0, str.length - 3)) > 0)
        return str.substring(0, str.length - 1);
      else return str;
      // (*v*) ED ->
    } else if (
      str.endsWith("ed") &&
      this.containsVowel(str.substring(0, str.length - 2))
    ) {
      return this.step1b2(str.substring(0, str.length - 2));
      // (*v*) ING ->
    } else if (
      str.endsWith("ing") &&
      this.containsVowel(str.substring(0, str.length - 3))
    ) {
      return this.step1b2(str.substring(0, str.length - 3));
    } // end if
    return str;
  } // end step1b

  step1b2(str) {
    // AT -> ATE
    if (str.endsWith("at") || str.endsWith("bl") || str.endsWith("iz")) {
      return str + "e";
    } else if (
      this.endsWithDoubleConsonent(str) &&
      !(str.endsWith("l") || str.endsWith("s") || str.endsWith("z"))
    ) {
      return str.substring(0, str.length - 1);
    } else if (this.stringMeasure(str) == 1 && this.endsWithCVC(str)) {
      return str + "e";
    } else {
      return str;
    }
  } // end step1b2

  step1c(str) {
    // (*v*) Y -> I
    if (str.endsWith("y")) {
      if (this.containsVowel(str.substring(0, str.length - 1)))
        return str.substring(0, str.length - 1) + "i";
    } // end if
    return str;
  } // end step1c

  step2(str) {
    // (m > 0) ATIONAL -> ATE
    if (
      str.endsWith("ational") &&
      this.stringMeasure(str.substring(0, str.length - 5)) > 0
    ) {
      return str.substring(0, str.length - 5) + "e";
      // (m > 0) TIONAL -> TION
    } else if (
      str.endsWith("tional") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 0
    ) {
      return str.substring(0, str.length - 2);
      // (m > 0) ENCI -> ENCE
    } else if (
      str.endsWith("enci") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 0
    ) {
      return str.substring(0, str.length - 2);
      // (m > 0) ANCI -> ANCE
    } else if (
      str.endsWith("anci") &&
      this.stringMeasure(str.substring(0, str.length - 1)) > 0
    ) {
      return str.substring(0, str.length - 1) + "e";
      // (m > 0) IZER -> IZE
    } else if (
      str.endsWith("izer") &&
      this.stringMeasure(str.substring(0, str.length - 1)) > 0
    ) {
      return str.substring(0, str.length - 1);
      // (m > 0) ABLI -> ABLE
    } else if (
      str.endsWith("abli") &&
      this.stringMeasure(str.substring(0, str.length - 1)) > 0
    ) {
      return str.substring(0, str.length - 1) + "e";
      // (m > 0) ENTLI -> ENT
    } else if (
      str.endsWith("alli") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 0
    ) {
      return str.substring(0, str.length - 2);
      // (m > 0) ELI -> E
    } else if (
      str.endsWith("entli") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 0
    ) {
      return str.substring(0, str.length - 2);
      // (m > 0) OUSLI -> OUS
    } else if (
      str.endsWith("eli") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 0
    ) {
      return str.substring(0, str.length - 2);
      // (m > 0) IZATION -> IZE
    } else if (
      str.endsWith("ousli") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 0
    ) {
      return str.substring(0, str.length - 2);
      // (m > 0) IZATION -> IZE
    } else if (
      str.endsWith("ization") &&
      this.stringMeasure(str.substring(0, str.length - 5)) > 0
    ) {
      return str.substring(0, str.length - 5) + "e";
      // (m > 0) ATION -> ATE
    } else if (
      str.endsWith("ation") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 0
    ) {
      return str.substring(0, str.length - 3) + "e";
      // (m > 0) ATOR -> ATE
    } else if (
      str.endsWith("ator") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 0
    ) {
      return str.substring(0, str.length - 2) + "e";
      // (m > 0) ALISM -> AL
    } else if (
      str.endsWith("alism") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 0
    ) {
      return str.substring(0, str.length - 3);
      // (m > 0) IVENESS -> IVE
    } else if (
      str.endsWith("iveness") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 0
    ) {
      return str.substring(0, str.length - 4);
      // (m > 0) FULNESS -> FUL
    } else if (
      str.endsWith("fulness") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 0
    ) {
      return str.substring(0, str.length - 4);
      // (m > 0) OUSNESS -> OUS
    } else if (
      str.endsWith("ousness") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 0
    ) {
      return str.substring(0, str.length - 4);
      // (m > 0) ALITII -> AL
    } else if (
      str.endsWith("aliti") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 0
    ) {
      return str.substring(0, str.length - 3);
      // (m > 0) IVITI -> IVE
    } else if (
      str.endsWith("iviti") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 0
    ) {
      return str.substring(0, str.length - 3) + "e";
      // (m > 0) BILITI -> BLE
    } else if (
      str.endsWith("biliti") &&
      this.stringMeasure(str.substring(0, str.length - 5)) > 0
    ) {
      return str.substring(0, str.length - 5) + "le";
    } // end if
    return str;
  } // end step2

  step3(str) {
    // (m > 0) ICATE -> IC
    if (
      str.endsWith("icate") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 0
    ) {
      return str.substring(0, str.length - 3);
      // (m > 0) ATIVE ->
    } else if (
      str.endsWith("ative") &&
      this.stringMeasure(str.substring(0, str.length - 5)) > 0
    ) {
      return str.substring(0, str.length - 5);
      // (m > 0) ALIZE -> AL
    } else if (
      str.endsWith("alize") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 0
    ) {
      return str.substring(0, str.length - 3);
      // (m > 0) ICITI -> IC
    } else if (
      str.endsWith("iciti") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 0
    ) {
      return str.substring(0, str.length - 3);
      // (m > 0) ICAL -> IC
    } else if (
      str.endsWith("ical") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 0
    ) {
      return str.substring(0, str.length - 2);
      // (m > 0) FUL ->
    } else if (
      str.endsWith("ful") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 0
    ) {
      return str.substring(0, str.length - 3);
      // (m > 0) NESS ->
    } else if (
      str.endsWith("ness") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 0
    ) {
      return str.substring(0, str.length - 4);
    } // end if
    return str;
  } // end step3

  step4(str) {
    if (
      str.endsWith("al") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 1
    ) {
      return str.substring(0, str.length - 2);
      // (m > 1) ANCE ->
    } else if (
      str.endsWith("ance") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 1
    ) {
      return str.substring(0, str.length - 4);
      // (m > 1) ENCE ->
    } else if (
      str.endsWith("ence") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 1
    ) {
      return str.substring(0, str.length - 4);
      // (m > 1) ER ->
    } else if (
      str.endsWith("er") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 1
    ) {
      return str.substring(0, str.length - 2);
      // (m > 1) IC ->
    } else if (
      str.endsWith("ic") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 1
    ) {
      return str.substring(0, str.length - 2);
      // (m > 1) ABLE ->
    } else if (
      str.endsWith("able") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 1
    ) {
      return str.substring(0, str.length - 4);
      // (m > 1) IBLE ->
    } else if (
      str.endsWith("ible") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 1
    ) {
      return str.substring(0, str.length - 4);
      // (m > 1) ANT ->
    } else if (
      str.endsWith("ant") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
      // (m > 1) EMENT ->
    } else if (
      str.endsWith("ement") &&
      this.stringMeasure(str.substring(0, str.length - 5)) > 1
    ) {
      return str.substring(0, str.length - 5);
      // (m > 1) MENT ->
    } else if (
      str.endsWith("ment") &&
      this.stringMeasure(str.substring(0, str.length - 4)) > 1
    ) {
      return str.substring(0, str.length - 4);
      // (m > 1) ENT ->
    } else if (
      str.endsWith("ent") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
      // (m > 1) and (*S or *T) ION ->
    } else if (
      (str.endsWith("sion") || str.endsWith("tion")) &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
      // (m > 1) OU ->
    } else if (
      str.endsWith("ou") &&
      this.stringMeasure(str.substring(0, str.length - 2)) > 1
    ) {
      return str.substring(0, str.length - 2);
      // (m > 1) ISM ->
    } else if (
      str.endsWith("ism") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
      // (m > 1) ATE ->
    } else if (
      str.endsWith("ate") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
      // (m > 1) ITI ->
    } else if (
      str.endsWith("iti") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
      // (m > 1) OUS ->
    } else if (
      str.endsWith("ous") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
      // (m > 1) IVE ->
    } else if (
      str.endsWith("ive") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
      // (m > 1) IZE ->
    } else if (
      str.endsWith("ize") &&
      this.stringMeasure(str.substring(0, str.length - 3)) > 1
    ) {
      return str.substring(0, str.length - 3);
    } // end if
    return str;
  } // end step4

  step5a(str) {
    // (m > 1) E ->
    if (
      this.stringMeasure(str.substring(0, str.length - 1)) > 1 &&
      str.endsWith("e")
    )
      return str.substring(0, str.length - 1);
    // (m = 1 and not *0) E ->
    else if (
      this.stringMeasure(str.substring(0, str.length - 1)) == 1 &&
      !this.endsWithCVC(str.substring(0, str.length - 1)) &&
      str.endsWith("e")
    )
      return str.substring(0, str.length - 1);
    else return str;
  } // end step5a

  step5b(str) {
    // (m > 1 and *d and *L) ->
    if (
      str.endsWith("l") &&
      this.endsWithDoubleConsonent(str) &&
      this.stringMeasure(str.substring(0, str.length - 1)) > 1
    ) {
      return str.substring(0, str.length - 1);
    } else {
      return str;
    }
  } // end step5b

  /*
   -------------------------------------------------------
   The following are functions to help compute steps 1 - 5
   -------------------------------------------------------
*/

  // does  end with 's'?
  endsWithS(str) {
    return str.endsWith("s");
  } // end function

  // does  contain a vowel?
  containsVowel(str) {
    for (let i = 0; i < str.length; i++) {
      if (this.isVowel(str[i])) return true;
    }
    // no aeiou but there is y
    if (str.indexOf("y") > -1) return true;
    else return false;
  } // end function

  // is char a vowel?
  isVowel(c) {
    if (c == "a" || c == "e" || c == "i" || c == "o" || c == "u") return true;
    else return false;
  } // end function

  // does  end with a double consonent?
  endsWithDoubleConsonent(str) {
    if (str.length > 1) {
      const c = str.charAt(str.length - 1);
      if (c == str.charAt(str.length - 2))
        if (!this.containsVowel(str.substring(str.length - 2))) {
          return true;
        }
    }
    return false;
  } // end function

  // returns a CVC measure for the
  stringMeasure(str) {
    let count = 0;
    let vowelSeen = false;

    for (let i = 0; i < str.length; i++) {
      if (this.isVowel(str[i])) {
        vowelSeen = true;
      } else if (vowelSeen) {
        count++;
        vowelSeen = false;
      }
    } // end for
    return count;
  } // end function

  // does stem end with CVC?
  endsWithCVC(str) {
    let c = " ";
    let v = " ";
    let c2 = " ";
    if (str.length >= 3) {
      c = str.charAt(str.length - 1);
      v = str.charAt(str.length - 2);
      c2 = str.charAt(str.length - 3);
    } else {
      return false;
    }

    if (c == "w" || c == "x" || c == "y") {
      return false;
    } else if (this.isVowel(c)) {
      return false;
    } else if (!this.isVowel(v)) {
      return false;
    } else if (this.isVowel(c2)) {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = PortStemmer;
