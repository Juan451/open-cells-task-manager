import React from 'react';

import { createRoot } from 'react-dom/client';

import { NotificationForm } from './notification-form.jsx';

export class ReactNotificationForm extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({
        mode: 'open',
      });
    }

    this.container = document.createElement('div');

    this.shadowRoot.appendChild(this.container);

    this.root = createRoot(this.container);

    this.root.render(React.createElement(NotificationForm));
  }

  disconnectedCallback() {
    this.root?.unmount();
  }
}

customElements.define('react-notification-form', ReactNotificationForm);
