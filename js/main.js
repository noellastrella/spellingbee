//using lodash



var words;
var letters = [];

// Make the fetch request with the provided options
fetch('/js/wordlist/index.json')
  .then(response => {
    // Check if the request was successful
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // Parse the response as JSON
    return response.json();
  })
  .then(data => {
    // Handle the JSON data
    words = data.reduce((acc,curr)=>{
        curr.length > 3 && acc.push(curr)
        return acc;
    }, [])

    init();
    console.log(data);
  })
  .catch(error => {
    // Handle any errors that occurred during the fetch
    console.error('Fetch error:', error);
  });

function init(){
    let vowels = "AEIOU".split("");
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let consonants = "BCDFGHJKLMNPQRSTVWXYZ".split("");

    let letters = [];
    
    //letters.push(_.sample(vowels));  //lodash
    //letters.push(_.sampleSize(alphabet,6)); //lodash

    letters.push(
        [...vowels
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value).splice(0,1) ]
    );

    letters.push(
        [...alphabet
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value).splice(0,6) ]
    );

    letters = letters.flat();
    
    document.querySelectorAll(".hex").forEach((e,i)=>{
        e.addEventListener("click", addLetter);
        e.querySelector("polygon").setAttribute("data-letter", letters[i]);
        e.querySelector("text").innerHTML = letters[i];
        
    })

    function addLetter(e){
        console.log(e.target.dataset["letter"])
    }

    console.log("LETTERS: ", letters);
}