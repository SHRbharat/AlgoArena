import axios from "axios";
const judge0_base_url = import.meta.env.VITE_BASE_JUDGE0;
const server_url = import.meta.env.VITE_SERVER_URL;
const hosted_judge0_base_url = import.meta.env.VITE_BASE_JUDGE0_HOSTED;

const headers = {
  "Content-Type": "application/json",
};

const params = {
  base64_encoded: true,
  wait: true,
};

export const createBatchSubmission = async (inputData) => {
  try {
    const { data } = await axios.post(
      `${hosted_judge0_base_url}/submissions/batch?base64_encoded=true`,
      inputData,
      { headers }
    );
    return data;
  } catch (error) {
    console.error("Error making submission:", error);
    return {
      success: false,
      message: "An error occurred while making a batch submission",
    };
  }
};

export const createRunSubmission = async ({ problem_id, uid }) => {
  try {
    const { data } = await axios.post(
      `${server_url}/api/submission/run/${problem_id}`,
      { uid },
      { headers }
    );
    return data;
  } catch (error) {
    console.error("Error run problem:", error);
    return {
      success: false,
      message: "An error occurred while running the problem.",
    };
  }
};

export const getBatchSubmission = async (tokens) => {
  const { data } = await axios.get(`${judge0_base_url}/submissions/batch/`, {
    headers,
    withCredentials: true,
    params: {
      base64_encoded: true,
      tokens,
    },
  });
  return data;
};

export const createSubmission = async (inputData) => {
  const { data } = await axios.post(
    `${hosted_judge0_base_url}/submissions`,
    inputData,
    {
      headers,
      params,
    }
  );
  return data;
};

export const getSubmission = async (token) => {
  const { data } = await axios.get(
    `${hosted_judge0_base_url}/submissions/${token}`,
    {
      headers,
      params,
    }
  );
  return data;
};

export const updateSubmission = async (result, callback_url) => {
  try {
    const { data } = await axios.put(`${server_url}${callback_url}`, result, {
      headers,
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error updating submission:", error);
    return {
      success: false,
      message: "An error occurred while updating the submission.",
    };
  }
};

export const submitProblem = async ({ problem_id, code, language_id }) => {
  try {
    const { data } = await axios.post(
      `${server_url}/api/problem/${problem_id}/submit`,
      { code, language_id },
      {
        headers,
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error("Error submitting problem:", error);
    return {
      success: false,
      message: "An error occurred while submitting the problem.",
    };
  }
};

export const runProblem = async (inputData) => {
  try {
    const { data } = await axios.post(
      `${hosted_judge0_base_url}/submissions/batch?base64_encoded=true&wait=true`,
      inputData,
      { headers }
    );
    return data;
  } catch (error) {
    console.error("Error making submission:", error);
    return {
      success: false,
      message: "An error occurred while making a batch submission",
    };
  }
};

export const getProblemSubmissions = async (problem_id) => {
  try {
    const { data } = await axios.get(
      `${server_url}/api/problem/${problem_id}/submissions`,
      {
        headers,
        withCredentials: true,
      }
    );
    return data.submissions;
  } catch (error) {
    console.error("Error fetching problem submissions", error);
    throw new Error("Failed to get the submissions");
  }
};

export const getFileData = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data.toString();
  } catch (error) {
    console.error("Error Fetching Data:", error);
    return {
      success: false,
      message: "An error occurred while fetching data.",
    };
  }
};

export const saveProblem = async (formData) => {
  try {
    const { data } = await axios.post(
      `${server_url}/api/problem/create`,
      { ...formData },
      {
        headers,
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error("Error saving problem:", error);
    throw new Error("Failed to save problem");
  }
};

export const uploadToS3 = async (url, file, fileType) => {
  try {
    await axios.put(url, file, {
      headers: {
        "Content-Type": fileType || "text/plain",
      },
    });
  } catch (error) {
    console.error("Error uploading the file to s3", error);
    throw new Error("Failed to upload file on s3");
  }
};

const LIMIT = 10;

export const getAllProblems = async (page) => {
  try {
    const { data } = await axios.get(`${server_url}/api/problem/all`, {
      params: { page, LIMIT },
    });
    return data;
  } catch (error) {
    console.error("Error fetching all the problems", error);
    throw new Error("Failed to get the problems");
  }
};

export const fetchProblems = async (
  searchTerm,
  difficultyFilter,
  topicFilter,
  companyFilter,
  currentPage
) => {
  try {
    const { data } = await axios.get(`${server_url}/api/problem/filter`, {
      params: {
        searchTerm,
        difficulty: difficultyFilter === "All" ? null : difficultyFilter,
        topic: topicFilter,
        company: companyFilter,
        page: currentPage,
        pageSize: LIMIT,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching problems:", error);
  }
};

export const getAdminAllProblems = async (page) => {
  try {
    const { data } = await axios.get(`${server_url}/api/problem/admin/all`, {
      headers,
      withCredentials: true,
      params: { page, LIMIT },
    });
    return data;
  } catch (error) {
    console.error("Error fetching all the problems", error);
    throw new Error("Failed to get the problems");
  }
};

export const fetchAdminProblems = async (
  searchTerm,
  difficultyFilter,
  topicFilter,
  companyFilter,
  currentPage
) => {
  try {
    const { data } = await axios.get(`${server_url}/api/problem/admin/filter`, {
      headers,
      withCredentials: true,
      params: {
        searchTerm,
        difficulty: difficultyFilter === "All" ? null : difficultyFilter,
        topic: topicFilter,
        company: companyFilter,
        page: currentPage,
        pageSize: LIMIT,
      },
    });
    return data;
  } catch (error) {
    console.error("Error fetching problems:", error);
  }
};

export const getProblemById = async (problem_id) => {
  try {
    const { data } = await axios.get(`${server_url}/api/problem/${problem_id}`, {
      headers,
      withCredentials: true,
    });
    return data.problem;
  } catch (error) {
    console.error("Error fetching problem by id", error);
    throw new Error("Failed to get the problem");
  }
};

export const getAllExampleTestcases = async (problem_id) => {
  try {
    const { data } = await axios.get(
      `${server_url}/api/problem/${problem_id}/example_testcases`
    );
    return data.testcasesURls;
  } catch (error) {
    console.error("Error fetching example testcases", error);
    throw new Error("Failed to get the testcases");
  }
};

export const editProblem = async (formData) => {
  try {
    const { data } = await axios.patch(
      `${server_url}/api/problem/edit`,
      { ...formData },
      {
        headers,
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error("Error editing problem:", error);
    throw new Error("Failed to edit problem");
  }
};

export const deleteProblem = async (problemId) => {
  try {
    const { data } = await axios.delete(
      `${server_url}/api/problem/${problemId}`,
      {
        headers,
        withCredentials: true,
      }
    );
    return data;
  } catch (error) {
    console.error("Error deleting problem:", error);
    throw new Error("Failed to delete problem");
  }
};
