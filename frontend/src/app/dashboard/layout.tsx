'use client'

import Menu from "@/component/Menu";
import { useGetAdminDashboardDataQuery, useGetSellerDashboardDataQuery } from "@/redux/api/dashboardApi";
import { setDashboardData } from "@/redux/reducers/dashboardReducer";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const { user } = useSelector((state: any) => state.authReducer);
    const dispatch = useDispatch();

    const shouldFetchAdmin = user?.role === "Admin" && !!user?.role;
    const shouldFetchSeller = user?.role === "Seller" && !!user?.role;

    const { data: adminData } = useGetAdminDashboardDataQuery(undefined, {
        skip: !shouldFetchAdmin, // Skip fetching if condition is not met
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const { data: sellerData } = useGetSellerDashboardDataQuery(undefined, {
        skip: !shouldFetchSeller, // Skip fetching if condition is not met
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    useEffect(() => {
        const data = user?.role === "Admin" ? adminData : sellerData;
        if (data) {
            dispatch(setDashboardData(data));
        }
    }, [adminData, sellerData, user?.role, dispatch]);
   
    return (
        <div className="max-h-[100vh] min-h-screen mx-auto overflow-hidden w-full flex bg-[#fbfdff] relative">
            <section className="flex-1 bg-white shadow-[2px_4px_9px_rgba(62,29,29,0.05)] p-5">
                <Menu />
            </section>
            <section className="flex-[6] p-5 overflow-y-scroll">
                {children}
            </section>
        </div>
    );
};

export default DashboardLayout;
