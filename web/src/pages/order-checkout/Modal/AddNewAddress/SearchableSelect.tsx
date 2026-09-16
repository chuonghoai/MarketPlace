import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
    options: { id: number; name: string }[];
    value: string;
    onSelect: (id: number, name: string) => void;
    placeholder: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onSelect,
    placeholder
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm(value);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [value]);

    const filteredOptions = options.filter(opt => opt.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div ref={wrapperRef} className={`relative transition-all duration-300 ease-in-out ${isOpen ? 'z-50 mb-48' : 'z-10'}`}>
            <input
                type="text"
                className="input-field w-full px-3 py-2 bg-surface relative z-10"
                placeholder={placeholder}
                value={searchTerm}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
                <ul className="absolute w-full bg-white border border-border-medium rounded-md shadow-xl max-h-48 overflow-y-auto top-full mt-1">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(opt => (
                            <li
                                key={opt.id}
                                className="px-3 py-2 hover:bg-surface-container-low cursor-pointer font-body-sm text-text-ink border-b border-subtle last:border-0"
                                onClick={() => {
                                    onSelect(opt.id, opt.name);
                                    setIsOpen(false);
                                }}
                            >
                                {opt.name}
                            </li>
                        ))
                    ) : (
                        <li className="px-3 py-2 text-text-muted font-body-sm text-center">Không tìm thấy</li>
                    )}
                </ul>
            )}
        </div>
    );
};