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

function navigateToLastResolved() {
  window.history.back();
  toggleProfileMenu();
}

function toggleProfileMenu() {
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
        document.getElementById('upload-status').innerText = 'Upload successful!';
        // Re-enable the button
        this.disabled = false;
        this.textContent = 'Upload File';
      })
      .catch(error => {
        console.error('Error:', error);
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
    
    document.getElementById('file-to-upload').innerHTML = '';
    document.getElementById('file-to-upload').appendChild(icon);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const socket = io(domain, { transports: ['websocket'] });

  socket.on('connect', () => {
    console.log('Connected to the server');
  });

  router
    .on("/", (match) => {
      console.log(`Match value on home route: ${JSON.stringify(match)}`);
    }, {
      before(done) {
        (async () => {
          await loadTemplate("home.html", document.getElementById('app'));
          await loadTemplate("footer.html", document.getElementById('footer'));

          await loadTemplate("header.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Home';
          done();
        })();
      }
    })
    .on("/you/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("foryou.html", document.getElementById('app'));
          await loadTemplate("footer.html", document.getElementById('footer'));

          await loadTemplate("header.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'For You';
          done();
        })();
      }
    })
    .on("/chats/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("chats.html", document.getElementById('app'));
          await loadTemplate("footer.html", document.getElementById('footer'));

          await loadTemplate("header.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Chats';
          done();
        })();
      }
    })
    .on("/daily/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("dailypicks.html", document.getElementById('app'));
          await loadTemplate("footer.html", document.getElementById('footer'));

          await loadTemplate("header.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Daily Picks';
          done();
        })();
      }
    })
    .on("/chat/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("chat.html", document.getElementById('app'));
          await loadTemplate("chat-footer.html", document.getElementById('footer'));

          done();
        })();
      }
    })
    .on("/job-description", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("job-description.html", document.getElementById('app'));

          // remove all markup from the footer
          document.getElementById('footer').innerHTML = '';

          handleFileUpload('upload/job-description');

          done();
        })();
      }
    })
    .on("/profile/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("profile.html", document.getElementById('app'));

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
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("settings.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .on("/preferences/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("preferences.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .resolve();
});