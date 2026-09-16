import { useState } from 'react';

interface Props {
    materials: string[];
    onChange: (materials: string[]) => void;
}

export const MaterialTagInput = ({ materials, onChange }: Props) => {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = input.trim();
            if (value && !materials.includes(value)) {
                onChange([...materials, value]);
            }
            setInput('');
        }
    };

    const remove = (index: number) => {
        onChange(materials.filter((_, i) => i !== index));
    };

    const inputClass = "w-full border border-border-medium rounded-lg px-3 py-2 text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary-container/50 focus:border-primary-container transition-colors bg-white";

    return (
        <div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className={inputClass}
                placeholder="Nhập chất liệu rồi nhấn Enter ↵"
            />
            {materials.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {materials.map((mat, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 bg-primary-container/10 text-text-ink text-xs font-semibold px-2.5 py-1 rounded-full border border-border-subtle"
                        >
                            {mat}
                            <button type="button" onClick={() => remove(i)} className="hover:text-error transition-colors">
                                <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                        </span>
                    ))}
                </div>
            )}
            <p className="text-xs text-text-muted mt-1">Nhấn Enter để thêm chất liệu mới</p>
        </div>
    );
};