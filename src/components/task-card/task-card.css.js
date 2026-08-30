import { css } from 'lit';

export const styles = css`
  :host {
    display: block;
    font-family: 'Archivo', sans-serif;
  }

  .task {
    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 1rem;
    padding: 1.25rem;

    border: 1px solid var(--color-grey-mid);
    border-radius: 2px;

    background: var(--color-white);

    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .task:hover {
    border-color: var(--color-blue);

    box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
  }

  .task__title {
    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.5;

    color: var(--color-blue-dark);

    transition:
      color 0.15s ease,
      opacity 0.15s ease;
  }

  .task__title--completed {
    color: var(--color-grey);

    text-decoration: line-through;

    opacity: 0.7;
  }

  /*
   * Mismo diseño que .btn de main.css
   */
  .task__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: fit-content;

    padding: 0.75rem 1.5rem;

    border: 2px solid var(--color-core-blue);
    border-radius: 2px;

    background: var(--color-core-blue);
    color: var(--color-white);

    font-family: inherit;
    font-size: 1rem;
    font-weight: 600;
    line-height: normal;

    cursor: pointer;

    transition:
      background 0.15s ease,
      border-color 0.15s ease,
      color 0.15s ease;
  }

  .task__button:hover {
    background: var(--color-navy);
    border-color: var(--color-navy);
  }

  /*
   * Cuando la tarea está completada,
   * usamos el mismo diseño que .btn-outline
   */
  .task__button--completed {
    background: transparent;
    color: var(--color-core-blue);
  }

  .task__button--completed:hover {
    background: var(--color-core-light);
    border-color: var(--color-core-blue);
    color: var(--color-core-blue);
  }
`;