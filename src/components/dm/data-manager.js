import { LitElement } from 'lit';

const MEALS_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const TASKS_BASE_URL = 'https://d1wohnfz6jexov.cloudfront.net/api/tasks';

const AUTH_BASE_URL = 'https://d1wohnfz6jexov.cloudfront.net/api/auth';

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

  async _request(baseUrl, endpoint, options = {}) {
    const isOwnApi = baseUrl === TASKS_BASE_URL;
    const token = isOwnApi ? sessionStorage.getItem('authToken') : null;

    const headers = {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const response = await fetch(`${baseUrl}${endpoint}`, {
      cache: 'no-store',
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  // --- Meals (TheMealDB) ---

  async searchMeals(searchText) {
    try {
      const search = encodeURIComponent(searchText);

      const data = await this._request(
        MEALS_BASE_URL,
        `/search.php?s=${search}`,
      );

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
      const data = await this._request(MEALS_BASE_URL, `/lookup.php?i=${id}`);

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
      const data = await this._request(MEALS_BASE_URL, '/random.php');

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
      const data = await this._request(MEALS_BASE_URL, '/categories.php');

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

      const data = await this._request(
        MEALS_BASE_URL,
        `/filter.php?c=${value}`,
      );

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

      const data = await this._request(
        MEALS_BASE_URL,
        `/filter.php?a=${value}`,
      );

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

      const data = await this._request(
        MEALS_BASE_URL,
        `/filter.php?i=${value}`,
      );

      this.dispatchCustomEvent('meals-by-ingredient-success', {
        meals: data.meals ?? [],
      });
    } catch (error) {
      this.dispatchCustomEvent('meals-by-ingredient-error', {
        error,
      });
    }
  }

  // --- Tasks (Spring backend AWS + CloudFront) ---

  async getTasks() {
    try {
      const tasks = await this._request(TASKS_BASE_URL, '');

      this.dispatchCustomEvent('get-tasks-success', {
        tasks,
      });
    } catch (error) {
      this.dispatchCustomEvent('get-tasks-error', {
        error,
      });
    }
  }

  async toggleTask(id) {
    try {
      const task = await this._request(TASKS_BASE_URL, `/${id}/toggle`, {
        method: 'PATCH',
      });

      this.dispatchCustomEvent('toggle-task-success', {
        task,
      });
    } catch (error) {
      this.dispatchCustomEvent('toggle-task-error', {
        error,
        id,
      });
    }
  }

  async createTask(title) {
    try {
      const task = await this._request(TASKS_BASE_URL, '', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });

      this.dispatchCustomEvent('create-task-success', { task });
    } catch (error) {
      this.dispatchCustomEvent('create-task-error', { error });
    }
  }

  // --- Auth ---

  async register(email, password) {
    try {
      const data = await this._request(AUTH_BASE_URL, '/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      this.dispatchCustomEvent('register-success', { data });
    } catch (error) {
      this.dispatchCustomEvent('register-error', { error });
    }
  }

  async login(email, password) {
    try {
      const data = await this._request(AUTH_BASE_URL, '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      this.dispatchCustomEvent('login-success', { data });
    } catch (error) {
      this.dispatchCustomEvent('login-error', { error });
    }
  }
}

customElements.define('data-manager', DataManager);
