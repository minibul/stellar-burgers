import { selectors } from './selectors';

describe('Добавление и удаление ингредиентов в конструкторе', () => {
  beforeEach(() => {
    cy.mockIngredients();
    cy.mockUnauthorized();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен добавить булку в конструктор', () => {
    cy.addToConstructor('Краторная булка N-200i');

    cy.contains('Краторная булка N-200i (верх)').should('exist');
    cy.contains('Краторная булка N-200i (низ)').should('exist');
  });

  it('должен добавить начинку в конструктор', () => {
    cy.get(selectors.constructor).should('contain', 'Выберите начинку');

    cy.addToConstructor('Биокотлета из марсианской Магнолии');

    cy.get(selectors.constructor).should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );
  });

  it('должен удалить начинку из конструктора', () => {
    cy.addToConstructor('Биокотлета из марсианской Магнолии');

    cy.get(selectors.constructor).should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    cy.get(selectors.constructorList)
      .contains('li', 'Биокотлета из марсианской Магнолии')
      .find(selectors.constructorIngredientAction)
      .click();

    cy.get(selectors.constructor).should(
      'not.contain',
      'Биокотлета из марсианской Магнолии'
    );
    cy.contains('Выберите начинку').should('exist');
  });
});
