export type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
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
