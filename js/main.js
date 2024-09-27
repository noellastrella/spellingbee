//Didn't want to pay NYT subscription and wanted to make this game on my own
var possibleWords // dirty cheat
(()=>{
  let vowels = "AEIOU".split("");
  let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");    
  let consonants = alphabet.reduce((acc,curr)=>vowels.includes(curr) ? acc: [...acc, curr],[]);
  var letters, lettersOpp, guessArray, guessesArray, score;
  var minPossibleAllowed = 20;
  var minPossibleScore = 100;
  var words;

  var wordFile = './js/wordlist/wordsFiltered.json' +"?num="+Math.random();  //'/js/wordlist/words273k.json'

  document.querySelector("#custom_letters").addEventListener("submit", (e)=>{ 
    e.preventDefault();
    init(document.querySelector("#customLetters").value.toUpperCase().split(""));
  });
    
  document.querySelector("#reset").addEventListener("click", e=>{
    e.preventDefault();
      init();
      updateState();
  });

  document.querySelector("#buttons_container").addEventListener("click", (e)=>{
    let msg = " ";

    if(e.target.id==="delete"){
      guessArray.pop();
    }else if(e.target.id==="submit"){
        msg = "Enter a word"
        if(guessArray.length > 0 && guessArray.length <4 ){
          msg = "Word Too Short";
        }else{
          msg = checkWord();
        }
    }
    updateState(msg);
  });

  fetch(wordFile)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      words = data.reduce((acc,curr)=>{
          curr.length > 3 && acc.push(curr)
          return acc;
      }, []);
      init();
    })
    .catch(error => console.error('Fetch error:', error) );

  async function init(lettersTemp = []){
      lettersOpp = [];
      guessArray = [];
      guessesArray = [];
      console.log(lettersTemp)
      if(lettersTemp.length > 1){
        letters = lettersTemp;
      }else{
        letters = [];
        letters.push( [...vowels.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value).splice(0,1) ] );
        letters.push( [...consonants.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value).splice(0,6) ] );
        letters = letters.flat();
        document.querySelector("#customLetters").value = letters.join("").toUpperCase()
      }

      score = 0;

      lettersOpp = alphabet.reduce((acc,curr)=>{
        acc = letters.includes(curr) ? acc : [...acc, curr];
        return acc;
      },[]);

      updateLetters();

      const msg = await findMatches();
      
      if((msg.words.length < minPossibleAllowed) || msg.maxScore < minPossibleScore){
        if(lettersTemp.length > 1){
          alert(`Not enough words can be generated from ${lettersTemp.join(', ')}`)
        }else{
          init(); //redo this cuz theres not enough possible words
        }
      } 
      possibleWords = msg;
      document.querySelector("#possible_matches").innerHTML = msg.words.length;
      document.querySelector("#max_score").innerHTML = msg.maxScore;
  }

  function updateLetters(){
    document.querySelectorAll(".hex").forEach((e,i)=>{
      e.addEventListener("click", addLetter);
      e.querySelector("polygon").setAttribute("data-letter", letters[i]);
      e.querySelector("text").innerHTML = letters[i];
    });
  }

  function addLetter(e){
    guessArray.push(e.target.dataset["letter"]);
    updateState(" ");
  }

  function updateState(msg=" "){
    document.querySelector("#word_list").innerHTML = guessesArray.reduce((acc,curr)=>acc+=`<li>${curr} (${getScore(curr)})</li>`,"")
    document.querySelector("#text").innerText = guessArray.join("");
    document.querySelector("#score").innerText = score;
    document.querySelector("#alert").innerHTML = msg;
  }

  function findMatches(){
    let maxScore = 0
    return new Promise((resolve)=>{
      let matches = words.reduce((acc,curr,i)=>{
        let pass = true;
        if(!curr.includes(letters[letters.length-1].toLowerCase())){
            pass = false;
        }else{
          lettersOpp.forEach(e=>{
            if(curr.includes(e.toLowerCase())) pass = false;
          })
        }
  
        if(pass) {
          acc.push(curr)
          maxScore += getScore(curr);
        };
        
        return acc;
      },[]);

      resolve({words:matches, maxScore: maxScore});
    })
  }

  function checkWord(){
    let guessTemp = guessArray.join("").toLowerCase();
    if(!guessTemp.includes(letters[letters.length-1].toLowerCase())) return "MUST USE MIDDLE LETTER"
    if(words.includes(guessTemp)){
        if(guessesArray.includes(guessTemp)){
          return "Word already used";
        }else{
          let scoreTemp = getScore(guessTemp);
          guessesArray.push(guessTemp);
          score+=scoreTemp;
          guessArray = [];
          return "...";
        }
    }else{
      return "Not a word";
    }
  }

  function getScore(temp){
    return temp.length-3;
  }
})();