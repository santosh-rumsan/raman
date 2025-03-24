import { cn, formatCurrency, IconByName } from '@/utils';
import {
  EditableSelectField,
  EditableTextArea,
  EditableTextField,
} from '@rumsan/raman-ui/components/editable-fields';
import { useSelectLookUp } from '@rumsan/raman-ui/hooks/select-lookup.hook';
import { useEditExpense } from '@rumsan/raman-ui/queries/expense.query';
import { ExpenseExtended } from '@rumsan/raman/types';
import { InvoiceType } from '@rumsan/raman/types/enums';
import {
  Card,
  CardContent,
  CardHeader,
} from '@rumsan/shadcn-ui/components/card';
import { Label } from '@rumsan/shadcn-ui/components/label';
import { useToast } from '@rumsan/shadcn-ui/hooks/use-toast';
import { CheckCircle, FileQuestion, XCircle } from 'lucide-react';

export default function ExpenseDetailCard({
  className,
  expense,
}: {
  className?: string;
  expense: ExpenseExtended;
}) {
  const { toast } = useToast();
  const { lookupByCuid, accounts, categories, departments, projects, users } =
    useSelectLookUp();
  const editExpense = useEditExpense();
  const iconColor =
    expense?.isVerified && expense?.isReconciled
      ? 'text-green-600'
      : expense?.isVerified || expense?.isReconciled
        ? 'text-yellow-600'
        : 'text-red-600';
  const category = lookupByCuid('categories', expense?.categoryId);

  const handleUpdateField = async <T = string,>(field: string, value: T) => {
    try {
      const { success } = await editExpense.mutateAsync({
        id: expense.cuid,
        data: { [field]: value },
      });
      if (success) {
        toast({
          variant: 'success',
          title: 'Success',
          description: `${field} updated successfully`,
        });
      }
    } catch (error) {
      console.error('Failed to update field:', error);
    }
  };

  return (
    <Card className={cn('relative rounded-lg shadow-sm', className)}>
      {/* <div className="absolute top-6 right-6 z-10 grid grid-cols-1 gap-2"></div> */}

      <CardHeader className="grid gap-2">
        <div className="flex items-center mb-3 col-span-8">
          <div className="flex items-center w-full">
            <div className="rounded-full border flex justify-center items-center bg-gray-100 w-[30px] h-[30px]">
              <IconByName
                name={category?.meta?.icon}
                defaultIcon="HandCoins"
                className={cn(iconColor, 'h-4 w-4')}
                strokeWidth={2.5}
              />
            </div>
            <EditableTextField
              value={expense?.description || ''}
              onSave={(value: string) =>
                handleUpdateField('description', value)
              }
              className="ml-2 text-lg w-4/5 max-w-[600px]"
              isEditable={!expense?.isVerified}
            />
          </div>
          <div className=" col-span-4 text-right">
            <div className="flex flex-col items-end">
              <span className="text-2xl font-bold">
                {expense?.amount && formatCurrency(expense?.amount)}
              </span>
              <Label className="text-xs font-normal text-gray-400">
                {expense?.currency}
              </Label>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="grid grid-cols-2 gap-6 gap-x-6">
          <EditableSelectField
            label="Payment Account"
            value={expense?.accountId || ''}
            options={accounts}
            onSave={(value: string) => handleUpdateField('accountId', value)}
            isEditable={!expense?.isVerified && !expense?.isReconciled}
          />

          <EditableSelectField
            label="Category"
            value={expense?.categoryId || ''}
            options={categories}
            onSave={(value: string) => handleUpdateField('categoryId', value)}
            isEditable={!expense?.isVerified}
          />

          <EditableSelectField
            label="Department"
            value={expense?.departmentId || ''}
            options={departments}
            onSave={(value: string) => handleUpdateField('departmentId', value)}
            isEditable={!expense?.isVerified}
          />

          <EditableSelectField
            label="Project"
            value={expense?.projectId || ''}
            options={projects}
            onSave={(value: string) => handleUpdateField('projectId', value)}
            isEditable={!expense?.isVerified}
          />

          <EditableSelectField
            label="Invoice Type"
            value={expense?.invoiceType || ''}
            options={Object.values(InvoiceType).map((type) => ({
              label: type,
              value: type,
            }))}
            onSave={(value: string) => handleUpdateField('invoiceType', value)}
            isEditable={!expense?.isVerified}
          />

          <div>
            <Label className="text-xs font-normal text-gray-400">
              Reconcilation Status
            </Label>
            <p className="text-black font-normal text-sm flex items-center">
              {expense?.isReconciled ? (
                <>
                  <CheckCircle
                    strokeWidth={2.5}
                    className="text-green-600 h-4 mr-1"
                  />
                  Reconciled
                </>
              ) : (
                <>
                  <FileQuestion
                    strokeWidth={2.5}
                    className="text-amber-600 h-4 mr-1"
                  />
                  Not Reconciled
                </>
              )}
            </p>
          </div>
          <div>
            <Label className="text-xs font-normal text-gray-400">
              Verification
            </Label>
            <p className="text-black font-normal text-sm flex items-center">
              {expense?.isVerified ? (
                <>
                  <CheckCircle
                    strokeWidth={2.5}
                    className="text-green-600 h-4 mr-1"
                  />
                  Verified
                </>
              ) : (
                <>
                  <XCircle
                    strokeWidth={2.5}
                    className="text-red-600 h-4 mr-1"
                  />
                  Unverified
                </>
              )}
            </p>
          </div>
          <div>
            <Label className="text-xs font-normal text-gray-400">
              Verified By
            </Label>
            {expense?.isVerified ? (
              <EditableSelectField
                value={expense?.verificationDetails?.verifiedBy || ''}
                options={users}
                onSave={(value: string) =>
                  handleUpdateField('verificationDetails.verifiedBy', value)
                }
                isEditable={false}
              />
            ) : (
              <p className="text-black font-normal text-sm">Not verified yet</p>
            )}
          </div>

          <EditableTextField
            label="VAT Amount"
            value={expense?.vatAmount || 0}
            type="number"
            onSave={(value: string) =>
              handleUpdateField<Number>('vatAmount', Number(value) || 0)
            }
            isEditable={!expense?.isVerified}
          />

          <EditableTextField
            label="Bank Transfer Fees"
            value={expense?.bankTransferFees || 0}
            type="number"
            onSave={(value: string) =>
              handleUpdateField<Number>('bankTransferFees', Number(value) || 0)
            }
            isEditable={!expense?.isVerified}
          />
        </div>

        <div className="mt-6">
          <EditableTextArea
            label="Remarks"
            value={expense?.remarks || ''}
            onSave={(value: string) => handleUpdateField('remarks', value)}
            isEditable={!expense?.isVerified}
          />
        </div>
      </CardContent>
    </Card>
  );
}
