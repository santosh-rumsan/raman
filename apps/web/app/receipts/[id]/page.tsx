'use client';

import AdminLayout from '@/layouts/admin/layout';
import ReceiptDetails from '@/sections/invoices/sections/details';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };
  return (
    <AdminLayout title="Receipt Details">
      <ReceiptDetails receiptId={id} />
    </AdminLayout>
  );
}
