import constructorReducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor,
  initialState
} from './constructorSlice';
import { TIngredient } from '@utils-types';

const mockBun: TIngredient = {
  _id: 'bun-id-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'bun-image.png',
  image_large: 'bun-image-large.png',
  image_mobile: 'bun-image-mobile.png'
};

const mockIngredient: TIngredient = {
  _id: 'ingredient-id-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'meat-image.png',
  image_large: 'meat-image-large.png',
  image_mobile: 'meat-image-mobile.png'
};

describe('burgerConstructor slice', () => {

  it('должен вернуть начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('addBun', () => {
    it('должен добавить булку в конструктор', () => {
      const state = constructorReducer(initialState, addBun(mockBun));

      expect(state.bun).not.toBeNull();
      expect(state.bun?.name).toBe(mockBun.name);
      expect(state.bun?._id).toBe(mockBun._id);
      expect(state.bun?.id).toBeDefined();
    });

    it('должен заменить уже добавленную булку новой', () => {
      const anotherBun: TIngredient = {
        ...mockBun,
        _id: 'bun-id-2',
        name: 'Флюоресцентная булка R2-D3'
      };

      const stateWithBun = constructorReducer(initialState, addBun(mockBun));
      const stateWithNewBun = constructorReducer(
        stateWithBun,
        addBun(anotherBun)
      );

      expect(stateWithNewBun.bun?.name).toBe(anotherBun.name);
      expect(stateWithNewBun.bun?._id).toBe(anotherBun._id);
    });
  });

  describe('addIngredient', () => {
    it('должен добавить ингредиент в конструктор', () => {
      const state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe(mockIngredient.name);
      expect(state.ingredients[0]._id).toBe(mockIngredient._id);
      expect(state.ingredients[0].id).toBeDefined();
    });

    it('должен добавлять несколько ингредиентов', () => {
      const anotherIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'ingredient-id-2',
        name: 'Соус Spicy-X'
      };

      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(anotherIngredient));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].name).toBe(mockIngredient.name);
      expect(state.ingredients[1].name).toBe(anotherIngredient.name);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент из конструктора по id', () => {
      const stateWithIngredient = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      const ingredientId = stateWithIngredient.ingredients[0].id;

      const state = constructorReducer(
        stateWithIngredient,
        removeIngredient(ingredientId)
      );

      expect(state.ingredients).toHaveLength(0);
    });

    it('должен удалять только нужный ингредиент, не трогая остальные', () => {
      const anotherIngredient: TIngredient = {
        ...mockIngredient,
        _id: 'ingredient-id-2',
        name: 'Соус Spicy-X'
      };

      let state = constructorReducer(
        initialState,
        addIngredient(mockIngredient)
      );
      state = constructorReducer(state, addIngredient(anotherIngredient));

      const idToRemove = state.ingredients[0].id;
      state = constructorReducer(state, removeIngredient(idToRemove));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe(anotherIngredient.name);
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент вниз по списку', () => {
      let state = constructorReducer(
        initialState,
        addIngredient({ ...mockIngredient, _id: 'id-1', name: 'Ингредиент 1' })
      );
      state = constructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'id-2', name: 'Ингредиент 2' })
      );
      state = constructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'id-3', name: 'Ингредиент 3' })
      );

      const newState = constructorReducer(
        state,
        moveIngredient({ from: 0, to: 1 })
      );

      expect(newState.ingredients[0].name).toBe('Ингредиент 2');
      expect(newState.ingredients[1].name).toBe('Ингредиент 1');
      expect(newState.ingredients[2].name).toBe('Ингредиент 3');
    });

    it('должен переместить ингредиент вверх по списку', () => {
      let state = constructorReducer(
        initialState,
        addIngredient({ ...mockIngredient, _id: 'id-1', name: 'Ингредиент 1' })
      );
      state = constructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'id-2', name: 'Ингредиент 2' })
      );
      state = constructorReducer(
        state,
        addIngredient({ ...mockIngredient, _id: 'id-3', name: 'Ингредиент 3' })
      );

      const newState = constructorReducer(
        state,
        moveIngredient({ from: 2, to: 0 })
      );

      expect(newState.ingredients[0].name).toBe('Ингредиент 3');
      expect(newState.ingredients[1].name).toBe('Ингредиент 1');
      expect(newState.ingredients[2].name).toBe('Ингредиент 2');
    });
  });

  describe('resetConstructor', () => {
    it('должен очистить конструктор', () => {
      let state = constructorReducer(initialState, addBun(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient));

      const resetState = constructorReducer(state, resetConstructor());

      expect(resetState.bun).toBeNull();
      expect(resetState.ingredients).toHaveLength(0);
    });
  });
});
