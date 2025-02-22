import AdminLayout from '@/layouts/admin/layout';
import { ExpenseList } from '@/sections/expenses/sections/list';

export default function Page() {
  return (
    <AdminLayout title="Categories">
      <ExpenseList />
    </AdminLayout>
  );
}
