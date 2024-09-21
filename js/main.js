var words;
var letters = [];
var guessArray = []
var guess = "";

fetch('/js/wordlist/index.json')
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
    
    console.log(data.length, data);
    init();
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

function init(){
    let vowels = "AEIOU".split("");
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let consonants = "BCDFGHJKLMNPQRSTVWXYZ".split("");
    let lettersJoined;

    let letters = [];

    letters.push(
        [...vowels
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value).splice(0,1) ]
    );

    letters.push(
        [...consonants
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value).splice(0,6) ]
    );

    letters = ["A", "A", "H", "E", "D"]

    lettersJoined = letters.join("").toLowerCase();

    let words_filtered = words.reduce( (acc,curr, i)=>{
      const regex = new RegExp(`\s^[${lettersJoined}]+$\s`, "g"); 
      
      if(i<40){
        console.log(regex.test(curr), curr, lettersJoined.toLowerCase())
      }

      if(regex.test(curr)) acc.push(curr);

      return acc;
    },[]);
    
    console.log(">>>", words_filtered.length, words_filtered, lettersJoined);

    document.querySelectorAll(".hex").forEach((e,i)=>{
        e.addEventListener("click", addLetter);
        e.querySelector("polygon").setAttribute("data-letter", letters[i]);
        e.querySelector("text").innerHTML = letters[i];
    });

    document.querySelector("#buttons_container").addEventListener("click", (e)=>{
      console.log(e.target)
      if(e.target==="delete"){

      }else if(e.target==="submit"){

      }
      updateState();
    })

    function addLetter(e){
      guessArray.push(e.target.dataset["letter"]);
      updateState();
    }

    function updateState(){
      document.querySelector("#text").innerText = guessArray.join("");
    }
}