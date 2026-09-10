import { LitElement, html } from 'lit';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { StatsChart } from './stats-chart.jsx';

export class ReactStatsChart extends LitElement {
  static properties = {
    data: {
      type: Object,
    },
  };

  constructor() {
    super();
    this.data = { total: 0, completed: 0, pending: 0 };
    this._root = null;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`<div class="react-mount"></div>`;
  }

  firstUpdated() {
    const mountNode = this.querySelector('.react-mount');
    this._root = createRoot(mountNode);
    this._renderReact();
  }

  updated(changedProperties) {
    if (changedProperties.has('data')) {
      this._renderReact();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this._root) {
      this._root.unmount();
      this._root = null;
    }
  }

  _renderReact() {
    if (!this._root) return;

    const { total, completed, pending } = this.data;

    this._root.render(
      React.createElement(StatsChart, { total, completed, pending }),
    );
  }
}

customElements.define('react-stats-chart', ReactStatsChart);
