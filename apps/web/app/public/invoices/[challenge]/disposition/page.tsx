'use client';

import { InvoiceDisposition } from '@/sections/invoices/sections/approval/invoice.disposition';
import { useParams } from 'next/navigation';

export default function Page() {
  const { challenge } = useParams() as { challenge: string };

  return <InvoiceDisposition approvalChallenge={challenge} />;
}
