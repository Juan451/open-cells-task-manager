import { css } from 'lit';

export const styles = css`
  :host {
    display: block;

    position: fixed;
    inset: 0;

    z-index: 1000;

    font-family: 'Archivo', sans-serif;
  }

  .overlay {
    position: absolute;
    inset: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 2rem;

    background: rgb(7 33 70 / 55%);
  }

  .detail {
    position: relative;

    display: grid;
    grid-template-columns: minmax(280px, 40%) 1fr;

    width: min(1000px, 100%);
    max-height: 90vh;

    overflow: auto;

    border-radius: 4px;

    background: var(--color-white);

    box-shadow: 0 12px 40px rgb(0 0 0 / 25%);
  }

  .detail__close {
    position: absolute;
    top: 1rem;
    right: 1rem;

    z-index: 2;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 2.5rem;
    height: 2.5rem;

    padding: 0;

    border: 0;
    border-radius: 50%;

    background: var(--color-white);
    color: var(--color-core-blue);

    font-family: inherit;
    font-size: 1.75rem;

    cursor: pointer;
  }

  .detail__image {
    min-height: 100%;
    background: var(--color-grey-light);
  }

  ::slotted([slot='image']) {
    display: block;

    width: 100%;
    height: 100%;
    min-height: 400px;

    object-fit: cover;
  }

  .detail__content {
    padding: 3rem 2rem 2rem;
  }

  .detail__header {
    margin-bottom: 2rem;
  }

  ::slotted([slot='title']) {
    margin: 0 0 1rem;

    color: var(--color-core-blue);

    font-size: clamp(2rem, 4vw, 3rem);
    line-height: 1.1;
  }

  .detail__meta {
    display: flex;
    gap: 0.5rem;
  }

  .detail__section {
    margin-top: 2rem;
  }

  .detail__section h3 {
    margin: 0 0 1rem;

    color: var(--color-blue-dark);

    font-size: 1.125rem;
  }

  ::slotted([slot='instructions']) {
    color: var(--color-grey);

    font-size: 1rem;
    line-height: 1.6;
  }

  @media screen and (max-width: 48rem) {
    .overlay {
      padding: 1rem;
    }

    .detail {
      grid-template-columns: 1fr;
    }

    ::slotted([slot='image']) {
      height: 260px;
      min-height: auto;
    }
  }
`;