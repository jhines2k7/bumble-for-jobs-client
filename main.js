const router = new Navigo('/', { hash: true });
let profileMenu = document.getElementById('profile-menu');
let hammer = new Hammer(profileMenu);

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

document.addEventListener('DOMContentLoaded', () => {
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

          // file upload
          let dropArea = document.querySelector('.upload-area-description'); // document.getElementById('drop-area');          
          let fileInput = document.getElementById('file-input');
          let uploadBtn = document.querySelector('.modal-footer .btn-primary'); // document.getElementById('upload-btn');
          let cancelBtn = document.querySelector('.modal-footer .btn-secondary'); // document.getElementById('cancel-btn');
        
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
          fileInput.addEventListener('change', function() {
            handleFiles(this.files);
          }, false);

          let fileUploadText = document.querySelector('.upload-area-description strong')
          
          fileUploadText.addEventListener('click', function() {
            // Trigger the file input when the div is clicked
            fileInput.click();
          });

          // Handle the actual upload process
          uploadBtn.addEventListener('click', function() {
            if (fileInput.files.length > 0) {
              // TODO: Implement the upload logic here
              alert('File is being uploaded...');
            } else {
              alert('Please select a file to upload.');
            }
          });
        
          // Cancel button logic
          cancelBtn.addEventListener('click', function() {
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
            fileInput.files = files;
            // You could also preview the file or do preliminary validation here
          }

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