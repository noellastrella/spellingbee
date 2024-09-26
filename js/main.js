var words;
var letters = [];
var guessArray = [];
var guessesArray = [];
var wordFile = "";
var score = 0;

wordFile = '/js/wordlist/words100k.json';  //'/js/wordlist/words273k.json'

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
    }, [])
    
    init();
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
  
function init(){
    let vowels = "AEIOU".split("");
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");    
    let consonants = alphabet.reduce((acc,curr)=>vowels.includes(curr) ? acc: [...acc, curr],[]);

    letters.push(
        [...vowels.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value).splice(0,1) ]
    );

    letters.push(
        [...consonants.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value).splice(0,6) ]
    );
    
    letters = letters.flat()
    
    document.querySelectorAll(".hex").forEach((e,i)=>{
        e.addEventListener("click", addLetter);
        e.querySelector("polygon").setAttribute("data-letter", letters[i]);
        e.querySelector("text").innerHTML = letters[i];
    });

    document.querySelector("#buttons_container").addEventListener("click", (e)=>{
      let msg = "";

      if(e.target.id==="delete"){
        guessArray.pop();
      }else if(e.target.id==="submit"){
          msg = "Enter a word"
          if(guessArray.length > 0 && guessArray.length <4 ){
            msg = "Word Too Short";
          }else{
            msg = checkWord();
          }
          document.querySelector("#alert").innerHTML = msg;
      }

      updateState();
    })

    function addLetter(e){
      guessArray.push(e.target.dataset["letter"]);
      updateState();
    }

    function updateState(){
      document.querySelector("#word_list").innerHTML = guessesArray.reduce((acc,curr)=>acc+=`<li>${curr.guess} (${curr.score})</li>`,"")
      document.querySelector("#text").innerText = guessArray.join("");
      document.querySelector("#score").innerText = score;
    }

    function checkWord(){
      let guessTemp = guessArray.join("").toLowerCase();

      if(!guessTemp.includes(letters[letters.length-1].toLowerCase())) return "MUST USE MIDDLE WORD"
      
      if(words.includes(guessTemp)){
          if(guessesArray.includes(guessTemp)){
            return "Word already used";
          }else{
            let scoreTemp = guessTemp.length-3;
            guessesArray.push({
              guess: guessTemp,
              score: scoreTemp
            });
            score+=scoreTemp;
            guessArray = [];
            return "...";
          }
      }else{
        return "Not a word";
      }
    }
}