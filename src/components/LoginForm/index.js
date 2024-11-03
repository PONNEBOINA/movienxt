import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    iserror: false,
    errorMsg: '',
  }

  showerrormsg = errorMsg => {
    this.setState({iserror: true, errorMsg})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
    const {username, password} = this.state
    localStorage.setItem('username', username)
    localStorage.setItem('password', password)
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.showerrormsg(data.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPasswordField = () => {
    const {password} = this.state

    return (
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
          onChange={this.onChangePassword}
        />
      </>
    )
  }

  renderUsernameField = () => {
    const {username} = this.state
    return (
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
          onChange={this.onChangeUsername}
        />
      </>
    )
  }

  render() {
    const {iserror, errorMsg} = this.state
    return (
      <div className="bg-form-container">
        <img
          src="https://res.cloudinary.com/dnxbl0xrb/image/upload/v1729667371/Group_7399_os0yqk.svg"
          className="login-website-logo-desktop-image"
          alt="login website logo"
        />

        <form className="form-container" onSubmit={this.submitForm}>
          <h1 className="heading">Login</h1>
          <div className="input-container">{this.renderUsernameField()}</div>
          <div className="input-container">{this.renderPasswordField()}</div>

          <div>
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
          {iserror && <p className="msg">{errorMsg}</p>}
        </form>
      </div>
    )
  }
}

export default LoginForm
