const router = new Navigo('/', { hash: true });
let profileMenu = document.getElementById('profile-menu');
let hammer = new Hammer(profileMenu);
const domain = 'https://bfj.generalsolutions43.com';

const socket = io(domain, { transports: ['websocket'] });

async function loadTemplate(name, element) {
  return fetch(`templates/${name}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      element.innerHTML = data;
    })
    .catch(error => {
      console.debug('There has been a problem with your fetch operation: ', error);
    });
}

function navigateToLastResolved(userId, state) {
  window.history.back();
  // toggleProfileMenu(userId, state);
}

function toggleProfileMenu(userId, state) {
  (async () => {
    await loadTemplate("profile-menu-1f935f85c6e7f25c6680156b02caacba.html", document.getElementById('profile-menu'));

    // create a transparent overlay to prevent scrolling and clicking
    let overlay = document.createElement('div');
    // set the height of the overlay to 100% of the viewport
    overlay.style.height = '100vh';
    // position the overlay to the left of the screen
    overlay.style.left = '0';
    overlay.style.top = '0';
    // set the width of the overlay to 100% of the viewport
    overlay.style.width = '100vw';
    // set the z-index of the overlay to 150
    overlay.style.zIndex = '150';
    // set the position of the overlay to absolute
    overlay.style.position = 'absolute';
    // set a click event listener on the overlay
    overlay.addEventListener('click', () => {
      // remove the overlay
      overlay.remove();
      profileMenu.classList.toggle('move-right');
    });
    // append the overlay to the body
    document.body.appendChild(overlay);

    profileMenu.style.left = '-300px';
    profileMenu.classList.toggle('move-right');

    let initialPosition = -300;
    let newPosition = 0;

    hammer.on('panend', function (e) {
      // snap back to initial position if the element is dragged less than 300px to the left
      if (newPosition > -450) {
        profileMenu.style.left = '-300px';
      }

      if (newPosition <= -450) {
        overlay.remove();
        profileMenu.classList.remove('move-right');
      }
    });

    hammer.on('panmove', function (e) {
      newPosition = initialPosition + e.deltaX;

      if (newPosition <= initialPosition) {
        profileMenu.style.left = newPosition + 'px';
      }
    });

    const preferencesBtn = document.getElementById('preferences-btn');
    preferencesBtn.addEventListener('click', () => {
      router.navigate(`/preferences/${userId}/${state}`);
    });

    const settingsBtn = document.getElementById('settings-btn');
    settingsBtn.addEventListener('click', () => {
      // router.navigate(`/settings/${userId}/${state}`);
      var overlay = document.body.lastElementChild;
      overlay.remove();

      let profileMenu = document.getElementById('profile-menu');
      profileMenu.classList.toggle('move-right');

      logout();
    });

    const profileBtn = document.getElementById('profile-btn');
    profileBtn.addEventListener('click', () => {
      router.navigate(`/profile/${userId}/${state}`);
    });
  })();
}

function uploadFile(endpoint, user) {
  var formData = new FormData();

  // Ensure there's at least one file selected
  if (fileInput.files.length === 0) {
    alert('Please select a file to upload.');
    return;
  }

  // Append the file to the FormData instance
  formData.append('file', fileInput.files[0]);
  formData.append('user', JSON.stringify(user));

  // Disable the button to prevent multiple uploads
  this.disabled = true;
  this.textContent = 'Uploading...';

  // Use Fetch API to post the FormData to the server
  fetch(`${domain}/${endpoint}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          router.navigate('/login');
        }

        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json(); // Return JSON data
    })
    .then(data => {
      console.debug('Success:', data);
      document.getElementById('file-to-upload').innerHTML = '';
      document.getElementById('upload-status').innerText = 'Upload successful!';
      // Re-enable the button
      this.disabled = false;
      this.textContent = 'Upload File';
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('file-to-upload').innerHTML = '';
      document.getElementById('upload-status').innerText = 'Upload failed: ' + error.message;
      // Re-enable the button
      this.disabled = false;
      this.textContent = 'Upload File';
    });
}

function handleFileUpload(endpoint, user) {
  (async () => {
    await loadTemplate("file-upload-ab22345fd6d9b7bda5962481f1af72af.html", document.getElementById('app'));

    var overlay = document.body.lastElementChild;
    overlay.remove();

    let profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.toggle('move-right');

    // remove all markup from the footer
    document.getElementById('footer').innerHTML = '';
    document.getElementById('header').innerHTML = '';

    let dropArea = document.querySelector('.upload-area-description'); // document.getElementById('drop-area');          
    let fileInput = document.getElementById('file-input');
    let uploadBtn = document.querySelector('.modal-footer .btn-primary'); // document.getElementById('upload-btn');
    let cancelBtn = document.querySelector('.modal-footer .btn-secondary'); // document.getElementById('cancel-btn');
    let fileBrowseBtn = document.querySelector('.modal-logo');

    // Highlight drop area when file is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });

    // Handle file drop
    dropArea.addEventListener('drop', handleDrop, false);

    // Handle file selection via input
    fileInput.addEventListener('change', function () {
      handleFiles(this.files);
    }, false);

    document.querySelector('.upload-area-description strong').addEventListener('click', function () {
      // Trigger the file input when the div is clicked
      fileInput.click();
    });

    fileBrowseBtn.addEventListener('click', function () {
      fileInput.click();
    });

    // Handle the actual upload process
    uploadBtn.addEventListener('click', function () {
      uploadFile(endpoint, user);
    });

    // Cancel button logic
    cancelBtn.addEventListener('click', function () {
      fileInput.value = ''; // Clear the input
      // TODO: Any additional cancel logic
      alert('Upload cancelled.');
    });

    function highlight(e) {
      dropArea.classList.add('highlight');
    }

    function unhighlight(e) {
      dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
      var dt = e.dataTransfer;
      var files = dt.files;

      handleFiles(files);
    }

    function handleFiles(files) {
      // Simple validation for file type and size
      const file = files[0];
      if (!file) {
        return; // No file selected
      }

      // Validate the file type
      const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(file.type)) {
        alert('Please select valid file type: docx, pdf, or txt.');
        return;
      }

      // Validate the file size (e.g., 2MB limit)
      const maxSizeInBytes = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSizeInBytes) {
        alert('The file is too large. Please select a file smaller than 2MB.');
        return;
      }

      uploadBtn.disabled = false;

      // add an icon for the file type
      /*
      <div class="icon pdf">PDF</div>
      <div class="icon xls">XLS</div>
      <div class="icon doc">DOC</div>
      */
      const fileTypeLookup = {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'doc',
        'text/plain': 'txt'
      };

      const fileType = fileTypeLookup[file.type];

      let icon = document.createElement('div');
      icon.classList.add('icon');
      icon.classList.add(fileType);
      icon.textContent = fileType.toUpperCase();

      let p = document.createElement('p');
      p.textContent = file.name;

      document.getElementById('file-to-upload').innerHTML = '';
      document.getElementById('file-to-upload').appendChild(icon);
      document.getElementById('file-to-upload').appendChild(p);
    }
  })();
}

async function getJobPostListing(employerId, state) {
  const response = await fetch(`${domain}/job-post-listing`, {
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

  loadTemplate("job-post-listing-14424a816a55ce227896b1252af8d814.html", document.getElementById('app'));
  loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));

  await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
  document.querySelector('#header h1').textContent = 'Job Posts';

  document.querySelector('#header .avatar').addEventListener('click', () => {
    toggleProfileMenu(employerId, state);
  });

  const cardTemplate = document.querySelector("[data-job-post-card-template]")
  const cardContainer = document.querySelector("[data-job-post-card-container]")
  console.debug('job listing data: ' + data);
  data.map(post => {
    const card = cardTemplate.content.cloneNode(true).children[0]
    card.addEventListener('click', () => {
      router.navigate(`/job-seekers/${post.id}`);
    });

    const jobTitle = card.querySelector("[data-title]");
    const location = card.querySelector("[data-location]");
    const count = card.querySelector("[data-count]");
    jobTitle.textContent = post.title;
    location.textContent = post.location;
    count.textContent = post.count;
    cardContainer.append(card);
  })
}

async function getJobPosts(userId, state, page, liked) {
  let url = `${domain}/job-posts?page=${page}`;
  
  if(liked) {
    url = `${domain}/job-posts?page=${page}&liked=${liked}`;
  }

  const response = await fetch(url, {
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

  await loadTemplate("gallery-7541a8e55baf01b38b04e10006627d5a.html", document.getElementById('app'));
  const userCardTemplate = document.querySelector("[data-contact-card-template]")
  const userCardContainer = document.querySelector("[data-contact-cards-container]")

  await loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));
  const forYouLink = document.querySelector('.footer-link.for-you');
  forYouLink.href = `#/foryou/${userId}/${state}?page=1`;

  const likesLink = document.querySelector('.footer-link.likes');
  likesLink.href = `#/likes/${userId}/${state}?page=1`;

  await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
  document.querySelector('#header h1').textContent = 'For You';

  document.querySelector('#header .avatar').addEventListener('click', () => {
    toggleProfileMenu(userId, state);
  });

  data.job_posts.map(post => {
    console.debug(`job post: ${post}`);
    const card = userCardTemplate.content.cloneNode(true).children[0]
    card.addEventListener('click', () => {
      router.navigate(`/compatibility-analysis/${post.id}`);
    });

    const header = card.querySelector("[data-header]");
    const jobTitle = card.querySelector("[data-title]");
    const location = card.querySelector("[data-location]");
    header.innerHTML = `<h1>${post.normalized_score}</h1><span>/100</span>`;
    jobTitle.textContent = post.job_title;
    location.textContent = post.location;
    userCardContainer.append(card);
  })
}

function toSentenceCase(str) {
  // Split the string into an array of words
  let words = str.split('_');

  // Capitalize the first letter of the first word
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

  // Join the words back into a string with spaces
  return words.join(' ');
}

function updateFixedElementSizeAndPosition() {
  const parent = document.getElementById('app');
  const rect = parent.getBoundingClientRect(); // Get position & size of parent

  const fixedElement = document.querySelector('#chat-zone .chat-messages');

  if (fixedElement) {
    // Set size and position to match parent
    // fixedElement.style.width = `${rect.width}px`;
    fixedElement.style.height = `${rect.height}px`;
    // fixedElement.style.top = '60px';
    // fixedElement.style.left = `${rect.left}px`;
  } else {
    console.error('Fixed element not found');
  }
}

async function getCompatibilityAnalysis(id) {
  const response = await fetch(`${domain}/compatibility-analysis/${id}`, {
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

  const token = parseJwt(localStorage.getItem('access_token'));
  const userId = token.user_id;
  const state = token.state;

  await loadTemplate("compatibility-analysis-a1f434b530eaece19f009828ce815dfc.html", document.getElementById('app'));
  await loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));
  const forYouLink = document.querySelector('.footer-link.for-you');
  forYouLink.href = `#/foryou/${userId}/${state}?page=1`;

  const likesLink = document.querySelector('.footer-link.likes');
  likesLink.href = `#/likes/${userId}/${state}?page=1`;

  await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
  document.querySelector('#header h1').textContent = 'Compatibility Analysis';

  document.querySelector('#header .avatar').addEventListener('click', () => {
    toggleProfileMenu(userId, state);
  });

  document.querySelector('.container .job-title').textContent = data.job_title;
  document.querySelector('.container .username').textContent = data.username;

  let ul = document.querySelector('.container ul');

  // loop through the keys of the object
  for (let key in data.compatibility_analysis) {
    let sentenceCasedKey = toSentenceCase(key);

    let li = document.createElement('li');
    li.textContent = `${sentenceCasedKey}: ${data.compatibility_analysis[key]}`;
    ul.appendChild(li);
  }

  // select the p tag after the h2 tag
  const p = document.querySelector('.full-analysis');
  p.textContent = data.full_analysis;

  const chatButton = document.querySelector('.user-interaction-options .round-button.chat');
  chatButton.addEventListener('click', () => {
    router.navigate(`/chat?job_seeker_id=${data.job_seeker_id}&employer_id=${data.employer_id}&job_post_id=${data.job_post_id}`);
  });

  const likeButton = document.querySelector('.user-interaction-options .round-button.like');
  likeButton.addEventListener('click', () => {
    markCompatibilityAnalysis(id, 'Y', true, true);
  });

  const dislikeButton = document.querySelector('.user-interaction-options .round-button.dislike');
  dislikeButton.addEventListener('click', () => {
    markCompatibilityAnalysis(id, 'N', true, true);
  });
}

async function getJobSeekers(jobPostId) {
  // const response = await fetch(`${domain}/job-seekers/${jobPostId}`, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${localStorage.getItem('access_token')}`
  //   }
  // });

  fetch(`${domain}/job-seekers/${jobPostId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  })
    .then(response => {
      if (!response.ok) {
        if (response.status === 401) {
          router.navigate('/login');
        }

        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      (async () => {

        await loadTemplate("gallery-7541a8e55baf01b38b04e10006627d5a.html", document.getElementById('app'));
        await loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));

        await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
        document.querySelector('#header h1').textContent = 'For You';

        document.querySelector('#header .avatar').addEventListener('click', () => {
          toggleProfileMenu(userId, state);
        });

        const userCardTemplate = document.querySelector("[data-contact-card-template]")
        const userCardContainer = document.querySelector("[data-contact-cards-container]")

        const h1 = document.querySelector('.job-title');
        h1.textContent = data.job_seekers[0].job_title;

        data.job_seekers.map(jobSeeker => {
          const card = userCardTemplate.content.cloneNode(true).children[0]
          card.addEventListener('click', () => {
            router.navigate(`/compatibility-analysis/${jobSeeker.analysis_id}`);
          });

          const header = card.querySelector("[data-header]");
          const username = card.querySelector("[data-title]");
          const location = card.querySelector("[data-location]");
          header.innerHTML = `<h1>${jobSeeker.normalized_score}</h1><span>/100</span>`;
          username.textContent = jobSeeker.username;
          location.textContent = `${jobSeeker.city}, ${jobSeeker.state}`;
          userCardContainer.append(card);
        })
      })();
    })
}

async function getJobSeekerCompatibilityAnalysis(compatibility_analysis_id) {
  const response = await fetch(`${domain}/job-seeker-compatibility-analysis/${compatibility_analysis_id}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      router.navigate('/login');
    }

    if (response.status === 404) {
      router.navigate('/no-job-posts');
    }

    throw new Error('Network response was not ok ' + response.statusText);
  }

  const data = await response.json();

  let decodedToken = parseJwt(localStorage.getItem('access_token'));
  let userId = null;
  let state = null;
  if (decodedToken) {
    userId = decodedToken.user_id;
    state = decodedToken.state;
  }
  await loadTemplate("job-post-42ca49be746eb64bc8f08c8cf4ab6877.html", document.getElementById('app'));
  
  await loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));
  const forYouLink = document.querySelector('.footer-link.for-you');
  forYouLink.href = `#/foryou/${userId}/${state}?page=1`;

  const likesLink = document.querySelector('.footer-link.likes');
  likesLink.href = `#/likes/${userId}/${state}?page=1`;

  await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
  document.querySelector('#header h1').textContent = 'For You';

  document.querySelector('#header .avatar').addEventListener('click', () => {
    toggleProfileMenu(userId, state);
  });

  const jobPost = data.job_post;

  document.querySelector('.container h1').textContent = jobPost.title;
  document.querySelector('.container .percentage').innerHTML = `${data.normalized_score}<span>/100</span>`;
  document.querySelector('.container .content p').textContent = jobPost.description;

  const responsibilitiesUL = document.getElementById('responsibilities');
  jobPost.responsibilities.forEach(responsibility => {
    let li = document.createElement('li');
    li.textContent = responsibility;
    responsibilitiesUL.appendChild(li);
  });

  const requiredSkillsUL = document.getElementById('required-skills');
  jobPost.required_skills.forEach(skill => {
    let li = document.createElement('li');
    li.textContent = skill;
    requiredSkillsUL.appendChild(li);
  });

  const softSkillsUL = document.getElementById('soft-skills');
  jobPost.soft_skills.forEach(skill => {
    let li = document.createElement('li');
    li.textContent = skill;
    softSkillsUL.appendChild(li);
  });

  if (typeof jobPost.benefits === 'string') {
    document.getElementById('benefits').innerHTML = `<li>${jobPost.benefits}</li>`;
  } else if (Array.isArray(jobPost.benefits) && jobPost.benefits.length > 0) {
    const benefitsUL = document.getElementById('benefits');
    jobPost.benefits.forEach(benefit => {
      let li = document.createElement('li');
      li.textContent = benefit;
      benefitsUL.appendChild(li);
    });
  } else {
    document.getElementById('benefits').innerHTML = '<li>No benefits listed</li>';
  }

  const chatButton = document.querySelector('.user-interaction-options .round-button.chat');
  chatButton.addEventListener('click', () => {
    router.navigate(`/chat?job_seeker_id=${userId}&employer_id=${jobPost.employer_id}&job_post_id=${jobPost.id}`);
  });

  const likeButton = document.querySelector('.round-button.like');
  likeButton.addEventListener('click', async () => {
    markCompatibilityAnalysis(compatibility_analysis_id, 'Y');
  });

  const dislikeButton = document.querySelector('.round-button.dislike');
  dislikeButton.addEventListener('click', () => {
    markCompatibilityAnalysis(compatibility_analysis_id, 'N');
  });
}

async function markCompatibilityAnalysis(compatibility_analysis_id, like, employer) {
  let endpoint = 'mark-compatibility-analysis';

  if(employer) {
    endpoint = '/mark-jobseeker-compatibility-analysis';
  }

  const response = await fetch(`${domain}/${endpoint}/${compatibility_analysis_id}?like=${like}`, {
    method: 'PUT',
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

  if(response.status === 204) {
    router.navigate('/no-job-posts');

    return;
  }

  const data = await response.json();

  router.navigate('/compatibility-analysis/' + data.next);
}

function isTokenExpired() {
  const token = localStorage.getItem('access_token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Date.now() / 1000; // Convert to seconds
    if (now > expiry) {
      console.debug("Token has expired");

      return true;
    }
  } else {
    logout(); // No token found, log the user out
  }
}

function parseJwt(token) {
  try {
    // Split the token into its parts
    const base64Url = token.split('.')[1];
    // Replace URL-safe characters and decode
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    // Parse the decoded payload
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decoding JWT:", e);
    return null;
  }
}

function createSvg(hashValue, size) {
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttributeNS(null, "width", size);
  svg.setAttributeNS(null, "height", size);
  svg.setAttributeNS(null, "data-jdenticon-value", hashValue);
  return svg;
}

function appendIdenticon(hashValue, size, targetElement) {
  var identicon = createSvg(hashValue, size);
  document.querySelector(targetElement).appendChild(identicon);
  jdenticon.update(identicon);
}

function logout() {
  fetch(`${domain}/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  }).then(response => {
    if (!response.ok) {
      // Remove the token from localStorage  
      localStorage.removeItem('access_token');
      // Redirect the user to the login page or home page
      router.navigate('/login');

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Remove the token from localStorage  
    localStorage.removeItem('access_token');
    // Redirect the user to the login page or home page
    router.navigate('/login');
  });
}

async function loadChat(jobSeekerId, employerId, jobPostId) {
  document.getElementById('header').innerHTML = '';

  const response = await fetch(`${domain}/chat?job_seeker_id=${jobSeekerId}&employer_id=${employerId}&job_post_id=${jobPostId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    }
  });

  if (!response.ok) {
    if (response.status === 401) {
      router.navigate('/login');
    }
  }

  const data = await response.json();

  await loadTemplate("chat-3a3896f5583c9db6397a942de417dab7.html", document.getElementById('app'));
  await loadTemplate("chat-footer-8cb9441ae82b8cbeb26c69a888275874.html", document.getElementById('footer'));

  updateFixedElementSizeAndPosition();

  window.onresize = updateFixedElementSizeAndPosition;

  document.querySelector('.chat-title h1').textContent = data.job_title;

  const chatMessages = document.querySelector('#chat-zone .chat-messages');

  const token = localStorage.getItem('access_token');

  let userId = null;
  const decodedToken = parseJwt(token);
  if (decodedToken) {
    userId = decodedToken.user_id;
    console.debug("User ID:", userId);
  }

  data.chat.messages.slice().reverse().forEach(message => {
    let messageItemDiv = document.createElement('div');

    if (message.sender_id === userId) {
      messageItemDiv.classList.add('message-item', 'sender');
    } else {
      messageItemDiv.classList.add('message-item', 'receiver');
    }

    let messageBlocDiv = document.createElement('div');
    messageBlocDiv.classList.add('message-bloc');

    let messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = message.content;

    let dateTimeDiv = document.createElement('div');
    dateTimeDiv.classList.add('date-time');
    dateTimeDiv.textContent = formatTime12hr(new Date(message.date));

    messageBlocDiv.appendChild(messageDiv);
    messageBlocDiv.appendChild(dateTimeDiv);

    messageItemDiv.appendChild(messageBlocDiv);

    chatMessages.appendChild(messageItemDiv);
  });

  let chatInput = document.querySelector('#chat-input input[type="text"]');

  let sendButton = document.querySelector('#chat-input button');
  sendButton.addEventListener('click', function () {
    const content = chatInput.value;
    chatInput.value = '';

    let messageItemDiv = document.createElement('div');

    messageItemDiv.classList.add('message-item', 'sender');

    let messageBlocDiv = document.createElement('div');
    messageBlocDiv.classList.add('message-bloc');

    let messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = content;

    let dateTimeDiv = document.createElement('div');
    dateTimeDiv.classList.add('date-time');
    const now = new Date();
    dateTimeDiv.textContent = formatTime12hr(now);

    messageBlocDiv.appendChild(messageDiv);
    messageBlocDiv.appendChild(dateTimeDiv);

    messageItemDiv.appendChild(messageBlocDiv);

    chatMessages.insertBefore(messageItemDiv, chatMessages.firstChild);

    socket.emit('message_sent', {
      chat_id: data.chat.id,
      job_post_id: jobPostId,
      message: {
        sender_id: decodedToken.user_id,
        receiver_id: data.receiver_id,
        date: now.toISOString(),
        read: false,
        read_time: null,
        message_type: 'text',
        job_post_id: jobPostId,
        content: content,
        status: 'sent'
      }
    });
  });

  socket.emit('join_chat', { chat_id: data.chat.id });
}

function formatTime12hr(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutesPadded = minutes < 10 ? '0' + minutes : minutes;

  const formattedTime = hours + ':' + minutesPadded + ' ' + ampm;
  return formattedTime;
}

function registerSocketIOEventListeners() {
  socket.on('connect', () => {
    console.debug('Connected to the server');
  });

  socket.on('new_message', (data) => {
    isTokenExpired();
    const chatMessages = document.querySelector('#chat-zone .chat-messages');

    let messageItemDiv = document.createElement('div');

    messageItemDiv.classList.add('message-item', 'receiver');

    let messageBlocDiv = document.createElement('div');
    messageBlocDiv.classList.add('message-bloc');

    let messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.textContent = data.message.content;

    let dateTimeDiv = document.createElement('div');
    dateTimeDiv.classList.add('date-time');
    const messageTime = new Date(data.message.date);
    dateTimeDiv.textContent = formatTime12hr(messageTime);

    messageBlocDiv.appendChild(messageDiv);
    messageBlocDiv.appendChild(dateTimeDiv);

    messageItemDiv.appendChild(messageBlocDiv);

    chatMessages.insertBefore(messageItemDiv, chatMessages.firstChild);

    socket.emit('message_received', { message: data.message, chat_id: data.chat_id, job_post_id: data.job_post_id });
  });

  socket.on('chat_joined', (data) => {
    console.debug(`Joined chat: ${data.chat_id}`);
  });
}

async function refreshAccessToken() {
  try {
    console.debug('Refreshing access token...')

    const response = await fetch(`${domain}/token/refresh`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('refresh_token')}`
      }
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 500) {
        router.navigate('/login');
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error refreshing token:', error);

    throw error;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  registerSocketIOEventListeners();

  router
    .on(() => {
      console.debug('Matched the default route');
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
    .on("/login", (match) => {
      console.debug(`Match value on login route: ${JSON.stringify(match)}`);

      (async () => {
        document.getElementById('footer').innerHTML = '';
        document.getElementById('header').innerHTML = '';

        await loadTemplate("login-5810d77949c583cca8d80562e79410a6.html", document.getElementById('app'));

        let loginForm = document.querySelector('.form .login-form');

        loginForm.addEventListener('submit', async function (e) {
          e.preventDefault();

          const email = document.querySelector('.login-form input[type="text"]').value;
          const password = document.querySelector('.login-form input[type="password"]').value;

          try {
            const response = await fetch(`${domain}/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: email, password: password }),
            });

            if (!response.ok) {
              document.querySelector('.login .form p.message.error').textContent = 'Username or password is incorrect';
              throw new Error('Network response was not ok ' + response.statusText);
            }

            const data = await response.json();

            if (data.access_token && data.refresh_token) {
              // Store the JWT in localStorage or session storage
              localStorage.setItem('access_token', data.access_token);
              localStorage.setItem('refresh_token', data.refresh_token);

              const token = parseJwt(data.access_token);
              router.navigate(`/foryou/${token.user_id}/${token.state}?page=1`);
            } else {
              throw new Error('Access token or refresh token not found in response');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        });
      })();

    }, {
      before(done) {
        document.getElementById('footer').innerHTML = '';
        document.getElementById('header').innerHTML = '';
        loadTemplate("login-5810d77949c583cca8d80562e79410a6.html", document.getElementById('app'));
        done();
      }
    })
    .on("/foryou/:userId/:state", (match) => {

    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);

            const token = parseJwt(data.access_token);

            if (token.roles.includes('EMPLOYER')) {
              getJobPostListing(match.data.userId, match.data.state);
            } else {
              getJobPosts(match.data.userId, match.data.state, match.params.page);
            }
          });
        } else {
          // log expiration date
          const token = parseJwt(localStorage.getItem('access_token'));

          if (token.roles.includes('EMPLOYER')) {
            getJobPostListing(match.data.userId, match.data.state);
          } else {
            getJobPosts(match.data.userId, match.data.state, match.params.page);
          }
        }

        done();
      }
    })
    .on("/job-seekers/:jobPostId", (match) => {
      console.debug(`Match value on job seekers route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);

            getJobSeekers(match.data.jobPostId);
          });
        } else {
          getJobSeekers(match.data.jobPostId);
        }

        done();
      }
    })
    .on("/compatibility-analysis/:analysisId", (match) => {
      console.debug(`Match value on chats route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);

            const token = parseJwt(data.access_token);

            if(token.roles.includes('EMPLOYER')) {
              getCompatibilityAnalysis(match.data.analysisId);
            } else {
              getJobSeekerCompatibilityAnalysis(match.data.analysisId);
            }
          });
        } else {
          const token = parseJwt(localStorage.getItem('access_token'));
          
          if(token.roles.includes('EMPLOYER')) {
            getCompatibilityAnalysis(match.data.analysisId);
          } else {
            getJobSeekerCompatibilityAnalysis(match.data.analysisId);
          }
        }

        done();
      }
    })
    .on("/chats/:userId", (match) => {
      console.debug(`Match value on chats route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);

            loadTemplate("chats-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
            loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));

            loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
            document.querySelector('#header h1').textContent = 'Chats';
          });
        } else {
          loadTemplate("chats-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
          loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));

          loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Chats';
        }

        done();
      }
    })
    .on("/chat", (match) => {
      console.debug(`Match value on chat route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);

            loadChat(match.params.job_seeker_id, match.params.employer_id, match.params.job_post_id);
          });
        } else {
          loadChat(match.params.job_seeker_id, match.params.employer_id, match.params.job_post_id);
        }
        done();
      }
    })
    .on("/upload/:userId/:state", (match) => {
      console.debug(`Match value on upload route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        const user = {
          id: match.data.userId,
          state: match.data.state,
        };

        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);

            const token = parseJwt(data.access_token);

            if (token.roles.includes('EMPLOYER')) {
              handleFileUpload('upload/job-description', user);
            } else {
              handleFileUpload('upload/resume', user);
            }
          });
        } else {
          const token = localStorage.getItem('access_token');

          if (token.roles.includes('EMPLOYER')) {
            handleFileUpload('upload/job-description', user);
          } else {
            handleFileUpload('upload/resume', user);
          }
        }

        done();
      }
    })
    .on("/profile/:userId/:state", (match) => {
      console.debug(`Match value on profile route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);

            loadTemplate("profile-448518c07b2836cf2706151c20b876d4.html", document.getElementById('app'));
            loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));

            loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
            document.querySelector('#header h1').textContent = 'Profile';

            document.querySelector('#header .avatar').addEventListener('click', () => {
              toggleProfileMenu(match.data.userId, match.data.state);
            });
          });
        } else {
          loadTemplate("profile-448518c07b2836cf2706151c20b876d4.html", document.getElementById('app'));
          loadTemplate("footer-0cf1295aa77c5fb4a2a0673f44851d0f.html", document.getElementById('footer'));

          loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Profile';

          document.querySelector('#header .avatar').addEventListener('click', () => {
            toggleProfileMenu(match.data.userId, match.data.state);
          });
        }
        const user = {
          id: match.data.userId,
          state: match.data.state,
        };
        handleFileUpload('upload/resume', user);
        done();
      }
    })
    .on("/settings/:userId", (match) => {
      console.debug(`Match value on settings route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);
            loadTemplate("settings-d41d8cd98f00b204e9800998ecf8427e.html", document.getElementById('app'));
          });
        } else {
          loadTemplate("settings-d41d8cd98f00b204e9800998ecf8427e.html", document.getElementById('app'));
        }

        done();
      }
    })
    .on("/preferences/:userId", (match) => {
      console.debug(`Match value on preferences route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);
            loadTemplate("preferences-d41d8cd98f00b204e9800998ecf8427e.html", document.getElementById('app'));
          });
        } else {
          loadTemplate("preferences-d41d8cd98f00b204e9800998ecf8427e.html", document.getElementById('app'));
        }

        done();
      }
    })
    .on("/no-job-posts", (match) => {
      console.debug(`Match value on no job posts route: ${JSON.stringify(match)}`);
      loadTemplate("no-job-posts-699379345f6871ba558de4d76817024b.html", document.getElementById('app'));
    })
    .on('/likes/:userId/:state', (match) => {
      console.debug(`Match value on likes route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        if (isTokenExpired()) {
          refreshAccessToken().then(data => {
            localStorage.setItem('access_token', data.access_token);
            
            getJobPosts(match.data.userId, match.data.state, match.params.page, 'true');
          });
        } else {
          getJobPosts(match.data.userId, match.data.state, match.params.page, 'true');
        }

        done();
      }
    })
    .resolve();
});