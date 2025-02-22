import { Expense } from '@rumsan/raman/types';
import { createZustandStore } from '@rumsan/react-query';

export type ExpenseStateType = {
  expense: Expense | null;
};

type ExpenseActionsType = {
  setExpense: (expense: Expense) => void;
};

export type ExpenseStoreType = ExpenseStateType & ExpenseActionsType;

export const useExpenseStore = createZustandStore<ExpenseStoreType>((set) => ({
  expense: null,

  setExpense: (expense: Expense) => {
    set(() => ({ expense }));
  },
}));
