import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import config from "../../config/config";
import { getDecodeTokenHook } from "@/hooks/useAuth";

const Profile: React.FC = () => {
    const navigate = useNavigate();

    // Use local state instead of Redux
    const [userData, setUserData] = useState({
        _id: "",
        firstName: "",
        lastName: "",
        email: "",
        image: null as string | null,
        location: "",
        department: "",
        skills: [] as string[]
    });

    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [token, setToken] = useState<string>("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        location: "",
        department: "",
        skills: "",
        image: ""
    });

    // Fetch user data on component mount
    useEffect(() => {
        // Get token from localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            fetchUserData(storedToken);
        } else {
            // Handle no token case - redirect to login
            navigate('/login');
        }
    }, [navigate]);
    const decodeToken = getDecodeTokenHook();

    const fetchUserData = async (token: string) => {
        try {

            const response = await axios.get(`${config.backendUrl}/admin/getAllUserLists?_id=${decodeToken?._id}`, {
                headers: { token }
            });

            if (response.data && response.data.data) {
                const user = response.data.data;
                setUserData(user);
                console.log(user);

                setFormData({
                    firstName: user.firstName || "",
                    lastName: user.lastName || "",
                    location: user.location || "",
                    department: user.department || "",
                    skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
                    image: user.profilePicImageLink || null
                });

                setPreviewImage(user.profilePicImageLink || null);
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to load profile data");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setProfileImage(file);

            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("firstName", formData.firstName);
            formDataToSend.append("lastName", formData.lastName);
            formDataToSend.append("location", formData.location);
            formDataToSend.append("department", formData.department);

            // Convert skills string back to array and append
            const skillsArray = formData.skills.split(",").map(skill => skill.trim()).filter(Boolean);
            skillsArray.forEach(skill => {
                formDataToSend.append("skills", skill);
            });

            // Add profile image if selected
            if (profileImage) {
                formDataToSend.append("image", profileImage);
            }

            const response = await axios.put(
                `${config.backendUrl}/profile`,
                formDataToSend,
                {
                    headers: {
                        token: token,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            if (response.data) {
                toast.success("Profile updated successfully!");
                // console.log("New token", token);
                setToken(token);
                // Refresh user data
                fetchUserData(token);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("Failed to update profile");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen  py-8 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto">
                <div className="border-b border-gray-100 pb-5 mb-8">
                    <div className="flex justify-between items-center flex-wrap">
                        <div>
                            <h1 className="text-3xl font-bold text-white">My Profile</h1>
                            <p className="mt-1 text-white">
                                Manage your personal information and account preferences
                            </p>
                        </div>
                        <div className="flex mt-3 sm:mt-0">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 border border-white rounded-md text-white mr-3 hover:bg-red-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => (document.getElementById('profile-form') as HTMLFormElement)?.requestSubmit()}
                                disabled={isLoading}
                                className={`px-4 py-2 border border-white text-white  rounded-md hover:bg-violet-800 flex items-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isLoading && (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto">
                    {/* Profile Image Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8 pb-8 border-b border-gray-100">
                        <div className="relative mb-4 sm:mb-0 sm:mr-6">
                            <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-gray-100 shadow">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-white text-3xl font-bold">
                                        {formData.firstName.charAt(0).toUpperCase()}{formData.lastName.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="profileImage"
                                className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2.5 cursor-pointer hover:bg-gray-700 transition shadow"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                                    <circle cx="12" cy="13" r="4"></circle>
                                </svg>
                            </label>
                            <input
                                type="file"
                                id="profileImage"
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-semibold text-white">
                                {formData.firstName} {formData.lastName}
                            </h2>
                            <p className="text-gray-600 mt-1">{userData.email}</p>
                            {/* <div className="mt-2">
                                <span className="px-2 py-1 bg-green-50 text-green-800 text-xs rounded-full">
                                    Verified Account
                                </span>
                            </div> */}
                            <p className="mt-3 text-sm text-white max-w-md">
                                Update your photo and personal details here. A complete profile helps others connect with you.
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-xl font-semibold text-white mb-4">Personal Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-medium text-white">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 bg-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="block text-sm font-medium text-white">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 bg-transparent"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-white">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        value={userData.email}
                                        disabled
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-700 rounded-md text-white bg-transparent"
                                    />
                                    <p className="text-xs text-white">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="location" className="block text-sm font-medium text-white">
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        name="location"
                                        type="text"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, Country"
                                        className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Professional Information */}
                        <div className="pt-6 border-t border-gray-100">
                            <h3 className="text-xl font-semibold text-white mb-4">Professional Information</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg">
                                <div className="space-y-2">
                                    <label htmlFor="department" className="block text-sm font-medium text-white">
                                        Department
                                    </label>
                                    <select
                                        id="department"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border  border-gray-700 rounded-md focus:outline-none focus:ring-1 bg-transparent text-white"
                                    >
                                        <option className="text-black" value="">Select Department</option>
                                        <option className="text-black" value="Engineering">Engineering</option>
                                        <option className="text-black" value="Design">Design</option>
                                        <option className="text-black" value="Marketing">Marketing</option>
                                        <option className="text-black" value="Sales">Sales</option>
                                        <option className="text-black" value="Customer Support">Customer Support</option>
                                        <option className="text-black" value="Finance">Finance</option>
                                        <option className="text-black" value="HR">HR</option>
                                        <option className="text-black" value="Other">Other</option>
                                    </select>
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <label htmlFor="skills" className="block text-sm font-medium text-white">
                                        Skills (comma separated)
                                    </label>
                                    <textarea
                                        id="skills"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="React, Node.js, Design, etc."
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-700 rounded-md focus:outline-none focus:ring-1 bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills Preview */}
                        {formData.skills && (
                            <div className="pt-4">
                                <h3 className="text-lg font-semibold text-white mb-3">Your Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {formData.skills.split(",").map((skill, index) => (
                                        skill.trim() && (
                                            <div
                                                key={index}
                                                className="px-3 py-1 bg-transparent border rounded-2xl text-white text-sm"
                                            >
                                                {skill.trim()}
                                            </div>
                                        )
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>

                    {/* Mobile-only Save Button (bottom fixed) */}
                    <div className="sm:hidden fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 p-4 z-10">
                        <button
                            onClick={() => (document.getElementById('profile-form') as HTMLFormElement)?.requestSubmit()}
                            disabled={isLoading}
                            className={`w-full px-4 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 flex items-center justify-center ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                        >
                            {isLoading && (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;