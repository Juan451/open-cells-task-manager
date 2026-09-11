import { LitElement, html } from 'lit';

import '../../components/task-card/task-card.js';
import '../../components/dm/data-manager.js';

export class TasksPage extends LitElement {
  static properties = {
    tasks: {
      state: true,
    },
    newTaskTitle: {
      state: true,
    },
  };

  constructor() {
    super();

    this.tasks = [];
    this.newTaskTitle = '';
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this._dataManager = this.querySelector('data-manager');
    this._dataManager.getTasks();
  }

  render() {
    return html`
      <data-manager
        @get-tasks-success=${this._onGetTasksSuccess}
        @get-tasks-error=${this._onGetTasksError}
        @toggle-task-success=${this._onToggleTaskSuccess}
        @toggle-task-error=${this._onToggleTaskError}
        @create-task-success=${this._onCreateTaskSuccess}
      ></data-manager>

      <div class="page-header">
        <p class="pretitle">OPEN CELLS TASK MANAGER</p>

        <h1>My tasks</h1>

        <p>Manage your tasks while learning LitElement and Open Cells.</p>
      </div>
      <form class="task-form" @submit=${this._onCreateTask}>
        <input
          type="text"
          placeholder="New task..."
          .value=${this.newTaskTitle}
          @input=${(e) => (this.newTaskTitle = e.target.value)}
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

  _onGetTasksSuccess(event) {
    this.tasks = event.detail.tasks;
  }

  _onGetTasksError(event) {
    console.error('Error al cargar las tareas:', event.detail.error);
  }

  _onToggleTask(event) {
    const { id } = event.detail;
    this._dataManager.toggleTask(id);
  }

  _onToggleTaskSuccess(event) {
    const updatedTask = event.detail.task;

    this.tasks = this.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task,
    );
  }

  _onToggleTaskError(event) {
    console.error('Error al actualizar la tarea:', event.detail.error);
  }
  _onCreateTask(event) {
    event.preventDefault();
    this._dataManager.createTask(this.newTaskTitle.trim());
  }

  _onCreateTaskSuccess(event) {
    this.tasks = [...this.tasks, event.detail.task];
    this.newTaskTitle = '';
  }
}

customElements.define('tasks-page', TasksPage);
