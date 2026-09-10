import { LitElement, html } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';

import '../../components/dm/data-manager.js';
import '../../components/react-stats-chart/react-stats-chart.js';

export class StatsPage extends PageMixin(LitElement) {
  static properties = {
    tasks: {
      state: true,
    },
  };

  constructor() {
    super();
    this.tasks = [];
  }

  createRenderRoot() {
    return this;
  }

  onPageEnter() {
    this._dataManager = this.querySelector('data-manager');
    this._dataManager.getTasks();
  }

  get _stats() {
    const total = this.tasks.length;
    const completed = this.tasks.filter((task) => task.completed).length;
    const pending = total - completed;

    return { total, completed, pending };
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

      <react-stats-chart .data=${this._stats}></react-stats-chart>
    `;
  }

  _onGetTasksSuccess(event) {
    this.tasks = event.detail.tasks;
  }

  _onGetTasksError(event) {
    console.error('Error al cargar las tareas:', event.detail.error);
  }
}

customElements.define('stats-page', StatsPage);
