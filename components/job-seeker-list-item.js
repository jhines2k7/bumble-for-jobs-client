const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
    cursor: pointer;
  }

  * {
    outline: 1px solid red;
  }

  p {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  .job-seeker-list-item {
    margin-bottom: 20px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    vertical-align: top;
  }

  .job-seeker-list-item p:not(:last-child) {
    margin-bottom: 10px;
  }

  .username {
    font-size: 16px;
    font-weight: bold;
    color: #555;
  }

  .location {
    font-size: 12px;
    color: #555;
  }

  .normalized-score {
    font-size: 48px;
    font-weight: bold;
    display: inline-block;
  }
`);

export class JobSeekerListItem extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];

    const template = document.getElementById('job-seeker-list-item-template');
    const content = template.content.cloneNode(true);

    this.shadowRoot.appendChild(content);
  }
  
  handleClick(analysisId) {
    this.router.navigate(`/compatibility-analysis/${analysisId}`);
  }
  
  connectedCallback() {
    const { 
      analysisId, 
      city, 
      state,
      username,
      normalizedScore 
    } = this.data || {};

    this.shadowRoot.querySelector('.username').textContent = username || '';
    this.shadowRoot.querySelector('.location').textContent = `${city}, ${state}` || '';
    this.shadowRoot.querySelector('.normalized-score').textContent = normalizedScore || '';
    
    this.addEventListener('click', this.handleClick.bind(this, analysisId));
  }

  set data(value) {
    this._data = value;
  }

  get data() {
    return this._data;
  }
}

customElements.define('job-seeker-list-item', JobSeekerListItem);