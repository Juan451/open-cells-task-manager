import { LitElement, html } from 'lit';

import { PageMixin } from '@open-cells/page-mixin';

import '../../components/task-card/task-card.js';
import '../../components/dm/data-manager.js';

export class TasksPage extends PageMixin(LitElement) {
  static properties = {
    tasks: {
      state: true,
    },

    newTaskTitle: {
      state: true,
    },

    loading: {
      state: true,
    },

    error: {
      state: true,
    },

    isAuthenticated: {
      state: true,
    },
  };

  constructor() {
    super();

    this.tasks = [];
    this.newTaskTitle = '';

    this.loading = false;
    this.error = '';
    this.isAuthenticated = false;
  }

  createRenderRoot() {
    return this;
  }

  async onPageEnter() {
    this.tasks = [];
    this.newTaskTitle = '';
    this.error = '';

    const token = sessionStorage.getItem('authToken');

    this.isAuthenticated = Boolean(token);

    if (!token) {
      console.warn('[TasksPage] No auth token');

      this.loading = false;

      return;
    }

    this.loading = true;

    await this.updateComplete;

    this._dataManager = this.querySelector('data-manager');

    this._dataManager?.getTasks();
  }

  onPageLeave() {
    this.tasks = [];
    this.newTaskTitle = '';
    this.loading = false;
    this.error = '';
  }

  render() {
    return html`
      <data-manager
        @get-tasks-success=${this._onGetTasksSuccess}
        @get-tasks-error=${this._onGetTasksError}
        @toggle-task-success=${this._onToggleTaskSuccess}
        @toggle-task-error=${this._onToggleTaskError}
        @create-task-success=${this._onCreateTaskSuccess}
        @create-task-error=${this._onCreateTaskError}
      ></data-manager>

      <div class="page-header">
        <p class="pretitle">OPEN CELLS TASK MANAGER</p>

        <h1>My tasks</h1>

        <p>Manage your tasks while learning LitElement and Open Cells.</p>
      </div>

      ${this._renderContent()}
    `;
  }

  _renderContent() {
    // Usuario NO logueado
    if (!this.isAuthenticated) {
      return html`
        <div class="tasks-auth-message">
          <h3>Login required</h3>

          <p>You need to log in to manage your tasks.</p>
        </div>
      `;
    }

    // Cargando tasks
    if (this.loading) {
      return html`
        <div class="tasks-loading">
          <div class="tasks-spinner"></div>

          <p>Loading your tasks...</p>
        </div>
      `;
    }

    // Error GET
    if (this.error) {
      return html` <div class="tasks-error">${this.error}</div> `;
    }

    // Usuario correctamente autenticado
    return html`
      <form class="task-form" @submit=${this._onCreateTask}>
        <input
          type="text"
          placeholder="New task..."
          .value=${this.newTaskTitle}
          @input=${this._onTaskTitleInput}
          required
        />

        <button class="btn" type="submit">Add task</button>
      </form>

      <div class="tasks-list" @toggle-task=${this._onToggleTask}>
        ${this.tasks.length
          ? this.tasks.map(
              (task) => html` <task-card .task=${task}></task-card> `,
            )
          : html` <div class="empty-message">You don't have any tasks.</div> `}
      </div>
    `;
  }

  _onTaskTitleInput(event) {
    this.newTaskTitle = event.target.value;
  }

  _onGetTasksSuccess(event) {
    this.tasks = event.detail.tasks ?? [];

    this.loading = false;
    this.error = '';
  }

  _onGetTasksError(event) {
    console.error('[TasksPage] Error loading tasks:', event.detail.error);

    this.tasks = [];
    this.loading = false;

    this.error = 'Your tasks could not be loaded.';
  }

  _onToggleTask(event) {
    const { id } = event.detail;

    this._dataManager?.toggleTask(id);
  }

  _onToggleTaskSuccess(event) {
    const updatedTask = event.detail.task;

    this.tasks = this.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
  }

  _onToggleTaskError(event) {
    console.error('[TasksPage] Error updating task:', event.detail.error);
  }

  _onCreateTask(event) {
    event.preventDefault();

    const title = this.newTaskTitle.trim();

    if (!title) {
      return;
    }

    this._dataManager?.createTask(title);
  }

  _onCreateTaskSuccess(event) {
    this.tasks = [...this.tasks, event.detail.task];

    this.newTaskTitle = '';
  }

  _onCreateTaskError(event) {
    console.error('[TasksPage] Error creating task:', event.detail.error);
  }
}

customElements.define('tasks-page', TasksPage);
