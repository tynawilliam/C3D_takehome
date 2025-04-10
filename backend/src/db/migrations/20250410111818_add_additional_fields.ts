import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("students", (table) => {
    table.string("email").notNullable().unique();
    table.integer("graduation_year").nullable();
    table.string("phone_number").nullable();
    table.decimal("gpa", 3, 2).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("students", (table) => {
    table.dropColumn("email");
    table.dropColumn("graduation_year");
    table.dropColumn("phone_number");
    table.dropColumn("gpa");
  });
}
