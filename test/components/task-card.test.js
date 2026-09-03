import {
  expect,
  fixture,
  html,
} from '@open-wc/testing';

import sinon from 'sinon';

import '../../src/components/task-card/task-card.js';

describe('TaskCard', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should call _toggleTask when clicking button', async () => {
    const element = await fixture(html`
      <task-card
        .task=${{
          id: 1,
          title: 'Learn LitElement',
          completed: false,
        }}
      ></task-card>
    `);

    const spy = sinon.spy(element, '_toggleTask');

    element.requestUpdate();
    await element.updateComplete;

    const button =
      element.shadowRoot.querySelector('.task__button');

    button.click();

    expect(spy.calledOnce).to.be.true;
  });

  it('should dispatch toggle-task event', async () => {
    const element = await fixture(html`
      <task-card
        .task=${{
          id: 5,
          title: 'Learn Open Cells',
          completed: false,
        }}
      ></task-card>
    `);

    const dispatchSpy = sinon.spy(
      element,
      'dispatchEvent',
    );

    const button =
      element.shadowRoot.querySelector('.task__button');

    button.click();

    expect(dispatchSpy.calledOnce).to.be.true;

    const event =
      dispatchSpy.firstCall.args[0];

    expect(event.type).to.equal('toggle-task');
    expect(event.detail.id).to.equal(5);
    expect(event.bubbles).to.be.true;
    expect(event.composed).to.be.true;
  });
});