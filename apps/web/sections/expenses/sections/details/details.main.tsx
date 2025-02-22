'use client';

import { PATHS } from '@/routes/paths';
import { useWebSocketEvent } from '@raman-ui/core/hooks/webSocketEvent.hook';
import { Expense } from '@rumsan/raman';
import {
  useDeleteAttachment,
  useExpenseById,
  useUploadAttachments,
} from '@rumsan/raman-ui/queries/expense.query';
import { ChevronLeft } from 'lucide-react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { AttachmentCard } from './attachment.card';
import ExpenseDetailCard from './details.card';

type ExpensesDetailsProps = {
  router: AppRouterInstance;
  expenseId: string;
};

export default function ExpensesDetails({
  router,
  expenseId,
}: ExpensesDetailsProps) {
  const formData = new FormData();
  const expenseDetails = useExpenseById(expenseId);
  useWebSocketEvent('expense.upload', expenseDetails.refetch);

  const {
    mutateAsync: uploadAttachments,
    reset,
    isPending: loadingAttachment,
  } = useUploadAttachments();
  const { mutateAsync: deleteAttachmentHandler } = useDeleteAttachment();
  const expense: Expense = expenseDetails?.data as unknown as Expense;

  const handleBackButton = () => {
    router.push(PATHS.EXPENSE.HOME);
  };

  const handleEditButton = () => {
    router.push(`${PATHS.EXPENSE.HOME}/${expenseId}/edit`);
  };

  const addAttachmentHandler = async (files: FileList) => {
    await uploadAttachments({
      cuid: expenseId,
      data: formData,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center my-3">
        <div className="flex items-start gap-1">
          <div className="m-auto items-center justify-center">
            <ChevronLeft
              className="h-8 w-8 cursor-pointer"
              onClick={handleBackButton}
            />
          </div>

          <div className="flex flex-col gap-1 ml-1">
            <h1 className="text-xl font-base font-bold text-gray-900">
              Expense Details
            </h1>
          </div>
        </div>
        <button
          onClick={handleEditButton}
          className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        <ExpenseDetailCard className="col-span-8" expense={expense} />
        <AttachmentCard
          className="col-span-4"
          expense={expense}
          formData={formData}
          addAttachmentHandler={addAttachmentHandler}
          deleteAttachmentHandler={deleteAttachmentHandler}
          loadingState={loadingAttachment}
        />
      </div>
    </div>
  );
}
