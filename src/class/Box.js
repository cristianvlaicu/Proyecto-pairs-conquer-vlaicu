// Define the Box class
class Box {
	// Private properties
	#col; // Column position of the box
	#row; // Row position of the box
	#color; // Color of the box
	#free; // Whether the box is free (not matched yet)
	#open; // Whether the box is currently open
	#element; // DOM element representing the box

	// Constructor to initialize a Box instance
	constructor(row, col, color, free = true, open = false) {
		this.#col = col; // Set the column position
		this.#row = row; // Set the row position
		this.#color = color; // Set the color of the box
		this.#free = free; // Set whether the box is free
		this.#open = open; // Set whether the box is open
	}

	// Getter for the column property
	get col() {
		return this.#col;
	}

	// Getter for the row property
	get row() {
		return this.#row;
	}

	// Getter for the open property
	get open() {
		return this.#open;
	}

	// Getter for the free property
	get free() {
		return this.#free;
	}

	// Getter for the color property
	get color() {
		return this.#color;
	}

	// Setter for the element property
	set element(element) {
		this.#element = element;
	}

	// Setter for the free property
	set free(newValue) {
		this.#free = newValue;
	}

	// Method to add a click event listener to the box
	addEventClick() {
		// Check if the box has an associated DOM element
		if (this.#element) {
			// Add a click event listener to the element
			this.#element.addEventListener("click", (e) => {
				// If the box is not already open
				if (!this.#open) {
					this.#element.style.backgroundColor = this.#color; // Set the background color to the box's color
					this.#open = true; // Mark the box as open
				}
				return false; // Prevent default event behavior
			});
		}
	}

	// Method to reset the color of the box
	resetColor() {
		this.#element.style.backgroundColor = "black"; // Reset the background color to black
		this.#open = false; // Mark the box as closed
	}
}

// Export the Box class as the default export
export default Box;
