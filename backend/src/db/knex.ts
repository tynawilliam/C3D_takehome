import knex from "knex";
import config from "./knexfile";

const env = process.env.NODE_ENV || "development";
const knexConfig = config[env];

export default knex(knexConfig);
