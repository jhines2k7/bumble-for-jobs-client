const { init } = require("events");

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
    await loadTemplate("profile-menu-d5f0385b81dfb67f87448af9a8883dad.html", document.getElementById('profile-menu'));

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

    hammer.on('panend', function(e) {
      // snap back to initial position if the element is dragged less than 300px to the left
      console.log(`newPosition in panstop: ${newPosition}`);
      if(newPosition > -450) {
        profileMenu.style.left = '-300px';
      }

      if(newPosition <= -450) {
        overlay.remove();
        profileMenu.classList.toggle('move-right');
        // document.getElementById('profile-menu').innerHTML = '';
      }

      // initialPosition = -300;
    });

    hammer.on('panmove', function(e) {
      // Calculate the new position
      newPosition = initialPosition + e.deltaX;
      console.log(`newPosition in panmove: ${newPosition}`);

      // Restrict movement to 300px to the left
      if (newPosition <= initialPosition) {
        // Update the element's position
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
          await loadTemplate("footer-11c9a829e91bc79349c29e61c42c5fb8.html", document.getElementById('footer'));

          await loadTemplate("header-c7a43d71033e449e4cf76e454b7df0c2.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Home';
          // await loadGameList();
          done();
        })();
      }
    })
    .on("/you/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("foryou-493afa6410a8db0d605da4c939ad1c67.html", document.getElementById('app'));
          await loadTemplate("footer-11c9a829e91bc79349c29e61c42c5fb8.html", document.getElementById('footer'));

          await loadTemplate("header-c7a43d71033e449e4cf76e454b7df0c2.html", document.getElementById('header'));
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
          await loadTemplate("chats-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
          await loadTemplate("footer-11c9a829e91bc79349c29e61c42c5fb8.html", document.getElementById('footer'));

          await loadTemplate("header-c7a43d71033e449e4cf76e454b7df0c2.html", document.getElementById('header'));
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
          await loadTemplate("dailypicks-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
          await loadTemplate("footer-11c9a829e91bc79349c29e61c42c5fb8.html", document.getElementById('footer'));

          await loadTemplate("header-c7a43d71033e449e4cf76e454b7df0c2.html", document.getElementById('header'));
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
          await loadTemplate("chat-3722e1f3fdfa7dc68549ac8cc4589bdb.html", document.getElementById('app'));
          await loadTemplate("chat-footer-8cb9441ae82b8cbeb26c69a888275874.html", document.getElementById('footer'));

          done();
        })();
      }
    })
    .on("/profile/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("profile-20f879d1464507309632ddf196f590ae.html", document.getElementById('app'));
          
          var overlay = document.body.lastElementChild;
          overlay.remove();

          let profileMenu = document.getElementById('profile-menu');
          profileMenu.classList.toggle('move-right');          
          
          // remove all markup from the footer
          document.getElementById('footer').innerHTML = '';

          done();
        })();
      }
    })
    .on("/settings/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("settings-d41d8cd98f00b204e9800998ecf8427e.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .on("/preferences/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("preferences-d41d8cd98f00b204e9800998ecf8427e.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .resolve();
});