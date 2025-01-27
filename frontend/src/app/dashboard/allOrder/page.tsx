'use client'

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Table from "@/component/Table";
import { useGetOrdersQuery } from "@/redux/api/orderApi";
import { addOrder } from "@/redux/reducers/orderReducer";
import UpdateOrderStatus from "@/dialogs/UpdateOrderStatusDialog";

const DashboardOrders = () => {
    const userRole = useSelector((state) => state.authReducer?.user?.role);
    const dispatch = useDispatch();
    const { data, isLoading } = useGetOrdersQuery(undefined, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    const adminData = useSelector((state) => state.dashboardReducer?.data);
    const adminIsLoading = useSelector((state) => state.dashboardReducer.isLoading); // Adjust based on your state structure
    useEffect(() => {
        if (data) {
            dispatch(addOrder(data.orders));
        }
    }, [data, dispatch]);

    const adminHeadings = [
        "S.No",
        "Image",
        "Product Name",
        "Seller Name",
        "Seller Email",
        "Seller Phone",
        "User Name",
        "User Email",
        "User Phone",
        "Quantity",
        "Price",
        "Status",
    ];

    const sellerHeadings = [
        "S.No",
        "Image",
        "Product Name",
        "User Name",
        "User Email",
        "User Phone",
        "Quantity",
        "Price",
        "Status",
        "Actions",
    ];

    const adminTableData =
        adminData?.stats?.allOrder?.map((order, i) => ({
            "s.no": i + 1,
            image: (
                <img
                    src={order.orderItem?.photo}
                    alt={order.orderItem?.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm transition-transform duration-300 hover:scale-110"
                />
            ),
            "product name": order.orderItem?.name,
            "seller name": order.seller?.name,
            "seller email": order.seller?.email,
            "seller phone": order.seller?.phone,
            "user name": order.user?.name,
            "user email": order.user?.email,
            "user phone": order.user?.phone,
            quantity: order.orderItem?.quantity,
            price: `₹${order.orderItem?.price}`,
            status: (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {order.status}
                </span>
            ),
            "order date": new Date(order.createdAt).toLocaleDateString(),
        })) || [];

    const sellerTableData =
        data?.orders?.map((order, i) => ({
            "s.no": i + 1,
            image: (
                <img
                    src={order.orderItem?.photo}
                    alt={order.orderItem?.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm transition-transform duration-300 hover:scale-110"
                />
            ),
            "product name": order.orderItem?.name,
            "user name": order.user?.name,
            "user email": order.user?.email,
            "user phone": order.user?.phone || "N/A",
            quantity: order.orderItem?.quantity,
            price: `₹${order.orderItem?.price * order.orderItem?.quantity}`,
            status: (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {order.status}
                </span>
            ),
            actions: (
                <div className="flex gap-2">
                    <UpdateOrderStatus orderData={order} />
                </div>
            ),
        })) || [];

    return (
        <div className="flex flex-col gap-6 p-6 bg-[#ffffff] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-800">Products</h3>
                <p className="text-gray-600">
                    <Link href="/" className="hover:underline">
                        Dashboard
                    </Link>{" "}
                    /{" "}
                    <Link href="/product" className="hover:underline">
                        Products
                    </Link>
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                {userRole === "Admin"
                    ? !adminIsLoading && (
                        <Table headings={adminHeadings} data={adminTableData} />
                    )
                    : !isLoading && (
                        <Table headings={sellerHeadings} data={sellerTableData} />
                    )}
            </div>
        </div>
    );
};

export default DashboardOrders;
