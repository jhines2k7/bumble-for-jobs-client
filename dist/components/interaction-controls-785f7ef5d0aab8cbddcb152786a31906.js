const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    padding: 90px 0 110px 0;
    width: 100%;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: space-around;
    left: 0;
    bottom: 70px;
    width: 100%;
    background-color: #f0f0f0;
    padding: 10px 20px;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
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

  .dislike {
    background-color: dimgray;
    width: 40px;
    height: 40px;
  }

  .chat {
    background-color: #87ceeb;
    margin-right: 10px;
  }

  .like {
    background-color: #f08080;
  }
`);

export class InteractionControls extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.adoptedStyleSheets = [styles];
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
    <button class="round-button dislike"></button>
    <div class="user-interaction-options">
      <button class="round-button chat"></button>
      <button class="round-button like"></button>
    </div>
    `;
  }
}

customElements.define('interaction-controls', InteractionControls);