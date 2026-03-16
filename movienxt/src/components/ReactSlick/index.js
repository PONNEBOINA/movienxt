import {Link} from 'react-router-dom'
import Slider from 'react-slick'

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

const ReactSlick = ({movies}) => (
  <div className="slick-app-container">
    <div style={{width: '95%'}}>
      <Slider {...settings}>
        {movies.map(each => (
          <Link to={`/movies/${each.id}`} key={each.id}>
            <li className="react-slick-li-item" key={each.id}>
              <img
                className="slick-movie-img"
                src={each.posterPath}
                alt={each.title}
              />
            </li>
          </Link>
        ))}
      </Slider>
    </div>
  </div>
)

export default ReactSlick
