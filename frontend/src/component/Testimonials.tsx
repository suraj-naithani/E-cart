import { FC } from "react";
import { FaStar } from "react-icons/fa";

const testimonials = [
    {
        id: 1,
        name: "Sarah Johnson",
        role: "Frequent Shopper",
        content:
            "I'm amazed by the quality of products and the exceptional customer service. This is my go-to online store for all my needs!",
        rating: 5,
        avatar: "https://ui-avatars.com/api/?name=Sarah Johnson&background=random",
    },
    {
        id: 2,
        name: "Michael Chen",
        role: "Tech Enthusiast",
        content:
            "The range of products is impressive, and the delivery is always on time. Highly recommend for anyone looking for reliability.",
        rating: 3,
        avatar: "https://ui-avatars.com/api/?name=Michael Chen&background=random",
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        role: "Fashion Blogger",
        content:
            "I love the trendy selections and how easy it is to navigate the site. It's like they always know what I'm looking for!",
        rating: 4,
        avatar: "https://ui-avatars.com/api/?name=Emily Rodriguez&background=random",
    },
];

const Testimonials: FC = () => {
    return (
        <div className="bg-gray-100 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-[#3a3a3a] mb-8">
                    Featured Testimonials
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between gap-4"
                        >
                            <div className="flex items-center mb-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={`${testimonial.name}'s avatar`}
                                    width={50}
                                    height={50}
                                    className="rounded-full mr-4"
                                />
                                <div>
                                    <h4 className="font-bold text-[#3a3a3a]">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-gray-600">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-4">{testimonial.content}</p>
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar
                                        key={i}
                                        className={`w-5 h-5 ${i < testimonial.rating
                                                ? "text-[#3a3a3a] fill-[#3a3a3a]"
                                                : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Testimonials;
