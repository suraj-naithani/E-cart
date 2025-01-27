'use client'
import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa6";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useGetSingleProductQuery } from "@/redux/api/productApi";
import { useParams } from "next/navigation";
import { useGetReviewsQuery } from "@/redux/api/reviewApi";
import moment from "moment";
import { addToCart } from "@/redux/reducers/cartReducer";
import { useNewCartMutation } from "@/redux/api/cartApi";
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import AddReviewDialog from "@/dialogs/AddReviewDialog";

const SingleProduct = () => {
    const params = useParams();
    const productId = params.id;

    const dispatch = useDispatch();

    const { cartItems } = useSelector((state) => state.cartReducer);
    const { role } = useSelector((state) => state.authReducer);

    const [quantity, setQuantity] = useState(1);

    const handleDec = () => setQuantity((prev) => Math.max(1, prev - 1));
    const handleInc = () => setQuantity((prev) => Math.min(10, prev + 1));

    const { data, error, isLoading, refetch } = useGetSingleProductQuery(productId);

    const [addNewProduct, { isLoading: cartIsLoading }] = useNewCartMutation();

    const [image, setImage] = useState(null);

    const handleImage = (e) => {
        setImage(e.target.src);
    }

    const handleAddToCart = async (e) => {
        e.preventDefault();
        const newProduct = {
            productId: data?.product.id,
            quantity,
        };

        const toastId = toast.loading("Adding to cart...");

        try {
            const response = await addNewProduct(newProduct);
            if (response.data) {
                response.data.cart.items.forEach((product) => {
                    dispatch(
                        addToCart({
                            productId: product.productId,
                            quantity: quantity,
                        })
                    );
                });
                toast.success("Product added successfully!", { id: toastId });
            }
        } catch (error) {
            toast.error("An error occurred during adding.", { id: toastId });
        }
    };

    const { data: reviewData, isLoading: reviewLoading } = useGetReviewsQuery(productId);

    useEffect(() => {
        if (productId) {
            refetch();
        }
    }, [productId, refetch]);

    return !isLoading && !reviewLoading ? (
        <>
            <Navbar />
            <div className="flex flex-col gap-10 p-6 max-w-7xl mx-auto w-full">
                <div className="flex flex-wrap items-center justify-between">
                    <h3 className="text-2xl font-semibold text-gray-800">Product</h3>
                    <p className="text-gray-600">
                        <Link href="/">home</Link> / <Link href="/product">product</Link> /{" "}
                        {data.product.name}
                    </p>
                </div>
                <div className="flex flex-wrap flex-col gap-8 lg:flex-row lg:gap-16">
                    <div className="flex-[2] flex flex-col gap-6 items-center w-full lg:w-auto">
                        <div className="flex justify-center w-full">
                            <img src={image ? image : data.product.image[0]?.url} alt="" width={400} height={500} className="object-contain w-full max-w-sm h-auto rounded-md" />
                        </div>
                        <div className='flex gap-2 sm:gap-2 cursor-pointer'>
                            {data.product.image.map((src, index) => (
                                <img
                                    key={index}
                                    src={src.url}
                                    alt=""
                                    width={90}
                                    height={100}
                                    onClick={handleImage}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-[3] flex flex-col gap-8 w-full lg:w-auto">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-2xl font-semibold">{data.product.name}</h3>
                            <div className="flex flex-wrap items-center gap-4">
                                <h4 className="text-xl font-semibold">₹{data.product.price}</h4>
                                <p className="text-gray-500">
                                    MRP{" "}
                                    <span className="line-through">
                                        ₹{data.product.originalPrice}
                                    </span>
                                </p>
                                <p>({data.product.discountPercentage}% OFF)</p>
                            </div>
                        </div>

                        {
                            reviewData?.stats.totalReviews > 0 &&
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, index) => (
                                        <FaStar
                                            key={index}
                                            className={index < Math.floor(parseInt(reviewData?.stats?.totalRatings.totalRating.substr(0, 3)) || 0) ? "text-yellow-500" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <p className="ml-2">
                                    {reviewData?.stats?.totalRatings.totalRating.substr(0, 3) || "4.5"} reviews{" "}
                                    <small>({reviewData?.stats?.reviews?.length || "25"})</small>
                                </p>
                            </div>
                        }

                        <p>{data.product.description}</p>

                        <div className="flex flex-col gap-2">
                            <li className="font-semibold">
                                Available:{" "}
                                <span className="font-normal">
                                    {data.product.stock > 0 ? "In Stock" : "Out of Stock"}
                                </span>
                            </li>
                            <li className="font-semibold">
                                Category:{" "}
                                <span className="font-normal">{data.product.category}</span>
                            </li>
                            <li className="font-semibold">
                                Shipping Fee:{" "}
                                <span className="font-normal">
                                    {data.product.shippingFee
                                        ? `₹${data.product.shippingFee}`
                                        : "Free"}
                                </span>
                            </li>
                            <li className="font-semibold">
                                Return: <span className="font-normal">14-day Easy Return</span>
                            </li>
                        </div>

                        <div className="flex items-center gap-4">
                            <p className="font-semibold">Qty</p>
                            <div className="flex items-center gap-2">
                                <button
                                    className="w-10 h-10 bg-gray-200 text-xl flex items-center justify-center rounded-full"
                                    onClick={handleDec}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    min={1}
                                    max={10}
                                    value={quantity}
                                    readOnly
                                    className="w-16 text-center border rounded-md p-2"
                                />
                                <button
                                    className="w-10 h-10 bg-gray-200 text-xl flex items-center justify-center rounded-full"
                                    onClick={handleInc}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="bg-gray-800 text-white flex items-center gap-2 py-2 px-6 rounded-md hover:bg-gray-700"
                            >
                                <IoCartOutline className="text-xl" /> Add to cart
                            </button>
                            <button className="bg-gray-800 text-white flex items-center gap-2 py-2 px-6 rounded-md hover:bg-gray-700">
                                <IoMdHeartEmpty className="text-xl" /> Wishlist
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <section className="flex flex-wrap p-6 max-w-7xl mx-auto w-full flex-col-reverse gap-8 lg:flex-row lg:gap-16">
                <div className="flex flex-col gap-5 flex-1">
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-gray-800">
                            Customer Reviews
                        </h4>
                        {role === "Buyer" && <AddReviewDialog productId={productId} />}
                    </div>

                    {reviewData?.stats?.reviews?.length === 0 ? (
                        <div className="text-center p-8 rounded-lg shadow-sm">
                            <p className="text-gray-600 text-base">No review found</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 px-5">
                            {reviewData?.stats?.reviews?.map((review) => (
                                <div
                                    className="flex flex-col gap-4 border-b border-gray-200 pb-5"
                                    key={review.id}
                                >
                                    <div className="flex gap-2 items-center">
                                        <img
                                            src={
                                                review
                                                    ? `https://ui-avatars.com/api/?name=${review.user.name}&background=random`
                                                    : "./avatar.png"
                                            }
                                            alt=""
                                            className="w-11 h-11 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-gray-600">{review.user.name}</p>
                                            <p className="text-gray-500 text-sm">
                                                {moment(review.createdAt).fromNow()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <div
                                            className={`flex justify-center items-center bg-[#1d9792] text-white rounded-sm px-1 text-xs gap-1`}
                                        >
                                            <p>{review.rating}</p>
                                            <FaStar className="text-[8px]" />
                                        </div>
                                        <p className="text-gray-500">
                                            {moment(review.createdAt).format("MMM YYYY")}
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-5 flex-1">
                    {reviewData.stats.reviews.length === 0 ? null : (
                        <>
                            <h4 className="text-lg font-semibold text-gray-800">Rating</h4>
                            <div className="flex gap-12 items-center">
                                <div className="text-center">
                                    <p className="text-4xl text-gray-800">
                                        {reviewData.stats.totalRatings.totalRating.substr(0, 3)}{" "}
                                        <FaStar className="inline-block" />
                                    </p>
                                    <p className="text-gray-600">
                                        {reviewData.stats.totalReviews} Ratings
                                    </p>
                                </div>
                                <span className="block w-[1.5px] bg-gray-300 h-full"></span>

                                <div>
                                    {Array.from({ length: 5 }, (_, index) => 5 - index).map((rating) => {
                                        const ratingData = reviewData.stats.totalStarsGroup.find(
                                            (group) => group.rating === rating
                                        );

                                        const count = ratingData ? parseInt(ratingData.count) : 0;

                                        const percentage = ((count / reviewData.stats.totalReviews) * 100).toFixed(2);

                                        return (
                                            <div className="flex gap-2 items-center" key={rating}>
                                                <p className="text-gray-600 text-sm flex items-center">
                                                    {rating}
                                                    <FaStar className="ml-1 text-[10px]" />
                                                </p>
                                                <div className="relative bg-gray-300 w-24 h-[3px] overflow-hidden">
                                                    <div
                                                        className={`absolute top-0 left-0 h-full transition-width ease-in-out ${rating === 5 || rating === 4
                                                            ? "bg-[#14958f]"
                                                            : rating === 3
                                                                ? "bg-[#72bfbc]"
                                                                : rating === 2
                                                                    ? "bg-[#fcb301]"
                                                                    : "bg-[#f16565]"
                                                            }`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <p className="text-gray-600 text-sm">{count}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}

                </div>
            </section>
            <Footer />
        </>
    ) : (
        "Loading..."
    );
};

export default SingleProduct;
