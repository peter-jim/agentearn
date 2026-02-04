import React from 'react';
import { ReviewStats as ReviewStatsType } from '../types';

interface ReviewStatsProps {
    stats: ReviewStatsType;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
    const { averageRating, totalReviews, ratingDistribution } = stats;

    return (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Average Rating */}
                <div className="flex flex-col items-center justify-center border-r border-slate-800 md:border-r-0 md:col-span-1">
                    <div className="text-5xl font-bold text-white mb-2">{averageRating.toFixed(1)}</div>
                    <div className="flex items-center text-yellow-400 mb-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(averageRating) ? 'fill-current' : 'fill-slate-700'}`}
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        ))}
                    </div>
                    <div className="text-sm text-slate-400">{totalReviews.toLocaleString()} 条评价</div>
                </div>

                {/* Rating Distribution */}
                <div className="md:col-span-2 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12">
                                    <span className="text-sm text-slate-400">{rating}</span>
                                    <svg className="w-3 h-3 fill-yellow-400" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                </div>
                                <div className="flex-1 bg-slate-950/50 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-indigo-500 h-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="text-xs text-slate-400 w-12 text-right">
                                    {count > 0 ? `${percentage.toFixed(0)}%` : '0%'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ReviewStats;
