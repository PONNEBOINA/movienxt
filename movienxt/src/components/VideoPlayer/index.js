import {useState} from 'react'
import './index.css'

const VideoPlayer = ({videoUrl, onClose}) => {
  const [isLoading, setIsLoading] = useState(true)

  const handleVideoLoad = () => {
    setIsLoading(false)
  }

  const handleVideoError = () => {
    setIsLoading(false)
  }

  return (
    <div className="video-player-overlay">
      <div className="video-player-container">
        <button
          type="button"
          className="video-close-btn"
          onClick={onClose}
          aria-label="Close video"
        >
          ×
        </button>
        {isLoading && (
          <div className="video-loader">
            <div className="spinner"></div>
          </div>
        )}
        <video
          className="video-player"
          controls
          autoPlay
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  )
}

export default VideoPlayer
