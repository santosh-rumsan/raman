import { useAccountByUuid } from '@rumsan/raman-ui/queries/account.query';
import {
  Banknote,
  Folder,
  Landmark,
  Layers,
  NotepadText,
  ReceiptText,
} from 'lucide-react';

interface PersonalExpenseDetailsProps {
  expenseTitle: string;
  paymentForm: string;
  isPending: boolean;
  // type: string;
  category: string;
  department: string;
  project: string;
  billType: string;
  vatAmount: number;
  remarks: string;
}

const PersonalExpenseDetails: React.FC<PersonalExpenseDetailsProps> = ({
  expenseTitle,
  paymentForm,

  category,
  isPending,

  project,
  billType,
  vatAmount,
  department,
  remarks,
}) => {
  const findAccount = useAccountByUuid(paymentForm);

  const statusColor = isPending
    ? 'bg-red-100 text-red-600'
    : 'bg-green-100 text-green-600';
  const statusText = isPending ? 'Unpaid' : 'Paid';
  //const typeStatus = type === 'Expense' ? 'Expense' : 'Income';

  return (
    <div className="space-y-2">
      <div className="flex items-center px-4">
        <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
          <Banknote strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col ml-4 tracking-wide">
          <span className="font-normal text-sm text-left mb-1">
            Expense Title
          </span>
          <span className="text-gray-800 text-[12px] text-left">
            {expenseTitle}
          </span>
          <span className="text-green-500 text-[12px] text-left">
            {expenseTitle}
          </span>
        </div>
        <div className="flex flex-col">
          <span
            className={`bg-green-100 flex justify-center items-center font-medium text-green-600 text-xs rounded-2xl w-[55px] mt-[3px] ml-2 p-1 ${statusColor}`}
          >
            {statusText}
          </span>
        </div>
      </div>
      <hr className="w-full" />
      <div className="flex items-center px-4">
        <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
          <Landmark strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col ml-4 tracking-wide">
          <span className="font-normal text-sm text-left mb-1">
            Payment From
          </span>
          <span className="text-gray-600 text-[12px] text-left">
            {findAccount?.data?.name || ''}
          </span>
        </div>
      </div>

      <hr className="w-full" />
      <div className="flex items-center px-4">
        <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
          <Landmark strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col ml-4 tracking-wide">
          <span className="font-normal text-sm text-left mb-1">Type</span>
          <span
            className={`bg-gray-100 flex justify-center items-center text-black-700 text-sm rounded-2xl w-[95px] font-medium mt-[3px] p-1 ${'Income'}`}
          >
            {'default value'}
          </span>
        </div>
      </div>

      <hr className="w-full" />
      <div className="flex items-center px-4">
        <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
          <Layers strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col ml-4 tracking-wide">
          <span className="font-normal text-sm text-left mb-1">Category</span>
          <span className="text-gray-600 text-[12px] text-left">
            {category || ''}
          </span>
        </div>
      </div>

      {/* <hr className="w-full" />
      <div className="flex items-center px-4">
        <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
          <LayoutTemplate strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col ml-4 tarcking-wide">
          <span className="text-xs font-[600] mr-auto mb-1">Department</span>
          <span className="text-[12px]">{department}</span>
        </div>
      </div> */}

      <hr className="w-full" />
      <div className="flex items-center px-4">
        <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
          <Folder strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col ml-4 tracking-wide">
          <span className="text-sm font-normal text-left mb-1">Project</span>
          <span className="text-gray-600 text-[12px] text-left">
            {project || ''}
          </span>
        </div>
      </div>

      {department && (
        <>
          <hr className="w-full" />
          <div className="flex items-center px-4">
            <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
              <Folder strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex flex-col ml-4 tracking-wide">
              <span className="text-sm font-normal text-left mb-1">
                Department
              </span>
              <span className="text-gray-600 text-[12px] text-left">
                {department || ''}
              </span>
            </div>
          </div>
        </>
      )}

      <hr className="w-full" />
      <div className="flex items-center px-4">
        <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
          <ReceiptText strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col ml-4 tarcking-wide">
          <span className="text-sm font-normal text-left mb-1">
            Invoice Type
          </span>
          <span className="text-gray-600 text-[12px] text-left">
            {billType || ''}
          </span>
        </div>
      </div>

      {vatAmount > 0 && (
        <>
          <hr className="w-full" />
          <div className="flex items-center px-4">
            <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
              <ReceiptText
                strokeWidth={1.5}
                className="w-5 h-5 text-gray-600"
              />
            </div>
            <div className="flex flex-col ml-4 tarcking-wide">
              <span className="text-sm font-normal text-left mb-1">
                VAT Amount
              </span>
              <span className="text-gray-600 text-[12px] text-left">
                {vatAmount || ''}
              </span>
            </div>
          </div>
        </>
      )}

      <hr className="w-full" />
      <div className="flex items-center px-4">
        <div className="rounded-full flex justify-center items-center w-[40px] h-[40px] ">
          <NotepadText strokeWidth={1.5} className="w-5 h-5 text-gray-600" />
        </div>
        <div className="flex flex-col ml-4 tarcking-wide">
          <span className="text-sm font-normal text-left mb-1">Remarks</span>
          <span className="text-gray-600 text-[12px] text-left">
            {remarks || ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PersonalExpenseDetails;
