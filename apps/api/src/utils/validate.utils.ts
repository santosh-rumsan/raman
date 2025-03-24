import { InvoiceType } from '@rumsan/raman/types/enums';

export const validateVAT = (
  vatAmount: number = 0,
  totalAmount: number = 0,
  invoiceType: InvoiceType,
): boolean => {
  if (invoiceType !== InvoiceType.VAT) {
    if (vatAmount !== 0) {
      throw new Error('VAT amount must be 0 if invoiceType is not VAT.');
    }
    return true;
  }
  if (vatAmount <= 0) {
    throw new Error('VAT amount must be greater than 0 if invoiceType is VAT.');
  }
  if (vatAmount > totalAmount) {
    throw new Error('Total amount must be larger than VAT.');
  }
  return false;
};

export const validateBankTransferFees = (
  bankTransferFees: number,
  totalAmount: number,
): boolean => {
  if (bankTransferFees < 0)
    throw new Error('Bank transfer fees must be greater than or equal to 0.');
  if (bankTransferFees === 0) return true;
  if (bankTransferFees > 0 && bankTransferFees < totalAmount) {
    return true;
  }
  throw new Error('Total amount must be larger than bank transfer fees.');
};

export const validateVATandBankTransferFees = (
  vatAmount: number = 0,
  totalAmount: number = 0,
  invoiceType: InvoiceType,
  bankTransferFees: number = 0,
) => {
  validateVAT(vatAmount, totalAmount, invoiceType);
  validateBankTransferFees(bankTransferFees, totalAmount);
};
