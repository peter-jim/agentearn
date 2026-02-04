import React, { useState } from 'react';

interface StarRatingProps {
    rating: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
    rating,
    onRatingChange,
    readonly = false,
    size = 'md',
    showValue = false
}) => {
    const [hoverRating, setHoverRating] = useState(0);

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };

    const handleClick = (value: number) => {
        if (!readonly && onRatingChange) {
            onRatingChange(value);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => !readonly && setHoverRating(star)}
                    onMouseLeave={() => !readonly && setHoverRating(0)}
                    className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                >
                    <svg
                        className={`${sizeClasses[size]} ${star <= displayRating ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-700 text-slate-700'
                            } transition-colors`}
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                </button>
            ))}
            {showValue && (
                <span className="ml-2 text-sm font-bold text-white">{displayRating.toFixed(1)}</span>
            )}
        </div>
    );
};

export default StarRating;
