import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorItems, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = TConstructorItems;

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: {
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        state.bun = action.payload;
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TIngredient & { id: string }>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;
      const items = [...state.ingredients];
      items.splice(to, 0, items.splice(from, 1)[0]);
      state.ingredients = items;
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;

export const selectConstructorItems = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor;

export const selectConstructorBun = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor.bun;

export const selectConstructorIngredients = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor.ingredients;
