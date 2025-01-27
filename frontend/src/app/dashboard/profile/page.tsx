'use client';

import EditProfileDialog from "@/dialogs/EditProfileDialog";
import {
    FaAddressCard,
    FaEnvelope,
    FaPhoneAlt,
    FaUserAlt,
    FaUserShield,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const DashboardProfile = () => {
    const { user } = useSelector((state) => state.authReducer);

    // useEffect(() => {
    //     if (user) {
    //         refetch();
    //     }
    // }, [user, refetch]);

    return (
        user && (
            <div className="rounded-lg p-8 flex flex-col gap-2 bg-white shadow-md sm:p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-lg font-semibold">Profile</h1>
                    <EditProfileDialog user={user} />
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                            <FaUserAlt className="text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-500">Name</p>
                                <p className="text-gray-800">{user.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaEnvelope className="text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-500">Email</p>
                                <p className="text-gray-800">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaPhoneAlt className="text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-500">Phone</p>
                                <p className="text-gray-800">{user.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaAddressCard className="text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-500">Address</p>
                                <p className="text-gray-800">{user.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaUserShield className="text-gray-500" />
                            <div>
                                <p className="font-medium text-gray-500">Role</p>
                                <p className="text-gray-800">{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default DashboardProfile;
