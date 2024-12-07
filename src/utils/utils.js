// Function to shuffle the elements of an array randomly
function shuffleArray(array) {
	// Initialize the currentIndex to the length of the array
	let currentIndex = array.length;

	// While there are still elements to shuffle...
	while (currentIndex != 0) {
		// Generate a random index from the remaining elements
		let randomIndex = Math.floor(Math.random() * currentIndex);
		// Decrement the currentIndex
		currentIndex--;

		// Swap the element at the currentIndex with the one at the randomIndex
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex],
			array[currentIndex],
		];
	}
}

// Export the shuffleArray function for use in other files
export { shuffleArray };
