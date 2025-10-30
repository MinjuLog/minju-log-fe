import type AroundPreviewType from "../types/AroundPreviewType.ts";
import {useNavigate} from "react-router-dom";

interface props {
    aroundPreview: AroundPreviewType;
}

export default function AroundPreview({ aroundPreview }: props) {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/columns/${1}`);
    };

    return (
        <div
            key={aroundPreview.id}
            onClick={handleClick}
            className={`relative overflow-hidden rounded-3xl ${aroundPreview.bgColor} p-8 transition-transform hover:scale-105 cursor-pointer`}
            style={{minHeight: "320px"}}
        >
            {/* Mission Label */}
            <p className={`mb-3 text-sm font-medium ${aroundPreview.textColor}`}>{aroundPreview.label}</p>

            {/* Mission Title */}
            <h2 className={`mb-4 whitespace-pre-line text-2xl font-bold leading-tight ${aroundPreview.titleColor}`}>
                {aroundPreview.title}
            </h2>

            {/* Progress Indicator */}
            {aroundPreview.progress && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5">
                    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{aroundPreview.progress}</span>
                </div>
            )}

            {/* Badge Indicator */}
            {aroundPreview.badge && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5">
                    <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                        />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">{aroundPreview.badge}</span>
                </div>
            )}

            {/* Illustration */}
            {aroundPreview.illustration && (
                <div className="absolute bottom-6 right-6">
                    <div className="h-32 w-32 opacity-80">
                        <img
                            src={aroundPreview.illustration || "/placeholder.svg"}
                            alt=""
                            className="h-full w-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}