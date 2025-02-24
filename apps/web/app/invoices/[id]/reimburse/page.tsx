'use client';

import AdminLayout from '@/layouts/admin/layout';
import InvoiceReimburse from '@/sections/invoices/sections/form/invoice.reimburse';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };

  return (
    <AdminLayout title="Invoice Details">
      <InvoiceReimburse cuid={id} />
    </AdminLayout>
  );
}
