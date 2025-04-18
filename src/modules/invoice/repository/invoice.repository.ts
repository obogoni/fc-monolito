import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../domain/invoice-item.entity";
import Invoice from "../domain/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {
  async save(input: Invoice): Promise<void> {
    await InvoiceModel.create({
      id: input.id.id,
      name: input.name,
      document: input.document,
      number: input.address.number,
      street: input.address.street,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
      items: input.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }))
    }, {
      include: [{
        model: InvoiceItemModel,
        as: 'items'
      }]
    });
  }

  async find(input: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id: input },
      include: [{
        model: InvoiceItemModel,
        as: 'items'
      }]
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${input} not found.`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode,
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
      items: invoice.items.map((model) => new InvoiceItem(model.price, model.name, new Id(model.id)))
    });
  }
}
