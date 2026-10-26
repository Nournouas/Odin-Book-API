require("dotenv").config();
const { execSync } = require("node:child_process");

module.exports = async () => {
  const url = process.env.TEST_DATABASE_URL
  if (!url || !url.includes("testdb")) {
    throw new Error("TEST_DATABASE_URL is missing or doesn't look like a test database");
  }

  execSync("npx prisma migrate deploy", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: url },
  });
};