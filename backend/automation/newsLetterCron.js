import cron from "node-cron";

import { User } from "../models/userSchema.js";
import {} from  "../utils/sendEmail.js";

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running News Letter Cron Automation.");
  });
};
