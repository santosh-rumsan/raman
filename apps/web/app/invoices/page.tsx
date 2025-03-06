import AdminLayout from '@/layouts/admin/layout';
import { InvoiceList } from '@/sections/invoices/sections/list';

export default function Page() {
  return (
    <AdminLayout title="Invoices & Receipts">
      <InvoiceList />
    </AdminLayout>
  );
}
