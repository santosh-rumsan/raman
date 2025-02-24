'use client';

import InvoiceApproval from '@/sections/invoices/sections/approval/invoice.approval';
import { useParams } from 'next/navigation';

export default function Page() {
  const { challenge } = useParams() as { challenge: string };
  return <InvoiceApproval invoiceChallenge={challenge} />;
}
