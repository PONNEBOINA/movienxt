// Utility functions for trailer functionality

/**
 * TMDB API configuration
 */
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY || 'YOUR_TMDB_API_KEY_HERE'
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

/**
 * Fetches trailer data from TMDB API
 * @param {string|number} movieId - The TMDB movie ID
 * @returns {Promise<string|null>} - YouTube video key or null
 */
export const fetchTrailerFromTMDB = async (movieId) => {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    )
    
    if (!response.ok) {
      throw new Error('Failed to fetch trailer data')
    }
    
    const data = await response.json()
    
    // Find the first official trailer
    const trailer = data.results.find(
      video => 
        video.type === 'Trailer' && 
        video.site === 'YouTube' && 
        video.official === true
    ) || data.results.find(
      video => 
        video.type === 'Trailer' && 
        video.site === 'YouTube'
    )
    
    return trailer ? trailer.key : null
  } catch (error) {
    console.error('Error fetching trailer from TMDB:', error)
    return null
  }
}

/**
 * Searches for movie on TMDB and gets trailer
 * @param {string} movieTitle - The title of the movie
 * @param {string} releaseYear - Optional release year for better matching
 * @returns {Promise<string|null>} - YouTube video key or null
 */
export const searchMovieTrailer = async (movieTitle, releaseYear = null) => {
  try {
    const searchQuery = encodeURIComponent(movieTitle)
    const yearParam = releaseYear ? `&year=${releaseYear}` : ''
    
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${searchQuery}${yearParam}`
    )
    
    if (!response.ok) {
      throw new Error('Failed to search movie')
    }
    
    const data = await response.json()
    
    if (data.results && data.results.length > 0) {
      const movieId = data.results[0].id
      return await fetchTrailerFromTMDB(movieId)
    }
    
    return null
  } catch (error) {
    console.error('Error searching movie trailer:', error)
    return null
  }
}

/**
 * Sample trailer keys for popular movies (fallback)
 */
export const sampleTrailerKeys = {
  // Marvel movies
  'Avengers: Endgame': 'TcMBFSGVi1c',
  'Spider-Man: No Way Home': 'JfVOs4VSpmA',
  'Black Panther': 'xjDjIWPwcPU',
  'Iron Man': '8ugaeA-nMTc',
  'Thor': 'JOddp-nlNvQ',
  
  // Popular movies
  'The Dark Knight': 'EXeTwQWrcwY',
  'Inception': 'YoHD9XEInc0',
  'Interstellar': 'zSWdZVtXT7E',
  'The Matrix': 'vKQi3bBA1y8',
  'Joker': 'zAGVQLHvwOY',
  'Parasite': '5xH0HfJHsaY',
  'Dune': '8g18jFHCLXk',
  'No Time to Die': 'BIhNsAtPbPI',
  'Fast & Furious 9': 'FUK2kdPsBws',
  'Wonder Woman 1984': 'sfM7_JLk-84'
}

/**
 * Gets trailer key with multiple fallback strategies
 * @param {string} movieTitle - The title of the movie
 * @param {string|number} movieId - Optional movie ID
 * @param {string} releaseYear - Optional release year
 * @returns {Promise<string|null>} - YouTube video key or null
 */
export const getTrailerKey = async (movieTitle, movieId = null, releaseYear = null) => {
  // Strategy 1: Use TMDB movie ID if available
  if (movieId) {
    const trailerKey = await fetchTrailerFromTMDB(movieId)
    if (trailerKey) return trailerKey
  }
  
  // Strategy 2: Search TMDB by title
  const searchTrailerKey = await searchMovieTrailer(movieTitle, releaseYear)
  if (searchTrailerKey) return searchTrailerKey
  
  // Strategy 3: Use sample trailer keys
  const sampleKey = sampleTrailerKeys[movieTitle]
  if (sampleKey) return sampleKey
  
  // Strategy 4: Try partial title match
  const partialMatch = Object.keys(sampleTrailerKeys).find(key => 
    key.toLowerCase().includes(movieTitle.toLowerCase()) ||
    movieTitle.toLowerCase().includes(key.toLowerCase())
  )
  if (partialMatch) return sampleTrailerKeys[partialMatch]
  
  return null
}

/**
 * Opens trailer in modal (not external browser)
 * @param {string} movieTitle - The title of the movie
 * @param {string|null} trailerKey - YouTube video key from API
 * @param {Function} onTrailerFound - Callback when trailer is found
 * @param {Function} onNoTrailer - Callback when no trailer is found
 * @param {string|number} movieId - Optional movie ID
 * @param {string} releaseYear - Optional release year
 */
export const openTrailerInModal = async (movieTitle, trailerKey, onTrailerFound, movieId = null, releaseYear = null, onNoTrailer = null) => {
  if (trailerKey) {
    // Use provided trailer key
    onTrailerFound(trailerKey, movieTitle)
    return
  }
  
  // Try to get trailer key
  const foundTrailerKey = await getTrailerKey(movieTitle, movieId, releaseYear)
  
  if (foundTrailerKey) {
    onTrailerFound(foundTrailerKey, movieTitle)
  } else {
    // Show no trailer modal if callback provided
    if (onNoTrailer) {
      onNoTrailer(movieTitle)
    } else {
      console.log(`No trailer found for: ${movieTitle}`)
    }
  }
}