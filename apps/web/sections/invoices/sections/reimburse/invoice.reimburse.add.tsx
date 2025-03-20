// 'use client';

// import { Button } from '@rumsan/shadcn-ui/components/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@rumsan/shadcn-ui/components/card';
// import { PATHS } from '@/routes/paths';
// import {
//   useGetInvoice,
//   useInvoiceReimburse,
// } from '@rumsan/raman-ui/queries/invoice.query';
// import { Loader2, Receipt } from 'lucide-react';
// import { useState } from 'react';
// import { InvoiceForm } from '../form/invoice.form';

// type InvoiceReimburseProps = {
//   router: any;
//   invoiceId: string;
// };

// export default function InvoiceReimburse({
//   router,
//   invoiceId,
// }: InvoiceReimburseProps) {
//   const invoiceData = useGetInvoice(invoiceId);
//   const invoiceDetails = invoiceData?.data?.data;

//   if (invoiceDetails)
//     invoiceDetails.date = new Date(invoiceDetails?.date || '');

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [files, setFiles] = useState<File[]>([]);

//   const { mutateAsync } = useInvoiceReimburse();

//   const handleInvoiceSubmit = async (data: any) => {
//     setIsSubmitting(true);
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       const payload = {
//         amount: Number(data.amount),
//         categoryId: data.categoryId,
//         description: data.description,
//         projectId: data.projectId,
//         status: 'REIMBURSED',
//         userId: data.userId,
//         invoiceType: data.invoiceType,
//         currency: data.currency,
//         remarks: data.remarks,
//         vatAmount: data.vatAmount,
//         date: data.date,
//         reimbursedDate: data.reimbursedDate,
//         reimbursedRemarks: data.reimbursedRemarks,
//         accountId: data.accountId,
//       };
//       await mutateAsync({ id: invoiceId, data: payload });
//       router.push(PATHS.RECEIPT.DETAIL(invoiceId));
//     } catch (error) {
//       console.error('Error reimbursing invoice:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBackButton = (e: React.MouseEvent<HTMLButtonElement>) => {
//     router.push(PATHS.RECEIPT.DETAIL(invoiceId));
//   };

//   return (
//     <div>
//       <Card className="rounded-lg w-full max-w-4xl mx-auto mt-8 mb-8">
//         <CardHeader>
//           <CardTitle className="flex">
//             <div className="rounded-full border flex flex-col justify-center bg-gray-100 items-center w-[30px] h-[30px]">
//               <Receipt className="h-4" strokeWidth={1.75} />
//             </div>
//             <div className="ml-2 font-bold text-xl">Invoice Reimburse</div>
//           </CardTitle>
//           <CardDescription className="text-base text-sm ml-10">
//             Reimburse the invoice details
//           </CardDescription>
//           <CardContent></CardContent>
//         </CardHeader>
//         <hr className="w-full" />

//         <CardContent className="p-0">
//           <InvoiceForm
//             mode="reimburse"
//             defaultValues={{
//               ...invoiceDetails,
//               accountId: '',
//               reimbursedDate: new Date(),
//               reimbursedRemarks: '',
//             }}
//             files={files}
//             setFiles={setFiles}
//             saveForm={handleInvoiceSubmit}
//             isEditing={true}
//             invoiceDetails={invoiceDetails}
//           >
//             <>
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="mr-2 w-[170px]"
//                 onClick={() => handleBackButton}
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="default"
//                 className="w-[170px] flex justify-center items-center gap-2"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="animate-spin h-5 w-5 text-white" />
//                     <span>Reimbursing....</span>
//                   </>
//                 ) : (
//                   'Reimburse'
//                 )}
//               </Button>
//             </>
//           </InvoiceForm>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
