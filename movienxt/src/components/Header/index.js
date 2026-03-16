import {Link, useLocation} from 'react-router-dom'
import {useState} from 'react'

import {HiOutlineSearch} from 'react-icons/hi'
import {MdMenuOpen} from 'react-icons/md'
import {ImCross} from 'react-icons/im'

import './index.css'

const Header = ({searchInput}) => {
  const [showMenu, setShowMenu] = useState(false)
  const [showSearchBar, setShowSearchBar] = useState(false)

  const location = useLocation()
  const path = location.pathname

  const onClickSearchIcon = () => {
    setShowSearchBar(prev => !prev)
  }

  const onClickShowMenu = () => {
    setShowMenu(true)
  }

  const onClickHideMenu = () => {
    setShowMenu(false)
  }

  const onChangeSearchInput = event => {
    const query = event.target.value
    if (searchInput) {
      searchInput(query)
    }
  }

  const onKeyDownSearchInput = event => {
    if (event.key === 'Enter') {
      const query = event.target.value.trim()
      if (searchInput) {
        searchInput(query)
      }
    }
  }

  let homeClassNameStyling
  let popularClassNameStyling
  let accountClassNameStyling

  switch (path) {
    case '/popular':
      homeClassNameStyling = 'passive'
      popularClassNameStyling = 'active'
      accountClassNameStyling = 'passive'
      break
    case '/account':
      homeClassNameStyling = 'passive'
      popularClassNameStyling = 'passive'
      accountClassNameStyling = 'active'
      break
    default:
      homeClassNameStyling = 'active'
      popularClassNameStyling = 'passive'
      accountClassNameStyling = 'passive'
      break
  }

  return (
    <nav className="nav-container">
      <div className="nav-elements-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dnxbl0xrb/image/upload/v1729667371/Group_7399_os0yqk.svg"
            className="app-logo"
            alt="website logo"
          />
        </Link>
        <ul className="nav-list-items">
          <Link to="/" className="nav-link">
            <li className={`popup-heading ${homeClassNameStyling}`}>Home</li>
          </Link>
          <Link to="/popular" className="nav-link">
            <li className={`popup-heading ${popularClassNameStyling}`}>
              Popular
            </li>
          </Link>
        </ul>
        <div className="search-container">
          {showSearchBar && (
            <input
              type="search"
              onChange={onChangeSearchInput}
              onKeyDown={onKeyDownSearchInput}
              placeholder="Search movies..."
              className="search"
            />
          )}
          <Link to="/search">
            <button type="button" className="icon-button">
              <HiOutlineSearch
                size={20}
                color="white"
                data-testid="searchButton"
                onClick={onClickSearchIcon}
              />
            </button>
          </Link>
          <Link to="/account">
            <img
              src="https://res.cloudinary.com/dnxbl0xrb/image/upload/v1729746270/Avatar_pxe1op.svg"
              className={`profile-logo ${accountClassNameStyling}`}
              alt="profile"
            />
          </Link>
          <MdMenuOpen
            size={25}
            color="white"
            className="menu-icon"
            onClick={onClickShowMenu}
          />
        </div>
      </div>
      {showMenu && (
        <div>
          <ul className="list-mini">
            <Link to="/" className="nav-link">
              <li className={`popup-heading ${homeClassNameStyling}`}>Home</li>
            </Link>
            <Link to="/popular" className="nav-link">
              <li className={`popup-heading ${popularClassNameStyling}`}>
                Popular
              </li>
            </Link>
            <Link to="/account" className="nav-link">
              <li className={`popup-heading ${accountClassNameStyling}`}>
                Account
              </li>
            </Link>
            <ImCross
              size={10}
              color="#ffffff"
              onClick={onClickHideMenu}
              className="icon"
            />
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Header
