import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
    links?: { label: string; href: string; active?: boolean }[];
    showSearch?: boolean;
    rightActions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ links = [], showSearch = true, rightActions }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-surface-card text-primary docked full-width top-0 sticky z-40 border-b border-border-subtle shadow-sm transition-all duration-200 ease-in-out flex justify-between items-center px-4 md:px-10 py-3 md:py-4 ml-14 md:ml-0 w-[calc(100%-3.5rem)] md:w-full">
            <div className="hidden md:flex items-center gap-8">
                <nav className="flex gap-6">
                    {links.map((link, idx) => (
                        <Link
                            key={idx}
                            to={link.href}
                            className={`font-body text-sm font-semibold transition-transform duration-200 ${
                                link.active
                                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                                    : 'text-text-muted hover:text-text-ink hover:-translate-y-0.5'
                            }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </div>
            
            {/* On mobile, we don't show the nav links in the normal flow. 
                Instead, if there's no search, this keeps the header balanced. */}
            <div className="md:hidden"></div>

            <div className="flex items-center gap-3 md:gap-6 flex-1 md:flex-none justify-end">
                {showSearch && (
                    <div className="relative group flex-1 md:flex-none max-w-50 md:max-w-none">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-primary transition-colors text-[20px] md:text-[24px]">search</span>
                        <input className="input-field pl-9 md:pl-10 pr-3 md:pr-4 py-2 font-body text-sm text-text-ink w-full md:w-64 placeholder-text-muted" placeholder="Search..." type="text" />
                    </div>
                )}
                
                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4 border-l border-border-subtle pl-6">
                    <button className="relative text-text-muted hover:text-text-ink hover:-translate-y-0.5 transition-all">
                        <span className="material-symbols-outlined">notifications</span>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-primary-container rounded-full"></span>
                    </button>
                    {rightActions}
                </div>

                {/* Mobile Actions Dropdown */}
                <div className="md:hidden relative flex items-center" ref={menuRef}>
                    <button 
                        className="text-text-muted p-1 hover:text-text-ink focus:outline-none focus:ring-2 focus:ring-primary-container rounded-md"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menu hành động"
                    >
                        <span className="material-symbols-outlined text-[28px]">more_horiz</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isMobileMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-56 bg-surface-card border border-border-subtle rounded-xl shadow-lg flex flex-col py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                            {links.length > 0 && (
                                <>
                                    <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Điều hướng</div>
                                    {links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            to={link.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`block px-4 py-3 font-body text-sm hover:bg-surface-container transition-colors ${
                                                link.active ? 'text-primary font-bold bg-surface-container' : 'text-text-ink'
                                            }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <div className="h-px bg-border-subtle my-2 mx-4" />
                                </>
                            )}
                            
                            <div className="px-4 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">Hành động</div>
                            <button className="flex items-center gap-3 px-4 py-3 text-text-ink hover:bg-surface-container transition-colors text-left">
                                <span className="material-symbols-outlined text-[20px]">notifications</span>
                                <span className="font-body text-sm">Thông báo</span>
                            </button>
                            
                            {rightActions && (
                                <div className="px-4 py-2" onClick={() => setIsMobileMenuOpen(false)}>
                                    {rightActions}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
