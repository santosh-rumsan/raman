import AdminLayout from '@/layouts/admin/layout';
import { ProjectList } from '@/sections/projects/list/main';

export default function Page() {
  return (
    <AdminLayout title="Projects">
      <ProjectList />
    </AdminLayout>
  );
}
