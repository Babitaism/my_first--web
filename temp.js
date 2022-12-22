// main.js

// POST request using fetch()
fetch("/test", {
	
	method: "POST",
	
	// Adding body or contents to send
	body: JSON.stringify({
		title: "poo",
		body: "bar",
		userId: 1
	}),
	
	// Adding headers to the request
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	}
})

// Converting to JSON
.then(response => response.json()) //igonre this

// Displaying results to console
.then((json) => { 
    console.log(json)
});

//
fetch("/editClickTab", {
    method: "POST",

    // Adding body or contents to send
      body: JSON.stringify({
        userId: userId
       
       }),
      headers: {
      "Content-type": "application/json; charset=UTF-8"
      }

   })

// Converting to JSON
.then(response => response.json()) //igonre this

// Displaying results to console
.then((json) => {
console.log(json)
})
