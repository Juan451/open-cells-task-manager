import { LitElement, html } from 'lit';
import logo from '../../../images/favicon.svg';
import { startApp } from '@open-cells/core';
import { ElementController } from '@open-cells/element-controller';

import { styles } from './app-index.css.js';
import { routes } from '../../router/routes.js';
/*
 * Arrancamos Open Cells
 */
startApp({
  routes,
  mainNode: 'app-content',
});
export class AppIndex extends LitElement {
  static styles = styles;

  constructor() {
    super();

    this.controller = new ElementController(this);
  }

  _navigate(page) {
    this.controller.navigate(page);
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
        </aside>

        <main>
          <slot></slot>
        </main>
      </div>
    `;
  }
}

customElements.define('app-index', AppIndex);
