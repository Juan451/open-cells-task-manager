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
        <p class="pretitle">SUGGESTIONS & FEEDBACK</p>

        <h1>Contact us</h1>

        <p>
          Send us your questions, suggestions or feedback about the application.
        </p>
      </div>

      <react-notification-form> </react-notification-form>
    `;
  }
}

customElements.define('notifications-page', NotificationsPage);
