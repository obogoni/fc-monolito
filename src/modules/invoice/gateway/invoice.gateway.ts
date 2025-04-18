import Invoice from "../domain/invoice.entity";

export default interface InvoiceGateway {
  save(input: Invoice): Promise<void>;
  find(input: string): Promise<Invoice>;
}
