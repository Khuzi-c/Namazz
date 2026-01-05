import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service',
    description: 'Read the Terms of Service for Namazz application.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 p-6 transition-colors duration-300">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Terms of Service
            </h1>

            <div className="bg-white dark:bg-emerald-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-emerald-800 space-y-4 text-sm text-gray-600 dark:text-gray-300">

                <p>
                    Welcome to Namaz Tracker. By accessing or using this application,
                    you agree to these Terms of Service. If you do not agree, please
                    discontinue use of the app.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">1. Purpose of the App</h3>
                <p>
                    Namaz Tracker is designed to help users track daily prayers,
                    view prayer times, and reflect on personal consistency. The app
                    serves as a supportive tool and does not replace personal
                    religious responsibility.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">2. User Responsibility</h3>
                <p>
                    All prayer tracking is based on user input. The app does not verify
                    whether prayers were performed and does not guarantee religious
                    accuracy. Users are responsible for confirming prayer times and
                    practices according to their beliefs.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">3. Accounts and Guest Mode</h3>
                <p>
                    You may use the app as a guest or create an account. Guest data may
                    be temporary and is not guaranteed to persist. Registered users
                    are responsible for maintaining account security.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">4. Acceptable Use</h3>
                <p>
                    You agree not to misuse the app, attempt unauthorized access,
                    or interfere with its normal operation. Any misuse may result
                    in restricted access.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">5. Availability</h3>
                <p>
                    The app is provided “as is” and may be updated, modified, or
                    temporarily unavailable without notice.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">6. Limitation of Liability</h3>
                <p>
                    We are not responsible for missed prayers, incorrect prayer times,
                    or data loss. Use of this app is at your own discretion.
                </p>

                <p className="text-xs text-gray-400 mt-4">
                    Effective Date: January 5, 2026
                </p>

            </div>
        </div>
    )
}
