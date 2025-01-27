"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";
import { IoMdHeartEmpty } from "react-icons/io";
import toast from "react-hot-toast";
import { clearToken, userExists, userNotExist } from "@/redux/reducers/authReducer";
import { useFetchUserProfileQuery } from "@/redux/api/profileApi";
import axios from 'axios';
import { SERVER } from "@/constants/constants";
import { useGetCartQuery } from "@/redux/api/cartApi";
import { setCart } from "@/redux/reducers/cartReducer";
import { useSearchProductQuery } from "@/redux/api/productApi";

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    const dispatch = useDispatch();
    const router = useRouter();

    const dropdownRef = useRef<HTMLDivElement>(null);
    const { user } = useSelector((state: RootState) => state.authReducer);
    const { data } = useFetchUserProfileQuery(undefined, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    useEffect(() => {
        if (data) {
            dispatch(userExists(data.user));
        } else {
            dispatch(userNotExist());
        }
    }, [user?.role, data, dispatch]);

    const { data: cartData } = useGetCartQuery(undefined, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });

    const { cartItems } = useSelector((state: RootState) => state.cartReducer);
    const role = user?.role;

    useEffect(() => {
        if (cartData) {
            dispatch(setCart(cartData));
        }
    }, [user, cartData, dispatch]);

    const { data: searchResults, isLoading, isError } = useSearchProductQuery(
        debouncedSearchTerm,
        {
            skip: !debouncedSearchTerm,
        }
    );

    // Handle search with debounce
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(search);
        }, 500);

        return () => clearTimeout(handler);
    }, [search]);

    // Handle logout
    const handleLogout = async () => {
        try {
            dispatch(userNotExist());
            dispatch(clearToken());  
            toast.success("Successfully logged out");
            router.push("/signin");
        } catch (error) {
            toast.error("Failed to log out");
        }
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    return (
        <nav className="bg-white shadow-sm w-full top-0 z-50" >
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24" >
                    {/* Logo */}
                    < div className="flex-shrink-0" >
                        <Link href="/" >
                            <span className="text-2xl font-semibold" > E - cart </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl mx-4 lg:mx-12" >
                        <div className="relative" >
                            <input
                                type="text"
                                placeholder="Search here"
                                className="w-full px-4 py-2.5 rounded-md bg-gray-100 focus:outline-none focus:ring-2"
                                value={search}
                                onChange={handleSearchChange}
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2" >
                                <IoSearchOutline className="w-5 h-5 text-gray-400" />
                            </button>
                            {/* Display search results */}
                            {
                                debouncedSearchTerm && (
                                    <div className="absolute bg-white w-full mt-1 rounded-lg shadow-lg z-10" >
                                        {
                                            isLoading ? (
                                                <div className="p-4 text-gray-500" > Loading...</ div >
                                            ) : searchResults?.products.length > 0 && !isError ? (
                                                searchResults.products.slice(0, 6).map((product) => (
                                                    <div
                                                        key={product.id}
                                                        className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition duration-200 ease-in-out rounded-md"
                                                        onClick={() => router.push(`/product/${product.id}`)}
                                                    >
                                                        <div className="flex-1" >
                                                            <p className="text-gray-800 truncate" >
                                                                {product.name.substr(0, 45)}
                                                            </p>
                                                        </div>
                                                        < div className="ml-4 text-sm text-gray-500" >
                                                            <p>{product.category} </p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-gray-500" > No results found </div>
                                            )}
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-6" >
                        <Link href="/" className="text-gray-700 hover:text-gray-900" >
                            Home
                        </Link>
                        < Link href="/product" className="text-gray-700 hover:text-gray-900" >
                            Product
                        </Link>
                        < div className="relative" >
                            <Link href="/cart" className="text-gray-700 hover:text-gray-900" >
                                <IoCartOutline className="w-6 h-6" />
                                {
                                    cartItems.length > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-[#ef4444] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {cartItems.length}
                                        </span>
                                    )
                                }
                            </Link>
                        </div>
                        {
                            user ? (
                                <div className="relative" ref={dropdownRef} >
                                    <button
                                        onClick={toggleDropdown}
                                        className="flex items-center focus:outline-none"
                                    >
                                        <img
                                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt="Profile"
                                            className="w-8 h-8 rounded-full"
                                        />
                                    </button>
                                    {
                                        isDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50" >
                                                {role === "Buyer" && (
                                                    <Link
                                                        href="/profile"
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        Profile
                                                    </Link>
                                                )
                                                }
                                                {
                                                    (role === "Admin" || role === "Seller") && (
                                                        <Link
                                                            href="/dashboard/home"
                                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                        >
                                                            Dashboard
                                                        </Link>
                                                    )
                                                }
                                                <Link
                                                    href="/orders"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Order
                                                </Link>
                                                < Link
                                                    href="/setting"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Settings
                                                </Link>
                                                < button
                                                    onClick={handleLogout}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                                >
                                                    Sign Out
                                                </button>
                                            </div>
                                        )
                                    }
                                </div>
                            ) : (
                                <Link
                                    href="/signin"
                                    className="bg-white text-gray-800 border border-transparent outline outline-gray-800 outline-1 px-4 py-2 rounded-md hover:bg-gray-800 hover:text-white hover:outline-white hover:border-gray-800 transition duration-300"
                                >
                                    Sign in
                                </Link>
                            )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden" >
                        <button
                            onClick={toggleMobileMenu}
                            className="text-gray-700 hover:text-gray-900"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {
                isMobileMenuOpen && (
                    <div className="md:hidden" >
                        <div className="px-2 pt-2 pb-3 space-y-1" >
                            <Link
                                href="/"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Home
                            </Link>
                            < Link
                                href="/product"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Product
                            </Link>
                            < Link
                                href="/cart"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Cart
                            </Link>
                            < Link
                                href="/profile"
                                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                            >
                                Profile
                            </Link>
                        </div>
                    </div>
                )
            }
        </nav>
    );
};

export default Navbar;
