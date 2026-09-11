import { LitElement, html } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';

import '../../components/dm/data-manager.js';

export class LoginPage extends PageMixin(LitElement) {
  static properties = {
    mode: { state: true },
    email: { state: true },
    password: { state: true },
    error: { state: true },
    loading: { state: true },
  };

  constructor() {
    super();
    this.mode = 'login';
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

  render() {
    return html`
      <data-manager
        @login-success=${this._onAuthSuccess}
        @login-error=${this._onAuthError}
        @register-success=${this._onAuthSuccess}
        @register-error=${this._onAuthError}
      ></data-manager>

      <div class="page-header">
        <p class="pretitle">OPEN CELLS TASK MANAGER</p>
        <h1>${this.mode === 'login' ? 'Sign in' : 'Create account'}</h1>
        <p>
          ${this.mode === 'login'
            ? 'Access your tasks.'
            : 'Sign up to start managing your tasks.'}
        </p>
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

        ${this.error ? html`<p class="auth-form__error">${this.error}</p>` : ''}

        <button class="btn" type="submit" ?disabled=${this.loading}>
          ${this.loading
            ? 'Please wait...'
            : this.mode === 'login'
              ? 'Sign in'
              : 'Create account'}
        </button>

        <button class="link-arrow" type="button" @click=${this._toggleMode}>
          ${this.mode === 'login'
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </form>
    `;
  }

  _toggleMode() {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.error = '';
  }

  _onSubmit(event) {
    event.preventDefault();

    this.loading = true;
    this.error = '';

    if (this.mode === 'login') {
      this._dm.login(this.email, this.password);
    } else {
      this._dm.register(this.email, this.password);
    }
  }

  _onAuthSuccess(event) {
    const { token, email } = event.detail.data;

    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('authEmail', email);

    this.loading = false;
    this.controller.navigate('tasks');
  }

  _onAuthError(event) {
    console.error('Auth error:', event.detail.error);

    this.loading = false;
    this.error =
      this.mode === 'login'
        ? 'Email o contraseña incorrectos.'
        : 'No se pudo crear la cuenta. ¿Ya existe ese email?';
  }
}

customElements.define('login-page', LoginPage);
