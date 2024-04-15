import { AppHeader } from './app-header.js';
import { JobPostListItem } from './job-post-list-item.js';
import { DOMAIN } from '../constants.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    padding: 90px 0 0 0;
    width: 100%;
    display: block;
  }
`);

export class JobPostsPage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  async connectedCallback() {
    const response = await fetch(`${DOMAIN}/job-posts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        
        this.router.navigate('/login');
      }

      throw new Error('Network response was not ok ' + response.statusText);
    }

    const data = await response.json();

    const header = new AppHeader();
    header.pageTitle = 'Job Posts';

    this.shadowRoot.appendChild(header);

    data.forEach(post => {
      const jobPostListItem = new JobPostListItem();
      jobPostListItem.router = this.router;
      jobPostListItem.data = { id: post.id, title: post.title, location: post.location, count: post.count };
      this.shadowRoot.appendChild(jobPostListItem);
    });    
  }
}

customElements.define('job-posts-page', JobPostsPage);