'use client';

import AdminLayout from '@/layouts/admin/layout';
import ExpensesDetails from '@/sections/expenses/sections/details/details.main';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };
  console.log(id);
  return (
    <AdminLayout title="Expense Details">
      <ExpensesDetails expenseId={id} />
    </AdminLayout>
  );
}
