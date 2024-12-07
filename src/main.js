// Import the main Sass file for styles
import "../sass/main.scss";

// Import the Game class from the specified path
import Game from "./class/Game";

// Get the reset button element from the DOM
let resetButton = document.getElementById("reset");

// Add a click event listener to the reset button
resetButton.addEventListener("click", () => {
	// Call the resetGame method from the Game class when the reset button is clicked
	Game.resetGame();
});

// Get the rows and columns data by calling the getRowsCols method from the Game class
let data = Game.getRowsCols();

// Create a new instance of the Game class using the retrieved data and specify "game" as an identifier
let game = new Game(data.rows, data.cols, "game");
