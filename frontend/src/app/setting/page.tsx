import Footer from "@/component/Footer";
import Navbar from "@/component/Navbar";
import ProfileDeleteDialog from "@/dialogs/ProfileDeleteDialog";

const Setting = () => {
    return (
        <div className="flex flex-col justify-between min-h-screen">
            <Navbar />
            <div className="min-h-[45vh]">
                <div className="rounded-lg p-8 flex flex-col gap-10 bg-white shadow-md sm:p-6 ">
                    <h4 className="text-lg font-semibold">Settings</h4>
                    <div className="flex justify-between items-center pl-2">
                        <p className="text-gray-700">Delete your account and data</p>
                        <ProfileDeleteDialog />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Setting;
