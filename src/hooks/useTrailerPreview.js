import {useState, useEffect, useCallback} from 'react'
import {getTrailerKey} from '../utils/trailerUtils'

const useTrailerPreview = (movie, hoverDelay = 1000) => {
  const [trailerKey, setTrailerKey] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Debounced hover handler
  useEffect(() => {
    let hoverTimer
    let loadTimer

    if (isHovered && movie) {
      // Start loading after hover delay
      hoverTimer = setTimeout(async () => {
        if (isHovered) {
          setIsLoading(true)
          
          try {
            // Check if we already have a trailer key
            if (movie.trailerKey) {
              setTrailerKey(movie.trailerKey)
              setShowPreview(true)
            } else {
              // Try to get trailer key
              const foundTrailerKey = await getTrailerKey(
                movie.title,
                movie.id,
                movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null
              )
              
              if (foundTrailerKey && isHovered) {
                setTrailerKey(foundTrailerKey)
                setShowPreview(true)
              }
            }
          } catch (error) {
            console.error('Error loading trailer preview:', error)
          } finally {
            setIsLoading(false)
          }
        }
      }, hoverDelay)
    } else {
      // Hide preview when not hovered
      setShowPreview(false)
      
      // Clear trailer after a delay to allow for smooth transitions
      loadTimer = setTimeout(() => {
        if (!isHovered) {
          setTrailerKey(null)
        }
      }, 300)
    }

    return () => {
      clearTimeout(hoverTimer)
      clearTimeout(loadTimer)
    }
  }, [isHovered, movie, hoverDelay])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
  }, [])

  return {
    trailerKey,
    isLoading,
    showPreview,
    handleMouseEnter,
    handleMouseLeave
  }
}

export default useTrailerPreview