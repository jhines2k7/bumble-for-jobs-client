import { AppHeader } from './app-header-2fb9b9110cf9458dd9b2fbf3160b6894.js';
import { JobSeekerListItem } from './job-seeker-list-item-7ea9c405b1c105bf423b6454bd0c601b.js';
import { DOMAIN } from '../constants.js';

const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    padding: 90px 0 0 0;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  * {
    outline: 1px solid red;
  }
`);

export class JobPostPage extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  async connectedCallback() {
    const response = await fetch(`${DOMAIN}/job-post/${this.jobPostId}`, {
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

    const header = new AppHeader();
    header.pageTitle = data.job_post_title;
    this.shadowRoot.appendChild(header);

    data.job_seekers.sort((a, b) => b.normalized_score - a.normalized_score)
      .forEach(jobSeeker => {
        const jobSeekerListItem = new JobSeekerListItem();
        jobSeekerListItem.router = this.router;
        jobSeekerListItem.data = { 
          analysisId: jobSeeker.analysis_id, 
          city: jobSeeker.city,
          state: jobSeeker.state,
          username: jobSeeker.username,
          normalizedScore: jobSeeker.normalized_score 
        };
        this.shadowRoot.appendChild(jobSeekerListItem);
    });    
  }
}

customElements.define('job-post-page', JobPostPage);