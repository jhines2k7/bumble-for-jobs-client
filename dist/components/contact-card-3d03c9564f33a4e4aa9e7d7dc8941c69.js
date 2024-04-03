const styles = new CSSStyleSheet();
styles.replaceSync(`
  .job-post-cards {
    padding: 20px 0 30px 0;
  }

  .contact-card, .job-post-card {
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: inline-block;
    vertical-align: top;
  }

  .job-post-card {
    width: 100%;
    margin-bottom: 20px;
  }

  .contact-header {
    text-align: center;
    color: #333;
    margin-bottom: 8px;
    font-weight: bold;
  }

  .contact-header h1 {
    font-size: 60px;
    display: inline-block;
  }

  .contact-header span {
    font-size: 12px;
  }

  .job-post-title,
  .contact-title {
    font-size: 16px;
    color: #555;
    margin-bottom: 4px;
  }

  .job-post-location,
  .contact-location {
    font-size: 12px;
    color: #555;
  }

  .username {
    font-size: larger;
    font-weight: bold;
  }
`);

export class ForYouPage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <div class="contact-card">
        <div class="contact-header" data-header></div>
        <div class="contact-title" data-title></div>
        <div class="contact-location" data-location></div>
      </div>
    `;
  }
}