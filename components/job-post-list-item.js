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

  .job-post-list-item {
    margin-bottom: 20px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    vertical-align: top;
  }

  .job-post-list-item p:not(:last-child) {
    margin-bottom: 10px;
  }

  .title {
    font-size: 16px;
    font-weight: bold;
    color: #555;
    margin-bottom: 10px;
  }

  .location {
    font-size: 12px;
    color: #555;
  }

  .seeker-count {
    font-size: 16px;
    font-weight: bold;
  }
`);

export class JobPostListItem extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];

    const template = document.getElementById('job-post-list-item-template');
    const content = template.content.cloneNode(true);

    this.shadowRoot.appendChild(content);
  }
  
  handleClick(id) {
    this.router.navigate(`/job-post/${id}`);
  }
  
  connectedCallback() {
    const { id, title, location, count } = this.data || {};
    
    this.shadowRoot.querySelector('.title').textContent = title || '';
    this.shadowRoot.querySelector('.location').textContent = location || '';
    this.shadowRoot.querySelector('.seeker-count').textContent = count || '';
    
    console.log('id:', id)
    this.addEventListener('click', this.handleClick.bind(this, id));
  }

  set data(value) {
    this._data = value;
  }

  get data() {
    return this._data;
  }
}

customElements.define('job-post-list-item', JobPostListItem);