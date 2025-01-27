'use client'

import React, { useEffect, useState } from "react";
import { GoArrowRight } from "react-icons/go";
import { categories } from "../constants/data";
import Link from "next/link";

const ImageSlider: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % categories.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="relative bg-gray-100 overflow-hidden">
            <div className="relative h-[60vh] md:h-[70vh] lg:h-[550px]">
                {categories.map((slide, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-white">
                                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                                    {slide.title}
                                </h1>
                                <p className="mb-8">{slide.description}</p>
                                <Link
                                    href="/product"
                                    className="bg-white text-black px-6 py-3 rounded-full hover:bg-gray-100 transition duration-300 w-fit flex items-center gap-1.5"
                                >
                                    Shop {slide.category}
                                    <GoArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ImageSlider;
