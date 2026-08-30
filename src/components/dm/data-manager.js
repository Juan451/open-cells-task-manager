import { LitElement } from 'lit';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export class DataManager extends LitElement {
  dispatchCustomEvent(eventName, detail = {}) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }

  async _request(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async searchMeals(searchText) {
    try {
      const search = encodeURIComponent(searchText);

      const data = await this._request(`/search.php?s=${search}`);

      this.dispatchCustomEvent('search-meals-success', {
        meals: data.meals ?? [],
      });
    } catch (error) {
      this.dispatchCustomEvent('search-meals-error', {
        error,
      });
    }
  }

  async getMealById(id) {
    try {
      const data = await this._request(`/lookup.php?i=${id}`);

      this.dispatchCustomEvent('get-meal-success', {
        meal: data.meals?.[0] ?? null,
      });
    } catch (error) {
      this.dispatchCustomEvent('get-meal-error', {
        error,
      });
    }
  }

  async getRandomMeal() {
    try {
      const data = await this._request('/random.php');

      this.dispatchCustomEvent('random-meal-success', {
        meal: data.meals?.[0] ?? null,
      });
    } catch (error) {
      this.dispatchCustomEvent('random-meal-error', {
        error,
      });
    }
  }

  async getCategories() {
    try {
      const data = await this._request('/categories.php');

      this.dispatchCustomEvent('categories-success', {
        categories: data.categories ?? [],
      });
    } catch (error) {
      this.dispatchCustomEvent('categories-error', {
        error,
      });
    }
  }

  async getMealsByCategory(category) {
    try {
      const value = encodeURIComponent(category);

      const data = await this._request(`/filter.php?c=${value}`);

      this.dispatchCustomEvent('meals-by-category-success', {
        meals: data.meals ?? [],
      });
    } catch (error) {
      this.dispatchCustomEvent('meals-by-category-error', {
        error,
      });
    }
  }

  async getMealsByArea(area) {
    try {
      const value = encodeURIComponent(area);

      const data = await this._request(`/filter.php?a=${value}`);

      this.dispatchCustomEvent('meals-by-area-success', {
        meals: data.meals ?? [],
      });
    } catch (error) {
      this.dispatchCustomEvent('meals-by-area-error', {
        error,
      });
    }
  }

  async getMealsByIngredient(ingredient) {
    try {
      const value = encodeURIComponent(ingredient);

      const data = await this._request(`/filter.php?i=${value}`);

      this.dispatchCustomEvent('meals-by-ingredient-success', {
        meals: data.meals ?? [],
      });
    } catch (error) {
      this.dispatchCustomEvent('meals-by-ingredient-error', {
        error,
      });
    }
  }
  async getMealById(id) {
    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      this.dispatchEvent(
        new CustomEvent('meal-detail-success', {
          detail: {
            meal: data.meals?.[0] ?? null,
          },
          bubbles: true,
          composed: true,
        }),
      );
    } catch (error) {
      this.dispatchEvent(
        new CustomEvent('meal-detail-error', {
          detail: {
            error,
          },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }
}

customElements.define('data-manager', DataManager);
