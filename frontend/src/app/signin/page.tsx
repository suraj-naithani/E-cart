'use client';

import { useUserSignInMutation } from "@/redux/api/authApi";
import { userExists } from "@/redux/reducers/authReducer";
import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

interface User {
    email: string;
    password: string;
}

const SignIn = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState<User>({
        email: "",
        password: "",
    });

    const dispatch = useDispatch();
    const router = useRouter();

    const [userLogin, { isLoading }] = useUserSignInMutation();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Login...");

        try {
            const response = await userLogin(user);
            if (response.data) {
                dispatch(userExists(response.data.user));
                localStorage.setItem('token', response.data.token);
                toast.success(response.data.message, { id: toastId });
                router.push("/");
            }
            if (response.error) {
                toast.error(response.error.data.message.split(",")[0], {
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error("An error occurred during Login.", { id: toastId });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
                    <p className="mt-2 text-sm text-gray-600">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={user.email}
                            onChange={handleInput}
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={user.password}
                                onChange={handleInput}
                                placeholder="Enter your password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-1"
                            >
                                {showPassword ? (
                                    <FaRegEyeSlash className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <FaRegEye className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        disabled={isLoading}
                    >
                        {isLoading ? "Sign In..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-600 hover:text-blue-500">
                        Sign up
                    </Link>
                </p>
                <Toaster />
            </div>
        </div>
    );
};

export default SignIn;
