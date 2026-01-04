import React from 'react';
import { FiStar } from 'react-icons/fi';

const StarRating = ({ rating, totalEvaluations, size = 16, showCount = true }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.2rem' }}>
                {/* Full stars */}
                {[...Array(fullStars)].map((_, i) => (
                    <FiStar
                        key={`full-${i}`}
                        size={size}
                        fill="#f59e0b"
                        color="#f59e0b"
                        style={{ flexShrink: 0 }}
                    />
                ))}

                {/* Half star */}
                {hasHalfStar && (
                    <div style={{ position: 'relative', width: size, height: size }}>
                        <FiStar
                            size={size}
                            color="rgba(245, 158, 11, 0.3)"
                            style={{ position: 'absolute' }}
                        />
                        <div style={{
                            position: 'absolute',
                            width: '50%',
                            height: '100%',
                            overflow: 'hidden'
                        }}>
                            <FiStar
                                size={size}
                                fill="#f59e0b"
                                color="#f59e0b"
                            />
                        </div>
                    </div>
                )}

                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                    <FiStar
                        key={`empty-${i}`}
                        size={size}
                        color="rgba(255, 255, 255, 0.2)"
                        style={{ flexShrink: 0 }}
                    />
                ))}
            </div>

            {showCount && totalEvaluations > 0 && (
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600
                }}>
                    {rating.toFixed(1)} ({totalEvaluations})
                </span>
            )}

            {showCount && totalEvaluations === 0 && (
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    fontWeight: 600,
                    fontStyle: 'italic'
                }}>
                    Pas encore évalué
                </span>
            )}
        </div>
    );
};

export default StarRating;
