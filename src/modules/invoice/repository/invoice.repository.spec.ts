import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address";
import Invoice from "../domain/invoice.entity";
import InvoiceItem from "../domain/invoice-item.entity";
import InvoiceModel from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceItemModel from "./invoice-item.model";

describe("InvoiceRepository test", () => {
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

  it("should save an invoice", async () => {
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Test Invoice",
      document: "123456789",
      address: new Address("Street", "1", "Complement", "City", "State", "ZipCode"),
      items: [new InvoiceItem(100, "Item 1", new Id("1"))],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new InvoiceRepository();
    await repository.save(invoice);

    const savedInvoice = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [{ all: true }]
    });

    expect(savedInvoice).toBeDefined();
    expect(savedInvoice.name).toBe(invoice.name);
    expect(savedInvoice.document).toBe(invoice.document);
    expect(savedInvoice.street).toBe(invoice.address.street);
    expect(savedInvoice.number).toBe(invoice.address.number);
    expect(savedInvoice.complement).toBe(invoice.address.complement);
    expect(savedInvoice.city).toBe(invoice.address.city);
    expect(savedInvoice.state).toBe(invoice.address.state);
    expect(savedInvoice.zipCode).toBe(invoice.address.zipCode);

    expect(savedInvoice.items).toHaveLength(invoice.items.length);
    expect(savedInvoice.items[0].id).toBe(invoice.items[0].id.id);
    expect(savedInvoice.items[0].name).toBe(invoice.items[0].name);
    expect(savedInvoice.items[0].price).toBe(invoice.items[0].price);
  });

  it("should find an invoice", async () => {

    //Arrange
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Test Invoice",
      document: "123456789",
      address: new Address("Street", "1", "Complement", "City", "State", "ZipCode"),
      items: [new InvoiceItem(100, "Item 1", new Id("1"))],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repository = new InvoiceRepository();
    await repository.save(invoice);

    //Act
    const foundInvoice = await repository.find("1");

    //Assert
    expect(foundInvoice).toBeDefined();
    expect(foundInvoice.name).toBe(invoice.name);
    expect(foundInvoice.document).toBe(invoice.document);
    expect(foundInvoice.address.street).toBe(invoice.address.street);
    expect(foundInvoice.address.number).toBe(invoice.address.number);
    expect(foundInvoice.address.complement).toBe(invoice.address.complement);
    expect(foundInvoice.address.city).toBe(invoice.address.city);
    expect(foundInvoice.address.state).toBe(invoice.address.state);
    expect(foundInvoice.address.zipCode).toBe(invoice.address.zipCode);

    expect(foundInvoice.items).toHaveLength(invoice.items.length);
    expect(foundInvoice.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(foundInvoice.items[0].name).toBe(invoice.items[0].name);
    expect(foundInvoice.items[0].price).toBe(invoice.items[0].price);

    expect(foundInvoice.createdAt).toEqual(invoice.createdAt);
    expect(foundInvoice.updatedAt).toEqual(invoice.updatedAt);
  });
});

