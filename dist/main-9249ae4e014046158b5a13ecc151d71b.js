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

document.addEventListener('DOMContentLoaded', () => {
  router
    .on("/", (match) => {
      console.log(`Match value on home route: ${JSON.stringify(match)}`);
    }, {
      before(done) {
        (async () => {
          await loadTemplate("home-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
          await loadTemplate("footer-c1683bfcb8f76eef82e185637d339f82.html", document.getElementById('footer'));
          
          await loadTemplate("header-bd13752495b2c47b0fd2e74782738d9a.html", document.getElementById('header'));
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
          await loadTemplate("foryou-493afa6410a8db0d605da4c939ad1c67.html", document.getElementById('app'));
          await loadTemplate("footer-c1683bfcb8f76eef82e185637d339f82.html", document.getElementById('footer'));
          
          await loadTemplate("header-bd13752495b2c47b0fd2e74782738d9a.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'For You';
          done();
        })();
      }
    })
    .on("/messages/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("messages-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
          await loadTemplate("footer-c1683bfcb8f76eef82e185637d339f82.html", document.getElementById('footer'));
          
          await loadTemplate("header-bd13752495b2c47b0fd2e74782738d9a.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Chats';
          done();
        })();
      }
    })
    .on("/profile/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("profile-7aaaad2c6390698810e0a82353682c12.html", document.getElementById('app'));
          await loadTemplate("footer-c1683bfcb8f76eef82e185637d339f82.html", document.getElementById('footer'));
          
          await loadTemplate("header-bd13752495b2c47b0fd2e74782738d9a.html", document.getElementById('header'));
          document.querySelector('#header h1').textContent = 'Profile';
          done();
        })();
      }
    })
    .on("/chat/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("chat-0868d88eeec3e14ad85ebd7526c6f510.html", document.getElementById('app'));
          await loadTemplate("chat-footer-400a5e6e28faba1c2b23c6d2ca03e52e.html", document.getElementById('footer'));
          
          done();
        })();
      }
    })
    .resolve();
});