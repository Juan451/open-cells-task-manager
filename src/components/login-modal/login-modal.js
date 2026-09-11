import { LitElement, html } from 'lit';

import { styles } from './login-modal.css.js';

import '../dm/data-manager.js';

export class LoginModal extends LitElement {
  static styles = styles;

  static properties = {
    email: {
      state: true,
    },

    password: {
      state: true,
    },

    error: {
      state: true,
    },

    loading: {
      state: true,
    },
  };

  constructor() {
    super();

    this.email = '';
    this.password = '';
    this.error = '';
    this.loading = false;
  }

  get _dm() {
    return this.renderRoot.querySelector('data-manager');
  }

  get _dialog() {
    return this.renderRoot.querySelector('dialog');
  }

  firstUpdated() {
    const dialog = this._dialog;

    if (!dialog) {
      console.error('[LoginModal] Dialog not found');
      return;
    }

    dialog.showModal();
  }

  render() {
    return html`
      <data-manager
        @login-success=${this._onLoginSuccess}
        @login-error=${this._onLoginError}
      ></data-manager>

      <dialog
        class="login-modal"
        @close=${this._onDialogClose}
        @click=${this._onBackdropClick}
      >
        <div class="login-modal__content">
          <button
            class="login-modal__close"
            type="button"
            @click=${this._requestClose}
            aria-label="Close"
          >
            ✕
          </button>

          <div class="login-modal__brand">
            <span class="login-modal__brand-dot"></span>

            OPEN CELLS TASK MANAGER
          </div>

          <div class="login-modal__header">
            <h1>Sign in</h1>

            <p>Access your personal workspace and manage your tasks.</p>
          </div>

          <form class="login-modal__form" @submit=${this._onSubmit}>
            <label class="login-modal__field">
              <span>Email</span>

              <input
                type="email"
                autocomplete="email"
                placeholder="name@example.com"
                required
                .value=${this.email}
                @input=${this._onEmailInput}
              />
            </label>

            <label class="login-modal__field">
              <span>Password</span>

              <input
                type="password"
                autocomplete="current-password"
                placeholder="Enter your password"
                required
                minlength="6"
                .value=${this.password}
                @input=${this._onPasswordInput}
              />
            </label>

            ${this.error
              ? html` <div class="login-modal__error">${this.error}</div> `
              : ''}

            <button
              class="login-modal__submit"
              type="submit"
              ?disabled=${this.loading}
            >
              ${this.loading
                ? html`
                    <span class="login-modal__spinner"></span>
                    <span>Signing in...</span>
                  `
                : html`
                    <span>Sign in</span>
                    <span aria-hidden="true">→</span>
                  `}
            </button>
          </form>

          <div class="login-modal__footer">
            <span> New to Open Cells Task Manager? </span>

            <button
              type="button"
              class="login-modal__register"
              @click=${this._goToRegister}
            >
              <span>Create account</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </dialog>
    `;
  }

  _onEmailInput(event) {
    this.email = event.target.value;
  }

  _onPasswordInput(event) {
    this.password = event.target.value;
  }

  _onDialogClose() {
    this.dispatchEvent(
      new CustomEvent('login-modal-close', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  _onBackdropClick(event) {
    if (event.target === this._dialog) {
      this._requestClose();
    }
  }

  _requestClose() {
    this._dialog?.close();
  }

  _onSubmit(event) {
    event.preventDefault();

    this.loading = true;
    this.error = '';

    this._dm?.login(this.email.trim(), this.password);
  }

  _onLoginSuccess(event) {
    const { token, email } = event.detail.data;

    sessionStorage.setItem('authToken', token);

    sessionStorage.setItem('authEmail', email);

    this.loading = false;

    this.dispatchEvent(
      new CustomEvent('login-modal-success', {
        detail: {
          email,
        },

        bubbles: true,
        composed: true,
      }),
    );
  }

  _onLoginError() {
    this.loading = false;

    this.error = 'Email o contraseña incorrectos.';
  }

  _goToRegister() {
    this.dispatchEvent(
      new CustomEvent('login-modal-go-to-register', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('login-modal', LoginModal);
