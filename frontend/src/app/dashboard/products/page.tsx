'use client'
import Table from "@/component/Table";
import DeleteProductDialog from "@/dialogs/DeleteProductDialog";
import NewProductDialog from "@/dialogs/NewProductDialog";
import UpdateProductDialog from "@/dialogs/UpdateProductDialog";
import { useGetProductsQuery } from "@/redux/api/sellerApi";
import { addProduct } from "@/redux/reducers/productReducer";
import Link from "next/link";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const DashboardProducts: React.FC = () => {
    const userRole = useSelector((state) => state.authReducer?.user?.role);
    const { product } = useSelector((state) => state.productReducer);
    const adminData = useSelector((state) => state.dashboardReducer?.data);

    const dispatch = useDispatch();

    const { data, isLoading } = useGetProductsQuery();

    useEffect(() => {
        if (data) {
            dispatch(addProduct(data.allProducts));
        }
    }, [data, dispatch]);

    const adminHeadings = [
        "S.No",
        "Image",
        "Product Name",
        "Seller Name",
        "Seller Email",
        "Seller Phone",
        "Price",
        "Stock",
        "Category",
    ];

    const sellerHeadings = [
        "S.No",
        "Image",
        "Product Name",
        "Price",
        "Stock",
        "Category",
        "Views",
        "Actions",
    ];

    const adminTableData =
        adminData?.stats?.products?.map((product, i) => ({
            "s.no": i + 1,
            image: (
                <img
                    src={product?.image[0]?.url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm transition-transform duration-300 hover:scale-110"
                />
            ),
            "product name": product.name,
            "seller name": product.seller?.name,
            "seller email": product.seller?.email,
            "seller phone": product.seller?.phone,
            price: `₹${product.price.toFixed(2)}`,
            stock: (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                >
                    {product.stock}
                </span>
            ),
            category: (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                </span>
            ),
        })) || [];

    const sellerTableData =
        data?.allProducts?.map((product, i) => ({
            "s.no": i + 1,
            image: (
                <img
                    src={product.image?.[0]?.url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm transition-transform duration-300 hover:scale-110"
                />
            ),
            "product name": product.name,
            price: `₹${product.price}`,
            stock: (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                >
                    {product.stock}
                </span>
            ),
            category: (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                </span>
            ),
            views: (
                <span className="text-gray-700 font-medium">
                    {product.hitCount || 0}
                </span>
            ),
            actions: (
                <div className="flex gap-2">
                    <UpdateProductDialog productData={product} />
                    
                    <DeleteProductDialog
                        productId={product.id}
                        productName={product.name}
                    />
                </div>
            ),
        })) || [];

    return (
        <div className="flex flex-col gap-6 p-6 bg-[#ffffff] min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-gray-800">Products</h3>
                <p className="text-gray-600">
                    <Link href="/" className="hover:underline">
                        Dashboard
                    </Link>{" "}
                    /{" "}
                    <Link href="/product" className="hover:underline">
                        Products
                    </Link>
                </p>
            </div>

            {userRole === "Seller" && <NewProductDialog />}

            <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                {userRole === "Admin" ? (
                    <Table headings={adminHeadings} data={adminTableData} />
                ) : (
                    <Table headings={sellerHeadings} data={sellerTableData} />
                )}
            </div>
        </div>
    );
};

export default DashboardProducts;
