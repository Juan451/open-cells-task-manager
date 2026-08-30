import { LitElement, html } from 'lit';

import { styles } from './meal-detail.css.js';

export class MealDetail extends LitElement {
  static styles = styles;

  render() {
    return html`
      <div class="overlay" @click=${this._onOverlayClick}>
        <article class="detail">
          <button
            class="detail__close"
            type="button"
            aria-label="Close meal detail"
            @click=${this._close}
          >
            ×
          </button>

          <div class="detail__image">
            <slot name="image"></slot>
          </div>

          <div class="detail__content">
            <header class="detail__header">
              <slot name="title"></slot>

              <div class="detail__meta">
                <slot name="meta"></slot>
              </div>
            </header>

            <section class="detail__section">
              <h3>Ingredients</h3>

              <slot name="ingredients"></slot>
            </section>

            <section class="detail__section">
              <h3>Instructions</h3>

              <slot name="instructions"></slot>
            </section>
          </div>
        </article>
      </div>
    `;
  }

  _onOverlayClick(event) {
    if (event.target.classList.contains('overlay')) {
      this._close();
    }
  }

  _close() {
    this.dispatchEvent(
      new CustomEvent('close-meal-detail', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define('meal-detail', MealDetail);