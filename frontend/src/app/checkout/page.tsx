'use client'

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNewOrderMutation } from "@/redux/api/orderApi";
import { useRemoveFromCartMutation } from "@/redux/api/cartApi";
import { clearCart } from "@/redux/reducers/cartReducer";
import { STRIPE_KEY } from "@/constants/constants";
import { useRouter, useSearchParams } from "next/navigation";

const stripePromise = loadStripe(STRIPE_KEY || "");

const responseToast = (res: any, navigate: any, url: string) => {
    if ("data" in res) {
        toast.success(res.data.message);
        if (navigate) navigate(url);
    } else {
        const error = res.error;
        const messageResponse = error.data;
        toast.error(messageResponse.message);
    }
};

const CheckOutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();
    const dispatch = useDispatch();

    const { user } = useSelector((state: any) => state.authReducer);

    const {
        shippingInfo,
        cartItems,
        subtotal,
        tax,
        discount,
        shippingCharges,
        total,
    } = useSelector((state: any) => state.cartReducer);

    const [isProcessing, setIsProcessing] = useState(false);

    const [newOrder] = useNewOrderMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;
        setIsProcessing(true);

        const orderData = {
            shippingInfo,
            orderItem: {
                name: cartItems[0]?.product?.name,
                photo: cartItems[0]?.product?.image[0]?.url,
                price: cartItems[0]?.product?.price,
                quantity: cartItems[0]?.quantity,
            },
            subtotal,
            tax,
            discount,
            shippingCharges,
            total,
            user: user?.id,
            productId: cartItems[0].product.id,
            sellerId: cartItems[0].product.sellerId,
        };

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required",
        });

        if (error) {
            setIsProcessing(false);
            return toast.error(error.message || "Something went wrong");
        }
        if (paymentIntent?.status === "succeeded") {
            const res = await newOrder(orderData);
            await removeFromCart(cartItems[0].product.id);
            dispatch(clearCart());
            responseToast(res, router.push, "/orders");
        }
        setIsProcessing(false);
    };

    return (
        <div className="container mx-auto p-4 max-w-lg">
            <form onSubmit={submitHandler} className="space-y-4 w-full">
                <PaymentElement className="border p-4 rounded-md" />
                <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-2 bg-black text-white font-semibold rounded-md shadow-md disabled:bg-gray-400"
                >
                    {isProcessing ? "Processing..." : "Pay"}
                </button>
            </form>
        </div>
    );
};

const Checkout: React.FC = () => {
    const router = useRouter();
    // const { clientSecret } = router.query; // Fetch clientSecret from query parameters
    const searchParams = useSearchParams();
    const clientSecret = searchParams.get('clientSecret');

    useEffect(() => {
        if (!clientSecret) {
            router.push("/shipping"); // Redirect to shipping if clientSecret is not available
        }
    }, [clientSecret, router]);

    if (!clientSecret) return null; // Return null while checking for clientSecret

    return (
        <Elements
            options={{
                clientSecret: clientSecret, // Make sure it's a string
            }}
            stripe={stripePromise}
        >
            <CheckOutForm />
        </Elements>
    );
};

export default Checkout;
