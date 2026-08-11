import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

// 1. ProductType (Kategori)
export const productTypes = sqliteTable('product_types', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

// Relasi ProductType
export const productTypesRelations = relations(productTypes, ({ many }) => ({
  products: many(products),
}));

// 2. Product (Barang)
export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  type: text('type').default(''),
  price: real('price').notNull(),
  stock: integer('stock').default(0).notNull(),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  productTypeId: integer('product_type_id').references(() => productTypes.id),
});

// Relasi Product
export const productsRelations = relations(products, ({ one, many }) => ({
  productType: one(productTypes, {
    fields: [products.productTypeId],
    references: [productTypes.id],
  }),
  transactionItems: many(transactionItems),
}));

// 3. Transaction (Struk Utama)
export const transactions = sqliteTable('transactions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  createdAt: text('created_at').default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  total: real('total').notNull(),
  qty: integer('qty').default(0).notNull(),
  price: real('price').default(0).notNull(),
  seller: text('seller').default('').notNull(),
  buyer: text('buyer').default('').notNull(),
});

// Relasi Transaction
export const transactionsRelations = relations(transactions, ({ many }) => ({
  items: many(transactionItems),
}));

// 4. TransactionItem (Detail Struk)
export const transactionItems = sqliteTable('transaction_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  transactionId: integer('transaction_id').references(() => transactions.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
});

// Relasi TransactionItem
export const transactionItemsRelations = relations(transactionItems, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transactionItems.transactionId],
    references: [transactions.id],
  }),
  product: one(products, {
    fields: [transactionItems.productId],
    references: [products.id],
  }),
}));

// 5. Users (Pengguna/Kasir)
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull(),
  name: text('name').notNull(),
  password: text('password').notNull(),
});
