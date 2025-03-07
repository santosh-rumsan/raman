'use client';

import AdminLayout from '@/layouts/admin/layout';
import ExpenseVerification from '@/sections/expenses/sections/verification';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };
  return (
    <AdminLayout title="Expense Details">
      <ExpenseVerification expenseId={id} />
    </AdminLayout>
  );
}
