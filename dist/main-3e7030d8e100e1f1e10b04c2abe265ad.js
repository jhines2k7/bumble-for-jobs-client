const router = new Navigo('/', { hash: true });
let profileMenu = document.getElementById('profile-menu');
let hammer = new Hammer(profileMenu);
const domain = 'https://bfj.generalsolutions43.com';

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

function navigateToLastResolved() {
  window.history.back();
  toggleProfileMenu();
}

function toggleProfileMenu(userId) {
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
      router.navigate(`/preferences/${userId}`);
    });

    const settingsBtn = document.getElementById('settings-btn');
    settingsBtn.addEventListener('click', () => {
      router.navigate(`/settings/${userId}`);
    });

    const profileBtn = document.getElementById('profile-btn');
    profileBtn.addEventListener('click', () => {
      router.navigate(`/profile/${userId}`);
    });
  })();
}

function handleFileUpload(endpoint) {
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
    var formData = new FormData();

    // Ensure there's at least one file selected
    if (fileInput.files.length === 0) {
      alert('Please select a file to upload.');
      return;
    }

    // Append the file to the FormData instance
    formData.append('file', fileInput.files[0]);

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
    // Simple validation for demonstration purposes
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
}

function getCompatibilityAnalysis(userId, state, page) {
  fetch(`${domain}/get-compatibility-analysis/${userId}/${state}?page=${page}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const jobDescription = data.job_description;

      document.querySelector('.container h1').textContent = jobDescription.title;
      document.querySelector('.container .percentage').innerHTML = `${data.score}<span>/100</span>`;
      document.querySelector('.container .content p').textContent = jobDescription.description;

      const chatButton = document.querySelector('.user-interaction-options .round-button.chat');
      chatButton.addEventListener('click', () => {
        router.navigate(`/chat/${userId}/${jobDescription.employer_id}`);
      });
    })
    .catch(error => {
      console.log('There has been a problem with your fetch operation: ', error);
    });
}

function checkTokenExpiry() {
  const token = localStorage.getItem('access_token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp;
    const now = Date.now() / 1000; // Convert to seconds
    if (now > expiry) {
      logout(); // Token has expired, log the user out
    }
  }
}

function logout() {
  // Remove the token from localStorage or sessionStorage
  localStorage.removeItem('access_token');
  // Redirect the user to the login page or home page
  router.navigate('/login');
}

// Call this function on page load or periodically
// checkTokenExpiry();

document.addEventListener('DOMContentLoaded', () => {
  const socket = io(domain, { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('Connected to the server');
  });

  router
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

              router.navigate(`/you/${data.id}/${data.state}?page=1`);
            } else {
              alert('Login failed');
            }
          })
          .catch(error => console.error('Error:', error));
      });
    }, {
      before(done) {
        (async () => {
          await loadTemplate("login-a89aeb4d882525f6323a07d6175f0b36.html", document.getElementById('app'));
          document.getElementById('footer').innerHTML = '';
          done();
        })();
      }
    })
    .on("/", (match) => {
      console.log(`Match value on home route: ${JSON.stringify(match)}`);
    }, {
      before(done) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("home.html", document.getElementById('app'));
          await loadTemplate("footer-11c9a829e91bc79349c29e61c42c5fb8.html", document.getElementById('footer'));

          await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Home';

          done();
        })();
      }
    })
    .on("/you/:id/:state", (match) => {
      console.log(`Match value on you route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("foryou-a504e05bcd79344f108d8c0df842b425.html", document.getElementById('app'));
          await loadTemplate("footer-11c9a829e91bc79349c29e61c42c5fb8.html", document.getElementById('footer'));
          await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'For You';

          const avatar = document.querySelector('#header .avatar');
          avatar.addEventListener('click', () => {
            toggleProfileMenu(match.data.id);
          }, false);

          getCompatibilityAnalysis(match.data.id, match.data.state, match.params.page);

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
          await loadTemplate("chats-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
          await loadTemplate("footer-11c9a829e91bc79349c29e61c42c5fb8.html", document.getElementById('footer'));

          await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Chats';
          /*    <div class="chat-title">
                  <a href="#/you/12345678">&lt; Communication, Society and Media (Job Title)</a>
                </div> */
          done();
        })();
      }
    })
    .on("/daily/:userId", (match) => {
      console.log(`Match value on daily route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("dailypicks-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
          await loadTemplate("footer-11c9a829e91bc79349c29e61c42c5fb8.html", document.getElementById('footer'));

          await loadTemplate("header-eec68ed32b504a4e1b1ec348d14774e8.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Daily Picks';
          done();
        })();
      }
    })
    .on("/chat/:userId/:employerId", (match) => {
      console.log(`Match value on chat route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("chat-8a84170e7a3bfa4539ad0280218f5b74.html", document.getElementById('app'));
          await loadTemplate("chat-footer-8cb9441ae82b8cbeb26c69a888275874.html", document.getElementById('footer'));

          fetch(`${domain}/get-chat/${match.data.userId}/${match.data.employerId}`)
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
              document.querySelector('.chat-title p').textContent = data.job_description.title;

              const chatMessages = document.querySelector('#chat-zone .chat-messages');

              data.messages.forEach(message => {
                let messageItemDiv = document.createElement('div');

                if (message.sender === 'EMPLOYER') {
                  messageItemDiv.classList.add('message-item customer');
                } else {
                  messageItemDiv.classList.add('message-item moderator');
                }

                let messageBlocDiv = document.createElement('div');
                messageBlocDiv.classList.add('message-bloc');

                let messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.textContent = message.message;

                let dateTimeDiv = document.createElement('div');
                dateTimeDiv.classList.add('date-time');
                dateTimeDiv.textContent = message.date_time;

                messageBlocDiv.appendChild(messageDiv);
                messageBlocDiv.appendChild(dateTimeDiv);

                messageItemDiv.appendChild(messageBlocDiv);

                chatMessages.appendChild(messageItemDiv);
              });
            })
            .catch(error => {
              console.log('There has been a problem with your fetch operation: ', error);
            });

          done();
        })();
      }
    })
    .on("/job-description", (match) => {
      console.log(`Match value on job-description route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("job-description-ab22345fd6d9b7bda5962481f1af72af.html", document.getElementById('app'));

          // remove all markup from the footer
          document.getElementById('footer').innerHTML = '';

          handleFileUpload('upload/job-description');

          done();
        })();
      }
    })
    .on("/profile/:userId", (match) => {
      console.log(`Match value on profile route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("profile-448518c07b2836cf2706151c20b876d4.html", document.getElementById('app'));

          var overlay = document.body.lastElementChild;
          overlay.remove();

          let profileMenu = document.getElementById('profile-menu');
          profileMenu.classList.toggle('move-right');

          // remove all markup from the footer
          document.getElementById('footer').innerHTML = '';

          handleFileUpload('upload/resume');

          done();
        })();
      }
    })
    .on("/settings/:userId", (match) => {
      console.log(`Match value on settings route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        checkTokenExpiry();
        (async () => {
          await loadTemplate("settings-d41d8cd98f00b204e9800998ecf8427e.html", document.getElementById('app'));

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
          await loadTemplate("preferences-d41d8cd98f00b204e9800998ecf8427e.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .resolve();
});