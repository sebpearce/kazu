/**
 * Kazu: A tool for learning to conceptualize Japanese numbers.
 * Copyright 2014 Seb Pearce
 * http://sebpearce.com
 * Licensed under the MIT license.
 */

(function kazu(){

  decNum = 10000; // variable for the number in the input
  lastNum = 0; // last number that was processed
  textShrink = false; // keep track of whether text has shrunk

  possiblePlaces = [
    Math.pow(10, 4),
    Math.pow(10, 5),
    Math.pow(10, 6),
    Math.pow(10, 7),
    Math.pow(10, 8),
    Math.pow(10, 9),
    Math.pow(10, 10),
    Math.pow(10, 11),
    Math.pow(10, 12),
  ];

  expArray = [
    Math.pow(10, 0),
    Math.pow(10, 1),
    Math.pow(10, 2),
    Math.pow(10, 3),
    Math.pow(10, 4),
    Math.pow(10, 5),
    Math.pow(10, 6),
    Math.pow(10, 7),
    Math.pow(10, 8),
    Math.pow(10, 9),
    Math.pow(10, 10),
    Math.pow(10, 11),
    Math.pow(10, 12),
  ];


  var englishPlaceWords = [
    'quadrillion',
    'trillion',
    'billion',
    'million',
    'thousand',
  ];

  var englishTenWords = [
    '',
    '',
    'twenty',
    'thirty',
    'forty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety',
  ];

  var englishTeenWords = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ];

  var englishUnitWords = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ];

  // numbers for ones, tens and hundreds place in English numbers
  var eng_factors = [
    Math.pow(10, 2),
    Math.pow(10, 1),
    Math.pow(10, 0),
  ];

  var eng_places = [
    Math.pow(10, 15), // quadrillion 0
    Math.pow(10, 12), // trillion 1
    Math.pow(10, 9), // billion 2
    Math.pow(10, 6), // million 3
    Math.pow(10, 3), // thousand 4
    Math.pow(10, 2), // hundred 5
    Math.pow(10, 1), // ten 6
    Math.pow(10, 0), // one 7
  ];

  var jap_places = [
    Math.pow(10, 12), //chou
    Math.pow(10, 8), //oku
    Math.pow(10, 4), //man
    Math.pow(10, 3), //sen
    Math.pow(10, 2), //hyaku
    Math.pow(10, 1), //juu
    Math.pow(10, 0), //(units)
  ];

  var kanjiList = ['兆', '億', '万', '千', '百', '十'];

  var hiraganaList = ['ちょう', 'おく', 'まん', 'せん', 'ひゃく', 'じゅう'];

  var tens = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];

  var ones = ['', 'man', 'oku', 'chou'];
  var onesN = ['', '万', '億', '兆'];

  var nums = ['zero', 'ichi', 'ni', 'san', 'yon', 'go', 'roku', 'nana', 'hachi', 'kyuu', 'juu'];
  var numsN = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];


  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  // Courtesy of http://www.protonfish.com/random.shtml
  function rnd_standardDistribution() {
    return (Math.random() * 2 - 1) + (Math.random() * 2 - 1) + (Math.random() * 2 - 1);
  }

  // Courtesy of http://www.protonfish.com/random.shtml
  function rnd(mean, stdev) {
    return Math.round(rnd_standardDistribution() * stdev + mean);
  }

  function randomNumber() {

    // generate a random number from 2-15 on a bell curve as rnd(mean, sd)
    var prob = rnd(3, 1);

    // set the upperLimit to one of the choices in possiblePlaces (mean = 10^10)
    upperLimit = possiblePlaces[prob];

    //generate random number from 1-upperLimit
    var result = Math.floor((Math.random() * upperLimit) + 10000);

    // we're going to keep 60% of the digits and round the rest to zeros
    var numberOfDigits = String(result).length;
    var howMuchToKeep = Math.floor(numberOfDigits * 0.6);
    var pointInArray = expArray[howMuchToKeep];
    result = Math.round(result / pointInArray) * pointInArray;

    return result;

  }

  // get English reading of numbers from 1-999
  function generateEnglishFactorWords(num) {

    var hyphen = false;
    var result = '';
    
    // english factor words (1 to 999)
    if (num >= 100) {
      h = Math.floor(num / 100);
      result = englishUnitWords[h] + ' hundred ';
      num -= (h * 100);
    }

    if (num >= 10) {
      // prepare for hyphen use if necessary
      if (num % 10 != 0 && num > 20 && num < 100) {
        hyphen = true;
      }
      t = Math.floor(num / 10);
      // handle -teen numbers
      if (t == 1) {
        result += englishTeenWords[num - 10] + ' ';
        num = 0;
      } else {
        result += englishTenWords[t];
        result += ((hyphen) ? '-' : ' ');
        hyphen = false;
        num -= (t * 10);
      }
    }

    if (num >= 1) {
      u = num;
      result += englishUnitWords[u] + ' ';
      num = 0;
    }

    return result;
  }

  // get English reading
  function generateEnglishWords(num) {

    var chk = num;
    var result = "";
    var factor = 0;
    var h, t, u = 0;
    var tensWord = "";

    if (num == 0) {
      return 'zero';
    }

    while (chk > 0) {

      for (i = 0; i < eng_places.length; i++) {

        if (chk >= eng_places[i]) {

          factor = Math.floor(chk / eng_places[i]);

          if (chk >= 1000) {

            // english place words >= 1000
            result += generateEnglishFactorWords(factor) + ' ' + englishPlaceWords[i] + ' ';
            chk -= (factor * eng_places[i]);
            break;

          } else {

            result += generateEnglishFactorWords(chk);
            chk = 0;
            break;

          }
        }
      }
    }

    result = result.trim();
    return result;

  }


  function generateJapaneseDigits(num, lowestKanjiPlace) {

    var chk = num;
    var result = "";
    var factor = 0;

    if (num == 0) {
      return '0';
    }

    while (chk > 0) {

      var i;
      // start with 兆 and iterate upward through the jap_places array
      for (i = 0; i < jap_places.length; i++) {

        //e.g. if 700万 > 1万
        if (chk >= jap_places[i]) {
          //find how many times bigger chk is than its next-highest place
          factor = Math.floor(chk / jap_places[i]);

          //if we're still above lowestKanjiLimit:
          //the lowest number you'll see a kanji 
          //used for – usually 10000 (万)...
          if (chk >= lowestKanjiPlace) {

            //add the factor then the kanji
            result += String(factor) + kanjiList[i];
            //subtract the place value (e.g.1万) from number
            chk -= (factor * jap_places[i]);
            break;
          } else {
            //otherwise just add the rest
            result += chk;
            chk = 0;
            break;
          }
        }
      }

    }

    return result;

  }


  function generateRawReading(s) {

    if (s == 0) {
      return 'zero';
    }

    var reading = '';
    var main = '';
    s = s.toString(); // s = our number as a string
    s = s.replace(/[\, ]/g, ''); // ignore commas
    if (s != parseFloat(s)) return 'not a number';
    x = s.length; // x = count of digits
    if (x > 16) return 'too big';
    var n = s.split(''); // n = array of all digits
    var check = 0;
    var pos = 0;

    //cycle through each digit from the left
    for (var i = 0; i < x; i++) {

      pos = ((x - i) % 4); // pos = position (tens, hundreds, thousands, ones)

      //is it in the TENS position?
      if (pos == 2) {
        //if it's 1, add 'juu'
        if (n[i] == '1') {
          reading += 'juu ';
          check = 1;
        } else if (n[i] != 0) {
          reading += (nums[n[i]] + ' juu ');
          check = 1;
        }
      }

      //is it in the HUNDREDS position?
      if (pos == 3) {
        //if it's 1, add 'hyaku'
        if (n[i] == '1') {
          reading += 'hyaku ';
          check = 1;
        }
        //if it's not 0, add the word
        else if (n[i] != 0) {
          reading += (nums[n[i]] + ' hyaku ');
          check = 1;
        }

      }

      //is it in the THOUSANDS position?
      if (pos == 0) {
        //if it's 1, add 'issen'
        if (n[i] == '1') {
          reading += 'issen ';
          check = 1;
        }
        //if it's not 0, add the word
        else if (n[i] != 0) {
          reading += (nums[n[i]] + ' sen ');
          check = 1;
        }
      }

      //is it in the ONES/MANS/OKUS/CHOUS position?
      if (pos == 1) {
        var type = (x - i - 1) / 4; // this will give 0, 1, 2 or 3 ('','万','億' or '兆')
        //if it's not 0, add the corresponding word            
        if (n[i] != 0) {
          check = 1;
          //if digit is a 1
          if (n[i] == '1') {
            //if it's in 'man' or 'oku' position, write 'ichi' first
            if (type == 1 || type == 2) {
              reading += 'ichi ' + ones[type] + ' ';
              check = 0;
            }
            //if it's 'chou', write 'itchou'
            else if (type == 3) {
              reading += 'itchou ';
              check = 0;
            } else {
              reading += 'ichi'; //it must be 1
              check = 0;
            }
          }
          //for other non-zero digits, add the digit and
          // corresponding word depending on its position
          else {
            reading += nums[n[i]] + ' ' + ones[type] + ' ';
            check = 0;
          }
        } else if (check) {
          //if digit is 0
          //and check = 1, i.e. if there are tens/hunds/thous to the left of this,
          //just add the corresponding word without a digit preceding it
          reading += ones[type] + ' ';
          check = 0;
        }
      }

    }

    reading = reading.trim();
    return reading;

  }

  function generateRomajiReading(reading, num) {

    // if input has 4 chars & first word is 'issen', change to 'sen'
    if (num < 2000) {
      reading = reading.replace(/^issen/g, 'sen');
    }
    reading = reading.replace(/^sen man/g, 'issen man');
    reading = reading.replace(/^sen oku/g, 'issen oku');
    reading = reading.replace(/^sen chou/g, 'issen chou');

    reading = reading.replace(/san hyaku/g, 'sambyaku');
    reading = reading.replace(/roku hyaku/g, 'roppyaku');
    reading = reading.replace(/hachi hyaku/g, 'happyaku');
    reading = reading.replace(/san sen/g, 'sanzen');
    reading = reading.replace(/hachi sen/g, 'hassen');
    reading = reading.replace(/juu chou/g, 'jutchou');

    return reading.trim();

  }

  function generateHiraganaReading(reading, num) {

    reading = reading.replace(/issen man/g, 'いっせん まん');
    reading = reading.replace(/issen oku/g, 'いっせん おく');
    reading = reading.replace(/issen chou/g, 'いっせん ちょう');

    // if input is 1999 or less & first word is 'issen', change to 'sen'
    if (num < 2000) {
      reading = reading.replace(/^issen/g, 'せん');
    }

    reading = reading.replace(/issen/g, 'いっせん');

    //replace weird readings
    reading = reading.replace(/san hyaku/g, 'さんびゃく');
    reading = reading.replace(/roku hyaku/g, 'ろっぴゃく');
    reading = reading.replace(/hachi hyaku/g, 'はっぴゃく');
    reading = reading.replace(/san sen/g, 'さんぜん');
    reading = reading.replace(/hachi sen/g, 'はっせん');
    reading = reading.replace(/itchou/g, 'いっちょう');
    reading = reading.replace(/juu chou/g, 'じゅっちょう');

    //convert regular words to hiragana
    reading = reading.replace(/zero/g, 'れい');
    reading = reading.replace(/ichi/g, 'いち');
    reading = reading.replace(/ni/g, 'に');
    reading = reading.replace(/san/g, 'さん');
    reading = reading.replace(/yon/g, 'よん');
    reading = reading.replace(/go/g, 'ご');
    reading = reading.replace(/roku/g, 'ろく');
    reading = reading.replace(/nana/g, 'なな');
    reading = reading.replace(/hachi/g, 'はち');
    reading = reading.replace(/kyuu/g, 'きゅう');
    reading = reading.replace(/juu/g, 'じゅう');

    reading = reading.replace(/juu/g, 'じゅう');
    reading = reading.replace(/hyaku/g, 'ひゃく');
    reading = reading.replace(/sen/g, 'せん');
    reading = reading.replace(/man/g, 'まん');
    reading = reading.replace(/oku/g, 'おく');
    reading = reading.replace(/chou/g, 'ちょう');

    return reading;

  }

  //convert regular words to traditional kanji
  function generateTraditionalJapaneseReading(reading, num) {

    reading = reading.replace(/issen man/g, '一千万');
    reading = reading.replace(/issen oku/g, '一千億');
    reading = reading.replace(/issen chou/g, '一千兆');

    // if input is 1999 or less & first word is 'issen', change to 'sen'
    if (num < 2000) {
      reading = reading.replace(/^issen/g, '千');
    }
    reading = reading.replace(/issen/g, '一千');

    // reading = reading.replace(/^sen man/g,'一千万');
    // reading = reading.replace(/^sen oku/g,'一千億');
    // reading = reading.replace(/^sen chou/g,'一千兆');

    reading = reading.replace(/zero/g, '零');
    reading = reading.replace(/itchou/g, '一兆');
    reading = reading.replace(/ichi/g, '一');
    reading = reading.replace(/ni/g, '二');
    reading = reading.replace(/san/g, '三');
    reading = reading.replace(/yon/g, '四');
    reading = reading.replace(/go/g, '五');
    reading = reading.replace(/roku/g, '六');
    reading = reading.replace(/nana/g, '七');
    reading = reading.replace(/hachi/g, '八');
    reading = reading.replace(/kyuu/g, '九');
    reading = reading.replace(/juu/g, '十');
    reading = reading.replace(/hyaku/g, '百');
    reading = reading.replace(/sen/g, '千');
    reading = reading.replace(/man/g, '万');
    reading = reading.replace(/oku/g, '億');
    reading = reading.replace(/chou/g, '兆');

    // strip all spaces from string
    reading = reading.replace(/ /g, '')

    return reading;
  }

  function moveCursorToEnd(el) {
    if (typeof el.selectionStart == "number") {
      el.selectionStart = el.selectionEnd = el.value.length;
    } else if (typeof el.createTextRange != "undefined") {
      el.focus();
      var range = el.createTextRange();
      range.collapse(false);
      range.select();
    }
  }

  $(document).ready(function() {

    $("#userinput").keyup(function() {

      if ($(this).val().length < 17) {
        if ($(this).val() == '0') {
          decNum = 0;
        } else {
          decNum = parseInt($("#userinput").val().replace(/[ ,]/g, '').replace(/^[0]+/g, ''));
        }
        if (decNum != lastNum && !isNaN(decNum)) {
          $("#japanesedigits").text(generateJapaneseDigits(decNum, 10000));
          $("#englishdigits").text(numberWithCommas(decNum));
          $("#englishwords").text(generateEnglishWords(decNum));

          // get a raw reading 
          var raw = generateRawReading(decNum);
          // console.log(raw);
          // if (readingOption == 1)
          $("#japanesewordsromaji").text(generateRomajiReading(raw, decNum));
          // else if (readingOption == 2)
          $("#japanesewordstraditional").text(generateTraditionalJapaneseReading(raw, decNum));
          $("#japanesewordshiragana").text(generateHiraganaReading(raw, decNum));
          lastNum = decNum;
        }
      }

      if ($(this).val().length > 12) {
        $("body").css('font-size', '85%');
        textShrink = true;
      } else if ((textShrink) && ($(this).val().length != 0)) {
        $("body").css('font-size', '100%');
        textShrink = false;
      }

    });

    // trigger Enter keyup
    e = jQuery.Event("keyup");
    e.which = 13 //enter key
    jQuery('#userinput').trigger(e);

    // move cursor to end of input instead of selecting it
    elem = $("#userinput")[0];
    moveCursorToEnd(elem);

    // default numbers on page load
    $("#japanesedigits").text('1万');
    $("#englishdigits").text('10,000');
    $("#englishwords").text('ten thousand');
    $("#japanesewordsromaji").text('ichi man');
    $("#japanesewordstraditional").text('一万');
    $("#japanesewordshiragana").text('いち まん');

  });

})(); // end of IIFE

/*

Numbers which take いち at the beginning:

10^12   いっちょう
10^8    いちおく
10^7    いっせんまん
10^5    いちまん

Other sound changes:

0       ゼロ
300     さんびゃく
600     ろっぴゃく
800     はっぴゃく
3000    さんぜん
8000    はっせん


*/