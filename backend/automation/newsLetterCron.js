import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log(` Running Cron Automation at: ${new Date().toISOString()}`);

    const jobs = await Job.find({ newsLettersSent: false });

    for (const job of jobs) {
      try {
        console.log(
          `✅ Found job to process: ${job.title} (Niche: ${job.jobNiche})`
        );

        const filteredUsers = await User.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });

        let emailSent = false;
        for (const user of filteredUsers) {
          // console.log(`📧 Preparing to send email to: ${user.email}`);

          await sendEmail({
            email: user.email,
            subject: `Hot Job Alert: ${job.title} Available Now`,
            message: `Hi ${user.name},\n\nGreat news! A new job that fits your niche has just been posted. The position is for a ${job.title} with ${job.companyName}, and they are looking to hire immediately.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nDon’t wait too long! Job openings like these are filled quickly. \n\nWe’re here to support you in your job search. Best of luck!\n\nBest Regards,\nNicheNest Team`,
          });

          // console.log(`✅ Email successfully sent to: ${user.email}`);
          emailSent = true;
        }

        if (emailSent) {
          job.newsLettersSent = true;
          await job.save();
          console.log(`Job marked as sent: ${job.title}`);
        }
      } catch (error) {
        console.error(" Error processing job:", error);
      }
    }
  });
};
