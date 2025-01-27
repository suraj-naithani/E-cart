import { useDeleteProductMutation } from "@/redux/api/sellerApi";
import { removeProduct } from "@/redux/reducers/productReducer";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";

interface DeleteProductDialogProps {
    productId: string;
    productName: string;
}

const DeleteProductDialog: React.FC<DeleteProductDialogProps> = ({ productId, productName }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [deleteProduct, { isLoading }] = useDeleteProductMutation({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    const dispatch = useDispatch();

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const handleDelete = async () => {
        const toastId = toast.loading("Deleting product...");
        try {
            const response = await deleteProduct(productId);
            if (response.data) {
                dispatch(removeProduct(productId));
                toast.success("Product deleted successfully!", { id: toastId });
                closeModal();
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete the product.", { id: toastId });
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
            >
                Delete
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
                                Are you sure you want to delete the product{" "}
                                <span className="font-semibold">{productName}</span>?
                            </p>
                            <div className="mt-8 flex justify-end gap-4">
                                <button
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300"
                                    onClick={handleDelete}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Deleting..." : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DeleteProductDialog;
