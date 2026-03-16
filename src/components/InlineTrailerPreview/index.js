import {useState, useEffect, useRef} from 'react'
import {FaVolumeUp, FaVolumeMute, FaExpand} from 'react-icons/fa'
import './index.css'

const InlineTrailerPreview = ({
  trailerKey,
  movieTitle,
  isVisible,
  onExpand,
  autoPlay = true,
  showControls = true
}) => {
  const [isMuted, setIsMuted] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const iframeRef = useRef(null)

  useEffect(() => {
    if (isVisible && trailerKey) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 200)
      return () => clearTimeout(timer)
    } else {
      setIsLoaded(false)
    }
  }, [isVisible, trailerKey])

  if (!trailerKey || !isVisible) {
    return null
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  const handleExpand = (e) => {
    e.stopPropagation()
    if (onExpand) {
      onExpand(trailerKey, movieTitle)
    }
  }

  const muteParam = isMuted ? '1' : '0'
  const autoPlayParam = autoPlay ? '1' : '0'
  
  return (
    <div className={`inline-trailer-preview ${isLoaded ? 'loaded' : ''}`}>
      <div className="trailer-video-wrapper">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=${autoPlayParam}&mute=${muteParam}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${trailerKey}`}
          title={`${movieTitle} Trailer Preview`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="trailer-iframe-preview"
        />
        
        {showControls && (
          <div className="trailer-controls">
            <button
              className="trailer-control-btn mute-btn"
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
            </button>
            
            <button
              className="trailer-control-btn expand-btn"
              onClick={handleExpand}
              title="Watch Full Trailer"
            >
              <FaExpand />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default InlineTrailerPreview