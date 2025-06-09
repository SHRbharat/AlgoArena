import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL;

const headers = {
  "Content-Type": "application/json",
};

export const createContest = async (contest) => {
  try {
    const { data } = await axios.post(
      `${server_url}/api/contest/create`,
      contest,
      {
        headers,
        withCredentials: true,
      }
    );

    return data;
  } catch (error) {
    console.error("Error creating the contest", error);
    throw new Error("Failed to create contest");
  }
};

export const getContestById = async (id) => {
  try {
    const { data } = await axios.get(`${server_url}/api/contest/${id}`, {
      headers,
      withCredentials: true,
    });

    return data.contestData;
  } catch (error) {
    console.error("Error fetching the contest", error);
    throw new Error("Failed to get the contest");
  }
};

export const getAllContests = async () => {
  try {
    const { data } = await axios.get(`${server_url}/api/contest/all`, {
      headers,
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.error("Error fetching all the contests", error);
    throw new Error("Failed to get the contests");
  }
};

export const deleteContest = async (contestId) => {
  try {
    const { data } = await axios.delete(`${server_url}/api/contest/${contestId}`, {
      headers,
      withCredentials: true,
    });

    return data;
  } catch (error) {
    console.error("Error deleting the contest", error);
    throw new Error("Failed to delete the contest");
  }
};

export const handleRegistration = async (contestId, isRegister) => {
  try {
    const { data } = await axios.get(
      `${server_url}/api/contest/${contestId}/register?register=${isRegister}`,
      {
        headers,
        withCredentials: true,
      }
    );

    return data;
  } catch (error) {
    console.error("Error registering for the contest", error);
    throw new Error("Failed to register for the contest");
  }
};

export const getLeaderboard = async (contestId) => {
  try {
    const { data } = await axios.get(
      `${server_url}/api/contest/${contestId}/leaderboard`,
      {
        headers,
        withCredentials: true,
      }
    );

    return data.leaderboard;
  } catch (error) {
    console.error("Error fetching the leaderboard", error);
    throw new Error("Failed to get the leaderboard");
  }
};
