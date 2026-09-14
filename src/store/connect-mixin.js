import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from './store.js';

export const connectStore = (BaseElement) => connect(store)(BaseElement);
