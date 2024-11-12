-- CreateTable
CREATE TABLE "CronJobLog" (
    "id" SERIAL NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "CronJobLog_pkey" PRIMARY KEY ("id")
);
