import { AppHeader } from './app-header-2fb9b9110cf9458dd9b2fbf3160b6894.js';
import { DOMAIN } from '../constants.js';
import { toSentenceCase } from '../utils.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    padding: 90px 0 130px 0;
    width: 100%;
    display: block;
  }

  * {
    outline: 1px solid red;
  }

  h2 {
    font-size: larger;
    font-weight: bold;
  }

  ul {
    margin: 0 0 0 20px;
    padding: 0 0 20px 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
    list-style: none;
  }

  li {
    font-size: smaller;
  }
`);

export class CompatibilityAnalysisPage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  async connectedCallback() {
    const response = await fetch(`${DOMAIN}/compatibility-analysis/${this.analysisId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        this.router.navigate('/login');
      }

      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();

    const markdown = marked.parse(data.full_analysis);

    this.shadowRoot.innerHTML = `
      <h2 class="job-title">${data.job_title}</h2>
      <h2 class="username">${data.username}</h2>
      <ul class="analysis"></ul>
      <h2>Full Analysis</h2>
      <p class="full-analysis"></p>
      <interaction-controls></interaction-controls>
    `;

    this.shadowRoot.querySelector('.full-analysis').innerHTML = markdown;

    let ul = this.shadowRoot.querySelector('ul');
  
    // loop through the keys of the object
    for (let key in data.compatibility_analysis) {
      let sentenceCasedKey = toSentenceCase(key);
  
      let li = document.createElement('li');
      li.textContent = `${sentenceCasedKey}: ${data.compatibility_analysis[key]}`;
      ul.appendChild(li);
    }

    const header = new AppHeader();
    header.pageTitle = 'Compatibility Analysis';
    this.shadowRoot.appendChild(header);
  }
}

customElements.define('compatibility-analysis-page', CompatibilityAnalysisPage);
