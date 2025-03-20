import AdminLayout from '@/layouts/admin/layout';
import { ReceiptList } from '@/sections/invoices/sections/list';

export default function Page() {
  return (
    <AdminLayout title="Receipts">
      <ReceiptList />
    </AdminLayout>
  );
}
