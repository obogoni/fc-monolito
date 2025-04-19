import { app, sequelize } from "../express";
import request from "supertest";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";

describe("E2E test for invoices", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find an invoice", async () => {
    const invoiceId = "1";

    await InvoiceModel.create(
      {
        id: invoiceId,
        name: "João",
        document: "000",
        street: "Rua dos Bobos",
        number: "0",
        complement: "complement",
        city: "city",
        state: "state",
        zipCode: "zipCode",
        items: [
          { id: "1", name: "Item 1", price: 400, createdAt: Date(), updatedAt: Date() },
          { id: "2", name: "Item 2", price: 300, createdAt: Date(), updatedAt: Date() }
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    );


    const response = await request(app)
      .get(`/invoices/${invoiceId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(invoiceId);
    expect(response.body.name).toBe("João");
    expect(response.body.document).toBe("000");
    expect(response.body.address).toBeDefined();
    expect(response.body.items.length).toBe(2);
    expect(response.body.total).toBe(700);
    expect(response.body.createdAt).toBeDefined();
  });
});
