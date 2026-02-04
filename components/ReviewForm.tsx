import React, { useState } from 'react';
import StarRating from './StarRating';
import { ProjectReview } from '../types';

interface ReviewFormProps {
    onSubmit: (review: Omit<ProjectReview, 'id' | 'date' | 'avatar'>) => void;
    onCancel?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState<{ rating?: string; comment?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const minCommentLength = 2;
    const maxCommentLength = 500;

    const validate = () => {
        const newErrors: { rating?: string; comment?: string } = {};

        if (rating === 0) {
            newErrors.rating = '请选择评分';
        }

        if (comment.trim().length < minCommentLength) {
            newErrors.comment = `评价内容至少需要 ${minCommentLength} 个字符`;
        }

        if (comment.trim().length > maxCommentLength) {
            newErrors.comment = `评价内容不能超过 ${maxCommentLength} 个字符`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            onSubmit({
                user: username.trim() || '匿名用户',
                rating,
                comment: comment.trim(),
                helpfulCount: 0,
                unhelpfulCount: 0,
                verified: false
            });

            // Reset form
            setRating(0);
            setComment('');
            setUsername('');
            setErrors({});
            setIsSubmitting(false);
        }, 500);
    };

    const commentLength = comment.trim().length;
    const isCommentValid = commentLength >= minCommentLength && commentLength <= maxCommentLength;

    return (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">写评价</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        评分 <span className="text-red-400">*</span>
                    </label>
                    <StarRating
                        rating={rating}
                        onRatingChange={setRating}
                        size="lg"
                        showValue
                    />
                    {errors.rating && (
                        <p className="text-red-400 text-xs mt-1">{errors.rating}</p>
                    )}
                </div>

                {/* Username */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        昵称（可选）
                    </label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="匿名用户"
                        maxLength={50}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>

                {/* Comment */}
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        评价内容 <span className="text-red-400">*</span>
                    </label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="分享您使用这个项目的体验..."
                        rows={4}
                        maxLength={maxCommentLength}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                    />
                    <div className="flex items-center justify-between mt-1">
                        <div>
                            {errors.comment && (
                                <p className="text-red-400 text-xs">{errors.comment}</p>
                            )}
                        </div>
                        <p className={`text-xs ${isCommentValid ? 'text-green-400' :
                            commentLength > 0 ? 'text-yellow-400' :
                                'text-slate-500'
                            }`}>
                            {commentLength} / {maxCommentLength}
                        </p>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors"
                    >
                        {isSubmitting ? '提交中...' : '提交评价'}
                    </button>
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="px-6 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors"
                        >
                            取消
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
