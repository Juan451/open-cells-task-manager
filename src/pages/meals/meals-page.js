import { LitElement, html } from 'lit';
import { PageMixin } from '@open-cells/page-mixin';
import '../../components/dm/data-manager.js';
import '../../components/meal-detail/meal-detail.js';

export class MealsPage extends PageMixin(LitElement) {
  static properties = {
    meals: {
      type: Array,
    },

    searchText: {
      type: String,
    },

    loading: {
      type: Boolean,
    },

    error: {
      type: String,
    },

    selectedMeal: {
      type: Object,
    },
  };

  constructor() {
    super();

    this.meals = [];
    this.searchText = '';
    this.loading = true;
    this.error = '';
    this.selectedMeal = null;
  }

  createRenderRoot() {
    return this;
  }
  onPageLeave() {
    console.log('me he salido?', this.meals);

    this._clearSearch();
  }

  firstUpdated() {
    this._dm.searchMeals('');
  }
  
  _clearSearch() {
    this.meals = [];
    this.searchText = '';
    this.loading = false;
    this.error = '';
    this.selectedMeal = null;
  }

  get _dm() {
    return this.renderRoot.querySelector('#dataManager');
  }

  render() {
    return html`
      <data-manager
        id="dataManager"
        @search-meals-success=${this._onSearchMealsSuccess}
        @search-meals-error=${this._onSearchMealsError}
        @meal-detail-success=${this._onMealDetailSuccess}
        @meal-detail-error=${this._onMealDetailError}
      ></data-manager>

      <div class="page-header">
        <p class="pretitle">THE MEAL DB</p>

        <h1>Meals</h1>

        <p>Search meals and recipes from around the world.</p>
      </div>

      <div class="meal-search">
        <input
          class="meal-search__input"
          type="text"
          placeholder="Search a meal..."
          .value=${this.searchText}
          @input=${this._onSearchInput}
          @keydown=${this._onSearchKeyDown}
        />

        <button
          class="btn"
          @click=${this._searchMeals}
          ?disabled=${this.loading}
        >
          ${this.loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      ${this._renderContent()}
      ${this.selectedMeal ? this._renderMealDetail() : ''}
    `;
  }

  _renderContent() {
    if (this.loading) {
      return html` <div class="meals-status">Loading meals...</div> `;
    }

    if (this.error) {
      return html` <div class="meals-error">${this.error}</div> `;
    }

    if (!this.meals.length) {
      return html` <div class="meals-status">No meals found.</div> `;
    }

    return html`
      <div class="meals-grid">
        ${this.meals.map(
          (meal) => html`
            <article
              class="meal-card"
              role="button"
              tabindex="0"
              aria-label="View ${meal.strMeal}"
              @click=${() => this._openMeal(meal.idMeal)}
              @keydown=${(event) => this._onMealKeyDown(event, meal.idMeal)}
            >
              <img
                class="meal-card__image"
                src=${meal.strMealThumb}
                alt=${meal.strMeal}
              />

              <div class="meal-card__content">
                ${meal.strCategory
                  ? html`
                      <span class="badge blue"> ${meal.strCategory} </span>
                    `
                  : ''}

                <h2>${meal.strMeal}</h2>

                ${meal.strArea ? html` <p>${meal.strArea}</p> ` : ''}
              </div>
            </article>
          `,
        )}
      </div>
    `;
  }

  _renderMealDetail() {
    const meal = this.selectedMeal;

    return html`
      <meal-detail @close-meal-detail=${this._closeMealDetail}>
        <!-- LIGHT DOM:
             este elemento será insertado
             en <slot name="image"> -->
        <img slot="image" src=${meal.strMealThumb} alt=${meal.strMeal} />

        <!-- LIGHT DOM:
             irá a <slot name="title"> -->
        <h2 slot="title">${meal.strMeal}</h2>

        <!-- LIGHT DOM:
             irá a <slot name="meta"> -->
        <div slot="meta">
          ${meal.strCategory
            ? html` <span class="badge blue"> ${meal.strCategory} </span> `
            : ''}
          ${meal.strArea
            ? html` <span class="badge"> ${meal.strArea} </span> `
            : ''}
        </div>

        <!-- LIGHT DOM:
             irá a <slot name="ingredients"> -->
        <ul slot="ingredients">
          ${this._getIngredients(meal).map(
            (ingredient) => html`
              <li>
                <strong> ${ingredient.name} </strong>

                ${ingredient.measure}
              </li>
            `,
          )}
        </ul>

        <!-- LIGHT DOM:
             irá a <slot name="instructions"> -->
        <p slot="instructions">${meal.strInstructions}</p>
      </meal-detail>
    `;
  }

  _onSearchInput(event) {
    this.searchText = event.target.value;
  }

  _onSearchKeyDown(event) {
    if (event.key === 'Enter') {
      this._searchMeals();
    }
  }

  _searchMeals() {
    const search = this.searchText.trim();

    if (!search) {
      this.meals = [];
      this.error = 'Please enter a meal name.';
      return;
    }

    this.loading = true;
    this.error = '';

    this._dm.searchMeals(search);
  }

  _onSearchMealsSuccess(event) {
    this.meals = event.detail.meals;
    this.loading = false;
    this.error = '';
  }

  _onSearchMealsError(event) {
    console.error('Error loading meals:', event.detail.error);

    this.meals = [];
    this.loading = false;
    this.error = 'The meals could not be loaded.';
  }

  _openMeal(id) {
    this._dm.getMealById(id);
  }

  _onMealKeyDown(event, id) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();

      this._openMeal(id);
    }
  }

  _onMealDetailSuccess(event) {
    this.selectedMeal = event.detail.meal;
  }

  _onMealDetailError(event) {
    console.error('Error loading meal detail:', event.detail.error);

    this.selectedMeal = null;
  }

  _closeMealDetail() {
    this.selectedMeal = null;
  }

  _getIngredients(meal) {
    const ingredients = [];

    for (let index = 1; index <= 20; index += 1) {
      const name = meal[`strIngredient${index}`];
      const measure = meal[`strMeasure${index}`];

      if (name?.trim()) {
        ingredients.push({
          name: name.trim(),
          measure: measure?.trim() || '',
        });
      }
    }

    return ingredients;
  }
}

customElements.define('meals-page', MealsPage);
