import { app, sequelize } from "../express";
import request from "supertest";
import { Umzug } from "umzug";
import { AdmProductModel } from "../../modules/product-adm/repository/product.model";
import { migrator } from "../../config/migrator/migrator";
import { Sequelize } from "sequelize-typescript";
import StoreCatalogProductModel from "../../modules/store-catalog/repository/product.model";

describe("E2E test for products", () => {

  let sequelize: Sequelize
  let migration: Umzug<any>

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    })

    sequelize.addModels([AdmProductModel, StoreCatalogProductModel])

    migration = migrator(sequelize)

    await migration.up()
  })

  afterEach(async () => {
    if (!migration || !sequelize) return

    migration = migrator(sequelize)
    await migration.down()
    await sequelize.close()
  })

  it("should add a new product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Switch 2",
        description: "Switão",
        purchasePrice: 4500.00,
        stock: 500,
      });

    expect(response.status).toBe(201);
    expect(response.body.id).not.toBeNull();
    expect(response.body.name).toBe("Switch 2");
    expect(response.body.description).toBe("Switão");
    expect(response.body.purchasePrice).toBe(4500.00);
    expect(response.body.stock).toBe(500);
    expect(response.body.createdAt).not.toBeNull();
    expect(response.body.updatedAt).not.toBeNull();
  });
});
