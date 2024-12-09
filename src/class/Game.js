// Import the shuffleArray utility function
import { shuffleArray } from "../utils/utils";

// Import the Box class
import Box from "./Box";

// Import the Timer class
import Timer from "./Timer";

// Define the Game class
class Game {
	// Private class properties
	#rows; // Number of rows in the game
	#cols; // Number of columns in the game
	#idElement; // ID of the DOM element for the game
	#boxes; // Array to hold the boxes in the game
	element; // DOM element for the game
	timer; // Timer instance for the game

	// Constructor to initialize the Game object
	constructor(rows, cols, idElement = "game") {
		this.#rows = rows; // Set the number of rows
		this.#cols = cols; // Set the number of columns
		this.#idElement = idElement; // Set the DOM element ID
		this.element = document.getElementById(idElement); // Get the DOM element
		this.#boxes = []; // Initialize the boxes array
		this.createBoxes(); // Create the game boxes
		this.paintBoxes(); // Paint the boxes on the screen

		// Add a click event listener to the game element
		this.element.addEventListener("click", () => {
			this.checkOpenBoxes(); // Check the open boxes when the game element is clicked
		});

		this.initTimer(); // Initialize the timer
	}

	// Getter for the number of columns
	get cols() {
		return this.#cols;
	}

	// Getter for the number of rows
	get rows() {
		return this.#rows;
	}

	// Method to check the open boxes and handle game logic
	checkOpenBoxes() {
		// Filter the boxes to find the ones that are open and free
		let nOpenBoxes = this.#boxes.filter((box) => box.open && box.free);
		// If exactly two boxes are open
		if (nOpenBoxes.length == 2) {
			// Check if the colors of the two boxes match
			if (nOpenBoxes[0].color === nOpenBoxes[1].color) {
				// Set both boxes to not free
				nOpenBoxes.map((box) => {
					box.free = false;
				});
				this.arrayBoxesToLocalStorage(); // Save the updated boxes to localStorage
			} else {
				// If colors don't match, reset the boxes' colors after a delay
				setTimeout(() => {
					nOpenBoxes.map((box) => {
						box.resetColor(); // Reset the color of the box
					});
				}, 250); // Delay of 250ms
			}
		} else {
			this.arrayBoxesToLocalStorage(); // Save the boxes to localStorage
		}
		this.checkFinishGame(); // Check if the game has been finished
	}

	// Method to check if the game is finished
	checkFinishGame() {
		// Filter the boxes to find the ones that are still free
		let freeBox = this.#boxes.filter((box) => box.free);
		// If no free boxes remain
		if (freeBox.length === 0) {
			setTimeout(() => {
				this.timer.stop(); // Stop the timer
				alert("Juego finalizado"); // Show an alert indicating the game is finished
			}, 200); // Delay of 200ms
		}
	}

	// Method to create random colors for the boxes
	createRandomColors() {
		let randomColors = []; // Initialize an array for random colors
		// Generate random colors for half the total number of boxes
		for (let index = 0; index < (this.#cols * this.#rows) / 2; index++) {
			let red = Math.floor(Math.random() * 256); // Generate a random red value
			let green = Math.floor(Math.random() * 256); // Generate a random green value
			let blue = Math.floor(Math.random() * 256); // Generate a random blue value
			let color = `rgb(${red}, ${green}, ${blue})`; // Create the RGB color string
			randomColors.push(color); // Add the color to the array
		}
		randomColors = [...randomColors, ...randomColors]; // Duplicate the colors to create pairs
		shuffleArray(randomColors); // Shuffle the colors randomly
		return randomColors; // Return the shuffled colors
	}

	// Method to create the game boxes
	createBoxes() {
		this.#boxes = []; // Reset the boxes array
		// Check if boxes data exists in localStorage
		if (localStorage.getItem("boxes") !== null) {
			// Parse the boxes data from localStorage
			let boxesFromLocalStorage = JSON.parse(localStorage.getItem("boxes"));
			// Create Box objects from the stored data
			boxesFromLocalStorage.map((box) => {
				let newBox = new Box(box.row, box.col, box.color, box.free, box.open);
				this.#boxes.push(newBox); // Add the new Box object to the array
			});
		} else {
			// If no stored data, generate random colors and create new boxes
			let randomColors = this.createRandomColors(); // Generate random colors
			for (let row = 0; row < this.#rows; row++) {
				for (let col = 0; col < this.#cols; col++) {
					let color = randomColors.shift(); // Get the next color from the array
					let newBox = new Box(row, col, color); // Create a new Box object
					this.#boxes.push(newBox); // Add the Box object to the array
				}
			}
			this.arrayBoxesToLocalStorage(); // Save the boxes to localStorage
		}
	}

	arrayBoxesToLocalStorage() {
		let arrayBoxesToLocalStorage = this.#boxes.map((box) => {
			return {
				row: box.row,
				col: box.col,
				color: box.color,
				free: box.free,
				open: box.open,
			};
		});
		localStorage.setItem("boxes", JSON.stringify(arrayBoxesToLocalStorage));
	}

	// Method to paint the boxes on the game board
	paintBoxes() {
		// Create a header element for the game
		let header = document.createElement("header");
		header.setAttribute("id", "boxHeader"); // Set an ID for the header element

		this.element.appendChild(header); // Append the header to the game element

		// Create a container for the boxes
		let boxContainer = document.createElement("div");
		boxContainer.setAttribute("id", "boxContainer"); // Set an ID for the container
		this.element.appendChild(boxContainer); // Append the container to the game element

		this.setCSSBoxTemplates(); // Set the CSS grid template for the boxes
		// Iterate over each box in the boxes array
		this.#boxes.map((box) => {
			// Create a new div for the box
			let newBoxDiv = document.createElement("div");
			newBoxDiv.classList.add("box"); // Add the "box" class to the div
			// If the box is not free or is open, set its background color
			if (!box.free || box.open) {
				newBoxDiv.style.backgroundColor = box.color;
			}
			box.element = newBoxDiv; // Assign the box div to the box object
			box.addEventClick(); // Add a click event to the box
			boxContainer.appendChild(newBoxDiv); // Append the box div to the container
		});
	}

	// Method to initialize the timer for the game
	initTimer() {
		// Create an h2 element for the timer
		let timerContainer = document.createElement("h2");
		timerContainer.setAttribute("id", "timerContainer"); // Set an ID for the timer container
		timerContainer.innerHTML = '<span id="timer">00:00:00</span>'; // Set the initial timer value

		let header = document.getElementById("boxHeader"); // Get the header element
		header.appendChild(timerContainer); // Append the timer to the header
		this.timer = new Timer(); // Create a new Timer instance
		this.timer.start(); // Start the timer
	}

	// Method to set the CSS grid templates for the boxes
	setCSSBoxTemplates() {
		let boxContainer = document.getElementById("boxContainer"); // Get the container for the boxes
		// Set the grid template columns based on the number of columns
		boxContainer.style.gridTemplateColumns = `repeat(${this.cols}, 1fr)`;
		// Set the grid template rows based on the number of rows
		boxContainer.style.gridTemplateRows = `repeat(${this.rows}, 1fr)`;
	}

	// Static method to get the number of rows and columns
	static getRowsCols() {
		let rows, cols; // Initialize variables for rows and columns

		// Check if rows and columns are stored in localStorage
		if (
			localStorage.getItem("rows") !== null &&
			localStorage.getItem("cols") !== null
		) {
			rows = parseInt(localStorage.getItem("rows")); // Retrieve rows from localStorage
			cols = parseInt(localStorage.getItem("cols")); // Retrieve columns from localStorage
		} else {
			// Prompt the user to enter the number of rows and columns
			rows = parseInt(prompt("Introduzca el número de filas"));
			cols = parseInt(prompt("Introduzca el número de columnas"));
			// Ensure the total number of boxes is even and betweent 1 and 8, both included.
			while (
				rows < 1 ||
				rows > 8 ||
				cols < 1 ||
				cols > 8 ||
				(rows * cols) % 2 !== 0
			) {
				alert(
					"El producto de los números de filas y columnas deben ser par y desde 1 al 8. Vuelva a introducir los datos." // Alert if the number of cards is odd
				);
				rows = parseInt(prompt("Introduzca el número de filas")); // Prompt for rows again
				cols = parseInt(prompt("Introduzca el número de columnas")); // Prompt for columns again
			}

			localStorage.setItem("rows", rows); // Store the rows in localStorage
			localStorage.setItem("cols", cols); // Store the columns in localStorage
		}

		// Return an object containing the rows and columns
		return {
			rows: rows,
			cols: cols,
		};
	}

	// Static method to reset the game
	static resetGame() {
		localStorage.removeItem("cols"); // Remove columns from localStorage
		localStorage.removeItem("rows"); // Remove rows from localStorage
		localStorage.removeItem("boxes"); // Remove boxes from localStorage
		localStorage.removeItem("timer"); // Remove timer data from localStorage
		location.reload(); // Reload the page to reset the game
	}
}
// Export the Game class as the default export
export default Game;
