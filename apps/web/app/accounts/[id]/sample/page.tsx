'use client';

import AdminLayout from '@/layouts/admin/layout';
import { SampleDataTable } from '@/sections/account-txn/list/sample';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };
  return (
    <AdminLayout title="Account Transactions">
      <SampleDataTable />
    </AdminLayout>
  );
}
