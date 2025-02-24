import cron from "node-cron";

import { User } from "../models/userSchema.js";
import {} from "../utils/sendEmail.js";
import { Job } from "../models/jobSchema.js";

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const jobs = await Job.find({ newsLettersSent: false });
    for (const job of jobs) {
      try {
        const filteredUsers = await User.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });
        for (const user of filteredUsers) {
          const subject = ``;
          const message = ``;
          sendEmail({
            email: user.email,
            subject,
            message,
          });
        }
        job.newsLettersSent = true;
        await job.save();
      } catch (error) {
        console.log("Error in node cron catch block");
        return next(console.log(error || "some error in crone"));
      }
    }
  });
};
