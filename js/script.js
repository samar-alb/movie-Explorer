/**
 * Movie Explorer Application
 * 
 * This script handles the interaction with the OMDB API to search for movie information,
 * display results dynamically, and manage user interactions.
 */
// API Key for OMDB API 
const API_KEY = 'd748d20e'; // OMDB API key
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`; // Base API endpoint

// DOM Elements
const movieForm = document.getElementById('movieForm'); // Search form element
const movieTitleInput = document.getElementById('movieTitle'); // Movie title input field
const randomBtn = document.getElementById('randomBtn'); // Random movie button
const clearBtn = document.getElementById('clearBtn'); // Clear results button
const resultsDiv = document.getElementById('results'); // Container for displaying results
const errorMessageDiv = document.getElementById('errorMessage');  // Error message container

// Array of random movie titles for the random button
const randomMovies = [
    'Inception', 'The Shawshank Redemption', 'Pulp Fiction', 
    'The Godfather', 'The Dark Knight', 'Fight Club',
    'Forrest Gump', 'The Matrix', 'Interstellar'
];

/**
 * Event Listeners Setup
 * 
 * Implements three different event types as required:
 * 1. Form submission (submit event)
 * 2. Button click (click event)
 * 3. Keyboard input (keyup event)
 */

// 1. Form submission handler - triggers movie search
movieForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission
    const title = movieTitleInput.value.trim(); // Get and clean input
    if (title) {
        fetchMovie(title); // Valid input - fetch movie
    } else {
        showError('Please enter a movie title'); // Show error for empty input
    }
});

// 2. Random movie button click handler
randomBtn.addEventListener('click', function() {
    // Select a random title from our predefined list
    const randomTitle = randomMovies[Math.floor(Math.random() * randomMovies.length)];
    movieTitleInput.value = randomTitle; // Populate input field
    fetchMovie(randomTitle); // Fetch the random movie
});

// 3. Keyboard input handler (keyup event) - demonstrates third event type
movieTitleInput.addEventListener('keyup', function(e) {
    if (e.key !== 'Enter') {
        console.log('Typing:', e.target.value); // Log typing activity
    }
});

// Clear button click handler - removes all results
clearBtn.addEventListener('click', clearResults);

/**
 * API Communication Functions
 */

/**
 * Fetches movie data from OMDB API
 * @param {string} title - Movie title to search for
 */

function fetchMovie(title) {
    // Show loading state
    resultsDiv.innerHTML = '<p>Loading...</p>';
    hideError(); // Clear any previous errors


    // Make AJAX request (using Fetch API)
    fetch(`${BASE_URL}&t=${encodeURIComponent(title)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok'); // Handle network errors
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            if (data.Response === 'True') {
                displayMovie(data); // Successful response - display movie
            } else {
                throw new Error(data.Error || ' movie Not found!'); // API returned error
            }
        })
        .catch(error => {
            showError(error.message); // Show error message
            resultsDiv.innerHTML = ''; // Clear results area
        });
}
/**
 * UI Update Functions
 */

/**
 * Displays movie information in the results area
 * @param {Object} movie - Movie data object from API
 */

// Function to display movie data
function displayMovie(movie) {
    // Create movie card element dynamically
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    resultsDiv.innerHTML = '<p class="success">Movie found! Loading details...</p>'; // Show temporary success message
    
    // Create HTML content for the movie card
    movieCard.innerHTML = `
        <h2>${movie.Title} (${movie.Year})</h2>
        <div class="movie-poster">
            ${movie.Poster !== 'N/A' ? `<img src="${movie.Poster}" alt="${movie.Title} Poster">` : '<p>No poster available</p>'}
        </div>
        <div class="movie-info">
            <p><strong>Rated:</strong> ${movie.Rated}</p>
            <p><strong>Released:</strong> ${movie.Released}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Language:</strong> ${movie.Language}</p>
            <p><strong>Country:</strong> ${movie.Country}</p>
            <p><strong>Awards:</strong> ${movie.Awards}</p>
            <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
            <p><strong>IMDb Votes:</strong> ${movie.imdbVotes}</p>
        </div>
        <button class="more-details-btn">More Details</button>
    `;
    
    // Clear previous results and add new movie card
    resultsDiv.innerHTML = '';
    resultsDiv.appendChild(movieCard);
    
    // Add event listener to the "More Details" button
    const moreDetailsBtn = movieCard.querySelector('.more-details-btn');
    moreDetailsBtn.addEventListener('click', function() { // Show complete movie data in alert 
        alert(`Full details for ${movie.Title}:\n\n${JSON.stringify(movie, null, 2)}`);
    });
}

/**
 * Utility Functions
 */

/**
 * Displays an error message to the user
 * @param {string} message - Error message to display
 */

function showError(message) {
    errorMessageDiv.textContent = message;
    errorMessageDiv.className = 'error'; // Apply error styling
}

// Function to hide error message
function hideError() {
    errorMessageDiv.className = 'hidden';
}

/**
 * Clears all search results and resets the form
 */
function clearResults() {
    resultsDiv.innerHTML = ''; // Clear results container
    movieTitleInput.value = ''; // Reset input field
    hideError(); // Hide any error messages
}