import { defineComputeConfig } from "@prisma/compute-sdk/config";

export default defineComputeConfig({
  app: {
    name: "prisma-next-app",
    framework: "nextjs",
    env: ".env",
  },
});
