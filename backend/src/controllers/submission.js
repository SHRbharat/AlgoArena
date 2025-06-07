import { PrismaClient, Difficulty } from "@prisma/client";
const prisma = new PrismaClient();

const ongoingUpdates = new Set();

export const handleRunCallback = async (req, res) => {
  const problem_id = req.params.id;
  const uid = req.body.uid;

  try {
    const io = req.io;

    if (!io) {
      console.error("Socket.IO not attached to request");
      return res.status(500).json({
        success: false,
        message: "Socket.IO not initialized",
      });
    }

    if (uid) {
      console.log("Attempting to emit with io:", !!io);
      io.to(uid).emit("update", {
        success: true,
        message: "Testcase updated successfully",
        problem_id,
        uid,
      });
      console.log(`Emitted to room ${uid}`);
    } else {
      console.log("UID not found in callback");
    }

    return res.status(200).json({
      success: true,
      message: "callback called properly",
    });
  } catch (error) {
    console.error("Error in handleRunCallback:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const handleSubmissionCallback = async (req, res) => {
  const subTestcaseId = req.params.id;
  const submissionId = req.params.submissionId;

  if (!subTestcaseId || !req.body || !submissionId) {
    return res.status(400).json({
      success: false,
      message: "Invalid request. Testcase ID or request body missing.",
    });
  }

  if (ongoingUpdates.has(subTestcaseId)) {
    return res.status(429).json({
      success: false,
      message: "This submission is already being processed.",
    });
  }

  ongoingUpdates.add(subTestcaseId);
  try {
    const { stdout, status, time, memory } = req.body;
    const parsedTime = time ? parseFloat(time) : 0;

    const result = await prisma.$transaction(
      async (tx) => {
        const updatedTestcase = await tx.submittedTestcase.update({
          where: { id: subTestcaseId },
          data: {
            output: stdout ?? "",
            status: status.id,
            memory: memory ?? 0,
            time: parsedTime,
          },
        });

        const submission = await tx.$queryRaw(`
          SELECT * 
          FROM "Submission"
          WHERE "id" = ${updatedTestcase.submissionId}
          FOR UPDATE
        `);

        if (!submission?.length) {
          throw new Error("Submission not found.");
        }

        const submissionData = submission[0];
        let { acceptedTestcases, evaluatedTestcases } = submissionData;
        let overallStatus = submissionData.status;

        if (updatedTestcase.status >= 3) {
          evaluatedTestcases++;
        }

        if (updatedTestcase.status === 3) {
          acceptedTestcases++;
        }

        if (evaluatedTestcases !== submissionData.totalTestcases) {
          if (updatedTestcase.status > 3) {
            overallStatus = updatedTestcase.status;
          }
        } else {
          overallStatus = Math.max(updatedTestcase.status, overallStatus);
        }

        const updatedSubmission = await tx.submission.update({
          where: { id: updatedTestcase.submissionId },
          data: {
            evaluatedTestcases,
            acceptedTestcases,
            status: overallStatus,
            memory: Math.max(submissionData.memory, memory),
            time: submissionData.time + parsedTime,
          },
        });

        if (overallStatus === 3) {
          const problem = await tx.problem.findUnique({
            where: { id: updatedSubmission.problemId },
            select: { difficulty: true },
          });

          const alreadySolved = await tx.submission.findFirst({
            where: {
              userId: updatedSubmission.userId,
              problemId: updatedSubmission.problemId,
              status: 3,
              NOT: { id: updatedSubmission.id },
            },
            select: { id: true },
          });

          if (!alreadySolved) {
            await tx.user.update({
              where: { id: updatedSubmission.userId },
              data: {
                problemsSolved: {
                  push: JSON.stringify({
                    id: updatedSubmission.problemId,
                    type: problem?.difficulty || Difficulty.Easy,
                  }),
                },
              },
            });
          }
        }

        return {
          success: true,
          message: "Submission updated successfully.",
          updatedSubmission,
        };
      },
      {
        maxWait: 20000,
        timeout: 20000,
      }
    );

    return res.status(200).json(result);
  } catch (error) {
    try {
      const updatedSubmission = await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 13,
        },
      });

      return res.status(500).json({
        success: false,
        message: "Internal server error. Submission marked as Internal Error.",
        updatedSubmission,
      });
    } catch (updateError) {
      console.error("Failed to update submission to Internal Error:", updateError);

      return res.status(500).json({
        success: false,
        message: "Internal server error. Submission marked as Internal Error.",
      });
    }
  } finally {
    ongoingUpdates.delete(subTestcaseId);
  }
};

export const handleContestSubmissionCallback = async (req, res) => {
  const subTestcaseId = req.params.id;
  const contestId = req.params.contestId;
  const submissionId = req.params.submissionId;

  if (!subTestcaseId || !req.body || !submissionId) {
    return res.status(400).json({
      success: false,
      message: "Invalid request. Testcase ID or request body missing.",
    });
  }

  if (ongoingUpdates.has(subTestcaseId)) {
    return res.status(429).json({
      success: false,
      message: "This submission is already being processed.",
    });
  }

  ongoingUpdates.add(subTestcaseId);
  try {
    const { stdout, status, time, memory } = req.body;
    const parsedTime = time ? parseFloat(time) : 0;

    const result = await prisma.$transaction(
      async (tx) => {
        const updatedTestcase = await tx.submittedTestcase.update({
          where: { id: subTestcaseId },
          data: {
            output: stdout ?? "",
            status: status.id,
            memory: memory ?? 0,
            time: parsedTime,
          },
        });

        const submission = await tx.$queryRaw(`
          SELECT * 
          FROM "Submission"
          WHERE "id" = ${updatedTestcase.submissionId}
          FOR UPDATE
        `);

        if (!submission?.length) {
          throw new Error("Submission not found.");
        }

        const submissionData = submission[0];
        let { acceptedTestcases, evaluatedTestcases } = submissionData;
        let overallStatus = submissionData.status;

        if (updatedTestcase.status >= 3) {
          evaluatedTestcases++;
        }

        if (updatedTestcase.status === 3) {
          acceptedTestcases++;
        }

        if (evaluatedTestcases !== submissionData.totalTestcases) {
          if (updatedTestcase.status > 3) {
            overallStatus = updatedTestcase.status;
          }
        } else {
          overallStatus = Math.max(updatedTestcase.status, overallStatus);
        }

        const updatedSubmission = await tx.submission.update({
          where: { id: updatedTestcase.submissionId },
          data: {
            evaluatedTestcases,
            acceptedTestcases,
            status: overallStatus,
            memory: Math.max(submissionData.memory, memory),
            time: submissionData.time + parsedTime,
          },
        });

        if (overallStatus === 3) {
          const problem = await tx.problem.findUnique({
            where: { id: updatedSubmission.problemId },
            select: { difficulty: true },
          });

          const alreadySolved = await tx.submission.findFirst({
            where: {
              userId: updatedSubmission.userId,
              problemId: updatedSubmission.problemId,
              status: 3,
              NOT: { id: updatedSubmission.id },
            },
            select: { id: true },
          });

          if (!alreadySolved) {
            await tx.user.update({
              where: { id: updatedSubmission.userId },
              data: {
                problemsSolved: {
                  push: JSON.stringify({
                    id: updatedSubmission.problemId,
                    type: problem?.difficulty || Difficulty.Easy,
                  }),
                },
              },
            });
          }

          const participant = await tx.contestParticipants.findFirst({
            where: {
              contestId,
              userId: updatedSubmission.userId,
            },
            select: {
              problemsSolved: true,
            },
          });

          if (!participant?.problemsSolved.includes(updatedSubmission.problemId)) {
            const contestProblem = await tx.contestProblem.findFirst({
              where: {
                contestId,
                problemId: updatedSubmission.problemId,
              },
              select: {
                score: true,
              },
            });

            if (contestProblem) {
              const [_updatedParticipant, contestParticipants] = await Promise.all([
                tx.contestParticipants.updateMany({
                  where: {
                    contestId,
                    userId: updatedSubmission.userId,
                  },
                  data: {
                    score: {
                      increment: contestProblem.score,
                    },
                    problemsSolved: {
                      push: updatedSubmission.problemId,
                    },
                  },
                }),
                tx.contestParticipants.findMany({
                  where: {
                    contestId,
                  },
                  orderBy: [{ score: "desc" }, { updatedAt: "asc" }],
                  include: {
                    user: {
                      select: {
                        name: true,
                      },
                    },
                  },
                }),
              ]);

              const io = req.io;
              if (!io) {
                console.error("Socket.IO not attached to request");
                throw new Error("IO object not found");
              }

              console.log("Attempting to emit with io:", !!io);
              io.to(contestId + "-leaderboard").emit("update", {
                success: true,
                message: "Leaderboard updated successfully",
                leaderboard: contestParticipants,
              });
            }
          }
        }

        return {
          success: true,
          message: "Submission updated successfully.",
          updatedSubmission,
        };
      },
      {
        maxWait: 20000,
        timeout: 20000,
      }
    );

    return res.status(200).json(result);
  } catch (error) {
    try {
      const updatedSubmission = await prisma.submission.update({
        where: { id: submissionId },
        data: {
          status: 13,
        },
      });

      return res.status(500).json({
        success: false,
        message: "Internal server error. Submission marked as Internal Error.",
        updatedSubmission,
      });
    } catch (updateError) {
      console.error("Failed to update submission to Internal Error:", updateError);

      return res.status(500).json({
        success: false,
        message: "Internal server error. Submission marked as Internal Error.",
      });
    }
  } finally {
    ongoingUpdates.delete(subTestcaseId);
  }
};

