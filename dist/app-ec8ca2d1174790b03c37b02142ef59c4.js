const router = new Navigo('/', { hash: true });

// import './components/app-header-73467f9901dfcf313bf7b57118b039ca.js';
// import './components/app-footer-29a53a22855a7207fbf6ec7ee202312c.js';
import { LoginPage } from './components/login-page-8d2fb9509f0606ffb0794e7ba325ae7f.js';
import { JobPostsPage } from './components/job-posts-page-b11200f06b5a79eeeb082ed1e4aad78d.js';
import './components/sliding-menu-49cce9a3a357ddf35f7741d4da3ec534.js';
import { JobPostPage } from './components/job-post-page-4a31c5bd22b0b59e8ea3cb6d4d6b570c.js';
// import './components/job-seeker-page.js';
// import './components/compatibility-analysis-page.js';
// import './components/chat-page.js';
// import './components/upload-page.js';
// import './components/profile-page.js';
// import './components/settings-page.js';
// import './components/preferences-page.js';
import { parseJwt, isTokenExpired, refreshAccessToken, logout } from './utils.js';

router
  .on(() => {
    if (isTokenExpired()) {
      refreshAccessToken().then(data => {
        localStorage.setItem('access_token', data.access_token);

        router.navigate(`/foryou?page=1`);
      }).catch(error => {
        console.error('Error refreshing token:', error);
      });
    } else {
      router.navigate(`/foryou?page=1`);
    }
  })
  .on('/login', () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.navigate(`/foryou?page=1`);
    }

    const loginPage = new LoginPage();
    loginPage.router = router;
    document.getElementById('app').innerHTML = '';
    document.getElementById('app').appendChild(loginPage);
  })
  .on('/foryou', () => {
    (async () => {
      document.getElementById('app').innerHTML = '';

      let token;

      if(isTokenExpired()) {
        try {
          const data = await refreshAccessToken();
          console.log('Access token refreshed:', data);
          
          localStorage.setItem('access_token', data.access_token);
  
          token = parseJwt(data.access_token);
        } catch (error) {
          console.error('Error refreshing access token:', error);
          logout();
        }
      } else {
        token = parseJwt(localStorage.getItem('access_token'));
      }

      if (token.roles.includes('EMPLOYER')) {
        const jobPostsPage = new JobPostsPage();
        jobPostsPage.router = router;
        document.getElementById('app').appendChild(jobPostsPage);
      } else {
        document.getElementById('app').innerHTML = `<job-post-page></job-post-page>`;
      }
    })();
  })
  .on('/job-post/:jobPostId', (match) => {
    document.getElementById('app').innerHTML = '';

    const jobPostPage = new JobPostPage();
    jobPostPage.router = router;
    jobPostPage.jobPostId = match.data.jobPostId;
    
    document.getElementById('app').appendChild(jobPostPage);
  })
  .on('/compatibility-analysis/:analysisId', (params) => {
    const token = localStorage.getItem('access_token');
    const decodedToken = parseJwt(token);
    if (decodedToken.roles.includes('EMPLOYER')) {
      document.getElementById('app').innerHTML = `<compatibility-analysis-page analysis-id="${params.analysisId}" employer="true"></compatibility-analysis-page>`;
    } else {
      document.getElementById('app').innerHTML = `<compatibility-analysis-page analysis-id="${params.analysisId}"></compatibility-analysis-page>`;
    }
  })
  /*
  .on('/chat', (params) => {
    document.getElementById('app').innerHTML = `<chat-page job-seeker-id="${params.job_seeker_id}" employer-id="${params.employer_id}" job-post-id="${params.job_post_id}"></chat-page>`;
  })
  .on('/upload/:userId/:state', (params) => {
    const token = localStorage.getItem('access_token');
    const decodedToken = parseJwt(token);
    if (decodedToken.roles.includes('EMPLOYER')) {
      document.getElementById('app').innerHTML = `<upload-page user-id="${params.userId}" state="${params.state}" endpoint="upload/job-description"></upload-page>`;
    } else {
      document.getElementById('app').innerHTML = `<upload-page user-id="${params.userId}" state="${params.state}" endpoint="upload/resume"></upload-page>`;
    }
  })
  .on('/profile/:userId/:state', (params) => {
    document.getElementById('app').innerHTML = `<profile-page user-id="${params.userId}" state="${params.state}"></profile-page>`;
  })
  .on('/settings/:userId', (params) => {
    document.getElementById('app').innerHTML = `<settings-page user-id="${params.userId}"></settings-page>`;
  })
  .on('/preferences/:userId', (params) => {
    document.getElementById('app').innerHTML = `<preferences-page user-id="${params.userId}"></preferences-page>`;
  })
  */
  .resolve();