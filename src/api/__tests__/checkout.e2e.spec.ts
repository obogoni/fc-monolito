import { app, sequelize } from "../express";
import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { AdmProductModel } from "../../modules/product-adm/repository/product.model";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";
import InvoiceModel from "../../modules/invoice/repository/invoice.model";
import InvoiceItem from "../../modules/invoice/domain/invoice-item.entity";
import InvoiceItemModel from "../../modules/invoice/repository/invoice-item.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../modules/checkout/repository/order-items.model";
import { migrator } from "../../config/migrator/migrator";

describe("E2E test for checkout", () => {
  let sequelize: Sequelize
  let migration: Umzug<any>

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    sequelize.addModels(
      [
        AdmProductModel,
        StoreCatalogProductModel,
        ClientModel,
        InvoiceModel,
        InvoiceItemModel,
        OrderModel,
        OrderItemModel
      ])

    migration = migrator(sequelize)

    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) return

    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("should checkout an order", async () => {

    const clientId = "1";

    await ClientModel.create({
      id: clientId,
      name: "João",
      email: "email@test.com",
      document: "99999999999",
      street: "Rua dos Bobos",
      number: "Zero",
      complement: "complemento",
      city: "test",
      state: "TE",
      zipcode: "999999999",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await StoreCatalogProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
      createdAt: new Date(),
      updatedAt: new Date(),
    })


    await StoreCatalogProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 50,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await AdmProductModel.update({
      stock: 1
    }, {
      where: {
        id: ["1", "2"]
      }
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: clientId,
        products: [
          { productId: "1" }, { productId: "2" }
        ],
      });
    expect(response.status).toBe(201);
    expect(response.body.total).toBe(150);
    expect(response.body.status).toBe('approved');
    expect(response.body.invoiceId).not.toBeNull();
  });
});
