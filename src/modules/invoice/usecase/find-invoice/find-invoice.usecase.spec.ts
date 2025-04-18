import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import InvoiceItem from "../../domain/invoice-item.entity";
import Invoice from "../../domain/invoice.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "123456789",
  address: new Address("Street 1", "123", "Apt 1", "City 1", "State 1", "12345"),
  items: [new InvoiceItem(100, "Item 1", new Id("1"))],
  createdAt: new Date(),
  updatedAt: new Date(),
});

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    save: jest.fn()
  };
};

describe("find an invoice usecase unit test", () => {
  it("should find an invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Invoice 1");
    expect(result.document).toBe("123456789");
    expect(result.address.street).toBe("Street 1");
    expect(result.address.number).toBe("123");
    expect(result.address.complement).toBe("Apt 1");
    expect(result.address.city).toBe("City 1");
    expect(result.address.state).toBe("State 1");
    expect(result.address.zipCode).toBe("12345");
    expect(result.items.length).toBe(1);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Item 1");
    expect(result.items[0].price).toBe(100);
    expect(result.total).toBe(100);
  });
});
