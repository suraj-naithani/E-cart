'use client'
import React, { useEffect } from 'react';
import { FaRegUser } from "react-icons/fa";
import { IoCartOutline, IoSettingsOutline } from "react-icons/io5";
import { LuLayoutDashboard, LuShoppingBag } from "react-icons/lu";
import { MdOutlineReviews } from "react-icons/md";
import { PiSignOut } from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { TfiStatsUp } from "react-icons/tfi";
import toast from "react-hot-toast";
import { clearToken, userExists, userNotExist } from '@/redux/reducers/authReducer';
import { useFetchUserProfileQuery } from '@/redux/api/profileApi';
import { clearDashboardData } from '@/redux/reducers/dashboardReducer';
import { removeAllProducts} from '@/redux/reducers/productReducer';
import { useRouter } from "next/navigation";
import Link from 'next/link';

type MenuProps = {};

const Menu: React.FC<MenuProps> = () => {
    const { user } = useSelector((state: any) => state.authReducer);

    const dispatch = useDispatch();
    const router = useRouter();

    const { data } = useFetchUserProfileQuery(undefined, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    useEffect(() => {
        if (data) {
            dispatch(userExists(data.user));
        } else {
            dispatch(userNotExist());
        }
    }, [user, data, dispatch]);


    const handleLogout = async () => {
        try {
            dispatch(clearToken());
            dispatch(userNotExist());
            dispatch(clearDashboardData());
            dispatch(removeAllProducts());
            router.push("/signin");
            toast.success("Successfully logged out");
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    const menuLinks = user?.role === "Admin"
        ? [
            {
                to: "/dashboard/home",
                icon: <LuLayoutDashboard />,
                label: "Dashboard",
            },
            {
                to: "/dashboard/products",
                icon: <LuShoppingBag />,
                label: "Products",
            },
            {
                to: "/dashboard/allOrder",
                icon: <IoCartOutline />,
                label: "All Order",
            },
            {
                to: "/dashboard/profile",
                icon: <FaRegUser />,
                label: "Profile",
            },
            {
                to: "/dashboard/setting",
                icon: <IoSettingsOutline />,
                label: "Settings",
            },
        ]
        : [
            {
                to: "/dashboard/home",
                icon: <LuLayoutDashboard />,
                label: "Dashboard",
            },
            {
                to: "/dashboard/products",
                icon: <LuShoppingBag />,
                label: "Products",
            },
            {
                to: "/dashboard/allOrder",
                icon: <IoCartOutline />,
                label: "All Order",
            },
            {
                to: "/dashboard/reviews",
                icon: <MdOutlineReviews />,
                label: "Review",
            },
            {
                to: "/dashboard/profile",
                icon: <FaRegUser />,
                label: "Profile",
            },
            {
                to: "/dashboard/setting",
                icon: <IoSettingsOutline />,
                label: "Settings",
            },
        ];

    return (
        <div className="flex flex-col justify-between h-full w-full pt-7">
            {/* Profile Section */}
            <div className="flex flex-col gap-7">
                <div className="flex flex-col items-center gap-4">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=random`}
                        alt="Profile"
                        className="w-12 h-12 rounded-full"
                    />
                    <div className="text-center">
                        <p className="text-[#343a40]">{user?.name || "Guest"}</p>
                        <p className="text-sm text-[#8590a5]">{user?.role || "User"}</p>
                    </div>
                </div>

                {/* Menu Links */}
                <div className="flex flex-col gap-5 w-full items-center md:items-start">
                    {menuLinks.map(({ to, icon, label }) => (
                        <Link
                            key={to}
                            href={to}
                            className={`flex items-center gap-3 px-5 py-2 text-[#8590a5] hover:text-[#3592ff] rounded-md ${router.pathname === to ? 'text-[#3592ff] bg-[#f0f4ff]' : ''
                                } md:w-full`}
                            aria-label={label}
                        >
                            {icon}
                            <p className="hidden md:block whitespace-nowrap">{label}</p>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Sign Out */}
            <div className="flex items-center justify-center md:justify-start gap-3 px-5 py-2 text-[#8590a5] hover:text-[#3592ff] rounded-md">
                <PiSignOut className="text-center" />
                <button className="hidden md:block whitespace-nowrap" onClick={handleLogout}>
                    Sign Out
                </button>
            </div>
        </div>
    );
};

export default Menu;
