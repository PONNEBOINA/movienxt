import {useState} from 'react'
import {Link} from 'react-router-dom'
import Slider from 'react-slick'
import {FaPlay} from 'react-icons/fa'
import TrailerModal from '../TrailerModal'
import InlineTrailerPreview from '../InlineTrailerPreview'
import useTrailerPreview from '../../hooks/useTrailerPreview'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './index.css'

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,

  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const MovieCard = ({movie}) => {
  const {
    trailerKey,
    showPreview,
    handleMouseEnter,
    handleMouseLeave
  } = useTrailerPreview(movie, 800) // 800ms hover delay

  const [showFullTrailer, setShowFullTrailer] = useState(false)

  const handleExpandTrailer = (trailerKey, title) => {
    setShowFullTrailer(true)
  }

  const handleCloseFullTrailer = () => {
    setShowFullTrailer(false)
  }

  return (
    <>
      <div className="slick-movie-container">
        <Link to={`/movies/${movie.id}`}>
          <li 
            className="react-slick-li-item" 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              className="slick-movie-img"
              src={movie.posterPath}
              alt={movie.title}
            />
            
            <InlineTrailerPreview
              trailerKey={trailerKey}
              movieTitle={movie.title}
              isVisible={showPreview}
              onExpand={handleExpandTrailer}
              autoPlay={true}
              showControls={true}
            />
          </li>
        </Link>
      </div>
      
      {showFullTrailer && (
        <TrailerModal
          videoKey={trailerKey}
          onClose={handleCloseFullTrailer}
          title={movie.title}
        />
      )}
    </>
  )
}

const ReactSlick = ({movies}) => {
  return (
    <div className="slick-app-container">
      <div style={{width: '95%'}}>
        <Slider {...settings}>
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default ReactSlick
