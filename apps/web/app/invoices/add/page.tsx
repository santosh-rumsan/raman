import AdminLayout from '@/layouts/admin/layout';
import InvoiceAddForm from '@/sections/invoices/sections/form/invoice.add';

export default function Page() {
  return (
    <AdminLayout title="Invoices & Receipts">
      <InvoiceAddForm />
    </AdminLayout>
  );
}
