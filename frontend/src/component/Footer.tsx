import { FC } from "react";
import Link from "next/link";

const Footer: FC = () => {
    return (
        <footer className="bg-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                    Shop
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            New Arrivals
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            Best Sellers
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            Sale
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                    Support
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            Contact Us
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            FAQs
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            Shipping
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="md:grid md:grid-cols-2 md:gap-8">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                    Company
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            Blog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            Careers
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-12 md:mt-0">
                                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                                    Legal
                                </h3>
                                <ul className="mt-4 space-y-4">
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="text-base text-gray-300 hover:text-white">
                                            Terms of Service
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-700 pt-8 flex justify-center">
                    <p className="text-base text-gray-400 text-center">
                        &copy; 2023 Your Company, Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
