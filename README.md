# Open Cells Task Manager

A sample web application built with **Open Cells**, **Lit** and **Web Components**.

The project was created as a learning and demonstration application to explore modern frontend concepts such as routing, reactive components, Shadow DOM, Light DOM, slots, custom events, API integration, React interoperability, serverless functions and testing.

🌐 **Live application:**  
https://open-cells-task-manager-app.netlify.app/#!/

---

## Features

The application includes several pages and components demonstrating different frontend concepts and architectural patterns.

### Home

The landing page of the application.

It introduces the project and provides navigation to the different sections.

Main concepts:

- Open Cells routing
- Lit components
- Global application styles
- Light DOM
- Navigation between pages

Route:

```text
#!/
```

---

### Tasks

A simple task manager built with Lit.

Users can:

- View tasks
- Mark tasks as completed
- Undo completed tasks

Each task is rendered using a reusable Web Component:

```html
<task-card></task-card>
```

The page passes the task to the child component using a JavaScript property:

```js
<task-card .task=${task}></task-card>
```

The child component communicates back to the page using a custom event:

```js
new CustomEvent('toggle-task', {
  detail: {
    id: this.task.id,
  },
  bubbles: true,
  composed: true,
});
```

This demonstrates the typical Web Components communication pattern:

```text
Parent
  │
  │ property
  ▼
Child component
  │
  │ CustomEvent
  ▼
Parent
```

Main concepts:

- Lit reactive properties
- Web Components
- Shadow DOM
- Custom events
- `bubbles`
- `composed`
- Parent → child communication
- Child → parent communication
- Reusable components

Route:

```text
#!/tasks
```

---

### Meals

A food search page connected to the public **TheMealDB API**.

Users can search for meals by name and view information such as:

- Meal name
- Image
- Category
- Country / area
- Ingredients
- Measurements
- Cooking instructions

API:

https://www.themealdb.com/api.php

Example search:

```text
Chicken
```

The application sends the request through a reusable Data Manager component instead of calling the API directly from the page.

Architecture:

```text
MealsPage
    │
    ▼
<data-manager>
    │
    ▼
fetch()
    │
    ▼
TheMealDB API
    │
    ▼
CustomEvent
    │
    ▼
MealsPage
```

This keeps HTTP logic separated from UI logic.

Main concepts:

- REST APIs
- `fetch`
- async operations
- loading states
- error handling
- reusable Data Manager
- custom events
- separation of concerns

Route:

```text
#!/meals
```

---

### Meal detail

Clicking a meal opens a reusable:

```html
<meal-detail></meal-detail>
```

component.

This component demonstrates the difference between **Shadow DOM** and **Light DOM** using named slots.

Example:

```html
<meal-detail>
  <img slot="image" src="meal.jpg" alt="Meal" />

  <h2 slot="title">Chicken Curry</h2>

  <ul slot="ingredients">
    ...
  </ul>

  <p slot="instructions">...</p>
</meal-detail>
```

Inside the component:

```html
<slot name="image"></slot>
<slot name="title"></slot>
<slot name="ingredients"></slot>
<slot name="instructions"></slot>
```

Conceptually:

```text
<meal-detail>

    Light DOM
    ├── image
    ├── title
    ├── ingredients
    └── instructions

        ↓ slots

    Shadow DOM
    ├── <slot name="image">
    ├── <slot name="title">
    ├── <slot name="ingredients">
    └── <slot name="instructions">

</meal-detail>
```

Main concepts:

- Shadow DOM
- Light DOM
- `<slot>`
- named slots
- `::slotted`
- reusable UI components
- style encapsulation

---

### Notifications

This page demonstrates how a **React component can be integrated inside an Open Cells / Lit application**.

Route:

```text
#!/notifications
```

The notification form is implemented with React and uses:

```js
useState();
```

for its internal state.

The React application is exposed as a Web Component:

```html
<react-notification-form> </react-notification-form>
```

This allows Open Cells to consume the React component without needing to know how it is implemented internally.

Architecture:

```text
Open Cells
    │
    ▼
NotificationsPage
    │
    ▼
<react-notification-form>
    │
    ▼
React
    │
    ▼
Netlify Function
    │
    ▼
Resend
    │
    ▼
Email
```

Main concepts:

- React
- `useState`
- controlled forms
- Web Components interoperability
- React inside a Web Component
- Netlify Functions
- serverless architecture
- email notifications
- environment variables

---

## Data Manager

API calls are centralized in a Data Manager component.

Example:

```html
<data-manager
  id="dataManager"
  @search-meals-success="${this._onSearchMealsSuccess}"
  @search-meals-error="${this._onSearchMealsError}"
></data-manager>
```

Instead of mixing network logic with UI logic:

```text
Page
 ├── render
 ├── state
 └── events

Data Manager
 ├── fetch
 ├── API URLs
 ├── HTTP errors
 └── API responses
```

This provides better separation of responsibilities and makes components easier to maintain and test.

---

## Open Cells lifecycle

Some pages use the Open Cells `PageMixin`:

```js
export class MealsPage extends PageMixin(LitElement) {
```

This provides page-specific lifecycle methods such as:

```js
onPageEnter() {
  // Executed when entering the page
}

onPageLeave() {
  // Executed when leaving the page
}
```

For example, the Meals page clears its search state when the user navigates away.

This is different from the standard Web Components lifecycle:

```js
connectedCallback();
disconnectedCallback();
```

because Open Cells can keep pages mounted while changing which page is active.

---

## Routing

Routing is managed by Open Cells.

Example route:

```js
{
  path: '/meals',
  name: 'meals',
  component: 'meals-page',

  action: async () => {
    await import('../pages/meals/meals-page.js');
  },
}
```

Navigation can then be performed with:

```js
this.controller.navigate('meals');
```

The application currently uses hash-based routes:

```text
#!/tasks
#!/meals
#!/notifications
```

---

## Application shell

The main application layout is implemented by:

```html
<app-index></app-index>
```

It contains:

- Application header
- Navigation
- Expandable sidebar
- Page container
- Open Cells routing outlet

The sidebar allows navigation between the different pages.

---

## Styling

The application uses two different styling strategies.

### Global page styles

Pages such as:

```text
Home
Tasks
Meals
Notifications
```

use global CSS.

Example:

```text
src/css/
├── main.css
├── home.css
├── second.css
├── tasks.css
└── meals.css
```

These pages render using Light DOM:

```js
createRenderRoot() {
  return this;
}
```

---

### Encapsulated component styles

Reusable Lit components use Shadow DOM and encapsulated styles.

Example:

```text
task-card/
├── task-card.js
└── task-card.css.js
```

```js
static styles = styles;
```

The Shadow DOM prevents global CSS from accidentally modifying the internal design of reusable components.

CSS Custom Properties are used to share design tokens:

```css
:root {
  --color-blue-dark: #043263;
  --color-blue: #1973b8;
  --color-core-blue: #004481;
  --color-navy: #072146;
  --color-white: #ffffff;
}
```

---

## Technologies

### Frontend

- JavaScript
- HTML
- CSS
- Web Components
- Lit 3
- Open Cells
- React
- React DOM

### Architecture

- Component-based architecture
- SPA
- Client-side routing
- Data Manager pattern
- Custom Events
- Shadow DOM
- Light DOM
- Slots

### API

- TheMealDB
- Fetch API

### Backend / Serverless

- Netlify Functions
- Node.js
- Resend

### Build tools

- Vite
- npm

### Testing

- Web Test Runner
- Open WC Testing
- Sinon
- Chai assertions

### Deployment

- GitHub
- Netlify
- Continuous deployment

---

## Project structure

A simplified version of the project structure:

```text
open-cells-task-manager/
│
├── functions/
│   └── send-notification.mjs
│
├── src/
│   │
│   ├── components/
│   │   ├── dm/
│   │   │   └── data-manager.js
│   │   │
│   │   ├── meal-detail/
│   │   │   ├── meal-detail.js
│   │   │   └── meal-detail.css.js
│   │   │
│   │   ├── task-card/
│   │   │   ├── task-card.js
│   │   │   └── task-card.css.js
│   │   │
│   │   └── react-notification-form/
│   │       ├── notification-form.jsx
│   │       └── react-notification-form.js
│   │
│   ├── pages/
│   │   ├── home/
│   │   ├── tasks/
│   │   ├── meals/
│   │   ├── notifications/
│   │   └── second/
│   │
│   ├── router/
│   │   └── routes.js
│   │
│   └── css/
│       ├── main.css
│       ├── home.css
│       ├── second.css
│       ├── tasks.css
│       └── meals.css
│
├── test/
│
├── netlify.toml
├── index.html
├── package.json
└── README.md
```

---

## Getting started

Clone the repository:

```bash
git clone https://github.com/Juan451/open-cells-task-manager.git
```

Enter the project:

```bash
cd open-cells-task-manager
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

---

## Local development with Netlify Functions

The email notification feature uses Netlify Functions.

To run the complete application locally, including serverless functions:

```bash
netlify dev
```

The frontend can still be developed independently with:

```bash
npm run dev
```

but Netlify Functions will not be available through Vite alone.

---

## Environment variables

The notification service requires the following environment variables:

```text
RESEND_API_KEY
RECIPIENT_EMAIL
```

These variables should be configured in Netlify.

Do not store API keys directly in the source code or commit them to GitHub.

Example:

```js
const apiKey = process.env.RESEND_API_KEY;
```

---

## Scripts

| Script                  | Description                          |
| ----------------------- | ------------------------------------ |
| `npm run dev`           | Start the Vite development server    |
| `npm run build`         | Build the application for production |
| `npm run preview`       | Preview the production build         |
| `npm test`              | Run the test suite                   |
| `npm run test:watch`    | Run tests in watch mode              |
| `npm run test:coverage` | Run tests and generate coverage      |

---

## Testing

The application uses:

- `@web/test-runner`
- `@open-wc/testing`
- Sinon

Example:

```js
import { expect, fixture, html } from '@open-wc/testing';

import sinon from 'sinon';
```

Tests can verify:

- Component rendering
- Reactive properties
- Shadow DOM
- Custom Events
- API calls
- `fetch`
- success responses
- error responses
- page lifecycle
- component interaction

Run tests:

```bash
npm test
```

Run tests continuously:

```bash
npm run test:watch
```

Generate coverage:

```bash
npm run test:coverage
```

---

## Production build

Create the production bundle:

```bash
npm run build
```

Vite generates the production files inside:

```text
dist/
```

---

## Deployment

The application is deployed with Netlify.

Configuration is stored in:

```text
netlify.toml
```

Example:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "functions"

[build.environment]
  NODE_VERSION = "22"
```

The project uses continuous deployment:

```text
Local development
      ↓
git commit
      ↓
git push
      ↓
GitHub
      ↓
Netlify
      ↓
npm run build
      ↓
Production deployment
```

Live application:

https://open-cells-task-manager-app.netlify.app/#!/

---

## Learning objectives

This project demonstrates how different frontend technologies can coexist in the same application.

It includes practical examples of:

- Lit
- Open Cells
- React
- JavaScript
- Web Components
- Shadow DOM
- Light DOM
- Slots
- Custom Events
- Reactive properties
- Page lifecycle
- REST APIs
- Async JavaScript
- Serverless functions
- Email services
- Testing
- Continuous deployment

The application is intended both as a learning project and as a reference implementation for experimenting with modern frontend architecture.
