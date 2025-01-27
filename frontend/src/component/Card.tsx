import Link from "next/link";
import { FC } from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";

interface Product {
    _id: string;
    discountPercentage: number;
    image: {
        url: string;
    };
    category: string;
    name: string;
    description: string;
    originalPrice: number;
    price: number;
}

interface CardProps {
    product: Product;
}

const Card: FC<CardProps> = ({ product }) => {
    return (
        product && (
            <Link href={{ pathname: `/product/${product.id}` }} className="block">
                <div className="relative w-full max-w-sm mx-auto bg-gray-100 shadow-lg rounded-lg overflow-hidden">
                    <span className="absolute top-2 right-2 rounded-full bg-red-500 px-2 py-1 text-xs font-semibold text-white">
                        {product.discountPercentage}% OFF
                    </span>
                    <div className="flex items-center justify-center h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px] bg-gray-200">
                        <img
                            src={product.image[0].url}
                            alt={product.name}
                            className="max-w-full max-h-full object-cover"
                        />
                    </div>
                    <div className="p-4 md:p-5">
                        <span className="block text-gray-400 text-xs md:text-sm mb-1 md:mb-2">
                            {product.category}
                        </span>
                        <h4 className="text-sm md:text-base font-medium text-gray-800 mb-1 md:mb-2 hover:text-gray-600 transition duration-300">
                            {product.name.substring(0, 20)}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3">
                            {product.description.substring(0, 62)}...
                        </p>
                        <div className="border-t border-gray-200 pt-2 md:pt-3 flex justify-between items-center">
                            <div className="text-sm md:text-lg font-medium text-gray-800">
                                <small className="text-xs md:text-sm font-normal text-gray-400 line-through mr-1">
                                    ₹{product.originalPrice}
                                </small>
                                ₹{product.price}
                            </div>
                            <div className="flex space-x-3 text-gray-400 items-center">
                                <div className="hover:text-gray-600">
                                    <IoMdHeartEmpty className="text-xl md:text-2xl cursor-pointer" />
                                </div>
                                <div className="rounded-full bg-gray-900 p-2 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                    <IoCartOutline className="h-4 w-4 md:h-5 md:w-5 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    );
};

export default Card;
