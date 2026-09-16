import { Link } from 'react-router-dom';

export const Footer = () => {
    return (
        <footer className="bg-surface text-text-muted w-full mt-auto border-t border-border-subtle opacity-75 flex flex-col md:flex-row justify-between items-start md:items-center px-4 md:px-10 py-6 transition-opacity duration-200 gap-4 md:gap-0">
            <div>
                <span className="font-body text-xs font-semibold uppercase tracking-widest text-text-ink">MarketNest v2.4.0 • Built for Artisans</span>
            </div>
            <ul className="flex flex-col md:flex-row gap-3 md:gap-6 w-full md:w-auto">
                <li><Link className="font-body text-sm text-text-muted hover:text-primary transition-colors duration-200 block py-1 md:py-0" to="#">Support</Link></li>
                <li><Link className="font-body text-sm text-text-muted hover:text-primary transition-colors duration-200 block py-1 md:py-0" to="#">Documentation</Link></li>
                <li><Link className="font-body text-sm text-text-muted hover:text-primary transition-colors duration-200 block py-1 md:py-0" to="#">Terms of Service</Link></li>
            </ul>
        </footer>
    );
};
