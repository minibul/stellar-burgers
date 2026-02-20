import { selectors } from './selectors';

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.mockIngredients();
    cy.mockUnauthorized();
    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('должен открыть модальное окно с данными кликнутого ингредиента (булка)', () => {
    cy.openIngredientModal('Краторная булка N-200i');

    cy.get(selectors.modal).should('exist');
    cy.get(selectors.modal).should('contain', 'Детали ингредиента');
    cy.get(selectors.modal).should('contain', 'Краторная булка N-200i');
  });

  it('должен открыть модальное окно с данными кликнутого ингредиента (соус)', () => {
    cy.openIngredientModal('Соус Spicy-X');

    cy.get(selectors.modal).should('exist');
    cy.get(selectors.modal).should('contain', 'Детали ингредиента');
    cy.get(selectors.modal).should('contain', 'Соус Spicy-X');
    cy.get(selectors.modal).should('not.contain', 'Краторная булка N-200i');
  });

  it('должен закрыть модальное окно по клику на крестик и остаться на главной', () => {
    cy.openIngredientModal('Краторная булка N-200i');
    cy.url().should('include', '/ingredients/');
    cy.get(selectors.modal).should('exist');

    cy.get(selectors.modalClose).click();

    cy.get(selectors.modal).should('not.exist');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });

  it('должен закрыть модальное окно по клику на оверлей и остаться на главной', () => {
    cy.openIngredientModal('Краторная булка N-200i');
    cy.url().should('include', '/ingredients/');
    cy.get(selectors.modal).should('exist');

    cy.get(selectors.modalOverlay).click({ force: true });

    cy.get(selectors.modal).should('not.exist');
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
  });
});
