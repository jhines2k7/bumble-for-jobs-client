import { Header } from './header.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`

`);

export class JobPostPage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    const header = new Header();
    this.shadowRoot.appendChild(header);
  }
}

customElements.define('job-post-page', JobPostPage);