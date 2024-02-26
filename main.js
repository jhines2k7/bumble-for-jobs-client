const router = new Navigo('/', { hash: true });
let profileMenu = document.getElementById('profile-menu');
let hammer = new Hammer(profileMenu);
const domain = 'http://localhost:8000';

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
      console.log('There has been a problem with your fetch operation: ', error);
    });
}

function navigateToLastResolved(userId, state) {
  window.history.back();
  // toggleProfileMenu(userId, state);
}

function toggleProfileMenu(userId, state) {
  (async () => {
    await loadTemplate("profile-menu.html", document.getElementById('profile-menu'));

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
      router.navigate(`/settings/${userId}/${state}`);
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
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      console.log('Response:', response.json());
    })
    .then(data => {
      console.log('Success:', data);
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
    await loadTemplate("file-upload.html", document.getElementById('app'));

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

function getJobPostings(userId, state, page) {
  fetch(`${domain}/job-postings?id=${userId}&state=${state}&page=${page}`)
    .then(res => res.json())
    .then(data => {
      (async () => {
        await loadTemplate("gallery.html", document.getElementById('app'));
        const userCardTemplate = document.querySelector("[data-contact-card-template]")
        const userCardContainer = document.querySelector("[data-contact-cards-container]")

        await loadTemplate("footer.html", document.getElementById('footer'));

        await loadTemplate("header.html", document.getElementById('header'));
        document.querySelector('#header h1').textContent = 'For You';

        document.querySelector('#header .avatar').addEventListener('click', () => {
          toggleProfileMenu(userId, state);
        });

        data.job_postings.map(posting => {
          console.log(`job posting: ${posting}`);
          const card = userCardTemplate.content.cloneNode(true).children[0]
          card.addEventListener('click', () => {
            router.navigate(`/job-posting/${posting.id}`);
          });

          const header = card.querySelector("[data-header]");
          const jobTitle = card.querySelector("[data-title]");
          const location = card.querySelector("[data-location]");
          header.innerHTML = `<h1>${posting.normalized_score}</h1><span>/100</span>`;
          jobTitle.textContent = posting.job_title;
          location.textContent = posting.location;
          userCardContainer.append(card);          
        })
      })();
    })
}

function getJobSeekers(userId, state, page) {
  const userCardTemplate = document.querySelector("[data-user-template]")
  const userCardContainer = document.querySelector("[data-user-cards-container]")

  fetch(`${domain}/${endpoint}/jobseekers/${userId}/state/${state}?page=${page}`)
    .then(res => res.json())
    .then(data => {
      (async () => {
        await loadTemplate("foryou.html", document.getElementById('app'));
        await loadTemplate("footer.html", document.getElementById('footer'));

        await loadTemplate("header.html", document.getElementById('header'));
        document.querySelector('#header h1').textContent = 'For You';

        document.querySelector('#header .avatar').addEventListener('click', () => {
          toggleProfileMenu(userId, state);
        });

        data.map(jobSeeker => {
          const card = userCardTemplate.content.cloneNode(true).children[0]
          const header = card.querySelector("[data-header]");
          const email = card.querySelector("[data-email]");
          const phone = card.querySelector("[data-phone]");
          header.textContent = user.name;
          email.textContent = user.email;
          phone.textContent = user.phone;
          userCardContainer.append(card);          
        })
      })();
    })
}

function getJobPosting(id) {
  fetch(`${domain}/job-postings/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      (async () => {
        await loadTemplate("job-posting.html", document.getElementById('app'));
        await loadTemplate("footer.html", document.getElementById('footer'));

        await loadTemplate("header.html", document.getElementById('header'));
        document.querySelector('#header h1').textContent = 'For You';

        document.querySelector('#header .avatar').addEventListener('click', () => {
          toggleProfileMenu(userId, state);
        });

        const jobPosting = data.job_posting;

        document.querySelector('.container h1').textContent = jobPosting.title;
        document.querySelector('.container .percentage').innerHTML = `${data.normalized_score}<span>/100</span>`;
        document.querySelector('.container .content p').textContent = jobPosting.description;

        const responsibilitiesUL = document.getElementById('responsibilities');
        jobPosting.responsibilities.forEach(responsibility => {
          let li = document.createElement('li');
          li.textContent = responsibility;
          responsibilitiesUL.appendChild(li);
        });

        const requiredSkillsUL = document.getElementById('required-skills');
        jobPosting.required_skills.forEach(skill => {
          let li = document.createElement('li');
          li.textContent = skill;
          requiredSkillsUL.appendChild(li);
        });

        const softSkillsUL = document.getElementById('soft-skills');
        jobPosting.soft_skills.forEach(skill => {
          let li = document.createElement('li');
          li.textContent = skill;
          softSkillsUL.appendChild(li);
        });

        if (jobPosting.benefits !== undefined && jobPosting.benefits !== null && jobPosting.benefits.length > 0) {
          const benefitsUL = document.getElementById('benefits');
          jobPosting.benefits.forEach(benefit => {
            let li = document.createElement('li');
            li.textContent = benefit;
            benefitsUL.appendChild(li);
          });
        } else {
          document.getElementById('benefits').innerHTML = '<li>No benefits listed</li>';
        }

        const chatButton = document.querySelector('.user-interaction-options .round-button.chat');
        chatButton.addEventListener('click', () => {
          router.navigate(`/chat?job_seeker_id=${userId}&employer_id=${jobPosting.employer_id}&job_posting_id=${jobPosting.id}`);
        });

        const likeButton = document.querySelector('.user-interaction-options .round-button.like');
        likeButton.addEventListener('click', () => {
          router.navigate(`/you/${userId}/${state}?page=${parseInt(page) + 1}`);
        });
      })();
    })
    .catch(error => {
      console.log('There has been a problem with your fetch operation: ', error);
    });
}

function checkTokenExpiry() {
  const token = localStorage.getItem('access_token');
  if (token) {
    console.log("Token:", token);
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Date.now() / 1000; // Convert to seconds
    if (now > expiry) {
      logout(); // Token has expired, log the user out
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
  // Remove the token from localStorage or sessionStorage
  localStorage.removeItem('access_token');
  // Redirect the user to the login page or home page
  router.navigate('/login');
}

function loadChat(userId, employerId, jobPostingId) {
  document.getElementById('header').innerHTML = '';

  fetch(`${domain}/get-chat?job_seeker_id=${userId}&employer_id=${employerId}&job_posting_id=${jobPostingId}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      (async () => {
        await loadTemplate("chat.html", document.getElementById('app'));
        await loadTemplate("chat-footer.html", document.getElementById('footer'));

        document.querySelector('.chat-title h1').textContent = data.job_title;

        const chatMessages = document.querySelector('#chat-zone .chat-messages');

        const token = localStorage.getItem('access_token');

        let userId = null;
        const decodedToken = parseJwt(token);
        if (decodedToken) {
          userId = decodedToken.user_id;
          console.log("User ID:", userId);
        }

        data.chat.messages.forEach(message => {
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
          dateTimeDiv.textContent = message.date;

          messageBlocDiv.appendChild(messageDiv);
          messageBlocDiv.appendChild(dateTimeDiv);

          messageItemDiv.appendChild(messageBlocDiv);

          chatMessages.appendChild(messageItemDiv);
        });
      })();
    })
    .catch(error => {
      console.log('There has been a problem with your fetch operation: ', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const socket = io(domain, { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('Connected to the server');
  });

  router
    .on(() => {
      console.log('Matched the default route');
      checkTokenExpiry();
      // get claims from the token
      const token = localStorage.getItem('access_token');
      const decodedToken = parseJwt(token);
      if (decodedToken) {
        router.navigate(`/foryou/${decodedToken.user_id}/${decodedToken.state}?page=1`);
      }
    })
    .on("/login", (match) => {
      console.log(`Match value on login route: ${JSON.stringify(match)}`);
      let loginForm = document.querySelector('.form .login-form');

      loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.querySelector('.login-form input[type="text"]').value;
        const password = document.querySelector('.login-form input[type="password"]').value;

        fetch(`${domain}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: username, password: password }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
            }

            return response.json();
          })
          .then(data => {
            if (data.access_token) {
              // Store the JWT in localStorage or session storage
              localStorage.setItem('access_token', data.access_token);

              router.navigate(`/foryou/${data.id}/${data.state}?page=1`);
            } else {
              alert('Login failed');
            }
          })
          .catch(error => console.error('Error:', error));
      });
    }, {
      before(done) {
        (async () => {
          document.getElementById('footer').innerHTML = '';
          document.getElementById('header').innerHTML = '';
          await loadTemplate("login.html", document.getElementById('app'));
          done();
        })();
      }
    })
    .on("/foryou/:userId/:state", (match) => {
      console.log(`Match value on for you route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        // get claims from the token
        const token = localStorage.getItem('access_token');
        const decodedToken = parseJwt(token);
        console.log("Decoded token:", decodedToken);
        if (decodedToken) {
          if (decodedToken.roles.includes('EMPLOYER')) {
            getJobSeekers(match.data.userId, match.data.state, match.params.page);
          } else {
            getJobPostings(match.data.userId, match.data.state, match.params.page);
          }
        }
        done();
      }
    })
    .on("/job-posting/:id", (match) => {
      console.log(`Match value on you route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          getJobPosting(match.data.id);
          
          done();
        })();
      }
    })
    .on("/chats/:userId", (match) => {
      console.log(`Match value on chats route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("chats.html", document.getElementById('app'));
          await loadTemplate("footer.html", document.getElementById('footer'));

          await loadTemplate("header.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Chats';
          done();
        })();
      }
    })
    .on("/chat", (match) => {
      console.log(`Match value on chat route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        loadChat(match.params.job_seeker_id, match.params.employer_id, match.params.job_posting_id);
        done();
      }
    })
    .on("/upload-resume", (match) => {
      console.log(`Match value on upload resume route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("file-upload.html", document.getElementById('app'));

          // remove all markup from the footer
          document.getElementById('footer').innerHTML = '';

          handleFileUpload('upload/job-description');

          done();
        })();
      }
    })
    .on("/profile/:userId/:state", (match) => {
      console.log(`Match value on profile route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        const user = {
          id: match.data.userId,
          state: match.data.state,
        };
        handleFileUpload('upload/resume', user);
        done();
      }
    })
    .on("/settings/:userId", (match) => {
      console.log(`Match value on settings route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("settings.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .on("/preferences/:userId", (match) => {
      console.log(`Match value on preferences route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("preferences.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .resolve();
});