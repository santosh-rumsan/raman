'use client';

import { cn, formatCurrency } from '@/utils';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { useProjectGet } from '@rumsan/raman-ui/queries/project.query';
import { Invoice } from '@rumsan/raman/types';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { User } from 'lucide-react';

import { format } from 'date-fns';
import { invoiceStatusColors } from '../list/list.column';

type InvoiceDetailsProps = {
  className: string;
  invoice: Invoice;
};

export default function InvoiceDetailCard({
  className,
  invoice,
}: InvoiceDetailsProps) {
  const { lookupByCuid } = useSelectLookUp();

  const projectData = useProjectGet(invoice?.projectId ?? '');
  const departmentId = projectData?.data?.departmentId;

  return (
    <Card className={cn('relative rounded-lg shadow-sm', className)}>
      <div className="absolute top-6 right-6 z-10">
        <div className="flex flex-col items-end">
          <span className="text-2xl font-bold">
            {invoice?.amount && formatCurrency(invoice?.amount)}
          </span>
          <Label className="text-xs font-normal text-gray-400">
            {invoice?.currency}
          </Label>
        </div>
      </div>
      <CardHeader className="px-6 py-4">
        <div className="flex items-center mb-3">
          <div className="rounded-full border flex flex-col justify-center bg-gray-100 items-center w-[30px] h-[30px]">
            <User className="h-4" strokeWidth={1.75} />
          </div>
          <h5 className="text-base ml-3 text-gray-700">Invoice Details</h5>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="grid grid-cols-2 gap-6 gap-x-6">
          <div>
            <Label className="text-xs font-normal text-gray-400">User</Label>
            <p className="text-black font-normal text-sm">
              {/* Ram Shrestha */}
              {invoice?.userId && lookupByCuid('users', invoice.userId)?.name}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Category
            </Label>
            <p className="text-black font-normal text-sm">
              {invoice?.categoryId &&
                lookupByCuid('categories', invoice.categoryId)?.name}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Invoice Type
            </Label>
            <p className="font-medium bg-gray-100 flex justify-center items-center text-gray-600 text-sm rounded-2xl w-[80px] h-[25px] mt-[3px]">
              {invoice?.invoiceType}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Recorded Date
            </Label>
            <p className="text-black font-normal text-sm">
              {invoice?.date ? format(invoice.date, 'do MMMM, yyyy') : ''}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">Project</Label>
            <p className="text-black font-normal text-sm">
              {invoice?.projectId &&
                lookupByCuid('projects', invoice.projectId)?.name}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Department
            </Label>
            <p className="text-black font-normal text-sm">
              {departmentId && lookupByCuid('departments', departmentId)?.name}
            </p>
          </div>

          <div>
            <Label className="text-xs font-normal text-gray-400">Status</Label>
            <p
              className={`flex space-x-2 h-6 w-[80px] font-normal text-sm items-center justify-center rounded-2xl p-2 ${
                invoiceStatusColors[
                  invoice?.status as keyof typeof invoiceStatusColors
                ]
              }`}
            >
              {invoice?.status}
            </p>
          </div>

          {invoice?.vatAmount ? (
            <>
              <div>
                <Label className="text-xs font-normal text-gray-400">
                  Vat Amount
                </Label>
                <p className="text-black font-normal text-sm">
                  {invoice?.vatAmount}
                </p>
              </div>
            </>
          ) : (
            ''
          )}
        </div>

        <div className="mt-6">
          <Label className="text-xs font-normal text-gray-400">
            Description
          </Label>
          <p className="text-black font-normal text-sm">
            {invoice?.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
