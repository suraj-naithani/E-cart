import { FC, useState } from "react";
import { RxMixerHorizontal } from "react-icons/rx";

interface FilterProps {
    categories: string[];
    minPrice: number;
    maxPrice: number;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    priceRange: number[];
    setPriceRange: (range: number[]) => void;
}

const Filter: FC<FilterProps> = ({
    categories,
    minPrice,
    maxPrice,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
}) => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceRange([minPrice, +e.target.value]);
    };

    const clearFilters = () => {
        setSelectedCategory("");
        setPriceRange([minPrice, maxPrice]);
    };

    const toggleMenu = () => {
        setIsFilterOpen((prevState) => !prevState);
        document.body.style.overflow = isFilterOpen ? "auto" : "hidden";
    };

    return (
        <div>
            <div
                className="lg:hidden fixed right-9 bottom-9 z-[9999] p-2 bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer"
                onClick={toggleMenu}
                style={{ fontSize: "24px" }}
            >
                <RxMixerHorizontal />
            </div>

            <div className="hidden lg:block bg-white rounded-lg">
                <div className="flex flex-col gap-6 w-full p-4">
                    <h4 className="text-lg font-semibold">Filter</h4>

                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold">Categories</h4>
                        <div className="grid gap-2">
                            {categories.map((category, index) => (
                                <label
                                    key={index}
                                    className="flex items-center gap-2 capitalize cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        id={category}
                                        name="Categories"
                                        value={category}
                                        checked={selectedCategory === category}
                                        onChange={() => handleCategoryChange(category)}
                                        className="rounded"
                                    />
                                    {category}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Filter */}
                    <div className="flex flex-col gap-4 mt-4">
                        <h4 className="font-semibold">Price</h4>
                        <input
                            type="range"
                            id="rangeSlider"
                            min={minPrice}
                            max={maxPrice}
                            step="1"
                            value={priceRange[1]}
                            onChange={handlePriceChange}
                            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                        />
                        <div>
                            ₹{priceRange[0]} - ₹{priceRange[1]}
                        </div>
                    </div>

                    <button
                        onClick={clearFilters}
                        className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Popup Filter Modal */}
            {isFilterOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white w-11/12 max-w-md p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold">Filter</h4>
                            <button
                                onClick={toggleMenu}
                                className="text-gray-600 text-xl focus:outline-none"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Category Filter */}
                        <div className="flex flex-col gap-4">
                            <h4 className="font-semibold">Categories</h4>
                            <div className="grid gap-2">
                                {categories.map((category, index) => (
                                    <label
                                        key={index}
                                        className="flex items-center gap-2 capitalize cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            id={category}
                                            name="Categories"
                                            value={category}
                                            checked={selectedCategory === category}
                                            onChange={() => handleCategoryChange(category)}
                                            className="rounded"
                                        />
                                        {category}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Filter */}
                        <div className="flex flex-col gap-4 mt-4">
                            <h4 className="font-semibold">Price</h4>
                            <input
                                type="range"
                                id="rangeSlider"
                                min={minPrice}
                                max={maxPrice}
                                step="1"
                                value={priceRange[1]}
                                onChange={handlePriceChange}
                                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                            />
                            <div>
                                ₹{priceRange[0]} - ₹{priceRange[1]}
                            </div>
                        </div>

                        {/* Buttons Row */}
                        <div className="flex justify-between gap-4 mt-6">
                            <button
                                onClick={clearFilters}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-400 w-1/2"
                            >
                                Clear
                            </button>
                            <button
                                onClick={toggleMenu}
                                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 w-1/2"
                            >
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Filter;
