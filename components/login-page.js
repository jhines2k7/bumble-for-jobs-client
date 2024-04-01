import { LoginForm } from './login-form.js';

export class LoginPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.render();
  }

  render() {
    const loginForm = new LoginForm();
    loginForm.router = this.router;
    this.shadowRoot.appendChild(loginForm);
  }
}

customElements.define('login-page', LoginPage);