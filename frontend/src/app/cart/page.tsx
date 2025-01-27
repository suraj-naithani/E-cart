'use client'
import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import { useRemoveFromCartMutation } from "@/redux/api/cartApi";
import { removeFromCart, setTotal, updateDiscount, updateShippingCharges } from "@/redux/reducers/cartReducer";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { IoCartOutline, IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
const Cart: React.FC = () => {
    const dispatch = useDispatch();

    const { cartItems } = useSelector((state: RootState) => state.cartReducer);
    const [removeItemFromCart] = useRemoveFromCartMutation();

    const totalPrice = cartItems.reduce((total, item) => {
        const price = Number(item.product.originalPrice) || 0;
        const quantity = item.quantity || 0;
        return total + price * quantity;
    }, 0);

    const totalDiscountPrice = cartItems.reduce((total, item) => {
        const price = Number(item.product.price) || 0;
        const quantity = item.quantity || 0;
        return total + price * quantity;
    }, 0);

    const shippingFee = cartItems.reduce((total, item) => {
        const fee = Number(item.product.shippingFee) || 0;
        const quantity = item.quantity || 0;
        if (quantity === 1 && item.product.price < 300) {
            return total + fee;
        }
        return total;
    }, 0);

    const handleRemoveFromCart = async (productId: string) => {
        const toastId = toast.loading("Removing from cart...");
        try {
            const response = await removeItemFromCart(productId);
            if (response.data.success) {
                dispatch(removeFromCart(productId));
                toast.success("Product removed successfully!", { id: toastId });
            }
        } catch (error) {
            toast.error("An error occurred while removing.", { id: toastId });
        }
    };

    useEffect(() => {
        dispatch(setTotal());
        dispatch(updateShippingCharges(shippingFee));
        dispatch(updateDiscount(totalDiscountPrice));
    }, [dispatch, cartItems, shippingFee, totalPrice, totalDiscountPrice]);

    return (
        <>
            <Navbar />
            {cartItems && cartItems.length ? (
                <div className="max-w-screen-xl mx-auto p-6 min-h-[80vh]">
                    <div className="mb-8 text-center flex justify-between">
                        <h3 className="text-2xl font-semibold text-gray-800">Products</h3>
                        <p className="text-gray-600">
                            <Link
                                href="/"
                                className="hover:underline cursor-pointer"
                            >
                                home
                            </Link>{" "}
                            /{" "}
                            <Link
                                href="/cart"
                                className="hover:underline cursor-pointer"
                            >
                                cart
                            </Link>
                        </p>
                    </div>

                    <div className="flex gap-8 flex-wrap">
                        <div className="flex-1 space-y-6">
                            {cartItems.map((product) => (
                                <div
                                    key={product.product.id}
                                    className="flex gap-6 border border-gray-300 p-5 rounded-lg"
                                >
                                    <img
                                        src={product.product.image[0].url}
                                        alt={product.product.name}
                                        className="object-cover w-24 h-26"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                {product.product.category}
                                            </span>
                                            <span
                                                className="cursor-pointer"
                                                onClick={() => handleRemoveFromCart(product.product.id)}
                                            >
                                                <IoClose size={20} />
                                            </span>
                                        </div>
                                        <div
                                            // onClick={() =>
                                            //     router.push(`/product/${product.id}`)
                                            // }
                                            className="cursor-pointer"
                                        >
                                            <h4 className="font-medium mt-2">{product.product.name}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {product.product.description.slice(0, 100)}...
                                            </p>
                                            <div className="flex justify-between items-center mt-4">
                                                <div className="text-gray-800 flex gap-2">
                                                    <p className="line-through text-sm text-gray-500">
                                                        ₹{product.product.originalPrice}
                                                    </p>
                                                    <p className="font-semibold">
                                                        ₹{product.product.price}
                                                    </p>
                                                </div>
                                                <p className="text-gray-600">Qty {product.quantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex-2 space-y-6">
                            <h4 className="font-semibold">
                                Price Details ({cartItems.length} items)
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <p>Total MRP</p>
                                    <p>₹{totalPrice}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Discount on MRP</p>
                                    <p>-₹{totalPrice - totalDiscountPrice}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p>Shipping Fee</p>
                                    <p>₹{shippingFee}</p>
                                </div>
                                <hr className="border-gray-300" />
                                <div className="flex justify-between">
                                    <h4 className="font-semibold">Total Amount</h4>
                                    <h4>{totalDiscountPrice + shippingFee}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mt-6 w-full justify-end">
                        <Link
                            href="/shipping"
                            className="flex flex-row gap-2 items-center px-4 py-2 outline-none bg-black text-white rounded-md hover:bg-gray-800 transition-colors duration-300"
                        >
                            <IoCartOutline size={20} />
                            Checkout
                        </Link>
                    </div>
                </div>
            ) : (
                <h1 className="text-center text-gray-500 text-xl font-medium mt-8 min-h-screen">
                    No product
                </h1>
            )}
            <Footer />
        </>
    )
};

export default Cart;
