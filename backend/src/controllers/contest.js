import { PrismaClient } from '@prisma/client';
import {
  addContestStartJob,
  addContestEndJob,
  removeContestStartJob,
  removeContestEndJob,
  addContestEmailJob,
  removeContestEmailJob,
} from '../bullmq/queues/contestQueues.js';

const prisma = new PrismaClient();

export const handleStartContest = async (contestId) => {
  try {
    await prisma.contest.update({
      where: { id: contestId },
      data: { status: "Ongoing" },
    });
  } catch (error) {
    console.error("Error starting contest:", error);
  }
};

export const handleEndContest = async (contestId) => {
  try {
    await prisma.contest.update({
      where: { id: contestId },
      data: { status: "Ended" },
    });
  } catch (error) {
    console.error("Error ending contest:", error);
  }
};

export const handleCreateContest = async (req, res) => {
  try {
    const { title, description, startTime, endTime, problems } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const contest = await prisma.$transaction(async (prisma) => {
      const createdContest = await prisma.contest.create({
        data: {
          title,
          description,
          startTime,
          endTime,
          problems: problems.map((problem) => problem.id),
          userId: req.user.id,
        },
        select: { id: true },
      });

      if (!createdContest || !createdContest.id) {
        throw new Error("Failed to create contest.");
      }

      await Promise.all(
        problems.map(async (problem) => {
          await prisma.contestProblem.create({
            data: {
              contestId: createdContest.id,
              problemId: problem.id,
              score: problem.score,
            },
          });

          await prisma.problem.update({
            where: { id: problem.id },
            data: { contestId: createdContest.id },
          });
        })
      );

      return createdContest;
    });

    // Schedule jobs
    const contestStartJobId = await addContestStartJob(contest.id, new Date(startTime));
    const contestEndJobId = await addContestEndJob(contest.id, new Date(endTime));

    const parsedStartTime = new Date(startTime);
    let notificationTime = new Date(parsedStartTime.getTime() - 10 * 60000);

    if (parsedStartTime.getTime() - Date.now() < 10 * 60000) {
      notificationTime = new Date();
    }
    const contestEmailJobId = await addContestEmailJob(contest.id, notificationTime);

    const jobIds = {
      startJobId: contestStartJobId,
      endJobId: contestEndJobId,
      emailJobId: contestEmailJobId,
    };

    await prisma.contest.update({
      where: { id: contest.id },
      data: { jobIds: JSON.stringify(jobIds) },
    });

    res.status(201).json({ message: "Contest added successfully", contestId: contest.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding contest", error });
  }
};

export const handleDeleteContest = async (req, res) => {
  try {
    const contestId = req.params.id;

    const contest = await prisma.contest.findUnique({
      where: { id: contestId },
    });

    if (!contest) {
      return res.status(404).json({ message: "No such contest found." });
    }

    if (req.user?.role === "Organiser" && contest?.userId !== req.user.id) {
      return res.status(403).json({ message: "You aren't authorized to delete this contest." });
    }

    await prisma.$transaction(async (prisma) => {
      await Promise.all(
        contest.problems.map(async (problemId) => {
          await prisma.problem.update({
            where: { id: problemId },
            data: { contestId: null },
          });
        })
      );

      await prisma.contestProblem.deleteMany({ where: { contestId } });
      await prisma.contestParticipants.deleteMany({ where: { contestId } });

      if (contest.jobIds) {
        const jobIds = JSON.parse(contest.jobIds);
        if (jobIds.startJobId) await removeContestStartJob(jobIds.startJobId);
        if (jobIds.endJobId) await removeContestEndJob(jobIds.endJobId);
        if (jobIds.emailJobId) await removeContestEmailJob(jobIds.emailJobId);
      }

      await prisma.contest.delete({ where: { id: contestId } });
    });

    return res.status(200).json({ message: `${contest.title} contest deleted successfully` });
  } catch (error) {
    console.error("Error deleting contest:", error);
    return res.status(500).json({ message: "Error deleting contest", error });
  }
};

export const handleEditContest = async (_req, res) => {
  try {
    // TODO: implement contest editing logic
    res.status(200).json({ message: "Contest updated successfully" });
  } catch (error) {
    console.error("Error updating contest:", error);
    res.status(500).json({ message: "Error updating contest", error });
  }
};

export const handleGetContestByID = async (req, res) => {
  try {
    const requiredContest = await prisma.contest.findUnique({
      where: { id: req.params.id },
    });

    if (!requiredContest) {
      return res.status(404).json({ message: "No such contest found." });
    }

    const isRegistered = await prisma.contestParticipants.findFirst({
      where: { contestId: req.params.id, userId: req.user?.id },
    });

    const participants = await prisma.contestParticipants.count({
      where: { contestId: req.params.id },
    });

    const problemDetails = await Promise.all(
      requiredContest.problems.map(async (problemId) => {
        const problem = await prisma.problem.findUnique({
          where: { id: problemId },
          select: { id: true, title: true, difficulty: true },
        });

        const participant = await prisma.contestProblem.findFirst({
          where: { problemId, contestId: req.params.id },
          select: { score: true },
        });

        const solvedProblems = await prisma.contestParticipants.findFirst({
          where: { contestId: req.params.id, userId: req.user?.id },
          select: { problemsSolved: true },
        });

        return {
          ...problem,
          score: participant?.score || 0,
          solved: solvedProblems?.problemsSolved || [],
        };
      })
    );

    res.status(200).json({
      message: "Contest fetched successfully",
      contestData: {
        ...requiredContest,
        participants,
        registered: !!isRegistered,
        problems: problemDetails,
        server_time: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching contest:", error);
    res.status(500).json({ message: "Error fetching contest", error });
  }
};

export const handleGetAll = async (req, res) => {
  try {
    const contests = await prisma.contest.findMany({
      orderBy: { endTime: "desc" },
    });

    const userContests = await prisma.contestParticipants.findMany({
      where: { userId: req.user?.id },
      select: { contestId: true },
    });

    const userAttended = new Set(userContests.map((uc) => uc.contestId));

    const enrichedContests = contests.map((contest) => ({
      ...contest,
      server_time: new Date().toISOString(),
      attended: userAttended.has(contest.id),
    }));

    res.status(200).json({
      message: "Contests fetched successfully",
      contests: enrichedContests,
    });
  } catch (error) {
    console.error("Error fetching contests:", error);
    res.status(500).json({
      message: "Error fetching contests",
      error: error instanceof Error ? error.message : "Unknown error occured",
    });
  }
};

export const handleContestRegister = async (req, res) => {
  try {
    const contestId = req.params.id;
    const { register } = req.query;

    const contest = await prisma.contest.findUnique({ where: { id: contestId } });

    if (!contest) {
      return res.status(404).json({ message: "No such contest found." });
    }

    if (contest.startTime && contest.startTime < new Date()) {
      return res.status(400).json({ message: "Contest has already started." });
    }

    if (register === "true") {
      await prisma.contestParticipants.create({
        data: { contestId, userId: req.user?.id },
      });
      return res.status(200).json({ message: "Contest registration successful." });
    } else {
      await prisma.contestParticipants.deleteMany({
        where: { contestId, userId: req.user?.id },
      });
      return res.status(200).json({ message: "Contest unregistration successful." });
    }
  } catch (error) {
    console.error("Error in handling registration:", error);
    res.status(500).json({
      message: "Error in handling registration. Please try after sometime",
      error,
    });
  }
};

export const handleGetLeaderboard = async (req, res) => {
  try {
    const contestParticipants = await prisma.contestParticipants.findMany({
      where: { contestId: req.params.id },
      orderBy: [{ score: "desc" }, { updatedAt: "asc" }],
      include: {
        user: { select: { name: true } },
      },
    });

    res.status(200).json({
      message: "Leaderboard fetched successfully",
      leaderboard: contestParticipants,
    });
  } catch (error) {
    console.error("Error in handling leaderboard:", error);
    res.status(500).json({
      message: "Error in handling leaderboard. Please try after sometime",
      error,
    });
  }
};

