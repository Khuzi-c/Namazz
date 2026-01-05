export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-emerald-950 pb-24 p-6 transition-colors duration-300">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Privacy Policy
            </h1>

            <div className="bg-white dark:bg-emerald-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-emerald-800 space-y-5 text-sm text-gray-600 dark:text-gray-300">

                <p>
                    This Privacy Policy describes how Namaz Tracker collects, uses,
                    stores, and protects user information. We are committed to handling
                    data responsibly and transparently.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">1. Information We Collect</h3>
                <p>
                    We may collect information including email address, authentication
                    identifiers, prayer checklist data, usage metadata, and app
                    preferences.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">2. Purpose of Data Collection</h3>
                <p>
                    Collected data is used solely to provide core app functionality,
                    including saving prayer records, generating analytics, maintaining
                    user accounts, and improving performance.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">3. Data We Do Not Collect</h3>
                <p>
                    We do not collect sensitive personal data, sell user information,
                    share data with advertisers, or track users across external websites
                    or services.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">4. Data Storage and Security</h3>
                <p>
                    User data is stored using secure infrastructure with access controls
                    such as Row Level Security to restrict unauthorized access.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">5. Guest Mode Data</h3>
                <p>
                    Guest mode data may be stored locally and is subject to removal if
                    browser data is cleared or the session expires.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">6. User Rights</h3>
                <p>
                    Users may request access to or deletion of their personal data.
                    Requests will be honored where technically and legally feasible.
                </p>

                <h3 className="font-semibold text-gray-900 dark:text-gray-100">7. Policy Updates</h3>
                <p>
                    This Privacy Policy may be updated periodically. Continued use of the
                    App indicates acceptance of the revised policy.
                </p>

                <p className="text-xs text-gray-400 mt-4">
                    Effective Date: January 5, 2026
                </p>

            </div>
        </div>
    )
}
