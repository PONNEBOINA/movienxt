import {useState} from 'react'
import {withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const LoginForm = ({history}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isError, setIsError] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const showErrorMsg = message => {
    setIsError(true)
    setErrorMsg(message)
  }

  const onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 300})
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
    history.replace('/')
  }

  const submitForm = async event => {
    event.preventDefault()
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      onSubmitSuccess(data.jwt_token)
    } else {
      showErrorMsg(data.error_msg)
    }
  }

  const renderUsernameField = () => (
    <>
      <div>
        <label className="input-label" htmlFor="username">
          USERNAME
        </label>
      </div>
      <input
        type="text"
        className="input"
        id="username"
        placeholder="USERNAME"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
    </>
  )

  const renderPasswordField = () => (
    <>
      <div>
        <label className="input-label" htmlFor="pass">
          PASSWORD
        </label>
      </div>
      <input
        type="password"
        id="pass"
        placeholder="PASSWORD"
        className="input"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </>
  )

  return (
    <div className="bg-form-container">
      <img
        src="https://res.cloudinary.com/dnxbl0xrb/image/upload/v1729667371/Group_7399_os0yqk.svg"
        className="login-website-logo-desktop-image"
        alt="login website logo"
      />

      <form className="form-container" onSubmit={submitForm}>
        <h1 className="heading">Login</h1>
        <div className="input-container">{renderUsernameField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <div>
          <button type="submit" className="login-button">
            Login
          </button>
        </div>
        {isError && <p className="msg">{errorMsg}</p>}
      </form>
    </div>
  )
}

export default withRouter(LoginForm)
