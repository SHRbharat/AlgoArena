import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL;

const headers = {
  "Content-Type": "application/json",
};

// Get all topics
export const getAllTopics = async () => {
  try {
    const { data } = await axios.get(`${server_url}/api/topic/all`);
    return data.topics;
  } catch (error) {
    console.error("Error fetching topics", error);
    throw new Error("Failed to get the topics");
  }
};

// Create topics
export const createTopics = async (topics) => {
  try {
    const { data } = await axios.post(
      `${server_url}/api/topic/create`,
      { topics },
      { headers }
    );
    return data.topics;
  } catch (error) {
    console.error("Error creating topics", error);
    throw new Error("Failed to create topics");
  }
};

// Delete a topic
export const deleteTopic = async (topic_id) => {
  try {
    const { data } = await axios.delete(`${server_url}/api/topic/${topic_id}`);
    return data.message;
  } catch (error) {
    console.error("Error deleting topic", error);
    throw new Error("Failed to delete topic");
  }
};

// Update a topic
export const updateTopic = async (topic_id, topic_name) => {
  try {
    const { data } = await axios.put(
      `${server_url}/api/topic/${topic_id}`,
      { name: topic_name }
    );
    return data.message;
  } catch (error) {
    console.error("Error updating topic", error);
    throw new Error("Failed to update topic");
  }
};
