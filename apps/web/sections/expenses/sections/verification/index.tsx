import { useExpenseById } from '@rumsan/raman-ui/queries/expense.query';
import { Expense } from '@rumsan/raman/types';
import PdfViewerCard from './verify.attachment';
import ExpenseVerificationDetails from './verify.details';

export default function ExpenseVerificationCard(props: { expenseId: string }) {
  const expenseDetails = useExpenseById(props.expenseId);
  const expense: Expense = expenseDetails?.data as unknown as Expense;

  return (
    <div className="grid grid-cols-4 gap-6 px-6 h-screen">
      <ExpenseVerificationDetails
        className="col-span-1 sticky top-4 self-start"
        expense={expense}
      />
      <div className="col-span-3 flex flex-col gap-4 overflow-y-auto">
        <PdfViewerCard expense={expense} />
      </div>
    </div>
  );
}
