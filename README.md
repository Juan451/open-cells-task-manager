# Open Cells Task Manager

A sample web application built with **Open Cells**, **Lit**, **Web Components** and **React**.

The project was created as a learning and demonstration application to explore modern frontend concepts such as routing, reactive components, Shadow DOM, Light DOM, slots, custom events, API integration, React interoperability, serverless functions, testing and continuous deployment.

---

## Live Demo

The application is publicly available on GitHub Pages:

https://juan451.github.io/open-cells-task-manager/

It is also deployed on Netlify:

https://open-cells-task-manager-app.netlify.app/

### GitHub Pages routes

- Home

https://juan451.github.io/open-cells-task-manager/#!/

- Tasks

https://juan451.github.io/open-cells-task-manager/#!/tasks

- Meals

https://juan451.github.io/open-cells-task-manager/#!/meals

- Notifications

https://juan451.github.io/open-cells-task-manager/#!/notifications

> The Netlify deployment is the full deployment because it also includes the serverless function used by the notification form.

### Tasks API

The Tasks page consumes a Spring Boot REST API deployed on AWS.

Production API endpoint:

https://d1wohnfz6jexov.cloudfront.net/api/tasks

CloudFront provides the public HTTPS endpoint used by the frontend, while Elastic Beanstalk hosts the Spring Boot application.

---

# Features

The application contains several pages and reusable components that demonstrate different frontend concepts and architectural patterns.

---

## Home

The landing page of the application.

It introduces the project and provides access to the different sections.

Main concepts demonstrated:

- Open Cells routing

- Lit components

- Light DOM

- Global application styles

- Client-side navigation

Route:

```text

#!/

```

---

## Tasks

A simple task manager built with **Lit**.

Users can:

- View tasks

- Mark tasks as completed

- Undo completed tasks

Task data is provided by a **Spring Boot REST API** deployed on **AWS Elastic Beanstalk** and exposed to the browser through **Amazon CloudFront**.

The frontend uses:

`GET /api/tasks`

to load the task list and:

`PATCH /api/tasks/{id}/toggle`

to change the completed state of a task.

Production flow:

```text

GitHub Pages (HTTPS)

│

│ fetch()

▼

Amazon CloudFront (HTTPS)

│

▼

AWS Elastic Beanstalk

│

▼

nginx

│

▼

Spring Boot / Java 21

│

▼

/api/tasks

```

Each task is rendered using a reusable Web Component:

```html
<task-card></task-card>
```

The page passes a task object to the child component using a JavaScript property:

```js

<task-card .task=${task}></task-card>

```

The child component communicates with the parent using a custom event:

```js
new CustomEvent('toggle-task', {
  detail: {
    id: this.task.id,
  },

  bubbles: true,

  composed: true,
});
```

The communication flow is:

```text

TasksPage

│

│ .task=${task}

▼

TaskCard

│

│ CustomEvent

▼

TasksPage

│

▼

Update state

│

▼

Lit re-renders

```

Main concepts demonstrated:

- Lit reactive properties

- Web Components

- Shadow DOM

- Custom Events

- `bubbles`

- `composed`

- Parent → child communication

- Child → parent communication

- Immutable state updates

- Reusable components

Route:

```text

#!/tasks

```

---

## Meals

A food search page connected to the public **TheMealDB API**.

API documentation:

https://www.themealdb.com/api.php

Users can search for meals and view information such as:

- Meal name

- Image

- Category

- Country / area

- Ingredients

- Measurements

- Cooking instructions

Example search:

```text

chicken

```

The page does not call the API directly.

Instead, all HTTP communication is delegated to a reusable:

```html
<data-manager></data-manager>
```

component.

Architecture:

```text

MealsPage

│

│ searchMeals()

▼

DataManager

│

│ fetch()

▼

TheMealDB API

│

│ JSON

▼

DataManager

│

│ CustomEvent

▼

MealsPage

│

▼

Render results

```

Main concepts demonstrated:

- REST API integration

- Fetch API

- Async JavaScript

- Loading states

- Error handling

- Data Manager pattern

- Separation of concerns

- Custom Events

Route:

```text

#!/meals

```

---

## Meal Detail

Clicking on a meal opens a reusable:

```html
<meal-detail></meal-detail>
```

component.

This component demonstrates the relationship between **Shadow DOM**, **Light DOM** and **slots**.

Example usage:

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

LIGHT DOM

├── \<img slot="image">

├── \<h2 slot="title">

├── \<ul slot="ingredients">

└── \<p slot="instructions">

          ↓

      SLOT DISTRIBUTION

          ↓

SHADOW DOM

├── \<slot name="image">

├── \<slot name="title">

├── \<slot name="ingredients">

└── \<slot name="instructions">

</meal-detail>

```

Main concepts demonstrated:

- Shadow DOM

- Light DOM

- Slots

- Named slots

- `::slotted`

- Style encapsulation

- Reusable UI components

---

## Notifications

The Notifications page demonstrates how a **React component can be integrated inside an Open Cells / Lit application**.

The page acts as a suggestions and feedback form.

Users can send:

- Their name

- Their contact email

- A suggestion, question or feedback message

The recipient of the notification is controlled by the backend and cannot be modified from the frontend.

The form is implemented using React:

```jsx
useState();
```

and exposed to the rest of the application as a Web Component:

```html
<react-notification-form> </react-notification-form>
```

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

│ POST

▼

Netlify Function

│

▼

Resend

│

▼

Email notification

```

Main concepts demonstrated:

- React

- `useState`

- Controlled forms

- React interoperability

- Web Components

- Netlify Functions

- Serverless architecture

- Environment variables

- Resend email API

- Separation between frontend and backend responsibilities

Route:

```text

#!/notifications

```

The complete notification flow is available in the Netlify deployment:

https://open-cells-task-manager-app.netlify.app/#!/notifications

---

# Data Manager

The application centralizes API communication in a Data Manager component.

The Data Manager currently communicates with two external services:

- **TheMealDB** for meal data.

- **Spring Boot on AWS** for task data.

The production Tasks base URL is:

```js
const TASKS_BASE_URL = 'https://d1wohnfz6jexov.cloudfront.net/api/tasks';
```

Example:

```html
<data-manager
  id="dataManager"
  @search-meals-success="${this._onSearchMealsSuccess}"
  @search-meals-error="${this._onSearchMealsError}"
></data-manager>
```

Instead of putting networking logic directly inside a page:

```text

MealsPage

├── UI

├── state

├── rendering

└── user events

```

the Data Manager handles:

```text

DataManager

├── fetch

├── API endpoints

├── HTTP errors

├── JSON parsing

└── API response events

```

This improves:

- Separation of concerns

- Maintainability

- Reusability

- Testability

---

# Open Cells Lifecycle

Some pages use:

```js
PageMixin;
```

from Open Cells.

Example:

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

For example, the Meals page can clear its search state when the user navigates away.

This is different from the standard Web Components lifecycle:

```js
connectedCallback();

disconnectedCallback();
```

Open Cells may keep pages mounted while only changing which page is active, so `onPageEnter()` and `onPageLeave()` are useful for page-level lifecycle management.

---

# Routing

Routing is managed by **Open Cells**.

Example route:

```js

{

path: '/meals',

name: 'meals',

component: 'meals-page',

action: async () => {

await import(

  '../pages/meals/meals-page.js'

);

},

}

```

Navigation can then be performed with:

```js
this.controller.navigate('meals');
```

The project uses hash-based routes:

```text

#!/

#!/tasks

#!/meals

#!/notifications

```

This is useful for static hosting environments such as GitHub Pages because route navigation is handled by the browser.

---

# Application Shell

The main application layout is implemented by:

```html
<app-index></app-index>
```

It contains:

- Header

- Application logo

- Documentation links

- Expandable sidebar

- Page navigation

- Main page container

The sidebar provides navigation between the application pages.

---

# Styling

The application uses two styling strategies.

## Global page styles

Pages use global CSS files:

```text

src/css/

├── main.css

├── home.css

├── second.css

├── tasks.css

├── meals.css

└── notifications.css

```

These pages render using Light DOM:

```js

createRenderRoot() {

return this;

}

```

This allows global selectors such as:

```css

meals-page .page-header {

...

}

```

to style page content.

---

## Encapsulated component styles

Reusable Lit components use Shadow DOM and encapsulated styles.

Example:

```text

task-card/

├── task-card.js

└── task-card.css.js

```

Inside the component:

```js

static styles = styles;

```

This prevents global styles from accidentally modifying internal component design.

---

# CSS Custom Properties

The application uses CSS Custom Properties as design tokens.

Example:

```css
:root {
  --color-aqua: #2dcccd;

  --color-blue-dark: #043263;

  --color-blue-light: #5bbeff;

  --color-blue: #1973b8;

  --color-core-blue: #004481;

  --color-core-light: #d4edfc;

  --color-grey-light: #f4f4f4;

  --color-grey-mid: #d9d9d9;

  --color-grey: #666666;

  --color-navy: #072146;

  --color-red: #d44b50;

  --color-white: #ffffff;
}
```

CSS Custom Properties can be inherited by components even when they use Shadow DOM.

This provides controlled theming while maintaining component encapsulation.

---

# Technologies

## Frontend

- JavaScript

- HTML

- CSS

- Web Components

- Lit 3

- Open Cells

- React

- React DOM

## Architecture

- Single Page Application

- Component-based architecture

- Data Manager pattern

- Client-side routing

- Custom Events

- Shadow DOM

- Light DOM

- Slots

- Reactive properties

## API

- TheMealDB

- Fetch API

- Spring Boot REST API

## Backend / Serverless

- Java 21

- Spring Boot

- Maven

- Netlify Functions

- Node.js

- Resend

## Build tools

- Vite

- npm

## Testing

- Web Test Runner

- Open WC Testing

- Sinon

- Chai assertions

## Deployment

- GitHub

- GitHub Actions

- GitHub Pages

- Netlify

- AWS Elastic Beanstalk

- Amazon EC2

- Amazon CloudFront

- Amazon Linux 2023

- Amazon Corretto 21

- nginx

- Continuous Deployment

---

# Project Structure

Simplified project structure:

```text

open-cells-task-manager/

│

├── .github/

│   └── workflows/

│       └── deploy-pages.yml

│

├── functions/

│   └── send-notification.mjs

│

├── src/

│   │

│   ├── components/

│   │   │

│   │   ├── app-index/

│   │   │

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

│       ├── meals.css

│       └── notifications.css

│

├── test/

│

├── index.html

├── package.json

├── package-lock.json

├── vite.config.js

├── netlify.toml

└── README.md

```

---

# Getting Started

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

Start the development server:

```bash

npm run dev

```

The application will normally be available at:

```text

http://localhost:5173

```

---

# Local Development with Netlify

The notification feature uses a Netlify Function.

To run the complete application locally, including serverless functions:

```bash

netlify dev

```

Using only:

```bash

npm run dev

```

starts the Vite frontend but does not provide the Netlify Function environment.

---

# Environment Variables

The email notification service requires:

```text

RESEND_API_KEY

```

This variable is configured securely in Netlify.

The API key must never be committed to GitHub.

Example usage:

```js
const apiKey = process.env.RESEND_API_KEY;
```

The notification recipient is controlled on the backend so users cannot modify the destination address from the frontend.

---

# Scripts

| Script | Description |

| ----------------------- | ------------------------------------ |

| `npm run dev` | Start the Vite development server |

| `npm run build` | Build the application for production |

| `npm run preview` | Preview the production build |

| `npm test` | Run the test suite |

| `npm run test:watch` | Run tests continuously in watch mode |

| `npm run test:coverage` | Run tests and generate coverage |

---

# Testing

The project uses:

```text

@web/test-runner

@open-wc/testing

sinon

```

Example:

```js
import { expect, fixture, html } from '@open-wc/testing';

import sinon from 'sinon';
```

Tests can verify:

- Component rendering

- Lit reactive properties

- Shadow DOM content

- Custom Events

- `bubbles`

- `composed`

- API calls

- `fetch`

- Successful API responses

- API errors

- Page lifecycle

- Component interaction

- React integration

Run tests:

```bash

npm test

```

Run continuously:

```bash

npm run test:watch

```

Generate coverage:

```bash

npm run test:coverage

```

---

# Production Build

Create a production build with:

```bash

npm run build

```

Vite generates the production bundle inside:

```text

dist/

```

---

# Vite Configuration

The project supports both Netlify and GitHub Pages deployments.

Example:

```js

import { defineConfig } from 'vite';

export default defineConfig({

base:

process.env.GITHUB\_ACTIONS === 'true' ? '/open-cells-task-manager/' : '/',

});

```

This means:

```text

Local development

→ /

Netlify

→ /

GitHub Pages

→ /open-cells-task-manager/

```

---

# Deployment

The frontend is deployed using both **GitHub Pages** and **Netlify**.

The Tasks backend is deployed separately on **AWS Elastic Beanstalk** and exposed over HTTPS through **Amazon CloudFront**.

---

## GitHub Pages

GitHub Pages deployment:

https://juan451.github.io/open-cells-task-manager/

Deployment is automated using **GitHub Actions**.

Workflow:

```text

.github/

└── workflows/

└── deploy-pages.yml

```

Deployment flow:

```text

git push

↓

GitHub

↓

GitHub Actions

↓

npm ci

↓

npm run build

↓

dist/

↓

GitHub Pages

```

Each push to the configured branch can automatically trigger a new deployment.

---

## Netlify

Netlify deployment:

https://open-cells-task-manager-app.netlify.app/

Netlify provides:

- Static hosting

- Continuous deployment

- Netlify Functions

- Environment variables

- Serverless backend functionality

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

Netlify deployment flow:

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

Deploy

```

---

## AWS Spring Boot Backend

The Tasks feature uses a Java Spring Boot backend deployed on AWS.

### Elastic Beanstalk

The Spring Boot application is packaged as an executable JAR:

```bash

./mvnw clean package

```

The generated artifact is:

```text

target/demo-0.0.1-SNAPSHOT.jar

```

It can be tested locally before deployment with:

```bash

java -jar target/demo-0.0.1-SNAPSHOT.jar

```

The Elastic Beanstalk environment uses:

- Platform: Java

- Platform branch: Corretto 21 running on 64bit Amazon Linux 2023

- Environment tier: Web server

- Environment type: Single instance

- EC2 instance type: `t3.micro`

- Architecture: `x86_64`

- Proxy server: nginx

- Deployment policy: All at once

- Managed platform updates: Disabled

The Spring Boot process is configured with the Elastic Beanstalk environment property:

```text

SERVER_PORT=5000

```

This allows nginx to forward requests to the Spring Boot application.

The direct Elastic Beanstalk origin is:

```text

http://opencells-api-env.eba-4u9emsyt.eu-west-2.elasticbeanstalk.com

```

and the Tasks endpoint is:

```text

http://opencells-api-env.eba-4u9emsyt.eu-west-2.elasticbeanstalk.com/api/tasks

```

The direct HTTP endpoint is useful for testing the backend, but it is not used by the GitHub Pages frontend.

### Why CloudFront is required

GitHub Pages serves the application through HTTPS:

```text

https://juan451.github.io

```

Calling the Elastic Beanstalk HTTP endpoint directly from an HTTPS page causes the browser to block the request as Mixed Content:

```text

HTTPS frontend
↓
HTTP backend
↓
Blocked by the browser

```

Amazon CloudFront is therefore used as an HTTPS layer in front of Elastic Beanstalk.

Production architecture:

```text

Browser

│

│ HTTPS

▼

GitHub Pages

https://juan451.github.io/open-cells-task-manager/

│

│ fetch HTTPS

▼

Amazon CloudFront

https://d1wohnfz6jexov.cloudfront.net

│

│ HTTP to origin

▼

AWS Elastic Beanstalk

│

▼

nginx

│

▼

Spring Boot :5000

│

▼

/api/tasks

```

CloudFront is configured with:

- Origin type: Custom origin

- Origin: Elastic Beanstalk environment domain

- Origin protocol: HTTP

- Viewer protocol policy: Redirect HTTP to HTTPS

- Allowed methods: GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE

- Cache policy: `CachingDisabled`

- Origin request policy: `AllViewer`

- Response headers policy: Not configured

- AWS WAF: Disabled for this demonstration environment

The public production Tasks API is:

```text

https://d1wohnfz6jexov.cloudfront.net/api/tasks

```

The frontend Data Manager uses:

```js
const TASKS_BASE_URL = 'https://d1wohnfz6jexov.cloudfront.net/api/tasks';
```

### CORS

CloudFront solves the HTTPS / Mixed Content problem, but the browser still enforces CORS because GitHub Pages and CloudFront use different origins.

Spring Boot therefore allows the GitHub Pages origin:

```java

@Configuration
public class CorsConfig {

@Bean
public WebMvcConfigurer corsConfigurer() {
    return new WebMvcConfigurer() {

        @Override
        public void addCorsMappings(CorsRegistry registry) {
            registry
                .addMapping("/api/**")
                .allowedOrigins(
                    "http://localhost:5173",
                    "https://juan451.github.io"
                )
                .allowedMethods(
                    "GET",
                    "POST",
                    "PUT",
                    "PATCH",
                    "DELETE",
                    "OPTIONS"
                )
                .allowedHeaders("*");
        }
    };
}

}

```

The production CORS origin is:

```text

https://juan451.github.io

```

The repository path is intentionally not included in the CORS origin because an origin consists of the protocol, host and port, not the URL path.

### Updating the backend

After changing the Spring Boot backend:

```text

Update the Java code

Run ./mvnw clean package

Test with java -jar target/demo-0.0.1-SNAPSHOT.jar

Open the existing Elastic Beanstalk environment

Use "Upload and deploy"

Upload target/demo-0.0.1-SNAPSHOT.jar

Wait until the environment health returns to OK

Verify https://d1wohnfz6jexov.cloudfront.net/api/tasks

```

The existing Elastic Beanstalk environment and CloudFront distribution can be reused; a new environment is not required for every backend release.

### Troubleshooting

If Tasks work locally but not from GitHub Pages, check the browser console.

Mixed Content

```text

Mixed Content: the page was loaded over HTTPS,
but requested an insecure HTTP resource.

```

Cause:

```text

GitHub Pages HTTPS → Elastic Beanstalk HTTP

```

Solution:

```text

Use the CloudFront HTTPS endpoint in TASKS_BASE_URL.

```

CORS

```text

No 'Access-Control-Allow-Origin' header is present.

```

Cause:

```text

Spring Boot does not allow the GitHub Pages origin.

```

Solution:

```text

Allow https://juan451.github.io in the Spring Boot CORS configuration,
rebuild the JAR and deploy the new version to Elastic Beanstalk.

```

---

# Notification Architecture

The notification system demonstrates a simple full-stack flow.

```text

React form

↓

fetch()

↓

Netlify Function

↓

Resend API

↓

Email

```

The frontend sends:

```json
{
  "name": "...",

  "email": "...",

  "message": "..."
}
```

The serverless function decides the recipient.

The frontend does not control the destination email address.

This prevents users from turning the application into an arbitrary email sending endpoint.

---

# Shadow DOM vs Light DOM

The project demonstrates both approaches.

## Shadow DOM

Used by reusable components such as:

```html
<task-card></task-card>
```

Advantages:

- Style encapsulation

- Internal DOM isolation

- Protection from global CSS

- Good fit for reusable Design System components

---

## Light DOM

Used by some page-level components:

```js

createRenderRoot() {

return this;

}

```

Advantages:

- Global styles can target page content

- Easier application-level layout styling

- Useful when working with existing global CSS architecture

---

# Slots

The project demonstrates slots using:

```html
<meal-detail></meal-detail>
```

Slots allow a component to define where external Light DOM content should appear inside its Shadow DOM.

Example:

```html
<slot name="title"></slot>
```

Consumer:

```html
<h2 slot="title">Chicken Curry</h2>
```

Slots allow reusable components to control layout while letting consumers provide content.

---

# Custom Events

Web Components communicate upward using Custom Events.

Example:

```js
this.dispatchEvent(
  new CustomEvent('toggle-task', {
    detail: {
      id: this.task.id,
    },

    bubbles: true,

    composed: true,
  }),
);
```

`bubbles: true` allows the event to bubble through the DOM.

`composed: true` allows the event to cross Shadow DOM boundaries.

---

# Learning Objectives

This project demonstrates practical examples of:

- JavaScript

- Lit

- Open Cells

- React

- Web Components

- Shadow DOM

- Light DOM

- Slots

- Custom Events

- Reactive properties

- Page lifecycle

- REST APIs

- Fetch API

- Async JavaScript

- Separation of concerns

- Data Manager pattern

- Serverless functions

- Email APIs

- Environment variables

- Sinon

- Component testing

- Git

- GitHub Actions

- GitHub Pages

- Netlify

- AWS Elastic Beanstalk

- Amazon EC2

- Amazon CloudFront

- Spring Boot deployment

- CORS

- HTTPS / Mixed Content

- Continuous Deployment

The application is intended both as a learning project and as a reference implementation for experimenting with modern frontend architecture.
