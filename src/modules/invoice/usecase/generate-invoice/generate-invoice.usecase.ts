import Address from "../../../@shared/domain/value-object/address";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceInputDto, GenerateInvoiceOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase {
  constructor(private readonly invoiceRepository: InvoiceGateway) { }

  async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto> {

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address(input.street, input.number, input.complement, input.city, input.state, input.zipCode),
      items: input.items.map(item => new InvoiceItem(item.price, item.name)),
    });

    await this.invoiceRepository.save(invoice);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map(item => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.total,
    };
  }
}
