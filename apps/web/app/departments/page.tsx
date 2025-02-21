import AdminLayout from '@/layouts/admin/layout';
import { DepartmentList } from '@/sections/deparment/list';

export default function Page() {
  return (
    <AdminLayout title="Departments">
      <DepartmentList />
    </AdminLayout>
  );
}
