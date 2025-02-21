import AdminLayout from '@/layouts/admin/layout';
import { CategoryList } from '@/sections/category/list';

export default function Page() {
  return (
    <AdminLayout title="Categories">
      <CategoryList />
    </AdminLayout>
  );
}
