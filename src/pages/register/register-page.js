import { LitElement, html } from 'lit';

import { PageMixin } from '@open-cells/page-mixin';
import { ElementController } from '@open-cells/element-controller';
import '../../components/dm/data-manager.js';

export class RegisterPage extends PageMixin(LitElement) {
  static properties = {
    email: { state: true },
    password: { state: true },
    error: { state: true },
    loading: { state: true },
    registerSuccess: { state: true },
    controller: { state: true },
  };

  constructor() {
    super();
    this.controller = new ElementController(this);
    this.email = '';
    this.password = '';
    this.error = '';
    this.loading = false;
    this.registerSuccess = false;

    this._redirectTimeout = null;
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
        @register-success=${this._onRegisterSuccess}
        @register-error=${this._onRegisterError}
      ></data-manager>

      ${this.registerSuccess
        ? this._renderSuccess()
        : this._renderRegisterForm()}
    `;
  }

  _renderRegisterForm() {
    return html`
      <div class="page-header">
        <p class="pretitle">OPEN CELLS TASK MANAGER</p>

        <h1>Create account</h1>

        <p>Sign up to start managing your tasks.</p>
      </div>

      <form class="auth-form" @submit=${this._onSubmit}>
        <label class="auth-form__field">
          <span>Email</span>

          <input
            type="email"
            required
            .value=${this.email}
            @input=${(event) => {
              this.email = event.target.value;
            }}
          />
        </label>

        <label class="auth-form__field">
          <span>Password</span>

          <input
            type="password"
            required
            minlength="6"
            .value=${this.password}
            @input=${(event) => {
              this.password = event.target.value;
            }}
          />
        </label>

        ${this.error
          ? html` <p class="auth-form__error">${this.error}</p> `
          : ''}

        <button class="btn" type="submit" ?disabled=${this.loading}>
          ${this.loading ? 'Please wait...' : 'Create account'}
        </button>
      </form>
    `;
  }

  _renderSuccess() {
    return html`
      <div class="register-success">
        <div class="register-success__icon">✓</div>

        <h1>Account created successfully!</h1>

        <p>Your account has been created correctly.</p>

        <div class="register-success__spinner" aria-label="Loading"></div>

        <p class="register-success__redirect">Redirecting to home...</p>
      </div>
    `;
  }

  _onSubmit(event) {
    event.preventDefault();

    this.loading = true;
    this.error = '';

    this._dm.register(this.email.trim(), this.password);
  }

  _onRegisterSuccess(event) {
    const { token, email } = event.detail.data;

    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('authEmail', email || this.email);

    this.loading = false;
    this.error = '';
    this.registerSuccess = true;

    this._redirectTimeout = setTimeout(() => {
      this.controller.navigate('home');
    }, 2000);
  }

  _onRegisterError(event) {
    console.error('Register error:', event.detail?.error);

    this.loading = false;
    this.registerSuccess = false;

    this.error = 'No se pudo crear la cuenta. ¿Ya existe ese email?';
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._redirectTimeout) {
      clearTimeout(this._redirectTimeout);
      this._redirectTimeout = null;
    }
  }
}

customElements.define('register-page', RegisterPage);
