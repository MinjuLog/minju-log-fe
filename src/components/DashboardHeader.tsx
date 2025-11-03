import LocationControl from "../pages/dashboard/components/LocationControl.tsx";

interface props {
    location: string;
    handleRefreshLocation: () => void;
    isLocLoading: boolean;
}

export default function DashboardHeader({ location, isLocLoading, handleRefreshLocation }: props) {
    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <h1 className="text-4xl font-bold text-gray-900">진행로그</h1>
                    {/*<button className="p-2 hover:bg-gray-200 rounded-lg transition">*/}
                    {/*    <Link2 className="w-5 h-5 text-gray-600" />*/}
                    {/*</button>*/}
                    {/*<button className="p-2 hover:bg-gray-200 rounded-lg transition">*/}
                    {/*    <Settings className="w-5 h-5 text-gray-600" />*/}
                    {/*</button>*/}
                </div>
                <LocationControl location={location} isLocLoading={isLocLoading} handleRefreshLocation={handleRefreshLocation} />
            </div>
        </>
    )
}