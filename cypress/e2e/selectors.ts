export const selectors = {
  constructor: '[data-testid="constructor"]',
  constructorList: '[data-testid="constructor"] ul',
  constructorIngredientAction: '.constructor-element__action',

  modal: '[data-testid="modal"]',
  modalClose: '[data-testid="modal-close"]',
  modalOverlay: '[data-testid="modal-overlay"]'
} as const;
