import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/facade.factory";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("InvoiceFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const invoiceFacade = InvoiceFacadeFactory.create();
    const input = {
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

    const result = await invoiceFacade.generateInvoice(input);

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
    expect(result.total).toBe(300);
  });

  it("should find an invoice", async () => {

    //Arrange

    const invoiceFacade = InvoiceFacadeFactory.create();

    await InvoiceModel.create({
      id: "1",
      name: "Test Invoice",
      document: "123456789",
      number: "1",
      street: "Street",
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "12345",
      createdAt: Date(),
      updatedAt: Date(),
      items: [{
        id: "1",
        invoiceId: "1",
        name: "Invoice item",
        price: 100,
        createdAt: Date(),
        updatedAt: Date()
      }]
    }, {
      include: [{
        model: InvoiceItemModel,
        as: 'items'
      }]
    });


    const input = {
      id: "1",
    };

    //Act
    const result = await invoiceFacade.findInvoice(input);

    //Assert
    expect(result).toBeDefined();
    expect(result.id).toBe(input.id);
    expect(result.name).toBe("Test Invoice");
    expect(result.document).toBe("123456789");
    expect(result.address.street).toBe("Street");
    expect(result.address.number).toBe("1");
    expect(result.address.complement).toBe("Complement");
    expect(result.address.city).toBe("City");
    expect(result.address.state).toBe("State");
    expect(result.address.zipCode).toBe("12345");
    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Invoice item");
    expect(result.items[0].price).toBe(100);
  });
});
