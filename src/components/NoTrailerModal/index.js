import {useEffect} from 'react'
import {ImCross} from 'react-icons/im'
import {FaFilm} from 'react-icons/fa'
import './index.css'

const NoTrailerModal = ({onClose, title}) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  const handleBackdropClick = e => {
    if (e.target.className === 'no-trailer-modal-backdrop') {
      onClose()
    }
  }

  return (
    <div className="no-trailer-modal-backdrop" onClick={handleBackdropClick}>
      <div className="no-trailer-modal-content">
        <div className="no-trailer-modal-header">
          <h2 className="no-trailer-modal-title">No Trailer Available</h2>
          <button
            type="button"
            className="no-trailer-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <ImCross size={16} />
          </button>
        </div>
        <div className="no-trailer-body">
          <FaFilm className="no-trailer-icon" />
          <h3 className="no-trailer-movie-title">{title}</h3>
          <p className="no-trailer-message">
            Sorry, no trailer is currently available for this movie.
          </p>
          <p className="no-trailer-suggestion">
            You can still enjoy the movie details and add it to your watchlist!
          </p>
        </div>
      </div>
    </div>
  )
}

export default NoTrailerModal