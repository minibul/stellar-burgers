declare global {
  namespace Cypress {
    interface Chainable {
      mockIngredients(): Chainable<void>;
      mockUnauthorized(): Chainable<void>;
      mockAuthUser(): Chainable<void>;
      mockOrder(): Chainable<void>;
      login(): Chainable<void>;
      logout(): Chainable<void>;
      addToConstructor(name: string): Chainable<void>;
      openIngredientModal(name: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('mockIngredients', () => {
  cy.intercept('GET', '**/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');
});

Cypress.Commands.add('mockUnauthorized', () => {
  cy.intercept('GET', '**/api/auth/user', {
    statusCode: 401,
    body: { success: false, message: 'You should be authorised' }
  }).as('getUser');
});

Cypress.Commands.add('mockAuthUser', () => {
  cy.intercept('GET', '**/api/auth/user', {
    fixture: 'user.json'
  }).as('getAuthUser');
});

Cypress.Commands.add('mockOrder', () => {
  cy.intercept('POST', '**/api/orders', {
    fixture: 'order.json'
  }).as('createOrder');
});

Cypress.Commands.add('login', () => {
  cy.setCookie('accessToken', 'Bearer test-access-token');
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('refreshToken', 'test-refresh-token');
    }
  });
});

Cypress.Commands.add('logout', () => {
  cy.clearCookie('accessToken');
  cy.clearLocalStorage('refreshToken');
});

Cypress.Commands.add('addToConstructor', (name: string) => {
  cy.contains('li', name).find('button').click();
});

Cypress.Commands.add('openIngredientModal', (name: string) => {
  cy.contains('li', name).find('a').click();
});

export {};
