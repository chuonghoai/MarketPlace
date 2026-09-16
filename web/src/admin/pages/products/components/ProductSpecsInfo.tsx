import React from 'react';

export interface ProductSpecsInfoProps {
    dimensions?: number[] | { length?: number | string; width?: number | string; height?: number | string; };
    weight?: number | string;
    careInstructions?: string;
    materials?: string[];
}

export const ProductSpecsInfo: React.FC<ProductSpecsInfoProps> = ({ dimensions, weight, careInstructions, materials }) => {
    
    let dimArray: any[] | null = null;
    if (Array.isArray(dimensions)) {
        if (dimensions.length === 3) dimArray = dimensions;
    } else if (dimensions) {
        if (dimensions.length !== undefined && dimensions.width !== undefined && dimensions.height !== undefined &&
            dimensions.length !== '' && dimensions.width !== '' && dimensions.height !== '' &&
            dimensions.length !== 0 && dimensions.width !== 0 && dimensions.height !== 0) {
            dimArray = [dimensions.length, dimensions.width, dimensions.height];
        }
    }

    const hasMaterials = materials && materials.length > 0;
    const hasDimensions = dimArray !== null;
    const hasWeight = weight !== undefined && weight !== null && weight !== '' && weight !== 0;
    const hasCareInstructions = careInstructions && careInstructions.trim().length > 0;

    if (!hasMaterials && !hasDimensions && !hasWeight && !hasCareInstructions) {
        return null;
    }

    return (
        <div className="space-y-4">
            {hasDimensions && (
                <div>
                    <p className="font-body text-sm font-semibold text-text-muted mb-1">Kích thước (Dài × Rộng × Cao)</p>
                    <p className="font-body text-sm text-text-ink">
                        {dimArray![0]} × {dimArray![1]} × {dimArray![2]} cm
                    </p>
                </div>
            )}
            
            {hasWeight && (
                <div>
                    <p className="font-body text-sm font-semibold text-text-muted mb-1">Trọng lượng</p>
                    <p className="font-body text-sm text-text-ink">{weight} kg</p>
                </div>
            )}

            {hasCareInstructions && (
                <div>
                    <p className="font-body text-sm font-semibold text-text-muted mb-1">Hướng dẫn bảo quản</p>
                    <p className="font-body text-sm text-text-ink whitespace-pre-line">{careInstructions}</p>
                </div>
            )}

            {hasMaterials && (
                <div>
                    <p className="font-body text-sm font-semibold text-text-muted mb-1">Chất liệu</p>
                    <div className="flex flex-wrap gap-2">
                        {materials!.map((m, i) => (
                            <span key={i} className="text-xs bg-surface-container px-3 py-1 rounded-full border border-border-subtle">{m}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
