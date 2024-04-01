import { LoginForm } from './login-form-2195ac1a26a986d667b87e52b2f51b9d.js';

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