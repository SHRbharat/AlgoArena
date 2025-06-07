import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

export const s3client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

async function getObjectURL(key) {
  const command = new GetObjectCommand({
    Bucket: "compete-nest",
    Key: key,
  });

  return getSignedUrl(s3client, command);
}

async function putObjectURL(key) {
  const command = new PutObjectCommand({
    Bucket: "compete-nest",
    Key: key,
    ContentType: "text/plain",
  });

  return getSignedUrl(s3client, command, { expiresIn: 3600 });
}

async function deleteObjectS3(key) {
  const command = new DeleteObjectCommand({
    Bucket: "compete-nest",
    Key: key,
  });
  await s3client.send(command);
}

async function deleteDirectoryS3(prefix) {
  const bucketName = "compete-nest";

  const listCommand = new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
  });

  const listedObjects = await s3client.send(listCommand);

  if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
    console.log(`No objects found under the prefix: ${prefix}`);
    return;
  }

  const deleteParams = {
    Bucket: bucketName,
    Delete: {
      Objects: listedObjects.Contents.map((object) => ({
        Key: object.Key,
      })),
    },
  };

  const deleteCommand = new DeleteObjectsCommand(deleteParams);
  await s3client.send(deleteCommand);

  console.log(`Deleted all objects under the prefix: ${prefix}`);

  if (listedObjects.IsTruncated) {
    await deleteDirectoryS3(prefix);
  }
}

export const handleSubmitProblem = async (req, res) => {
  try {
    const { code, language_id } = req.body;
    const problem_id = req.params.id;
    const user_id = req.user.id;

    const problem = await prisma.problem.findUnique({
      where: {
        id: problem_id,
      },
    });

    if (problem && problem.contestId) {
      const contest = await prisma.contest.findUnique({
        where: {
          id: problem.contestId,
        },
        select: {
          startTime: true,
          endTime: true,
        },
      });

      if (contest && contest.startTime && contest.startTime > new Date()) {
        return res.status(400).json({ error: "Contest has not started yet" });
      }
    }

    const testcases = await prisma.testcase.findMany({
      where: {
        problemId: problem_id,
      },
    });

    const sub_id = await prisma.submission.create({
      data: {
        problemId: problem_id,
        userId: user_id,
        userCode: code,
        language: language_id,
        totalTestcases: testcases.length,
      },
      select: {
        id: true,
      },
    });

    const input_urls = [];
    const exp_output_urls = [];
    const callback_urls = [];

    await Promise.all(
      testcases.map(async ({ id, inputPath, expOutputPath }) => {
        const input_url = await getObjectURL(inputPath);
        const exp_output_url = await getObjectURL(expOutputPath);

        const sub_testcase_id = await prisma.submittedTestcase.create({
          data: {
            testcaseId: id,
            submissionId: sub_id.id,
          },
          select: {
            id: true,
          },
        });

        let callback_url = `/api/submission/${sub_id.id}/submitted_testcase/${sub_testcase_id.id}`;

        if (problem && problem.contestId) {
          callback_url = `/api/submission/${sub_id.id}/contest/${problem.contestId}/submitted_testcase/${sub_testcase_id.id}`;
        }

        input_urls.push(input_url);
        exp_output_urls.push(exp_output_url);
        callback_urls.push(callback_url);
      })
    );

    return res.status(200).json({
      success: true,
      submission_id: sub_id.id,
      input_urls,
      exp_output_urls,
      callback_urls,
    });
  } catch (e) {
    console.error("Error in handleSubmitProblem:", e);

    return res.status(500).json({
      success: false,
    });
  }
};

export const handleRunProblem = async (req, res) => {
  const problem_id = req.params.id;

  const uid = problem_id + Date.now();

  return res.status(200).json({
    success: true,
    uid,
  });
};

export const handleCreateProblem = async (req, res) => {
  const userId = req.user.id;
  const {
    title,
    description,
    inputFormat,
    outputFormat,
    resources,
    constraints,
    difficulty,
    ownerCode,
    ownerCodeLanguage,
    contestId = null,
    topics = [],
    companies = [],
    testCases = [],
  } = req.body;

  if (
    !userId ||
    !title ||
    !description ||
    !inputFormat ||
    !outputFormat ||
    !difficulty ||
    !ownerCode ||
    ownerCodeLanguage == null ||
    testCases.length <= 0
  ) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const problemId = await prisma.problem.create({
      data: {
        userId,
        title,
        description,
        inputFormat,
        outputFormat,
        resourcesPath: resources,
        constraints,
        difficulty,
        ownerCode,
        ownerCodeLanguage: parseInt(ownerCodeLanguage),
        contestId,
        topics: topics.map((topic) => JSON.stringify(topic)),
        companies: companies.map((company) => JSON.stringify(company)),
      },
      select: {
        id: true,
      },
    });

    for (const topic of topics) {
      for (const company of companies) {
        await prisma.queryTable.create({
          data: {
            problemId: problemId.id,
            topicId: topic.id,
            companyId: company.id,
            difficulty,
            title,
          },
        });
      }
    }

    const resourceURLs = await Promise.all(
      resources.map(async (caption, index) => {
        const resourceKey = `Problems/${problemId.id}/resource/resource_${index}`;
        return await putObjectURL(resourceKey);
      })
    );

    const testcasesURLs = await Promise.all(
      testCases.map(async (isExample, index) => {
        const inputKey = `Problems/${problemId.id}/input/input_${index}.txt`;
        const outputKey = `Problems/${problemId.id}/output/output_${index}.txt`;

        const inputUrl = await putObjectURL(inputKey);
        const outputUrl = await putObjectURL(outputKey);

        await prisma.testcase.create({
          data: {
            problemId: problemId.id,
            inputPath: inputKey,
            expOutputPath: outputKey,
            isExample,
          },
        });

        return {
          inputUrl,
          outputUrl,
        };
      })
    );

    res.status(201).json({ id: problemId, testcasesURLs, resourceURLs });
  } catch (error) {
    console.error("Error saving problem:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const handleAdminGetAllProblem = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const problems = await prisma.queryTable.findMany({
      skip,
      take: limit,
      distinct: ["problemId"],
    });

    res.status(200).json({
      problems,
    });
  } catch (error) {
    console.error("Error saving problem:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const handleAdminGetFilterProblems = async (req, res) => {
  try {
    const { searchTerm, difficulty, topic, company, page, pageSize } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10) || 10;
    const offset = (pageNum - 1) * limit;

    const filter = {};

    if (searchTerm) {
      filter.title = { contains: searchTerm, mode: "insensitive" };
    }

    if (difficulty) {
      filter.difficulty = difficulty;
    }

    if (topic) {
      const topics = Array.isArray(topic) ? topic : [topic];
      filter.topicId = { in: topics };
    }

    if (company) {
      const companies = Array.isArray(company) ? company : [company];
      filter.companyId = { in: companies };
    }

    const problems = await prisma.queryTable.findMany({
      where: filter,
      skip: offset,
      take: limit,
      distinct: ["problemId"],
    });

    res.status(200).json({
      problems,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGetAllProblem = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const problems = await prisma.queryTable.findMany({
      skip,
      take: limit,
      distinct: ["problemId"],
    });

    const contestProblems = await prisma.problem.findMany({
      where: {
        contestId: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    const contestProblemsSet = new Set(contestProblems.map((problem) => problem.id));

    const filteredProblems = problems.filter(
      (problem) => !contestProblemsSet.has(problem.problemId)
    );

    res.status(200).json({
      problems: filteredProblems,
    });
  } catch (error) {
    console.error("Error saving problem:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const handleGetFilterProblems = async (req, res) => {
  try {
    const { searchTerm, difficulty, topic, company, page, pageSize } = req.query;

    const pageNum = parseInt(page, 10) || 1;
    const limit = parseInt(pageSize, 10) || 10;
    const offset = (pageNum - 1) * limit;

    const filter = {};

    if (searchTerm) {
      filter.title = { contains: searchTerm, mode: "insensitive" };
    }

    if (difficulty) {
      filter.difficulty = difficulty; // Assuming difficulty is an enum or string
    }

    if (topic) {
      const topics = Array.isArray(topic) ? topic : [topic];
      filter.topicId = { in: topics };
    }

    if (company) {
      const companies = Array.isArray(company) ? company : [company];
      filter.companyId = { in: companies };
    }

    // Fetch filtered problems with pagination
    const problems = await prisma.queryTable.findMany({
      where: filter,
      skip: offset,
      take: limit,
      distinct: ["problemId"],
    });

    const contestProblems = await prisma.problem.findMany({
      where: {
        contestId: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    const contestProblemsSet = new Set(contestProblems.map((problem) => problem.id));

    const filteredProblems = problems.filter(
      (problem) => !contestProblemsSet.has(problem.problemId)
    );

    res.status(200).json({
      problems: filteredProblems,
      currentPage: pageNum,
    });
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const handleGetProblemById = async (req, res) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    return res.status(200).json({ problem });
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const handleGetAllExampleTestcases = async (req, res) => {
  try {
    const testcases = await prisma.testcase.findMany({
      where: {
        problemId: req.params.id,
        isExample: true,
      },
    });

    const input_urls = [];
    const output_urls = [];
    await Promise.all(
      testcases.map(async (testcase) => {
        const inputUrl = await getObjectURL(testcase.inputPath);
        const outputUrl = await getObjectURL(testcase.expOutputPath);

        input_urls.push(inputUrl);
        output_urls.push(outputUrl);
      })
    );

    res.status(200).json({
      success: true,
      testcasesURls: { input_urls, output_urls },
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const handleGetSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.id;

    const problem = await prisma.problem.findUnique({
      where: {
        id: problemId,
      },
      select: {
        contestId: true,
      },
    });

    let submissions = await prisma.submission.findMany({
      where: {
        userId,
        problemId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (problem?.contestId) {
      const contest = await prisma.contest.findUnique({
        where: {
          id: problem.contestId,
        },
        select: {
          startTime: true,
        },
      });

      submissions = submissions.filter((submission) => {
        if (contest?.startTime && contest.startTime <= submission.createdAt) {
          return submission;
        }
      });
    }

    res.status(200).json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const handleEditProblem = async (req, res) => {
  const {
    problemId,
    description,
    inputFormat,
    outputFormat,
    constraints,
    ownerCode,
    ownerCodeLanguage,
    testCases = [],
  } = req.body;

  try {
    if (!problemId) {
      return res.status(400).json({ error: "Problem ID is required." });
    }

    await prisma.problem.update({
      where: { id: problemId },
      data: {
        description,
        inputFormat,
        outputFormat,
        constraints,
        ownerCode,
        ownerCodeLanguage: parseInt(ownerCodeLanguage),
      },
    });

    const currentTestCaseCount = await prisma.testcase.count({
      where: { problemId },
    });

    let testcasesURLs = [];
    if (testCases.length > 0) {
      testcasesURLs = await Promise.all(
        testCases.map(async (isExample, index) => {
          const currentIndex = currentTestCaseCount + index;
          const inputKey = `Problems/${problemId}/input/input_${currentIndex}.txt`;
          const outputKey = `Problems/${problemId}/output/output_${currentIndex}.txt`;

          const inputUrl = await putObjectURL(inputKey);
          const outputUrl = await putObjectURL(outputKey);

          await prisma.testcase.create({
            data: {
              problemId,
              inputPath: inputKey,
              expOutputPath: outputKey,
              isExample,
            },
          });

          return {
            inputUrl,
            outputUrl,
          };
        })
      );
    }

    res.status(200).json({ id: problemId, testcasesURLs });
  } catch (error) {
    console.error("Error updating problem:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const handleDeleteProblem = async (req, res) => {
  try {
    const problemId = req.params.id;
    console.log("Deleting problem with ID:", problemId);

    const problemExists = await prisma.problem.findUnique({
      where: { id: problemId },
    });

    if (!problemExists) {
      return res.status(404).json({ error: "Problem not found." });
    }

    const testcases = await prisma.testcase.findMany({
      where: { problemId },
    });

    const testcaseIds = testcases.map((testcase) => testcase.id);

    if (testcaseIds.length > 0) {
      await prisma.submittedTestcase.deleteMany({
        where: {
          testcaseId: { in: testcaseIds },
        },
      });
    }

    await prisma.queryTable.deleteMany({
      where: { problemId },
    });

    await prisma.testcase.deleteMany({
      where: { problemId },
    });

    await prisma.submission.deleteMany({
      where: { problemId },
    });

    await prisma.problem.delete({
      where: { id: problemId },
    });

    const key = `Problems/${problemId}/`;
    await deleteDirectoryS3(key);

    res.status(200).json({
      message: "Problem deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting problem:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


