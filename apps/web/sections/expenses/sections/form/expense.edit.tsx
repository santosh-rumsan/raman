import {
  useEditExpense,
  useExpenseById,
} from '@rumsan/raman-ui/queries/expense.query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ExpenseBase from './expense.form';
import { Expense } from './schema';

type ExpenseEditProps = {
  expenseId: string;
};

export function ExpenseEdit({ expenseId }: ExpenseEditProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing expense details
  const getExpenseDetail = useExpenseById(expenseId);
  const existingExpense = getExpenseDetail?.data as unknown as Expense;
  if (existingExpense)
    existingExpense.date = new Date(existingExpense?.date || '');

  // Mutation to update the expense
  const updateExpense = useEditExpense();

  const handleUpdateExpense = async (data: Expense) => {
    try {
      const payload = {
        ...data,
        date: data.date ? new Date(data.date || '').toISOString() : null,
      };

      await updateExpense.mutateAsync({ id: expenseId, data: payload });
      router.push(`/expenses/${expenseId}`);
    } catch (error) {
      console.error('Failed to update expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (getExpenseDetail.isLoading) {
    return <div>Loading...</div>;
  }

  if (getExpenseDetail.isError) {
    return <div>Failed to load expense details</div>;
  }

  return (
    <ExpenseBase
      mode="edit"
      defaultValues={existingExpense}
      saveForm={handleUpdateExpense}
      isEditing={true}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
      expenseId={expenseId}
    />
  );
}
