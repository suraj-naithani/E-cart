import ProfileDeleteDialog from "@/dialogs/ProfileDeleteDialog";

const DashboardSetting: React.FC = () => {
    return (
        <div className="rounded-lg p-8 flex flex-col gap-10 bg-white shadow-md sm:p-6">
            <h4 className="text-lg font-semibold">Settings</h4>
            <div className="flex justify-between items-center pl-2">
                <p className="text-gray-700">Delete your account and data</p>
                <ProfileDeleteDialog />
            </div>
        </div>
    );
};

export default DashboardSetting;
