import AdminLayout from '@/layouts/admin/layout';
import { SampleGrid } from '@/sections/grid';

export default function Page() {
  return (
    <AdminLayout title="Sample Grid">
      <div>
        <SampleGrid />
      </div>
    </AdminLayout>
  );
}
