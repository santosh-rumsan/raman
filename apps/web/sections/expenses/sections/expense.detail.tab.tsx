import { useDepartmentGet } from '@rumsan/raman-ui/queries/department.query';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rumsan/shadcn-ui/components/tabs';
import { FC } from 'react';
import PersonalExpenseDetails from './expense.personal.tab';
interface ExpenseDetailsTabsProps {
  data: any;
}

const ExpenseDetailsTabs: FC<ExpenseDetailsTabsProps> = ({ data }) => {
  const departmentName = useDepartmentGet(data?.departmentId);

  const numberOfAttachment = data?.attachments?.length;
  const handleImageClick = (attachment: string) => {
    if (attachment) {
      const imageUrl = `${attachment}`;
      window.open(imageUrl, '_blank');
    }
  };
  return (
    <Tabs defaultValue="personaldetail" className="w-auto">
      <div className="p-2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger
            value="personaldetail"
            className="text-sm font-[500] tracking-wide"
          >
            Personal Details
          </TabsTrigger>
          <TabsTrigger
            value="attachments"
            className="text-sm font-[500] tracking-wide"
          >
            Attachments
            <span className="text-sm bg-blue-100 text-blue-600 rounded-full px-2 ml-2">
              {numberOfAttachment > 0 ? numberOfAttachment : 0}
            </span>
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="personaldetail">
        <div className="py-2">
          <PersonalExpenseDetails
            expenseTitle={data?.description}
            paymentForm={data?.accountId}
            billType={data?.source}
            vatAmount={data?.vatAmount}
            category={data?.Category?.name}
            isPending={data?.isPending}
            department={departmentName?.data?.name || ''}
            project={data?.Project?.name}
            //billType="Bill Type Demo"
            remarks={data?.remarks}
          />
        </div>
      </TabsContent>
      <TabsContent value="attachments">
        <div className="py-2 px-4">
          <div className="mt-2 grid grid-cols-2 gap-2">
            {data?.attachments?.map((attachment: any, index: number) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg p-4"
              >
                <div className="flex flex-col items-center justify-center bg-stone-300 h-36 rounded-lg mb-2">
                  <div className="bg-gray-100 rounded-full p-4">
                    {/* <Image
                      strokeWidth={1.5}
                      className="w-5 h-5 text-stone-500"
                    /> */}
                    <a
                      href="#"
                      onClick={() => handleImageClick(attachment)}
                      className="font-light  flex flex-col text-base underline hover:text-blue-500  "
                    >
                      {`File ${index + 1}`}
                    </a>
                  </div>
                </div>
                {/* <span className="mt-2 text-xs font-[600] text-gray-600 mr-auto flex mb-2">
                  file
                </span> */}
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ExpenseDetailsTabs;
