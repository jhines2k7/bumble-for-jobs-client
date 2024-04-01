export class ForYouPage extends HTMLElement {
  constructor() {
    super();
    document.adoptedStyleSheets = [styles];
  }

  async connectedCallback() {
    try {
        const response = await getJobPosts();
        const data = await response.json();

        this.innerHTML = `
        <h1>Profile Page</h1>
        <p>Welcome to your profile!</p>
        `;
    } catch {
        
    }

    const userId = this.getAttribute('user-id');
    const state = this.getAttribute('state');
    const page = this.getAttribute('page');

    this.innerHTML = `
      <div class="for-you-page">
        <for-you-header></for-you-header>
        <for-you-content user-id="${userId}" state="${state}" page="${page}"></for-you-content>
      </div>
    `;
  }
}