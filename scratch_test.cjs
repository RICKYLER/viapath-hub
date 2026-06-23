const { Client } = require('pg');

const connectionString = "postgres://fdcf6f3231c43f85bec23a9732f590fc5a7b8e3822ebba52f91162779acc3be9:sk_HzpKfGdh8EXl5bECOqiJZ@pooled.db.prisma.io:5432/postgres?sslmode=require";

const client = new Client({
  connectionString: connectionString,
});

client.connect()
  .then(() => {
    console.log("SUCCESS: Connected to Prisma Postgres!");
    return client.end();
  })
  .catch(err => {
    console.error("FAILURE: Connection error details:", err);
  });
