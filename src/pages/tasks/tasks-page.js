import { LitElement, html } from 'lit';

import '../../components/task-card/task-card.js';

export class TasksPage extends LitElement {
  static properties = {
    tasks: {
      state: true,
    },
  };

  constructor() {
    super();

    this.tasks = [
      {
        id: 1,
        title: 'Learn LitElement',
        completed: false,
      },
      {
        id: 2,
        title: 'Learn Open Cells',
        completed: false,
      },
      {
        id: 3,
        title: 'Prepare technical interview',
        completed: true,
      },
    ];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="page-header">
        <p class="pretitle">
          OPEN CELLS TASK MANAGER
        </p>

        <h1>
          My tasks
        </h1>

        <p>
          Manage your tasks while learning LitElement and Open Cells.
        </p>
      </div>

      <div
        class="tasks-list"
        @toggle-task=${this._onToggleTask}
      >
        ${this.tasks.length
          ? this.tasks.map(
              task => html`
                <task-card
                  .task=${task}
                ></task-card>
              `,
            )
          : html`
              <div class="empty-message">
                You don't have any tasks.
              </div>
            `}
      </div>
    `;
  }

  _onToggleTask(event) {
    const { id } = event.detail;
    console.log('a cual le he dado?', id)
    this._toggleTask(id);
  }

  _toggleTask(id) {
    this.tasks = this.tasks.map(task =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
          }
        : task,
    );
  }
}

customElements.define('tasks-page', TasksPage);