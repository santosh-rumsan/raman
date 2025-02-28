'use client';

import AdminLayout from '@/layouts/admin/layout';
import { AccountTxnList } from '@/sections/account-txn/list';
import { useParams } from 'next/navigation';

export default function Page() {
  const { id } = useParams() as { id: string };
  return (
    <AdminLayout title="Account Transactions">
      <AccountTxnList accountId={id} />
    </AdminLayout>
  );
}
