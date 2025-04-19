import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { productRouter } from "./routes/product.routes";
import { ClientModel } from "../modules/client-adm/repository/client.model";
import { clientRouter } from "./routes/client.routes";
import { checkoutRouter } from "./routes/checkout.routes";
import { invoiceRouter } from "./routes/invoice.routes";
import { OrderModel } from "../modules/checkout/repository/order.model";
import { OrderItemModel } from "../modules/checkout/repository/order-items.model";
import InvoiceModel from "../modules/invoice/repository/invoice.model";
import InvoiceItemModel from "../modules/invoice/repository/invoice-item.model";
import TransactionModel from "../modules/payment/repository/transaction.model";
import StoreCatalogProductModel from "../modules/store-catalog/repository/product.model";
import { AdmProductModel } from "../modules/product-adm/repository/product.model";

export const app: Express = express();
app.use(express.json());

app.use("/products", productRouter);
app.use("/clients", clientRouter);
app.use("/checkout", checkoutRouter);
app.use("/invoices", invoiceRouter);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([OrderModel, OrderItemModel,
    ClientModel,
    InvoiceModel, InvoiceItemModel,
    TransactionModel,
    StoreCatalogProductModel,
    AdmProductModel,]);
  await sequelize.sync();
}
setupDb();
