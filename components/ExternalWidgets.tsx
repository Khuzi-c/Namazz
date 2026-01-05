'use client'

export default function ExternalWidgets() {
    return (
        <section className="space-y-6 animate-fade-in-up delay-200">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 px-2 border-l-4 border-emerald-500">Discover</h2>

            <div className="flex flex-col gap-6 overflow-hidden">
                {/* 99 Names */}
                <div className="w-full bg-white dark:bg-emerald-900 rounded-2xl overflow-hidden shadow-sm border border-emerald-50 dark:border-emerald-800">
                    <div className="p-4 border-b border-emerald-50 dark:border-emerald-800">
                        <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">99 Names of Allah</h3>
                    </div>
                    <div className="w-full overflow-x-auto p-2 flex justify-center bg-[#FFFDF4]">
                        <iframe
                            title="99 Names Of Allah"
                            src="https://muslimandquran.com/widgets/embedded/99%20Names%20of%20Allah?primarybg=%23&secondarybg=%23&headerbg=%237CB67D&bodybg=%23FFFDF4&bodytext=%23000000&accent=&text=%23&subheaderbg=%23&tablebg=%23&footerbg=%23505050&headertext=%23FFF&subheadertext=%23&tabletext=%23&footertext=%23FFF&fontsize=16&widgetpercent=&layout=false"
                            style={{ width: '100%', maxWidth: '350px', height: '400px', border: 'none' }}
                        />
                    </div>
                </div>

                {/* Special Islamic Events */}
                <div className="w-full bg-white dark:bg-emerald-900 rounded-2xl overflow-hidden shadow-sm border border-emerald-50 dark:border-emerald-800">
                    <div className="p-4 border-b border-emerald-50 dark:border-emerald-800">
                        <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Islamic Events</h3>
                    </div>
                    <div className="w-full overflow-x-auto p-2 flex justify-center bg-[#FFFDF4]">
                        <iframe
                            title="Special Islamic Events"
                            src="https://muslimandquran.com/widgets/embedded/Special%20Islamic%20Events?primarybg=%23&secondarybg=%23&headerbg=%237CB67D&bodybg=%23FFFDF4&bodytext=%23&accent=&text=%23000000&subheaderbg=%23&tablebg=%23&footerbg=%23505050&headertext=%23FFF&subheadertext=%23&tabletext=%23&footertext=%23FFF&fontsize=16&widgetpercent=&layout=false"
                            style={{ width: '100%', maxWidth: '400px', height: '400px', border: 'none' }}
                        />
                    </div>
                </div>

                {/* Ramadan Widget */}
                <div className="w-full bg-white dark:bg-emerald-900 rounded-2xl overflow-hidden shadow-sm border border-emerald-50 dark:border-emerald-800">
                    <div className="p-4 border-b border-emerald-50 dark:border-emerald-800">
                        <h3 className="font-semibold text-emerald-800 dark:text-emerald-200">Ramadan Countdown</h3>
                    </div>
                    <div className="w-full overflow-x-auto p-2 flex justify-center bg-[#FFFDF4]">
                        <iframe
                            title="Ramadan Widget"
                            src="https://muslimandquran.com/widgets/embedded/Ramadan%20Widget?primarybg=%23&secondarybg=%23&headerbg=%23FE8F00&bodybg=%23&bodytext=%23&accent=&text=%23&subheaderbg=%237CB67D&tablebg=%23FFFDF4&footerbg=%23505050&headertext=%23FFF&subheadertext=%23FFF&tabletext=%23212529&footertext=%23FFF&fontsize=16&widgetpercent=&layout=false"
                            style={{ width: '100%', maxWidth: '550px', height: '530px', border: 'none' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
