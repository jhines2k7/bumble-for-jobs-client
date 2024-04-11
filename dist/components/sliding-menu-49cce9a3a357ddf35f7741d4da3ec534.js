const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    left: -300px;
    top: 0;
    transition: transform 0.5s ease;
    position: fixed;
    z-index: 200;
  }  
  
  .avatar {
    width: 40px;
    min-width: 40px;
    height: 40px;
    margin: 0 8px 0 0;
    border-radius: 50%;
    background-color: lightskyblue;
    border: #3a4150 2px solid;
  }

  .avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    border: #3a4150 5px solid;
  }

  #preferences-profile {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  #preferences-profile h1 {
    text-align: center;
    margin: 20px 0 0 0;
  }

  #preferences-profile .customize {
    display: flex;
    justify-content: space-between;
    margin: 20px auto;
    width: 75%;
  }
  
  .menu{
    width: 300px;
    background-color: lightcyan;
    height: 100vh;
    padding: 20px 0 0 0;
  }
  
  .settings {
    display: flex;
    justify-content: flex-end;
    width: 90%;
    margin: 0 0 20px 0;
  }

  .round-button {
    width: 50px;  /* Set the width */
    height: 50px; /* Height should be the same as width for a perfect circle */
    border-radius: 50%; /* This makes the square a circle */
    border: none;  /* Optional: removes the default border */
    color: white; /* Text color */
    text-align: center; /* Center the text */
    line-height: 50px; /* Aligns the text vertically */
    cursor: pointer; /* Changes the cursor to a pointer on hover */
  }

  .round-button.user-settings {
    width: 25px;
    height: 25px;
  }
`);

export class SlidingMenu extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
    <div class="menu">
        <div class="settings">
            <button id="settings-btn" class="round-button user-settings"></button>
        </div>
        <div id="preferences-profile">
            <div class="avatar"></div>
            <h1>ashley_riot</h1>
            <div class="customize">
                <button id="preferences-btn" class="round-button">pref</button>
                <button id="profile-btn" class="round-button">prof</button>
            </div>
        </div>
    </div>
    `;

    this.shadowRoot.getElementById('preferences-btn').addEventListener('click', () => {
      router.navigate(`/preferences/${userId}/${state}`);
    });

    this.shadowRoot.getElementById('settings-btn').addEventListener('click', () => {
      var overlay = document.body.lastElementChild;
      overlay.remove();

      this.slidingMenu = this.shadowRoot.querySelector(this);
      this.slidingMenu.classList.toggle('move-right');

      logout();
    });

    this.shadowRoot.getElementById('profile-btn').addEventListener('click', () => {
      router.navigate(`/profile/${userId}/${state}`);
    });
  }
}

customElements.define('sliding-menu', SlidingMenu);