import Footer from "@/component/Footer";
import ImageSlider from "@/component/ImageSlider";
import Navbar from "@/component/Navbar";
import Testimonials from "@/component/Testimonials";
import { categories } from "@/constants/data";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col">
        <ImageSlider />

        <div className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Shop by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <div
                  key={category.title}
                  className="relative h-96 group overflow-hidden rounded-lg"
                >
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute flex flex-col gap-[5px] inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white font-bold">{category.category}</h3>
                    <p className="text-white text-center">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Feature Product
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8">
            {data?.allProducts?.slice(0, 8).map((product) => (
              <Card key={product._id} product={product} />
            ))}
          </div>
        </div>
      </div> */}

        <section className="relative h-[350px] md:h-[450px] lg:h-[550px]">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="About Us Background"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center">
            <div className="text-left text-white p-4 md:p-8 max-w-3xl flex justify-center h-full flex-col">
              <h2 className="text-3xl md:text-3xl lg:text-4xl font-bold mb-4">
                About Us
              </h2>
              <p>
                We are a passionate team dedicated to creating innovative
                solutions that make a difference in people′s lives. With years of
                experience and a commitment to excellence, we strive to exceed
                expectations and deliver outstanding results for our clients.
              </p>
            </div>
          </div>
        </section>

        <Testimonials />
      </div>
      <Footer />
    </>
  );
}
