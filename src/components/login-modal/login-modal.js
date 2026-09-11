import { LitElement, html } from 'lit';

import '../dm/data-manager.js';

export class LoginModal extends LitElement {
  static properties = {
    email: { state: true },
    password: { state: true },
    error: { state: true },
    loading: { state: true },
  };

  constructor() {
    super();
    this.email = '';
    this.password = '';
    this.error = '';
    this.loading = false;
  }

  createRenderRoot() {
    return this;
  }

  get _dm() {
    return this.querySelector('data-manager');
  }

  get _dialog() {
    return this.querySelector('dialog');
  }

  firstUpdated() {
    this._dialog.showModal();
    this._dialog.addEventListener('close', this._onDialogClose);
    this._dialog.addEventListener('click', this._onBackdropClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._dialog?.removeEventListener('close', this._onDialogClose);
    this._dialog?.removeEventListener('click', this._onBackdropClick);
  }

  render() {
    return html`
      <data-manager
        @login-success=${this._onLoginSuccess}
        @login-error=${this._onLoginError}
      ></data-manager>

      <dialog class="login-modal">
        <button
          class="login-modal__close"
          type="button"
          @click=${this._requestClose}
          aria-label="Close"
        >
          ✕
        </button>

        <div class="page-header">
          <p class="pretitle">OPEN CELLS TASK MANAGER</p>
          <h1>Sign in</h1>
          <p>Access your tasks.</p>
        </div>

        <form class="auth-form" @submit=${this._onSubmit}>
          <label class="auth-form__field">
            <span>Email</span>
            <input
              type="email"
              required
              .value=${this.email}
              @input=${(e) => (this.email = e.target.value)}
            />
          </label>

          <label class="auth-form__field">
            <span>Password</span>
            <input
              type="password"
              required
              minlength="6"
              .value=${this.password}
              @input=${(e) => (this.password = e.target.value)}
            />
          </label>

          ${this.error
            ? html`<p class="auth-form__error">${this.error}</p>`
            : ''}

          <button class="btn" type="submit" ?disabled=${this.loading}>
            ${this.loading ? 'Please wait...' : 'Sign in'}
          </button>

          <button class="link-arrow" type="button" @click=${this._goToRegister}>
            Don't have an account? Sign up
          </button>
        </form>
      </dialog>
    `;
  }

  _onDialogClose = () => {
    this.dispatchEvent(
      new CustomEvent('login-modal-close', { bubbles: true, composed: true }),
    );
  };

  _onBackdropClick = (event) => {
    // Un clic sobre el propio <dialog> (no sobre su contenido interno)
    // significa que se hizo clic en el backdrop.
    if (event.target === this._dialog) {
      this._requestClose();
    }
  };

  _requestClose() {
    this._dialog.close();
  }

  _onSubmit(event) {
    event.preventDefault();

    this.loading = true;
    this.error = '';

    this._dm.login(this.email, this.password);
  }

  _onLoginSuccess(event) {
    const { token, email } = event.detail.data;

    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('authEmail', email);

    this.loading = false;

    this.dispatchEvent(
      new CustomEvent('login-modal-success', {
        detail: { email },
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
