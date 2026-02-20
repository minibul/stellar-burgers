import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredients slice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  describe('fetchIngredients.pending', () => {
    it('должен установить isLoading=true и сбросить ошибку', () => {
      const action = fetchIngredients.pending('', undefined);
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('должен установить isLoading=true из состояния с ошибкой', () => {
      const stateWithError = { ...initialState, error: 'Предыдущая ошибка' };
      const action = fetchIngredients.pending('', undefined);
      const state = ingredientsReducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен записать ингредиенты в стор и установить isLoading=false', () => {
      const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(2);
    });

    it('должен сбросить isLoading после загрузки', () => {
      const loadingState = { ...initialState, isLoading: true };
      const action = fetchIngredients.fulfilled(mockIngredients, '', undefined);
      const state = ingredientsReducer(loadingState, action);

      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен записать ошибку и установить isLoading=false', () => {
      const error = new Error('Ошибка загрузки ингредиентов');
      const action = fetchIngredients.rejected(error, '', undefined);
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });

    it('должен использовать дефолтное сообщение, если ошибка без message', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });
  });
});
