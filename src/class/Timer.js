// Define the Timer class
class Timer {
	// Declare class properties
	min; // Minutes counter
	sec; // Seconds counter
	ms; // Milliseconds counter
	count; // Interval ID for controlling the timer
	malt; // Formatted minutes
	salt; // Formatted seconds
	msalt; // Formatted milliseconds
	idElement; // ID of the DOM element to display the timer

	// Constructor method to initialize the Timer
	constructor(idElement = "timer") {
		this.idElement = idElement; // Set the ID of the DOM element for the timer display

		// Check if a timer object exists in localStorage
		if (localStorage.getItem("timer") !== null) {
			// Parse the timer data from localStorage
			let timerFromLocalStorage = JSON.parse(localStorage.getItem("timer"));
			// Initialize seconds and milliseconds from stored data
			this.sec = parseInt(timerFromLocalStorage.sec);
			this.min = 0; // Initialize minutes to 0
			this.ms = parseInt(timerFromLocalStorage.ms);
		} else {
			// If no stored timer data exists, initialize all counters to 0
			this.ms = 0;
			this.min = 0;
			this.sec = 0;
		}
	}

	// Method to start the timer
	start() {
		// Start an interval that updates every 10 milliseconds
		this.count = setInterval(() => {
			// Check if milliseconds have reached 100
			if (this.ms == 100) {
				this.ms = 0; // Reset milliseconds to 0
				// Check if seconds have reached 60
				if (this.sec == 60) {
					this.sec = 0; // Reset seconds to 0
					this.min++; // Increment the minutes counter
				} else {
					// Every 2 seconds, save the timer state to localStorage
					if (this.sec % 2 == 0) {
						let timerObject = {
							sec: this.sec,
							ms: this.ms,
							min: this.min,
						};
						// Store the timer state as a JSON string in localStorage
						localStorage.setItem("timer", JSON.stringify(timerObject));
					}
					this.sec++; // Increment the seconds counter
				}
			} else {
				this.ms++; // Increment the milliseconds counter
			}

			// Format minutes, seconds, and milliseconds with padding
			this.malt = this.pad(this.min);
			this.salt = this.pad(this.sec);
			this.msalt = this.pad(this.ms);

			// Update the timer display
			this.update(this.malt + ":" + this.salt + ":" + this.msalt);
		}, 10); // Run the interval every 10 milliseconds
	}

	// Method to stop the timer
	stop() {
		clearInterval(this.count); // Clear the interval to stop the timer
	}

	// Method to update the DOM element with the current timer value
	update(txt) {
		let temp = document.getElementById(this.idElement); // Get the DOM element by ID
		temp.firstChild.nodeValue = txt; // Update the text content of the element
	}

	// Method to pad single-digit numbers with a leading zero
	pad(time) {
		let temp; // Temporary variable to hold the formatted time
		if (time < 10) {
			temp = "0" + time; // Add a leading zero for single-digit numbers
		} else {
			temp = time; // Use the original value for double-digit numbers
		}
		return temp; // Return the formatted time
	}
}

// Export the Timer class as the default export
export default Timer;
