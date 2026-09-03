import {
  expect,
  fixture,
  html,
} from '@open-wc/testing';

import sinon from 'sinon';

import '../../src/components/dm/data-manager.js';

describe('DataManager', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should search meals successfully', async () => {
    const mealsMock = [
      {
        idMeal: '1',
        strMeal: 'Chicken Curry',
      },
    ];

    sinon.stub(window, 'fetch').resolves({
      ok: true,

      json: sinon.stub().resolves({
        meals: mealsMock,
      }),
    });

    const element = await fixture(
      html`<data-manager></data-manager>`,
    );

    const dispatchSpy = sinon.spy(
      element,
      'dispatchEvent',
    );

    await element.searchMeals('chicken');

    expect(window.fetch.calledOnce).to.be.true;

    expect(
      window.fetch.firstCall.args[0],
    ).to.include('chicken');

    expect(dispatchSpy.calledOnce).to.be.true;

    const event =
      dispatchSpy.firstCall.args[0];

    expect(event.type).to.equal(
      'search-meals-success',
    );

    expect(event.detail.meals).to.deep.equal(
      mealsMock,
    );
  });
});