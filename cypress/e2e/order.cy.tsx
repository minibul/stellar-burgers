import { selectors } from './selectors';

describe('Создание заказа', () => {
  beforeEach(() => {
    cy.logout();
    cy.mockIngredients();
    cy.mockAuthUser();
    cy.mockOrder();
    cy.login();

    cy.wait('@getIngredients');
    cy.wait('@getAuthUser');
  });

  it('должен создать заказ, показать верный номер и очистить конструктор', () => {
    cy.addToConstructor('Краторная булка N-200i');
    cy.addToConstructor('Биокотлета из марсианской Магнолии');

    cy.contains('button', 'Оформить заказ').click();
    cy.wait('@createOrder');

    cy.get(selectors.modal).should('exist');
    cy.get(selectors.modal).should('contain', '12345');

    cy.get(selectors.modalClose).click();
    cy.get(selectors.modal).should('not.exist');

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});
