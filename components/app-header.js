const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }

  h1 {
    font-size: x-large;
    font-weight: 600;
    text-align: center;
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

  .move-right {
    transform: translateX(300px);
  }
`);

export class AppHeader extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];

    this.shadowRoot.innerHTML = `
      <sliding-menu></sliding-menu>
      <div class="avatar"></div>
      <h1></h1>
    `;

    this.hammer = new Hammer(this.shadowRoot.querySelector('sliding-menu'));

    this.slidingMenu = this.shadowRoot.querySelector('sliding-menu');
  }

  connectedCallback() {
    this.toggleBtn = this.shadowRoot.querySelector('.avatar');
    this.toggleBtn.addEventListener('click', this.toggleSlidingMenu.bind(this));
  }

  toggleSlidingMenu(userId, state) {
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
      this.slidingMenu.classList.remove('move-right');
    });
    // append the overlay to the body
    document.body.appendChild(overlay);

    this.slidingMenu.classList.add('move-right');
    
    let initialPosition = -300;
    let newPosition = 0;
    
    this.hammer.on('panend', (e) => {
      console.log(`newPosition: ${newPosition} initialPosition: ${initialPosition} deltaX: ${e.deltaX} deltaY: ${e.deltaY} velocityX: ${e.velocityX} velocityY: ${e.velocityY}`);
      // snap back to initial position if the element is dragged less than 300px to the left
      if (newPosition > -450) {
        this.slidingMenu.style.left = '-300px';
      }
      
      if (newPosition <= -450) {
        overlay.remove();
        this.slidingMenu.classList.remove('move-right');

        this.slidingMenu.addEventListener('transitionend', () => {
          this.slidingMenu.style.left = '-300px';
        });
      }
    });

    this.hammer.on('panmove', (e) => {
      newPosition = initialPosition + e.deltaX;

      if (newPosition <= initialPosition) {
        this.slidingMenu.style.left = newPosition + 'px';
      }
    });
  }
}

customElements.define('app-header', AppHeader);