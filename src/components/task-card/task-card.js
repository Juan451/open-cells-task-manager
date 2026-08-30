import { LitElement, html } from 'lit';

import { styles } from './task-card.css.js';

export class TaskCard extends LitElement {
  static properties = {
    task: {
      type: Object,
    },
  };

  static styles = styles;

  constructor() {
    super();

    this.task = {};
  }

  render() {
    return html`
      <div class="task">
        <span
          class="
            task__title
            ${this.task.completed ? 'task__title--completed' : ''}
          "
        >
          ${this.task.title}
        </span>

        <button
          class="
    task__button
    ${this.task.completed ? 'task__button--completed' : ''}
  "
          @click=${this._toggleTask}
        >
          ${this.task.completed ? 'Undo' : 'Complete'}
        </button>
      </div>
    `;
  }

  _toggleTask() {
    this.dispatchEvent(
      new CustomEvent('toggle-task', {
        detail: {
          id: this.task.id,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('task-card', TaskCard);
