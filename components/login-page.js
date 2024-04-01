export class LoginPage extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <login-form></login-form>
      `;

    const loginForm = this.querySelector('login-form');
    loginForm.router = this.router;
  }
}

customElements.define('login-page', LoginPage);