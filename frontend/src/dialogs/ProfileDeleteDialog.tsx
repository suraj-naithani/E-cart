'use client'
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { userNotExist } from "@/redux/reducers/authReducer";
import { useDeleteUserMutation } from "@/redux/api/profileApi";

const ProfileDeleteDialog: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [deleteAccount, { isLoading }] = useDeleteUserMutation();
    const dispatch = useDispatch();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleDeleteAccount = async () => {
        const toastId = toast.loading("Deleting account...");
        try {
            const response = await deleteAccount().unwrap();
            if (response.success) {
                dispatch(userNotExist());
                toast.success("Account deleted successfully.", { id: toastId });
            } else {
                throw new Error(response.message || "Failed to delete account");
            }
        } catch (error: any) {
            toast.error(error.message || "Something went wrong", { id: toastId });
        } finally {
            closeModal();
        }
    };

    return (
        <div className="flex justify-end">
            <button
                onClick={openModal}
                className="flex items-center justify-center sm:justify-start gap-2 p-2 sm:px-3 sm:py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-300"
            >
                <FaTrash className="text-lg sm:hidden" />
                <p className="hidden sm:inline">Delete Account</p>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 ease-in-out scale-100 opacity-100">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <h4 className="text-xl font-semibold text-gray-800">
                                Confirm Deletion
                            </h4>
                            <button
                                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                onClick={closeModal}
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <div className="mt-6">
                            <p className="text-gray-700">
                                Are you sure you want to delete your account? This action is
                                irreversible and will delete all your data.
                            </p>
                        </div>
                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                                disabled={isLoading}
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDeleteDialog;
