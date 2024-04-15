const router = new Navigo('/', { hash: true });

// import './components/app-header.js';
// import './components/app-footer.js';
import '/components/sliding-menu.js';
import './components/interaction-controls.js';
import { LoginPage } from './components/login-page.js';
import { JobPostsPage } from './components/job-posts-page.js';
import { JobPostPage } from './components/job-post-page.js';
// import './components/job-seeker-page.js';
import { CompatibilityAnalysisPage } from './components/compatibility-analysis-page.js';
// import './components/chat-page.js';
// import './components/upload-page.js';
// import './components/profile-page.js';
// import './components/settings-page.js';
// import './components/preferences-page.js';
import { parseJwt, isTokenExpired, refreshAccessToken } from './utils.js';
import { DOMAIN } from './constants.js';

document.addEventListener('logout-event', function (e) {
  const token = localStorage.getItem('access_token');

  if (token) {
    fetch(`${DOMAIN}/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then(response => {
      if (response.ok) {
        // Remove the tokens from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');

        // Redirect the user to the login page
        router.navigate('/login');
      } else {
        console.error('Logout failed:', response.statusText);
      }
    }).catch(error => {
      console.error('Error during logout:', error);
    });
  } else {
    console.info('No access token found, routing to login page...');
    router.navigate('/login');
  }
});

router.hooks({
  before: async (done, match) => {
    console.log('match:', match);
    document.getElementById('app').innerHTML = '';

    if (match.url !== "login") {
      const token = localStorage.getItem('access_token');

      if (!token) {
        console.log('No access token found');

        done(false);

        router.navigate(`/login`);

        const loginPage = new LoginPage();
        loginPage.router = router;

        document.getElementById('app').appendChild(loginPage);
      } else {
        if (isTokenExpired(token)) {
          try {
            const refreshToken = localStorage.getItem('refresh_token');

            if (!refreshToken) {
              throw new Error('No refresh token found');
            }

            const data = await refreshAccessToken(refreshToken);
            console.log('Access token refreshed:', data);
            localStorage.setItem('access_token', data.access_token);
            done();
          } catch (error) {
            console.error('Error refreshing access token:', error);

            done(false);

            router.navigate(`/login`);

            const loginPage = new LoginPage();
            loginPage.router = router;

            document.getElementById('app').appendChild(loginPage);
          }
        }
      }
    }

    done();
  }
});

router
  .on(() => {
    router.navigate(`/foryou`);
  })
  .on('/login', () => {
    if (localStorage.getItem('access_token')) {
      router.navigate(`/foryou`);
    }

    const loginPage = new LoginPage();
    loginPage.router = router;

    document.getElementById('app').appendChild(loginPage);
  })
  .on('/foryou', () => {
    const decodedToken = parseJwt(localStorage.getItem('access_token'));

    if (decodedToken.roles.includes('EMPLOYER')) {
      const jobPostsPage = new JobPostsPage();
      jobPostsPage.router = router;
      document.getElementById('app').appendChild(jobPostsPage);
    } else {
      document.getElementById('app').innerHTML = `<job-post-page></job-post-page>`;
    }
  })
  .on('/job-post/:jobPostId', (match) => {
    const decodedToken = parseJwt(localStorage.getItem('access_token'));

    if (decodedToken.roles.includes('EMPLOYER')) {
      const jobPostPage = new JobPostPage();
      jobPostPage.router = router;
      jobPostPage.jobPostId = match.data.jobPostId;

      document.getElementById('app').appendChild(jobPostPage);
    }
  })
  .on('/compatibility-analysis/:analysisId', (match) => {
    const decodedToken = parseJwt(localStorage.getItem('access_token'));

    if (decodedToken.roles.includes('EMPLOYER')) {
      const compatibilityAnalysisPage = new CompatibilityAnalysisPage();
      compatibilityAnalysisPage.router = router;
      compatibilityAnalysisPage.analysisId = match.data.analysisId;

      document.getElementById('app').appendChild(compatibilityAnalysisPage);
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