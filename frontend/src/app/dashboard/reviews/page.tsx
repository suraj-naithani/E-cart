'use client'
import { FaStar } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useSelector } from "react-redux";
import moment from "moment";
import toast from "react-hot-toast";
import { useDeleteReviewMutation, useGetMyProductReviewsQuery } from "@/redux/api/reviewApi";

interface Review {
    id: string;
    _id: string;
    userId: {
        name: string;
    };
    date: string;
    rating: number;
    comment: string;
}

interface ReviewData {
    reviews: Review[];
}

const DashboardReview = () => {
    const { data, error } = useGetMyProductReviewsQuery(undefined, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    const [deleteReview] = useDeleteReviewMutation();

    const handleDelete = async (id: string) => {
        const toastId = toast.loading("Deleting review...");
        try {
            const response = await deleteReview(id);
            if (response.data?.success) {
                toast.success("Review deleted successfully!", { id: toastId });
            }
        } catch (error) {
            toast.error("Failed to delete the Review.", { id: toastId });
        }
    };

    return (
        <div className="flex flex-col gap-6 p-6 bg-[#ffffff] min-h-screen">
            <h3 className="text-2xl font-semibold text-gray-800">
                Review ({data?.reviews?.length})
            </h3>
            {data?.reviews?.length === 0 ? (
                <div className="noData h-[80vh] flex items-center justify-center">
                    <p className="text-xl text-gray-500">No reviews found</p>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-[3]">
                        {data?.reviews?.map((review) => (
                            <div key={review.id} className="flex flex-col gap-4 p-6 rounded-lg bg-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${review.userId.name}&background=random`}
                                            alt={review.userId.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-normal text-gray-800">{review.userId.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {moment(review.date).format("MMM DD, YYYY")}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center ${review.rating === 5
                                                ? "bg-[#14958f]"
                                                : review.rating === 4
                                                    ? "bg-[#14958f]"
                                                    : review.rating === 3
                                                        ? "bg-[#72bfbc]"
                                                        : review.rating === 2
                                                            ? "bg-[#fcb301]"
                                                            : "bg-[#f16565]"
                                            } text-white text-sm px-2 py-1 rounded-full`}
                                    >
                                        <p>{review.rating}</p>
                                        <FaStar className="ml-1 text-xs" />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center gap-5">
                                    <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                                    <MdDeleteOutline
                                        className="text-2xl text-gray-500 hover:text-red-500 cursor-pointer shrink-0"
                                        onClick={() => handleDelete(review.id)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardReview;
