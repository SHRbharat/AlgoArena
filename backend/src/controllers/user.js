import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const handleAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    res.status(200).json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    // Validate the input
    if (!userId || !role) {
      return res.status(400).json({ error: "Missing userId or role in request" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return res
      .status(200)
      .json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate the input
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request" });
    }

    const deletedUser = await prisma.user.delete({
      where: { id: userId },
    });

    return res
      .status(200)
      .json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserProgress = async (req, res) => {
  try {
    // Assuming req.user.id is set by some auth middleware
    const userId = req.user.id;

    // Validate the input
    if (!userId) {
      return res.status(400).json({ error: "Missing userId in request" });
    }

    const solvedProblems = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        problemsSolved: true,
      },
    });

    const problems = await prisma.problem.findMany({
      select: {
        difficulty: true,
      },
    });

    const totalProblems = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };

    problems.forEach((problem) => {
      if (problem.difficulty in totalProblems) {
        totalProblems[problem.difficulty]++;
      }
    });

    return res.status(200).json({
      message: "User progress fetched successfully",
      solvedProblems: solvedProblems?.problemsSolved || [],
      totalProblems,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
