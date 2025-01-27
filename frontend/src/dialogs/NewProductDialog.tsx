import { useNewProductMutation } from "@/redux/api/sellerApi";
import { addProduct } from "@/redux/reducers/productReducer";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";

const NewProductDialog = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        originalPrice: "",
        discountPercentage: "",
        category: "Electronics",
        stock: "",
        image: [] as File[], // Changed to support multiple images
        shippingFee: "",
    });

    const [imagePreviews, setImagePreviews] = useState<string[]>([]); // State for image previews

    const dispatch = useDispatch();
    const { product } = useSelector((state: any) => state.productReducer);
    const [addNewProduct, { isLoading }] = useNewProductMutation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setFormData((prevData) => ({
            ...prevData,
            image: [...prevData.image, ...files], // Append new files to existing ones
        }));

        // Create image previews
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...previews]);
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        setImagePreviews([]); // Clear previews when closing modal
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const toastId = toast.loading("Creating new product...");

        const newProduct = new FormData();
        for (const key in formData) {
            if (key === "image") {
                formData.image.forEach((file) => newProduct.append("image", file)); // Append each image file
            } else {
                newProduct.append(key, formData[key]);
            }
        }

        try {
            const response = await addNewProduct(newProduct);
            (response)
            if (response.data) {
                dispatch(addProduct([...product, response.data.product]));
                toast.success("New product added successfully!", { id: toastId });
            }
            closeModal();
        } catch (error) {
            toast.error("An error occurred during adding.", { id: toastId });
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300 w-fit"
            >
                <FaPlus size={16} />
                <p className="hidden sm:inline">New Product</p>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="rounded-lg shadow-xl w-full max-w-md h-[90vh] overflow-hidden animate-scaleIn bg-[#ffffff]">
                        <div className="flex justify-between items-center p-6 border-b border-border">
                            <h4 className="text-xl font-semibold text-foreground">Add Product</h4>
                            <button
                                className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                                onClick={closeModal}
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-4"
                        >
                            <InputField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <TextAreaField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Original Price"
                                name="originalPrice"
                                type="number"
                                value={formData.originalPrice}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Discount Percentage"
                                name="discountPercentage"
                                type="number"
                                value={formData.discountPercentage}
                                onChange={handleChange}
                            />
                            <SelectField
                                label="Category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                options={[
                                    "Electronics",
                                    "Clothing",
                                    "Books",
                                    "Home Appliances",
                                    "Sports",
                                    "Other",
                                ]}
                            />
                            <FileUploadField
                                label="Upload Images"
                                name="images" // Updated to reflect multiple images
                                onChange={handleImageChange}
                            />

                            {/* Preview Section for Uploaded Images */}
                            {imagePreviews.length > 0 && (
                                <div className="mt-4">
                                    <h5 className="text-sm font-medium text-gray-700">Image Previews:</h5>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {imagePreviews.map((preview, index) => (
                                            <img key={index} src={preview} alt={`Preview ${index}`} className="w-20 h-20 object-cover rounded-md" />
                                        ))}
                                    </div>
                                </div>
                            )}

                            <InputField
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={handleChange}
                            />
                            <InputField
                                label="Shipping Fee"
                                name="shippingFee"
                                type="number"
                                value={formData.shippingFee}
                                onChange={handleChange}
                            />
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
                                    onClick={closeModal}
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={isLoading}
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

const InputField = ({ label, name, type = "text", value, onChange }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-foreground">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>
);

const TextAreaField = ({ label, name, value, onChange }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-foreground">{label}</label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        ></textarea>
    </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-foreground">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);

const FileUploadField = ({ label, name, onChange }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="block text-sm font-medium text-foreground">{label}</label>
        <input
            type="file"
            id={name}
            name={name}
            multiple // Allow multiple files to be selected
            onChange={onChange}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
    </div>
);

export default NewProductDialog;
