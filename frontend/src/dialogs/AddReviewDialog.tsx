import { useCreateReviewMutation } from "@/redux/api/reviewApi";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

interface AddReviewDialogProps {
  productId: { id: number };
}

const AddReviewDialog: React.FC<AddReviewDialogProps> = ({ productId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    comment: "",
    rating: 1,
  });

  const [addReview, { isLoading }] = useCreateReviewMutation();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStarClick = (rating: number) => {
    setFormData((prevFormData) => ({ ...prevFormData, rating }));
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Posting review...");

    try {
      const response = await addReview({
        review: formData,
        productId,
      });
      if (response.data) {
        toast.success("Review added successfully!", { id: toastId });
        closeModal();
      }
      if (response.error) {
        toast.error(response.error.data.message.split(",")[0], {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error(
        error.data?.message?.split(",")[0] ||
          "An error occurred during posting.",
        {
          id: toastId,
        }
      );
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-200"
      >
        Post Review
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="flex justify-between items-center p-6 border-b">
              <h4 className="text-xl font-semibold">Post Review</h4>
              <button
                className="text-gray-500 hover:text-gray-800"
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
                <label className="block text-sm font-medium">Stars</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      size={24}
                      color={star <= formData.rating ? "#ffc107" : "#e4e5e9"}
                      onClick={() => handleStarClick(star)}
                      className="cursor-pointer"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium">Comment</label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Write your review here..."
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Posting..." : "Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddReviewDialog;
