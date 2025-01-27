import { useState, FC } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateOrderMutation } from "@/redux/api/orderApi";
import { updateOrders } from "@/redux/reducers/orderReducer";

const UpdateOrderStatus = ({ orderData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(orderData.status);
    const [updateOrder, { isLoading }] = useUpdateOrderMutation();
    const dispatch = useDispatch();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const { order } = useSelector((state) => state.orderReducer);

    const handleStatusUpdate = async () => {
        const toastId = toast.loading("Updating order status...");
        try {
            const response = await updateOrder(orderData.id);
            if (response) {
                setCurrentStatus(response.order?.status);
                dispatch(updateOrders(response));
                toast.success(`Order status updated`, { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to update order status. Try again later.", { id: toastId });
        }
        closeModal();
    };

    return (
        <>
            <button
                onClick={openModal}
                className="px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
                disabled={currentStatus === "Delivered"}
            >
                <p>Update</p>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 ease-in-out scale-100 opacity-100">
                        <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                            <h4 className="text-xl font-semibold text-gray-800">
                                Update Order Status
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
                                Current Status:{" "}
                                <span className="font-semibold text-blue-600">
                                    {orderData.status}
                                </span>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Click "Update" to proceed to the next status in the order flow.
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
                                onClick={handleStatusUpdate}
                                className={`px-6 py-2 text-white rounded-full bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg  ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                                    }`}
                                disabled={isLoading}
                            >
                                {isLoading ? "Update..." : "Update"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UpdateOrderStatus;
