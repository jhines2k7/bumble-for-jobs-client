import { AppHeader } from './app-header.js';
import { JobPost } from './job-post-list-item.js';
import { DOMAIN } from '../constants.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    padding: 90px 0 0 0;
    width: 100%;
    display: block;
  }
`);

export class JobSeekersPage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  async connectedCallback() {
    const response = await fetch(`${DOMAIN}/job-post-listing`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        router.navigate('/login');
      }

      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();

    const header = new AppHeader();
    this.shadowRoot.appendChild(header);

    data.forEach(post => {
      const jobPost = new JobPost();
      jobPost.router = this.router;
      jobPost.data = { id: post.id, title: post.title, location: post.location, count: post.count };
      this.shadowRoot.appendChild(jobPost);
    });    
  }
}

customElements.define('job-post-list-page', JobPostListPage);