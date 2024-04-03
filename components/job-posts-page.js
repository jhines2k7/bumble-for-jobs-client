import { AppHeader } from './app-header.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    height: 50px;
    width: 100%;
  }
`);

export class JobPostsPage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    const header = new AppHeader();
    this.shadowRoot.appendChild(header);
  }
}

customElements.define('job-posts-page', JobPostsPage);