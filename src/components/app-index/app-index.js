import { LitElement, html } from 'lit';
import logo from '../../../images/favicon.svg';
import { startApp } from '@open-cells/core';
import { ElementController } from '@open-cells/element-controller';

import { styles } from './app-index.css.js';
import { routes } from '../../router/routes.js';

import '../../components/login-modal/login-modal.js';

startApp({
  routes,
  mainNode: 'app-content',
});

export class AppIndex extends LitElement {
  static styles = styles;

  static properties = {
    showLoginModal: { state: true },
    showAccountMenu: { state: true },
    loggedInEmail: { state: true },
  };

  constructor() {
    super();

    this.controller = new ElementController(this);
    this.showLoginModal = false;
    this.showAccountMenu = false;
    this.loggedInEmail = sessionStorage.getItem('authEmail');
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('hashchange', this._onHashChange);
    document.addEventListener('click', this._onDocumentClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('hashchange', this._onHashChange);
    document.removeEventListener('click', this._onDocumentClick);
  }

  _navigate(page) {
    this.controller.navigate(page);
  }

  _onHashChange = () => {
    this._closeLoginModal();
    this.showAccountMenu = false;
    this.loggedInEmail = sessionStorage.getItem('authEmail');
  };

  _onDocumentClick = (event) => {
    if (!this.showAccountMenu) return;

    const accountArea = this.querySelector('.account-area');
    if (accountArea && !accountArea.contains(event.target)) {
      this.showAccountMenu = false;
    }
  };

  _closeLoginModal = () => {
    this.showLoginModal = false;
  };

  _onAccountIconClick() {
    if (this.loggedInEmail) {
      this.showAccountMenu = !this.showAccountMenu;
    } else {
      this.showLoginModal = true;
    }
  }

  _onLoginSuccess() {
    this._closeLoginModal();
    this.loggedInEmail = sessionStorage.getItem('authEmail');
    this._navigate('tasks');
  }

  _onGoToRegister() {
    this._closeLoginModal();
    this._navigate('register');
  }

  _logout() {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authEmail');
    this.loggedInEmail = null;
    this.showAccountMenu = false;
    this._navigate('home');
  }

  render() {
    return html`
      <header>
        <nav>
          <a class="brand-link" @click=${() => this._navigate('home')}>
            <img
              class="brand-logo"
              src="https://www.opencells.dev/images/logo.svg"
              alt="Open Cells"
            />
          </a>

          <ul class="nav-links">
            <li>
              <a
                href="https://www.opencells.dev/docs/index.html"
                target="_blank"
              >
                Docs
              </a>
            </li>

            <li>
              <a href="https://github.com/BBVA/open-cells" target="_blank">
                GitHub
              </a>
            </li>

            <li class="account-area">
              <a
                class="nav-icon-link"
                @click=${this._onAccountIconClick}
                aria-label="Account"
                title=${this.loggedInEmail ?? 'Account'}
              >
                <svg
                  class="nav-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path
                    d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Z"
                  />
                </svg>
              </a>

              ${this.showAccountMenu
                ? html`
                    <div class="account-menu">
                      <p class="account-menu__email">${this.loggedInEmail}</p>
                      <button
                        class="account-menu__logout"
                        @click=${this._logout}
                      >
                        Sign out
                      </button>
                    </div>
                  `
                : ''}
            </li>
          </ul>
        </nav>
      </header>

      <div class="app-layout">
        <aside class="sidebar">
          <button class="menu-item" @click=${() => this._navigate('home')}>
            <span class="menu-icon">🏠</span>
            <span class="menu-text">Home</span>
          </button>

          <button class="menu-item" @click=${() => this._navigate('tasks')}>
            <span class="menu-icon">✅</span>
            <span class="menu-text">Tasks</span>
          </button>

          <button class="menu-item" @click=${() => this._navigate('second')}>
            <span class="menu-icon">📄</span>
            <span class="menu-text">Second page</span>
          </button>
          <button class="menu-item" @click=${() => this._navigate('meals')}>
            <span class="menu-icon">🍽️</span>
            <span class="menu-text">Meals</span>
          </button>
          <button
            class="menu-item"
            @click=${() => this._navigate('notifications')}
          >
            <span class="menu-icon"> ✉️ </span>
            <span class="menu-text"> Notifications </span>
          </button>
          <button class="menu-item" @click=${() => this._navigate('stats')}>
            <span class="menu-icon">📊</span>
            <span class="menu-text">Stats</span>
          </button>
        </aside>

        <main>
          <slot></slot>
        </main>
      </div>

      ${this.showLoginModal
        ? html`
            <login-modal
              @login-modal-success=${this._onLoginSuccess}
              @login-modal-go-to-register=${this._onGoToRegister}
              @login-modal-close=${this._closeLoginModal}
            ></login-modal>
          `
        : ''}
    `;
  }
}

customElements.define('app-index', AppIndex);
