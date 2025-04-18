import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import { GenerateInvoiceInputDto } from "./generate-invoice.dto";

const MockRepository = () => {
  return {
    save: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate Invoice usecase unit test", () => {
  it("should generate an invoice", async () => {

    //Arrange
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const input: GenerateInvoiceInputDto = {
      name: "Test Invoice",
      document: "123456789",
      street: "Street",
      number: "1",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "ZipCode",
      items: [
        { id: "1", name: "Item 1", price: 100 },
        { id: "2", name: "Item 2", price: 200 },
      ],
    };

    //Act
    const result = await usecase.execute(input);

    //Assert
    expect(invoiceRepository.save).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items).toHaveLength(input.items.length);
    expect(result.items[0].name).toBe(input.items[0].name);
    expect(result.items[0].price).toBe(input.items[0].price);
    expect(result.items[1].name).toBe(input.items[1].name);
    expect(result.items[1].price).toBe(input.items[1].price);
    expect(result.total).toBe(300); // Sum of item prices
  });
});
