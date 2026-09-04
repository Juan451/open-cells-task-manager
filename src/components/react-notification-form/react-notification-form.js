import React from 'react';
import { createRoot } from 'react-dom/client';

import { NotificationForm } from './notification-form.jsx';

export class ReactNotificationForm extends HTMLElement {
  connectedCallback() {
    if (this.root) {
      return;
    }

    this.root = createRoot(this);

    this.root.render(React.createElement(NotificationForm));
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
  }
}

customElements.define('react-notification-form', ReactNotificationForm);
