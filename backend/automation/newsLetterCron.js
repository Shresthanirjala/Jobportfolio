import cron from "node-cron";
import { Job } from "../models/jobSchema.js";
import { User } from "../models/userSchema.js";
import { sendEmail } from "../utils/sendEmail.js";

export const newsLetterCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("🕒 Running Cron Automation at:", new Date());

    try {
      const jobs = await Job.find({ newsLettersSent: false });
      console.log(`✅ Found ${jobs.length} jobs to process`);

      for (const job of jobs) {
        const filteredUsers = await User.find({
          $or: [
            { "niches.firstNiche": job.jobNiche },
            { "niches.secondNiche": job.jobNiche },
            { "niches.thirdNiche": job.jobNiche },
          ],
        });

        console.log(
          `📢 Target users count for job "${job.title}" (Niche: ${job.jobNiche}): ${filteredUsers.length}`
        );

        if (filteredUsers.length === 0) {
          console.log(`⚠️ No matching users found for job: ${job.title}`);
        }
        console.log(`📢 Target users count: ${filteredUsers.length}`);

        for (const user of filteredUsers) {
          const subject = `Hot Job Alert: ${job.title} in ${job.jobNiche} Available Now`;
          const message = `Hi ${user.name},\n\nGreat news! A new job that fits your niche has just been posted. The position is for a ${job.title} with ${job.companyName}, and they are looking to hire immediately.\n\nJob Details:\n- **Position:** ${job.title}\n- **Company:** ${job.companyName}\n- **Location:** ${job.location}\n- **Salary:** ${job.salary}\n\nDon’t wait too long! Job openings like these are filled quickly.\n\nBest Regards,\nNicheNest Team`;

          console.log(`📨 Sending email to: ${user.email}`);

          try {
            await sendEmail({
              email: user.email,
              subject,
              message,
            });
            console.log(`✅ Email successfully sent to: ${user.email}`);
          } catch (emailError) {
            console.error(
              `❌ Failed to send email to ${user.email}:`,
              emailError
            );
          }
        }

        // Mark job as sent only if at least one email was attempted
        job.newsLettersSent = true;
        await job.save();
        console.log(`✅ Job marked as sent: ${job.title}`);
      }
    } catch (error) {
      console.error("❌ ERROR IN NODE CRON:", error);
    }
  });
};
