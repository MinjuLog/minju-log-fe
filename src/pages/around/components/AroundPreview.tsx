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
            {aroundPreview.hashTags && (
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-1.5">
                    <span className="text-sm font-medium text-gray-700">
                      {aroundPreview.hashTags.map(tag => `#${tag}`).join(" ")}
                    </span>
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