import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Support - Chess Tips & Tricks",
    description: "Support and Help Center for Chess Tips & Tricks App",
};

export const viewport = {
    width: "device-width",
    initialScale: 1,
};

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="pt-32 md:pt-40 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center space-y-6">
                        <div className="text-6xl mb-4">♟️</div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            Chess Tips & Tricks
                        </h1>
                        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
                            Master the game, one move at a time.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <a
                                href="https://play.google.com/store/apps/details?id=com.atomdyno.chess_tips_and_tricks"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-base font-semibold rounded-lg transition-all hover:bg-gray-800 hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-xs leading-none opacity-80">GET IT ON</div>
                                    <div className="text-sm md:text-base font-bold leading-tight">Google Play</div>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="space-y-12">

                        {/* Contact Support */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Contact Support
                            </h2>
                            <p className="text-lg text-gray-700 mb-8">
                                Have questions, feedback, or need assistance with your account?
                                We are here to help you solve any issues you might encounter.
                            </p>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Email Us</h3>
                                <a
                                    href="mailto:nkcoderz@gmail.com"
                                    className="text-1xl md:text-2xl font-bold text-blue-600 hover:text-blue-700 hover:underline break-all"
                                >
                                    nkcoderz@gmail.com
                                </a>
                                <p className="mt-4 text-sm text-gray-600">
                                    We aim to respond to all inquiries within 24-48 hours.
                                </p>
                            </div>
                        </div>

                        {/* Common Topics */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Common Topics
                            </h2>
                            <div className="grid gap-6 md:grid-cols-1">
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Restore Purchases</h3>
                                    <p className="text-gray-700">
                                        Go to <strong>Home Page {'>'} Premium Button {'>'} Restore Purchases</strong> to retrieve your premium status.
                                    </p>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Report a Bug</h3>
                                    <p className="text-gray-700">
                                        Found a glitch? Send us a screenshot and details via email, and we'll investigate immediately.
                                    </p>
                                </div>

                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature Requests</h3>
                                    <p className="text-gray-700">
                                        We love feedback! Let us know what you want to see next in the app.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
