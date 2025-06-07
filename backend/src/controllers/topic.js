import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const handleCreateTopic = async (req, res) => {
  try {
    const { topics } = req.body; // Assuming `req.body` is an array of topic objects
    await prisma.topic.createMany({
      data: topics,
      skipDuplicates: true, // Optional: Skips duplicates based on unique constraints
    });
    res.status(201).json({ message: "Topics added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding topics", error });
  }
};

export const handleDeleteTopic = async (req, res) => {
  try {
    const deletedTopic = await prisma.topic.delete({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ message: "Topic deleted successfully", deletedTopic });
  } catch (error) {
    console.error("Error deleting topic:", error);
    res.status(500).json({ message: "Error deleting topic", error });
  }
};

export const handleEditTopic = async (req, res) => {
  try {
    const topicData = req.body;
    await prisma.topic.update({
      where: {
        id: req.params.id,
      },
      data: topicData,
    });

    res.status(200).json({ message: "Topic updated successfully" });
  } catch (error) {
    console.error("Error updating topic:", error);
    res.status(500).json({ message: "Error updating topic", error });
  }
};

export const handleGetAll = async (req, res) => {
  try {
    const topics = await prisma.topic.findMany({});

    res.status(200).json({ message: "Topic fetched successfully", topics });
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({ message: "Error fetching topic", error });
  }
};
