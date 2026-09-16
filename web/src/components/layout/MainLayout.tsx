import { Outlet } from "react-router-dom";
import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";

export const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-market-background font-['Open_Sans',sans-serif]">
            <Header />

            <main className="flex-1 w-full max-w-400 mx-auto px-4 md:px-8 py-8">
                <Outlet />
            </main>

            <Footer />
        </div>
    );
};