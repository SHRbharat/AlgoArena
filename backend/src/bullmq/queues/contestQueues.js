import { Queue } from "bullmq";

// contest start queue
export const contestStartQueue = new Queue("contestStart", {
  connection: { url: process.env.REDIS_URL },
  defaultJobOptions: {
    removeOnComplete: true,
  },
});

export const addContestStartJob = async (contestId, startTime) => {
  const job = await contestStartQueue.add(
    "startContest",
    { contestId },
    { delay: startTime.getTime() - Date.now() }
  );

  return job.id;
};

export const removeContestStartJob = async (jobId) => {
  try {
    const job = await contestStartQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  } catch (error) {
    console.error(`Error removing contest start job ${jobId}:`, error);
  }
};

// contest end queue
export const contestEndQueue = new Queue("contestEnd", {
  connection: { url: process.env.REDIS_URL },
  defaultJobOptions: {
    removeOnComplete: true,
  },
});

export const addContestEndJob = async (contestId, endTime) => {
  const job = await contestEndQueue.add(
    "endContest",
    { contestId },
    { delay: endTime.getTime() - Date.now() }
  );

  return job.id;
};

export const removeContestEndJob = async (jobId) => {
  try {
    const job = await contestEndQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  } catch (error) {
    console.error(`Error removing contest end job ${jobId}:`, error);
  }
};

// Email notification queue
export const emailQueue = new Queue("emailQueue", {
  connection: { url: process.env.REDIS_URL },
  defaultJobOptions: {
    removeOnComplete: true,
  },
});

export const addContestEmailJob = async (contestId, endTime) => {
  const job = await emailQueue.add(
    "contestSendNotification",
    { contestId },
    { delay: endTime.getTime() - Date.now() }
  );

  return job.id;
};

export const removeContestEmailJob = async (jobId) => {
  try {
    const job = await emailQueue.getJob(jobId);
    if (job) {
      await job.remove();
    }
  } catch (error) {
    console.error(`Error removing email job ${jobId}:`, error);
  }
};
