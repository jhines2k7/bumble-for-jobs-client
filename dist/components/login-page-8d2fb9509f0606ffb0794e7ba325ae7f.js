import { LoginForm } from './login-form-203f5d5fb6c2e71db4bc9509444a8984.js';

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