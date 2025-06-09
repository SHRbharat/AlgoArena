import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Camera,
  Github,
  Linkedin,
  Globe,
  Lock,
  Save,
  X,
  Plus,
  Trash2,
  Loader,
} from "lucide-react";
import { getUser, UpdateProfile, ChangePassword, DeleteUser } from "@/api/userApi";
import img from "../assets/blank.jpg";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/Spinner";
import { LogoutUser } from "@/api/authApi";
import { logout } from "@/redux/slice/authSlice";
import { useAppDispatch } from "@/redux/hook";

export const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    id: "",
    name: "",
    username: "",
    avatar: img,
    bio: "",
    github: "",
    linkedin: "",
    extraURL: "",
    email: "",
    skills: [],
  });
  const [imagechange, setImageChange] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "account" | "preferences"
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setPageLoading(true);
        const data = await getUser();
        setUserData({
          id: data.id,
          name: data.name || "",
          username: data.username || "",
          avatar: data.avatar || img,
          bio: data.bio || "",
          github: data.github || "",
          linkedin: data.linkedin || "",
          extraURL: data.extraURL || "",
          email: data.email || "",
          skills: data.skills || [],
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setPageLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserData((prev) => ({ ...prev, avatar: file }));
      setImageChange(true);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() !== "") {
      setUserData((prev) => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill("");
    }
  };

  const removeSkill = (index) => {
    setUserData((prev) => {
      const updatedSkills = [...prev.skills];
      updatedSkills.splice(index, 1);
      return { ...prev, skills: updatedSkills };
    });
  };

  const saveProfileChanges = async (e) => {
    try {
      e.preventDefault();
      const contentType =
        userData.avatar instanceof File ? userData.avatar.type : "image/jpeg";
      const updatedProfile = {
        imagechange,
        contentType,
        name: userData.name,
        bio: userData.bio,
        github: userData.github,
        linkedin: userData.linkedin,
        extraURL: userData.extraURL,
        skills: userData.skills,
      };
      setLoading(true);
      const res = await UpdateProfile(updatedProfile);
      if (res.status === 400) {
        toast.error("Invalid credentials");
        return;
      }
      if (imagechange && res.data.url) {
        await axios.put(res.data.url, userData.avatar, {
          headers: {
            "Content-Type": contentType,
          },
        });
      }
      toast.success("Profile changes saved successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while saving profile changes.");
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (e) => {
    try {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match!");
        return;
      }
      setLoading(true);
      const res = await ChangePassword({ oldPassword: currentPassword, newPassword });
      if (res.status === 200) {
        toast.success("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else if (res.status === 400) {
        toast.error("Invalid credentials");
      } else {
        toast.error("Failed to update password.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("An error occurred while updating password.");
    } finally {
      setLoading(false);
    }
  };

  const DeleteAccountHandler = async () => {
    try {
      setDeleteLoading(true);
      await LogoutUser();
      dispatch(logout());
      await DeleteUser(userData.id);
      navigate("/auth");
      toast.success("Account deleted successfully!");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("An error occurred while deleting account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const getCacheBustedUrl = (url) => `${url}?v=${new Date().getTime()}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {pageLoading ? (
        <div className="flex items-center justify-center min-h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="md:flex">
              {/* Sidebar */}
              <div className="md:w-64 bg-gray-50 dark:bg-gray-900">
                <div className="p-6">
                  <h2 className="text-lg font-semibold flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </h2>
                </div>
                <nav className="px-3 pb-6">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`flex items-center px-3 py-2 w-full text-left rounded-md mb-1 ${
                      activeTab === "profile"
                        ? "bg-purple-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("account")}
                    className={`flex items-center px-3 py-2 w-full text-left rounded-md mb-1 ${
                      activeTab === "account"
                        ? "bg-purple-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                    }`}
                  >
                    <Lock className="h-5 w-5 mr-2" />
                    Account & Security
                  </button>
                </nav>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6">
                {/* Profile Settings */}
                {activeTab === "profile" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Profile Settings</h2>

                    <form onSubmit={saveProfileChanges}>
                      {/* Profile Image */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">Profile Image</label>
                        <div className="flex items-center">
                          <div className="relative">
                            <img
                              src={
                                typeof userData.avatar === "string"
                                  ? getCacheBustedUrl(userData.avatar)
                                  : URL.createObjectURL(userData.avatar)
                              }
                              alt="Profile"
                              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                            />
                            <label
                              htmlFor="profile-image"
                              className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer"
                            >
                              <Camera className="h-4 w-4" />
                              <input
                                type="file"
                                id="profile-image"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                              />
                            </label>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Upload a new profile picture. <br />
                              Recommended size: 400x400px.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Name */}
                      <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={userData.name}
                          onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Bio */}
                      <div className="mb-6">
                        <label htmlFor="bio" className="block text-sm font-medium mb-2">
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          rows={3}
                          value={userData.bio}
                          onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                          className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Skills</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {userData.skills.map((skill, idx) => (
                            <div
                              key={idx}
                              className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                            >
                              <span>{skill}</span>
                              <button
                                type="button"
                                onClick={() => removeSkill(idx)}
                                className="ml-2 focus:outline-none"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add a skill"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            className="flex-1 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                          <button
                            type="button"
                            onClick={addSkill}
                            className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </button>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Social Links</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <input
                            type="text"
                            placeholder="GitHub URL"
                            value={userData.github}
                            onChange={(e) => setUserData({ ...userData, github: e.target.value })}
                            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="LinkedIn URL"
                            value={userData.linkedin}
                            onChange={(e) => setUserData({ ...userData, linkedin: e.target.value })}
                            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            type="text"
                            placeholder="Extra URL"
                            value={userData.extraURL}
                            onChange={(e) => setUserData({ ...userData, extraURL: e.target.value })}
                            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                        Save Changes
                      </button>
                    </form>
                  </div>
                )}

                {/* Account & Security */}
                {activeTab === "account" && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Account & Security</h2>

                    <form onSubmit={updatePassword} className="mb-6 max-w-md">
                      <label className="block text-sm font-medium mb-2">Change Password</label>
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-3 focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-3 focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white mb-4 focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {loading && <Loader className="h-4 w-4 mr-2 animate-spin" />}
                        Update Password
                      </button>
                    </form>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Delete Account</h3>
                      <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                        This action is irreversible. Deleting your account will remove all your data
                        permanently.
                      </p>
                      <button
                        onClick={DeleteAccountHandler}
                        disabled={deleteLoading}
                        className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        {deleteLoading ? (
                          <Loader className="h-4 w-4 mr-2 animate-spin inline-block" />
                        ) : (
                          "Delete Account"
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
