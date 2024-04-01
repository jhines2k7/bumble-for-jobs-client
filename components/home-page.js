export class HomePage extends HTMLElement {
  connectedCallback() {
    if (isTokenExpired()) {
      refreshAccessToken().then(data => {
        localStorage.setItem('access_token', data.access_token);

        const token = parseJwt(data.access_token);

        this.router.navigate(`/foryou/${token.user_id}/${token.state}?page=1`);
      }).catch(error => {
        console.error('Error refreshing token:', error);
      });
    } else {
      const token = localStorage.getItem('access_token');
      this.router.navigate(`/foryou/${token.user_id}/${token.state}?page=1`);
    }
  }
}

customElements.define('home-page', HomePage);