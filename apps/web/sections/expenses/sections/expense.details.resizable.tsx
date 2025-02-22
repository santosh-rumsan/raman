import { useExpenseStore } from '@/utils/expense.store';
import { Button } from '@rumsan/shadcn-ui/components/button';
import { ArchiveRestore, History, Pencil, X } from 'lucide-react';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import ExpenseDetailsTabs from './expense.detail.tab';

// import Image from "next/image";

interface ExpenseResizeableRowDetailProps {
  selectedRow: any;
  setSelectedRow: any;
  onEditComplete: any;
}

const ExpenseResizeableRowDetail: FC<ExpenseResizeableRowDetailProps> = ({
  selectedRow,
  setSelectedRow,
  onEditComplete,
}) => {
  const { setExpense } = useExpenseStore();
  useEffect(() => {
    if (selectedRow) {
      setExpense(selectedRow);
    }
  }, [selectedRow]);

  return (
    <>
      <div className="flex">
        <div className="mt-2 ml-4 rounded-full flex justify-center items-center w-[35px] h-[35px] hover:bg-[#FCEEEE] cursor-pointer">
          <ArchiveRestore color="#D92626" strokeWidth={1.5} size={20} />
        </div>
        <Link href={`/expenses/${selectedRow.id}/edit`}>
          <div className="mt-2  rounded-full flex justify-center hover:bg-[#EEF4FC] items-center w-[35px] h-[35px] cursor-pointer">
            <Pencil color="#297AD6" strokeWidth={1.5} size={20} />
          </div>
        </Link>
        <div className="mt-2 rounded-full flex justify-center hover:bg-[#F5F5F5] items-center w-[35px] h-[35px] cursor-pointer">
          <History color="#676798" strokeWidth={1.5} size={20} />
        </div>

        <div className="flex space-x-2 mt-2 ml-auto">
          <Button
            className="hover:bg-transparent focus:ring-0 active:bg-transparent"
            variant="ghost"
            onClick={() => {
              setSelectedRow(null);
            }}
          >
            <X color="#000000" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      <hr className="w-full mt-2" />
      <div className="py-4 text-center">
        <ExpenseDetailsTabs data={selectedRow} />
      </div>
    </>
  );
};

export default ExpenseResizeableRowDetail;
