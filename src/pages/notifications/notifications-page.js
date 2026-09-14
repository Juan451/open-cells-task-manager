import { LitElement, html } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';
import { connectStore } from '../../store/connect-mixin.js';
import { store } from '../../store/store.js';
import { restoreSession } from '../../store/authSlice.js';

import '../../components/react-notification-form/react-notification-form.js';

export class NotificationsPage extends connectStore(PageMixin(LitElement)) {
  static properties = {
    isAuthenticated: { state: true },
  };

  constructor() {
    super();
    this.isAuthenticated = false;
  }

  createRenderRoot() {
    return this;
  }

  stateChanged(state) {
    this.isAuthenticated = state.auth.isAuthenticated;
  }

  onPageEnter() {
    // Si TasksPage ya se visitó antes, el store ya tiene isAuthenticated
    // actualizado sin volver a leer sessionStorage. Si es la primera
    // página que se visita en la sesión, lo comprobamos igualmente:
    if (!store.getState().auth.token) {
      const token = sessionStorage.getItem('authToken');
      store.dispatch(restoreSession(token));
    }
  }

  render() {
    return html`
      <div class="page-header">
        <h1>Notifications</h1>
      </div>

      ${this.isAuthenticated
        ? html`<react-notification-form></react-notification-form>`
        : html`
            <div class="tasks-auth-message">
              <h3>Login required</h3>
              <p>You need to log in to send a notification.</p>
            </div>
          `}
    `;
  }
}

customElements.define('notifications-page', NotificationsPage);
