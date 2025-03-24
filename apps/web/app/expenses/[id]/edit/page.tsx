'use client';

import AdminLayout from '@/layouts/admin/layout';
import { ExpenseEdit } from '@/sections/expenses/sections/form/expense.edit';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };
  return (
    <AdminLayout title="Expense Details">
      <ExpenseEdit expenseId={id} />
    </AdminLayout>
  );
}
