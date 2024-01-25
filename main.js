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

function toggleProfileSettings() {
  (async () => {
    await loadTemplate("profile-settings.html", document.getElementById('profile-overlay'));
    let profileOverlay = document.getElementById('profile-overlay');
    // set the height of the overlay to 100% of the viewport
    profileOverlay.style.height = '100vh';
    // position the overlay to the left of the screen
    profileOverlay.style.left = '-300px';
    profileOverlay.classList.toggle('move-right');
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
          // await loadGameList();
          done();
        })();
      }
    })
    .on("/foryou/:userId", (match) => {
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
    .on("/dailypicks/:userId", (match) => {
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
    .on("/edit-profile/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("profile.html", document.getElementById('app'));
          
          done();
        })();
      }
    })
    .on("/settings/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("settiings.html", document.getElementById('app'));
          
          done();
        })();
      }
    })
    .resolve();
});