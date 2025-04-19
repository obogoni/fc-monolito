import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for clients", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should add a new client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        name: "John",
        email: "john@gmail.com",
        document: "000",
        street: "street",
        number: "number",
        complement: "complement",
        city: "city",
        state: "state",
        zipCode: "zipCode",
      });

    expect(response.status).toBe(201);
  });

});
