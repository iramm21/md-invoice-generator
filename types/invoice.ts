export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceMeta = {
  clientName: string;
  clientEmail: string;
  discount: number; // as percentage
  taxRate: number; // as percentage
  companyLogoUrl: string;
};

export type InvoiceFormData = {
  title: string;
  clientName: string;
  clientEmail?: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes?: string;
};
