import { LitElement, html } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';

import '../../components/dm/data-manager.js';

export class RegisterPage extends PageMixin(LitElement) {
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

  render() {
    return html`
      <data-manager
        @register-success=${this._onRegisterSuccess}
        @register-error=${this._onRegisterError}
      ></data-manager>

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
          ${this.loading ? 'Please wait...' : 'Create account'}
        </button>
      </form>
    `;
  }

  _onSubmit(event) {
    event.preventDefault();

    this.loading = true;
    this.error = '';

    this._dm.register(this.email, this.password);
  }

  _onRegisterSuccess(event) {
    const { token, email } = event.detail.data;

    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('authEmail', email);

    this.loading = false;
    this.pageController.navigate('tasks');
  }

  _onRegisterError() {
    this.loading = false;
    this.error = 'No se pudo crear la cuenta. ¿Ya existe ese email?';
  }
}

customElements.define('register-page', RegisterPage);
