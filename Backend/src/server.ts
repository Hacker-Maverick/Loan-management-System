import { app } from "./app";
import { connectDatabase } from "./config/database";
import { env } from "./config/env";

const startServer = async () => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`LMS backend is running on port ${env.PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start LMS backend", error);
  process.exit(1);
});
