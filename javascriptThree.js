var queryString = "http://api.giphy.com/v1/gifs/search?api_key=rEpq8NQb0jsV5UBQdOVZUFNS0phzzB3d&limit=10&q="
function buildQueryURL() {
  // queryURL is the url we'll use to query the API
  var queryURL = "http://api.giphy.com/v1/gifs/search?";
  // Begin building an object to contain our API call's query parameters
  // Set the API key
  var queryParams = { "api_key": "rEpq8NQb0jsV5UBQdOVZUFNS0phzzB3d" , "limit": 10 };
  // Grab text the user typed into the search input, add to the queryParams object
  queryParams.q = $("#search-term")
    .val()
    .trim();
  // Logging the URL so we have access to it for troubleshooting
  console.log("---------------\nURL: " + queryURL + "\n---------------");
  console.log(queryURL + $.param(queryParams));
  return queryURL + $.param(queryParams);
}
//store giphyData
/**
 * takes API data (JSON/object) and turns it into elements on the page
 * @param {object} giphyData - object containing Giphy API data
 */
function updatePage(giphyData) {
  // Get from the form the number of results to display
  var numGifs = giphyData.data.length;

  // Log the data to console, where it will show up as an object
  console.log(giphyData);
  console.log("------------------------------------");

  // Loop through and build elements for the defined number of gifs
  for (var i = 0; i < numGifs; i++) {
    // Get specific article info for current index
    var gif = giphyData.data[i];
    var iframe = "<img src='" + gif.images.downsized.url + "' data-still='" + 
    gif.images.downsized_still + "' data-animate='" + gif.images.downsized +
     "' class='gif'>";
    $("#gif-section").append(iframe);
  }
}
// Function to empty out the articles
function clear() {
  $("#article-section").empty();
}
// CLICK HANDLERS
// ==========================================================
// .on("click") function associated with the Search Button
$("#run-search").on("click", function(event) {
  // This line allows us to take advantage of the HTML "submit" property
  // This way we can hit enter on the keyboard and it registers the search
  // (in addition to clicks). Prevents the page from reloading on form submit.
  event.preventDefault();
  // Empty the region associated with the articles
  clear();
  // Build the query URL for the ajax request to the NYT API
  var queryURL = buildQueryURL();
  // Make the AJAX request to the API - GETs the JSON data at the queryURL.
  // The data then gets passed as an argument to the updatePage function
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(updatePage);
});
// $(iframe).click(function() {
//   console.log( "You clicked a paragraph!" );
// });
$(".gif").on("click", function() {
  console.log("clickworked")
  // The attr jQuery method allows us to get or set the value of any attribute on our HTML element
  var state = $(this).attr("data-state");
  // If the clicked image's state is still, update its src attribute to what its data-animate value is.
  // Then, set the image's data-state to animate
  // Else set src to the data-still value
  if (state === "still") {
    $(this).attr("src", $(this).attr("data-animate"));
    $(this).attr("data-state", "animate");
  } else {
    $(this).attr("src", $(this).attr("data-still"));
    $(this).attr("data-state", "still");
  }
});
//  .on("click") function associated with the clear button
$("#clear-all").on("click", clear);
var movies = ["white", "blue", "red", "yellow", "black"];
// displayMovieInfo function re-renders the HTML to display the appropriate content


function extractGifData(gifCollection){
  var data = []
  // console.log(gifCollection)
  for (var i = 0; i < gifCollection.length; i++){
    
    var gifInfo = {

      still: gifCollection[i].images.downsized_still.url,
      animate: gifCollection[i].images.downsized.url
    }
    // console.log("object made", gifInfo)
    data.push(gifInfo);
  }
  return data
}

function buildImageElement(data){
  var image = $("<img>")
  image.addClass("gifSingle")
  image.attr("src", data.still)
  image.attr("data-still", data.still)
  image.attr("data-animate", data.animate)
  image.attr("data-state", "still")

  return image

}
function handleAnimateImage(){

  if(this.dataset.state === "animated"){
    console.log(true)
    $(this).attr("src",this.dataset.still)
    $(this).attr("data-state", "still")
    console.log(this)
  }
  else if(this.dataset.state === "still"){
    console.log(false)
    $(this).attr("src",this.dataset.animate)
    $(this).attr("data-state", "animated")
  }
}


function appendImagesToDom(gifInfo){
  $("#movies-view").empty();
  var images = []
  for(var i=0; i<gifInfo.length; i++){
    images.push(buildImageElement(gifInfo[i]))
  }
  $("#movies-view").append(images);
  $(".gifSingle").on("click", handleAnimateImage);
}
function displayMovieInfo() {
  var movie = $(this).attr("data-name");
  var queryURL = queryString + movie
  console.log(queryURL)
//   var queryURL = "https://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
  // Creating an AJAX call for the specific movie button being clicked
  
  
  
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    // console.log(response.data[0].images.downsized_still)
    // var gifData = {sitll: response.data[0].images.downsized_still.url, animate:response.data[0].images.downsized.url}
    // console.log(gifData)
    // extractGifData(response.data)
    
    var gifInfo = extractGifData(response.data)
    // var testel = buildImageElement(gifInfo[0])
    // console.log(testel)

    appendImagesToDom(gifInfo);
    // Creating a div to hold the movie
  //   var movieDiv = $("<div class='movie'>");
  //   // Storing the rating data
  //   var rating = response.Rated;
  //   // Creating an element to have the rating displayed
  //   var pOne = $("<p>").text("Rating: " + rating);
  //   // Displaying the rating
  //   movieDiv.append(pOne);
  //   // Storing the release year
  //   var released = response.Released;
  //   // Creating an element to hold the release year
  //   var pTwo = $("<p>").text("Released: " + released);
  //   // Displaying the release year
  //   movieDiv.append(pTwo);
  //   // Storing the plot
  //   var plot = response.Plot;
  //   // Creating an element to hold the plot
  //   var pThree = $("<p>").text("Plot: " + plot);
  //   // Appending the plot
  //   movieDiv.append(pThree);
  //   // Retrieving the URL for the image
  //   var imgURL = response.Poster;
  //   // Creating an element to hold the image
  //   var image = $("<img>").attr("src", imgURL);
  //   // Appending the image
  //   movieDiv.append(image);
  //   // Putting the entire movie above the previous movies
  //   $("#movies-view").prepend(movieDiv);
  });

}
// Function for displaying movie data
function renderButtons() {
  // Deleting the movies prior to adding new movies
  // (this is necessary otherwise you will have repeat buttons)
  $("#buttons-view").empty();
  // Looping through the array of movies
  for (var i = 0; i < movies.length; i++) {
    // Then dynamicaly generating buttons for each movie in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    var a = $("<button>");
    // Adding a class of movie-btn to our button
    a.addClass("movie-btn");
    // Adding a data-attribute
    a.attr("data-name", movies[i]);
    // Providing the initial button text
    a.text(movies[i]);
    // Adding the button to the buttons-view div
    $("#buttons-view").append(a);
  }
}
// This function handles events where a movie button is clicked
$("#add-movie").on("click", function(event) {
  event.preventDefault();
  // This line grabs the input from the textbox
  var movie = $("#movie-input").val().trim();
  // Adding movie from the textbox to our array
  movies.push(movie);
  // Calling renderButtons which handles the processing of our movie array
  renderButtons();
});
// Adding a click event listener to all elements with a class of "movie-btn"
$(document).on("click", ".movie-btn", displayMovieInfo);
// Calling the renderButtons function to display the intial buttons
renderButtons();