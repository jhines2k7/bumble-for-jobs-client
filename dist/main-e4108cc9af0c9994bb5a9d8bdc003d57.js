const router = new Navigo('/', { hash: true });

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
  toggleProfileSettings();
}

function toggleProfileSettings() {
  (async () => {
    await loadTemplate("profile-menu-fda0ae557271b50cdc1e80233440a63b.html", document.getElementById('profile-menu'));
    let profileMenu = document.getElementById('profile-menu');

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
      // remove the profile overlay
      profileMenu.classList.toggle('move-right');
    });
    // append the overlay to the body
    document.body.appendChild(overlay);

    // set the height of the overlay to 100% of the viewport
    profileMenu.style.height = '100vh';
    // position the overlay to the left of the screen
    profileMenu.style.left = '-300px';
    profileMenu.classList.toggle('move-right');

    // Create a new instance of Hammer on the element
    var hammer = new Hammer(profileMenu);

    // Specify the options if necessary (e.g., to define velocity and threshold for swipes)
    hammer.get('swipe').set({
      direction: Hammer.DIRECTION_LEFT, // Enable detection of swipes in all directions
      threshold: 1, // Minimum distance in pixels the swipe must travel to be recognized
      velocity: 0.1 // Minimum velocity the swipe must travel to be recognized
    });

    // Add event listeners for the swipe events you want to detect
    hammer.on("swipeleft", function (ev) {
      // Your logic for each swipe direction
      switch (ev.type) {
        case 'swipeleft':
          console.log('Swiped left');
          profileOverlay.classList.toggle('move-right');
          break;
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
          await loadTemplate("footer-30e4d4fa61954c634701cc61cb7b3d38.html", document.getElementById('footer'));

          await loadTemplate("header-b0a04f0dad395bda51e9f1209028fe41.html", document.getElementById('header'));
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
          await loadTemplate("footer-30e4d4fa61954c634701cc61cb7b3d38.html", document.getElementById('footer'));

          await loadTemplate("header-b0a04f0dad395bda51e9f1209028fe41.html", document.getElementById('header'));
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
          await loadTemplate("footer-30e4d4fa61954c634701cc61cb7b3d38.html", document.getElementById('footer'));

          await loadTemplate("header-b0a04f0dad395bda51e9f1209028fe41.html", document.getElementById('header'));
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
          await loadTemplate("footer-30e4d4fa61954c634701cc61cb7b3d38.html", document.getElementById('footer'));

          await loadTemplate("header-b0a04f0dad395bda51e9f1209028fe41.html", document.getElementById('header'));
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
          await loadTemplate("chat-e0572855ca0ffaccc95791189fcafcaa.html", document.getElementById('app'));
          await loadTemplate("chat-footer-400a5e6e28faba1c2b23c6d2ca03e52e.html", document.getElementById('footer'));

          done();
        })();
      }
    })
    .on("/profile/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("profile-0a487fce6fc1b85a65fcd8cf67378989.html", document.getElementById('app'));
          
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