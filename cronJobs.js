const cron = require("node-cron");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// For running this cron job every day at 1:00 AM
cron.schedule("0 1 * * *", async () => {
  const logEntry = { executedAt: new Date(), status: '', message: '' };

  try {
    await archiveCompletedTasks();
    logEntry.status = "success";
    logEntry.message = "Cron job executed successfully: Completed tasks archived.";
  } catch (error) {
    logEntry.status = "failure";
    logEntry.message = `Error executing cron job: ${error.message}`;
    console.error(logEntry.message);
  } finally {
    // Log the result in CronJobLog table
    await prisma.cronJobLog.create({ data: logEntry });
  }
});

async function archiveCompletedTasks() {
  const now = new Date();
  const archiveThresholdDate = new Date(now.setMonth(now.getMonth() - 1));

  try {
    const result = await prisma.task.updateMany({
      where: {
        status: "completed",
        updatedAt: {
          lt: archiveThresholdDate,
        },
      },
      data: {
        status: "archived",
      },
    });
  } catch (error) {
    console.error("Error archiving tasks:", error);
    throw error;
  }
}

process.on("SIGINT", async () => {
  console.log(`exist successfully`);

  await prisma.$disconnect();

  process.exit(0);
});
