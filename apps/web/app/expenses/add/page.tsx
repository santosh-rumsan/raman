import AdminLayout from '@/layouts/admin/layout';
import ExpenseAdd from '@/sections/expenses/sections/form/expense.add';

export default function Page() {
  return (
    <AdminLayout title="Expenses">
      <ExpenseAdd />
    </AdminLayout>
  );
}
