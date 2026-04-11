import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

export default buildConfig({
  // admin: {
  //   user: "admins",
  // },
  collections: [],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    schemaName: "payload",
  }),
  secret: process.env.PAYLOAD_SECRET || "",
});
