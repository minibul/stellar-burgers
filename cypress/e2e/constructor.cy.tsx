import { selectors } from './selectors';

describe('Страница конструктора бургера', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 401,
      body: { success: false, message: 'You should be authorised' }
    }).as('getUser');
  });

  describe('Добавление ингредиентов в конструктор', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('должен добавить булку в конструктор', () => {
      cy.contains('li', 'Краторная булка N-200i').find('button').click();

      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должен добавить начинку в конструктор', () => {
      cy.get(selectors.constructor).should('contain', 'Выберите начинку');

      cy.contains('li', 'Биокотлета из марсианской Магнолии')
        .find('button')
        .click();

      cy.get(selectors.constructor).should(
        'contain',
        'Биокотлета из марсианской Магнолии'
      );
    });
  });

  describe('Модальное окно ингредиента', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('должен открыть модальное окно с данными кликнутого ингредиента (булка)', () => {
      cy.contains('li', 'Краторная булка N-200i').find('a').click();

      cy.get(selectors.modal).should('exist');
      cy.get(selectors.modal).should('contain', 'Детали ингредиента');
      cy.get(selectors.modal).should('contain', 'Краторная булка N-200i');
    });

    it('должен открыть модальное окно с данными кликнутого ингредиента (соус)', () => {
      cy.contains('li', 'Соус Spicy-X').find('a').click();

      cy.get(selectors.modal).should('exist');
      cy.get(selectors.modal).should('contain', 'Детали ингредиента');
      cy.get(selectors.modal).should('contain', 'Соус Spicy-X');
      cy.get(selectors.modal).should('not.contain', 'Краторная булка N-200i');
    });

    it('должен закрыть модальное окно по клику на крестик и остаться на главной', () => {
      cy.contains('li', 'Краторная булка N-200i').find('a').click();
      cy.url().should('include', '/ingredients/');
      cy.get(selectors.modal).should('exist');

      cy.get(selectors.modalClose).click();

      cy.get(selectors.modal).should('not.exist');
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    });

    it('должен закрыть модальное окно по клику на оверлей и остаться на главной', () => {
      cy.contains('li', 'Краторная булка N-200i').find('a').click();
      cy.url().should('include', '/ingredients/');
      cy.get(selectors.modal).should('exist');

      cy.get(selectors.modalOverlay).click({ force: true });

      cy.get(selectors.modal).should('not.exist');
      cy.url().should('eq', `${Cypress.config('baseUrl')}/`);
    });
  });

  describe('Удаление ингредиента из конструктора', () => {
    beforeEach(() => {
      cy.visit('/');
      cy.wait('@getIngredients');
    });

    it('должен удалить начинку из конструктора', () => {
      cy.contains('li', 'Биокотлета из марсианской Магнолии')
        .find('button')
        .click();

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

  describe('Создание заказа', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/auth/user', {
        fixture: 'user.json'
      }).as('getAuthUser');

      cy.intercept('POST', '**/api/orders', {
        fixture: 'order.json'
      }).as('createOrder');

      cy.setCookie('accessToken', 'Bearer test-access-token');

      cy.visit('/', {
        onBeforeLoad(win) {
          win.localStorage.setItem('refreshToken', 'test-refresh-token');
        }
      });

      cy.wait('@getIngredients');
      cy.wait('@getAuthUser');
    });

    afterEach(() => {
      cy.clearCookie('accessToken');
      cy.clearLocalStorage('refreshToken');
    });

    it('должен создать заказ, показать верный номер и очистить конструктор', () => {
      cy.contains('li', 'Краторная булка N-200i').find('button').click();
      cy.contains('li', 'Биокотлета из марсианской Магнолии')
        .find('button')
        .click();

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
});
