import {useEffect} from 'react'
import {ImCross} from 'react-icons/im'
import './index.css'

const TrailerModal = ({videoKey, onClose, title}) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleBackdropClick = e => {
    if (e.target.className === 'trailer-modal-backdrop') {
      onClose()
    }
  }

  if (!videoKey) return null

  return (
    <div className="trailer-modal-backdrop" onClick={handleBackdropClick}>
      <div className="trailer-modal-content">
        <div className="trailer-modal-header">
          <h2 className="trailer-modal-title">{title} - Trailer</h2>
          <button
            type="button"
            className="trailer-close-button"
            onClick={onClose}
            aria-label="Close trailer"
          >
            <ImCross size={16} />
          </button>
        </div>
        <div className="trailer-video-container">
          <iframe
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
            title={`${title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="trailer-iframe"
          />
        </div>
      </div>
    </div>
  )
}

export default TrailerModal
