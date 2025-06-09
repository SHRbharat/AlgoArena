import axios from "axios";
const server_url = import.meta.env.VITE_SERVER_URL;

const headers = {
  'Content-Type': 'application/json'
};

export const AuthenticateWithGoogle = async (token) => {
  try {
    const { data } = await axios.post(
      `${server_url}/api/auth/google`,
      { token },
      {
        headers,
        withCredentials: true
      }
    );
    return data;
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    throw error;
  }
};

export const LoginUser = async (email, password) => {
  try {
    const { data } = await axios.post(
      `${server_url}/api/auth/login`,
      { email, password },
      {
        withCredentials: true,
        headers
      }
    );
    return data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

export const LogoutUser = async () => {
  try {
    const { data } = await axios.get(`${server_url}/api/auth/logout`, {
      withCredentials: true,
      headers
    });
    return data;
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};

export const SignUpUser = async (email, password, name) => {
  try {
    const { data } = await axios.post(
      `${server_url}/api/auth/signup`,
      { email, password, name },
      {
        withCredentials: true,
        headers
      }
    );
    return data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const ValidateToken = async () => {
  try {
    const { data } = await axios.get(`${server_url}/api/auth/validate`, {
      withCredentials: true,
      headers
    });
    return data;
  } catch (error) {
    console.error('Error during token validation:', error);
    throw error;
  }
};

export const SendOTP = async (email) => {
  try {
    const { data } = await axios.post(`${server_url}/api/auth/send-otp`, { email });
    return data;
  } catch (error) {
    console.error('Error during OTP sending:', error);
    throw error;
  }
};

export const VerifyOTP = async (email, otp) => {
  try {
    const { data } = await axios.post(`${server_url}/api/auth/verify-otp`, { email, otp });
    return data;
  } catch (error) {
    console.error('Error during OTP Verification:', error);
    throw error;
  }
};
