import React from 'react';
import { Phone, Mail, MessageCircle, FileText, ExternalLink } from 'lucide-react';

const HelpSupport = () => {
  const supportOptions = [
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us at +1 (555) 123-4567',
      action: 'Call Now',
      href: 'tel:+15551234567',
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@zerohunger.org',
      action: 'Send Email',
      href: 'mailto:support@zerohunger.org',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team',
      action: 'Start Chat',
      href: '#',
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Browse our help articles',
      action: 'View Docs',
      href: '#',
    },
  ];

  const faqs = [
    {
      question: 'How do I place a new food request?',
      answer:
        'Click on the "New Request" tab in the sidebar, then click the "Create New Food Request" button. Fill in the required quantity and submit your request.',
    },
    {
      question: 'What is the OTP used for?',
      answer:
        'The OTP (One-Time Password) is used to verify your identity when collecting food from the donor. Show this code to the donor when picking up your food.',
    },
    {
      question: 'How long does it take to process a request?',
      answer:
        'Request processing times vary depending on donor availability. Most requests are matched with donors within 2-4 hours.',
    },
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportOptions.map((option) => (
            <div
              key={option.title}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
            >
              <div className="flex items-start">
                <div className="bg-blue-100 p-3 rounded-lg">
                  {React.createElement(option.icon, { className: "w-6 h-6 text-blue-600" })}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold">{option.title}</h3>
                  <p className="text-gray-600 mt-1">{option.description}</p>
                  <a
                    href={option.href}
                    className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700"
                  >
                    {option.action}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-semibold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
                {index < faqs.length - 1 && <hr className="mt-6" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;