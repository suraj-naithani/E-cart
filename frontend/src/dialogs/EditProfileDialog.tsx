'use client'

import { useUpdateUserProfileMutation } from "@/redux/api/profileApi";
import { userExists } from "@/redux/reducers/authReducer";
import { useState, ChangeEvent, FormEvent, FC } from "react";
import toast from "react-hot-toast";
import { CiEdit } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";// Create and import the User type

interface User {
    name: string;
    email: string;
    password: string;
    phone: number;
    address: string;
    role: string; 
}

interface EditProfileDialogProps {
    user: User;
}

const EditProfileDialog: FC<EditProfileDialogProps> = ({ user }) => {
    const [isOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        password: undefined,
        phone: user.phone || "",
        address: user.address || "",
    });

    const dispatch = useDispatch();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Updating profile...");

        const updatedData = {
            ...formData,
            password: formData.password || undefined,
        };

        try {
            const response = await updateProfile(updatedData);
            if (response.data.success) {
                dispatch(userExists(response.data.user));
                toast.success("Profile updated successfully!", { id: toastId });
            } 
            if(response.error){ 
                toast.error(response.message, { id: toastId });
            }
            closeModal();
        } catch (error) {
            toast.error("An error occurred during update.", { id: toastId });
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="flex items-center justify-center p-3 bg-white text-black rounded-full  hover:bg-gray-100 transition duration-300"
            >
                <CiEdit size={24} color="text-gray-800" />
            </button>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h4 className="text-xl font-semibold">Edit Profile</h4>
                            <button
                                className="text-gray-500 hover:text-black transition-colors duration-300"
                                onClick={closeModal}
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-4"
                        >
                            <div className="space-y-1">
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="*****"
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label
                                    htmlFor="address"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Address
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-300 ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                                        }`}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default EditProfileDialog;
