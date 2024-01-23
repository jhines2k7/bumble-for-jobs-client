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
          await loadTemplate("home-fe919dfbe925337c176e602ebbf0d15c.html", document.getElementById('app'));
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
          await loadTemplate("foryou-0e0d86d8d7a562d1f55cda30bc4605bd.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .on("/messages/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("messages-e76010136e682a7bfe67a5ebf9d8fb1f.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .on("/profile/:userId", (match) => {
      console.log(`Match value on game route: ${JSON.stringify(match)}`);
    }, {
      before(done, match) {
        (async () => {
          await loadTemplate("profile-523c1673f282115d217384692005e943.html", document.getElementById('app'));

          done();
        })();
      }
    })
    .resolve();
});