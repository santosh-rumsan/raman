'use client';

import AdminLayout from '@/layouts/admin/layout';
import InvoiceDetails from '@/sections/invoices/sections/details/details.main';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };
  return (
    <AdminLayout title="Invoice Details">
      <InvoiceDetails invoiceId={id} />
    </AdminLayout>
  );
}
