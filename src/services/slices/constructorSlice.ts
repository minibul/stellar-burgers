import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorItems, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TConstructorState = TConstructorItems;

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = { ...action.payload, id: uuidv4() };
    },
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredients.push({ ...action.payload, id: uuidv4() });
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
