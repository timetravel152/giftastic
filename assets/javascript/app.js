$(document).ready(function() {

var giftasticObj = {
	tvShows: ["Seinfeld", "Friends", "Brooklyn 99", "The Simpsons", "Futurama", "Adventure Time", "Bee and Puppycat", "The Office", "Stranger Things", "Breaking Bad"],
	currentSelection: "",
	userInput: "",
	giphyApiUrl: "https://api.giphy.com/v1/gifs/search?",
	giphyApiKey: "dc6zaTOxFJmzC",
	renderButtons: function() {
		// first empty the buttons bar/column
		$("#buttonsBar").empty();
		// then cycle through the tvShows array and populate the buttons
		for (var i = 0; i < this.tvShows.length; i++) {
			var a = $("<button>");
			a.addClass("buttons btn btn-info");
			a.attr("data-name", this.tvShows[i]);
			a.text(this.tvShows[i]);
			$("#buttonsBar").append(a);
		}
		// then add on-clicks for each of the buttons
		$(".buttons").on("click", function() {
			// console.log("button pressed");
			// in this case, this refers to the button clicked
			giftasticObj.currentSelection = $(this).attr("data-name");
			giftasticObj.displayGifs();
		});
	},
	displayGifs: function() {
		console.log(this.currentSelection);
		// first build the ajax query based on current button clicked
		var tvShowToDisplay = this.currentSelection;
		// use an &limit of 12 to grab 12 images
		var queryURL = this.giphyApiUrl + "&q=" + tvShowToDisplay + "&limit=12&api_key=" + this.giphyApiKey;

		// make the ajax query and store the response
		$.ajax({url: queryURL, method: "GET"}).done(function(response) {
			console.log(response);
			// begin by emptying out the gifsWindow div
			$("#gifsWindow").empty();
			for (var i = 0; i < response.data.length; i++) {
				var showObject = response.data[i];
				var showStill = response.data[i].images.fixed_height_small_still.url;
				var showMoving = response.data[i].images.fixed_height_small.url;
				var showRating = response.data[i].rating;
				console.log("Object: " + showObject);
				console.log("Still: " + showStill);
				console.log("Moving: " + showMoving);
				console.log("Rating: " + showRating);

				var showDiv = $("<div class='show col-md-4'>");
				// first in the div will be the rating
				var pOne = $("<p>").text("Rating: " + showRating);
				// append the rating into the div
				showDiv.append(pOne);
				// next will come the image starting in still mode
				var image = $("<img>").attr("src", showStill);
				// attach a myShowImage class to the image and store
				// the still image and the moving image links in data attributes
				image.addClass("myShowImage");
				image.attr("data-still", showStill);
				image.attr("data-moving", showMoving);
				// append the image into the div
				showDiv.append(image);
				// finally append the constructed div into the gifsWindow div
				$("#gifsWindow").append(showDiv);
			}

			// create on clicks for each image that has been displayed
			$(".myShowImage").on("click", function() {
		
				if ($(this).attr("src") == $(this).attr("data-still")) {
					$(this).attr("src", $(this).attr("data-moving"));
				} else if ($(this).attr("src") == $(this).attr("data-moving")) {
					$(this).attr("src", $(this).attr("data-still"));
				}

			});

		});
	}
};

$("#addTvShow").on("click", function() {
	giftasticObj.userInput = $("#tvShowInput").val().trim();
	// ignore submit button click if nothing has been entered
	// because we don't want to create empty buttons
	if (giftasticObj.userInput != "") {
		// add the tv show to the array and render buttons again
		giftasticObj.tvShows.unshift(giftasticObj.userInput);
		giftasticObj.renderButtons();
	}
	// reset the form
	$("input#tvShowInput").val("");
	return false;
});


// begin by rendering buttons at start of page load or upon refresh
giftasticObj.renderButtons();

// end document.ready function
});