import { LitElement, html } from 'lit';

import { PageMixin } from '@open-cells/page-mixin';

import '../../components/dm/data-manager.js';

import '../../components/react-stats-chart/react-stats-chart.js';

export class StatsPage extends PageMixin(LitElement) {
  static properties = {
    tasks: {
      state: true,
    },

    loading: {
      state: true,
    },

    error: {
      state: true,
    },
  };

  constructor() {
    super();

    this.tasks = [];
    this.loading = false;
    this.error = '';
  }

  createRenderRoot() {
    return this;
  }

  /**
   * Se ejecuta cada vez que entramos en /stats.
   */
  async onPageEnter() {
    // Importantísimo:
    // eliminamos posibles datos del usuario anterior.
    this.tasks = [];

    this.loading = true;
    this.error = '';

    // Esperamos a que <data-manager> esté renderizado.
    await this.updateComplete;

    this._dataManager = this.querySelector('data-manager');

    const token = sessionStorage.getItem('authToken');

    if (!token) {
      console.warn('[StatsPage] No auth token');

      this.loading = false;
      this.tasks = [];
      this.error = 'You need to log in to view your statistics.';

      return;
    }

    this._dataManager?.getTasks();
  }

  /**
   * Limpiamos los datos al abandonar la página.
   */
  onPageLeave() {
    this.tasks = [];
    this.loading = false;
    this.error = '';
  }

  get _stats() {
    const total = this.tasks.length;

    const completed = this.tasks.filter((task) => task.completed).length;

    const pending = total - completed;

    return {
      total,
      completed,
      pending,
    };
  }

  render() {
    return html`
      <data-manager
        @get-tasks-success=${this._onGetTasksSuccess}
        @get-tasks-error=${this._onGetTasksError}
      ></data-manager>

      <div class="page-header">
        <p class="pretitle">OPEN CELLS TASK MANAGER</p>

        <h1>Stats</h1>

        <p>An overview of your task progress.</p>
      </div>

      ${this._renderContent()}
    `;
  }

  _renderContent() {
    if (this.loading) {
      return html`
        <div class="stats-loading">
          <div class="stats-spinner"></div>

          <p>Loading your statistics...</p>
        </div>
      `;
    }

    if (this.error) {
      return html` <div class="stats-error">${this.error}</div> `;
    }

    return html` <react-stats-chart .data=${this._stats}></react-stats-chart> `;
  }

  _onGetTasksSuccess(event) {
    this.tasks = event.detail.tasks ?? [];

    this.loading = false;
    this.error = '';
  }

  _onGetTasksError(event) {
    console.error('[StatsPage] Error loading tasks:', event.detail.error);

    // Importantísimo:
    // jamás dejamos estadísticas anteriores.
    this.tasks = [];

    this.loading = false;

    this.error = 'Your statistics could not be loaded.';
  }
}

customElements.define('stats-page', StatsPage);
