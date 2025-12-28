import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children, title, subtitle, hideHeader = false }) {
    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
            <Sidebar />

            <main className="flex-1 ml-72 p-8 transition-all">
                <div className="max-w-7xl mx-auto space-y-8">
                    {!hideHeader && <Header title={title} subtitle={subtitle} />}
                    <div className="animate-fade-in delay-100">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
