// Books books books
let infinite = {
    title:"Infinite Jest",
    body: [
	   "Written by David Foster Wallace",
	   "Hal Incandenza is the youngest of the Incandenza children.",
	   "As a child, he was very precocious."
	   ]
}
    let galaxy = {
	title:"The Hitchhiker's Guide to the Galaxy",
	body: [
	       "What is the answer to the meaning of life, the universe, and everything?",
	       "Douglas Adams meant it as a joke,",
	       "but a new book shows how the number 42 has played a significant role in history."
	       ]
    }

	function bookReader(book) {
	    console.log("Title: " + book.title);
	    //pagenumberer
	    for (let i = 0; i < book.body.length; i++) {
		console.log("Page " + (i+1) + ": " + book.body[i]);
	    } 
	}

bookReader(infinite);
console.log("\n"); //divider
bookReader(galaxy);