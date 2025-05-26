import axios from "axios";
import { SetPosts } from "../redux/postSlice";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8800";


export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, method, data }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return result?.data;
  } catch (error) {
    const message = error?.response?.data?.message || error?.message || "Something went wrong";
    const status = error?.response?.data?.status || "failed";
    return { status, message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  try {
    if (!uploadFile) return null;

    const formData = new FormData();
    formData.append("file", uploadFile);
    formData.append("upload_preset", "Flicksy");
    formData.append("cloud_name", "detyj1tco");
    formData.append("folder", "Flicksy");

    console.log("Starting file upload to Cloudinary...", uploadFile);
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/detyj1tco/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    console.log("Cloudinary response:", data);

    if (!response.ok) {
      console.error("Upload failed:", data);
      throw new Error(data.error?.message || "Failed to upload image");
    }

    if (!data.secure_url) {
      console.error("No secure URL in response:", data);
      throw new Error("Upload succeeded but no URL returned");
    }

    console.log("Upload successful, URL:", data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error("Upload error details:", error);
    throw new Error("Image upload failed: " + (error.message || "Unknown error"));
  }
};

// Fetch posts
export const fetchPosts = async (token, dispatch) => {
  try {
    const res = await apiRequest({
      url: "/posts",
      token: token,
      method: "GET",
    });
    
    if (res?.status !== "failed") {
      dispatch(SetPosts(res?.data || []));
      return res?.data;
    } else {
      console.error("Error fetching posts:", res?.message);
      dispatch(SetPosts([]));
      return [];
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    dispatch(SetPosts([]));
    return [];
  }
};

// Like/unlike a post
export const likePost = async ({ token, uri }) => {
  try {
    const res = await apiRequest({
      url: uri,
      token,
      method: "POST", // Your backend uses PUT for likes
    });
    return res;
  } catch (error) {
    console.error("Error liking post:", error);
  }
};

// Delete a post
export const deletePost = async (id, token) => {
  try {
    
    const res= await apiRequest({
      url: "/posts/"+ id,
      token: token,
      method: "DELETE",
    });
    return;
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

// Get user info
export const getUserInfo = async (token, id) => {
  try {
    const uri = id === undefined ? "/users/get-user" : "/users/get-user/" + id;
    const res = await apiRequest({
      url: uri,
      token: token,
      method: "POST",
    });

    if (res?.message === "Authentication failed") {
      localStorage.removeItem("user");
      alert("Session expired, please login again");
      window.location.replace("/login");
    }

    return res?.user;
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

// Send friend request
export const sendFriendRequest = async (token, id) => {
  try {
    const res = await apiRequest({
      url: "/users/friend-request",
      token: token,
      method: "POST",
      data: { requestTo: id },
    });
    return res;
  } catch (error) {
    console.error("Error sending friend request:", error);
    return { status: "failed", message: error.message };
  }
};

// Get friend requests
export const getFriendRequests = async (token) => {
  try {
    const res = await apiRequest({
      url: "/users/get-friend-request",
      token: token,
      method: "POST",
    });
    return res;
  } catch (error) {
    console.error("Error getting friend requests:", error);
    return { status: "failed", message: error.message };
  }
};

// Get suggested friends
export const getSuggestedFriends = async (token) => {
  try {
    const res = await apiRequest({
      url: "/users/suggested-friends",
      token: token,
      method: "POST",
    });
    return res;
  } catch (error) {
    console.error("Error getting suggested friends:", error);
    return { status: "failed", message: error.message };
  }
};

// Track profile view
export const viewUserProfile = async (token, id) => {
  try {
    const res= await apiRequest({
      url: "/users/profile-view",
      token,
      method: "POST",
      data: {  id },
    });
    return res;
  } catch (error) {
    console.error("Error viewing user profile:", error);
  }
};
