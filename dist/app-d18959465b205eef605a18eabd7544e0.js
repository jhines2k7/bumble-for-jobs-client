const router = new Navigo('/', { hash: true });

// import './components/app-header-4c97e525733513254f17d3c62ee17ebe.js';
// import './components/app-footer-29a53a22855a7207fbf6ec7ee202312c.js';
import { LoginPage } from './components/login-page-8d2fb9509f0606ffb0794e7ba325ae7f.js';
import './components/job-posts-page-53535383ae0acf9ae6df67339c8fde9e.js';
import './components/sliding-menu-482ef9889f91767a4eaca051de39b1dc.js';
// import './components/job-post-page-eaf88bf9d130914ae721533dd7107d9e.js';
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

        const token = parseJwt(data.access_token);

        router.navigate(`/foryou/${token.user_id}/${token.state}?page=1`);
      }).catch(error => {
        console.error('Error refreshing token:', error);
      });
    } else {
      const token = localStorage.getItem('access_token');
      router.navigate(`/foryou/${token.user_id}/${token.state}?page=1`);
    }
  })
  .on('/login', () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decodedToken = parseJwt(token);
      router.navigate(`/foryou/${decodedToken.user_id}/${decodedToken.state}?page=1`);
    }

    const loginPage = new LoginPage();
    loginPage.router = router;
    document.getElementById('app').innerHTML = '';
    document.getElementById('app').appendChild(loginPage);
  })
  .on('/foryou/:userId/:state', (params) => {
    (async () => {
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
        document.getElementById('app').innerHTML = `<job-posts-page></job-posts-page>`;
      } else {
        document.getElementById('app').innerHTML = `<job-post-page></job-post-page>`;
      }
    })();
  })
  /*
  .on('/job-seekers/:jobPostId', (params) => {
    document.getElementById('app').innerHTML = `<job-seeker-page job-post-id="${params.jobPostId}"></job-seeker-page>`;
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