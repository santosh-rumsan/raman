import AdminLayout from '@/layouts/admin/layout';
import { InvoiceList } from '@/sections/invoices/sections/list/main';

export default function Page() {
  return (
    <AdminLayout title="Categories">
      <InvoiceList />
    </AdminLayout>
  );
}
