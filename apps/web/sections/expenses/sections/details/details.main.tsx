'use client';

import { useWebSocketEvent } from '@/hooks/ws-event.hook';
import { PATHS } from '@/routes/paths';
import {
  useDeleteAttachment,
  useExpenseById,
  useUploadAttachments,
} from '@rumsan/raman-ui/queries/expense.query';
import { Expense } from '@rumsan/raman/types';
import { useRouter } from 'next/navigation';
import { AttachmentCard } from './attachment.card';
import ExpenseDetailCard from './details.card';

type ExpensesDetailsProps = {
  expenseId: string;
};

export default function ExpensesDetails({ expenseId }: ExpensesDetailsProps) {
  const router = useRouter();
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
    <div className="px-6">
      <div className="flex justify-between items-center">
        <div className="flex items-start gap-1"></div>
        <button
          onClick={handleEditButton}
          className="bg-blue-500 text-white text-sm px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit Expense
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-4">
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
