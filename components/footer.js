const styles = new CSSStyleSheet();
styles.replaceSync(`

`);

export class AppFooter extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = ``;

  }
}

customElements.define('app-footer', AppFooter);