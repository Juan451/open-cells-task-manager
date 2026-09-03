import { LitElement, html } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';

import '../../components/react-notification-form/react-notification-form.js';

export class NotificationsPage extends PageMixin(LitElement) {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="page-header">
        <p class="pretitle">REACT + OPEN CELLS</p>

        <h1>Notifications</h1>

        <p>
          Example of a React component integrated inside an Open Cells
          application.
        </p>
      </div>

      <react-notification-form> </react-notification-form>
    `;
  }
}

customElements.define('notifications-page', NotificationsPage);
