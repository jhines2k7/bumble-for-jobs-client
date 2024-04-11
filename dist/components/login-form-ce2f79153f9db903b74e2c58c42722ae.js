import { parseJwt } from '../utils.js';
import { DOMAIN } from '../constants.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  @import url(https://fonts.googleapis.com/css?family=Roboto:300);

  .login {
    font-family: "Roboto", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    margin: 50px auto 0;
  }

  .form {
    z-index: 1;
    background: #FFFFFF;
    margin: 0 auto;
    padding: 40px;
    text-align: center;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2), 0 5px 5px 0 rgba(0, 0, 0, 0.24);
  }

  .form input {
    font-family: "Roboto", sans-serif;
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 15px;
    box-sizing: border-box;
    font-size: 14px;
  }

  .form button {
    font-family: "Roboto", sans-serif;
    text-transform: uppercase;
    outline: 0;
    background: #4CAF50;
    width: 100%;
    border: 0;
    padding: 15px;
    color: #FFFFFF;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    cursor: pointer;
  }

  .form button:hover,.form button:active,.form button:focus {
    background: #43A047;
  }

  .form .message {
    margin: 15px 0 0;
    color: #b3b3b3;
    font-size: 12px;
  }

  .form .message a {
    color: #4CAF50;
    text-decoration: none;
  }
  
  .form .register-form {
    display: none;
  }
`);

export class LoginForm extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({mode: "open"});
    shadowRoot.adoptedStyleSheets = [styles];
  }
  
  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <div class="login">
        <div class="form">
            <form class="register-form">
              <input type="text" placeholder="username" />
              <input type="password" placeholder="password" />
              <input type="text" placeholder="email address" />
              <button>create</button>
              <p class="message">Already registered? <a href="#">Sign In</a></p>
            </form>
            <form class="login-form">
              <input type="text" placeholder="email" />
              <input type="password" placeholder="password" />
              <button>login</button>
              <p class="message">Not registered? <a href="#">Create an account</a></p>
              <p class="message error"></p>
            </form>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.login-form').addEventListener('submit', this.handleLogin.bind(this));
  }

  async handleLogin(event) {
    event.preventDefault();

    const email = this.shadowRoot.querySelector('.login-form input[type="text"]').value;
    const password = this.shadowRoot.querySelector('.login-form input[type="password"]').value;

    try {
      const response = await fetch(`${DOMAIN}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response.ok) {
        this.shadowRoot.querySelector('.login .form p.message.error').textContent = 'Username or password is incorrect';
        throw new Error('Network response was not ok ' + response.statusText);
      }

      const data = await response.json();

      if (data.access_token && data.refresh_token) {
        // Store the JWT in localStorage or session storage
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);

        const token = parseJwt(data.access_token);
        this.router.navigate(`/foryou/${token.user_id}/${token.state}?page=1`);
      } else {
        throw new Error('Access token or refresh token not found in response');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
}

customElements.define('login-form', LoginForm);