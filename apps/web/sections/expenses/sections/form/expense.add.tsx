'use client';

import { useExpenseStore } from '@/utils/expense.store';
import { useAddExpense } from '@rumsan/raman-ui/queries/expense.query';
import { InvoiceType } from '@rumsan/raman/types/enums';
import { Expense as ExpenseType } from '@rumsan/raman/types/expense.type';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ExpenseBase from './expense.form';
import { Expense } from './schema';

const defaultValues: Expense = {
  description: '',
  amount: '',
  currency: 'NPR',
  projectId: '',
  categoryId: '',
  departmentId: '',
  accountId: '',
  vatAmount: 0,
  bankTransferFees: 0,
  attachments: [],
  invoiceType: InvoiceType.ESTIMATE,
  date: new Date(),
};

export default function ExpenseAdd() {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addExpense = useAddExpense();
  const { expense } = useExpenseStore();
  const [fileChoose, setFileChoose] = useState(false);

  const handleAddExpenses = async (data: Expense) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        date: data.date ? new Date(data.date || '').toISOString() : null,
        attachments: files,
      };

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach((file) => {
            if (file instanceof Blob || typeof file === 'string') {
              formData.append(key, file);
            } else {
              console.error('Invalid file type:', file);
            }
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const { success, response } = await addExpense.mutateAsync(formData); // Query execution

      if (success) {
        let exp = response.data as ExpenseType;
        router.push(`/expenses/${exp.cuid}`);
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ExpenseBase
      mode="add"
      defaultValues={defaultValues}
      saveForm={handleAddExpenses}
      files={files}
      setFiles={setFiles}
      isEditing={false}
      isSubmitting={isSubmitting}
      setIsSubmitting={setIsSubmitting}
    />
  );
}
