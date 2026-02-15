import React from 'react';

export default function LegalPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 bg-white text-slate-800">
            <h1 className="text-4xl font-bold mb-12 text-center text-slate-900">Legal Information</h1>

            <section id="privacy" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">Privacy Policy</h2>
                <div className="prose prose-slate max-w-none">
                    <p className="mb-4">
                        At Apni Vidya, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website `apnividya.in`.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Information Collection:</strong> We collect personal information you provide directly to us, such as your name, email address, and phone number when you register for courses.</li>
                        <li><strong>Use of Information:</strong> We use your information to provide, maintain, and improve our services, communicate with you, and process transactions.</li>
                        <li><strong>Data Security:</strong> We implement appropriate security measures to protecting your personal information.</li>
                    </ul>
                    <p>
                        For any questions regarding this policy, please contact us at apnividya.in@gmail.com.
                    </p>
                </div>
            </section>

            <section id="terms" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">Terms of Service</h2>
                <div className="prose prose-slate max-w-none">
                    <p className="mb-4">
                        By accessing or using Apni Vidya, you agree to be bound by these Terms of Service.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Account Responsibilities:</strong> You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li><strong>Course Access:</strong> Access to courses is personal and non-transferable.</li>
                        <li><strong>Prohibited Conduct:</strong> You agree not to engage in any unlawful or prohibited activities while using our platform.</li>
                    </ul>
                    <p>
                        We reserve the right to modify these terms at any time.
                    </p>
                </div>
            </section>

            <section id="refund" className="mb-16 scroll-mt-24">
                <h2 className="text-2xl font-bold mb-4 text-blue-600 border-b pb-2">Refund Policy</h2>
                <div className="prose prose-slate max-w-none">
                    <p className="mb-4">
                        We strive to provide total satisfaction to our students. However, if you are not satisfied with our courses, please review our refund policy below:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mb-4">
                        <li><strong>Eligibility:</strong> Refund requests must be made within 7 days of purchase.</li>
                        <li><strong>Process:</strong> To request a refund, please contact us at apnividya.in@gmail.com with your order details.</li>
                        <li><strong>Processing Time:</strong> Refunds are processed within 5-7 business days after approval.</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
