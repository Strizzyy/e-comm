import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShareIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  LinkIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const footerLinks = {
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Jobs', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Partners', href: '/partners' },
    ],
    solutions: [
      { name: 'Marketing', href: '/solutions/marketing' },
      { name: 'Analytics', href: '/solutions/analytics' },
      { name: 'Commerce', href: '/solutions/commerce' },
      { name: 'Insights', href: '/solutions/insights' },
      { name: 'Support', href: '/support' },
    ],
    documentation: [
      { name: 'Guides', href: '/docs/guides' },
      { name: 'API Status', href: '/docs/api-status' },
    ],
    legal: [
      { name: 'Claim', href: '/legal/claim' },
      { name: 'Privacy', href: '/privacy-policy' },
      { name: 'Terms', href: '/terms-condition' },
    ],
  };

  const socialLinks = [
    {
      name: 'Share',
      href: '#',
      icon: ShareIcon,
    },
    {
      name: 'Website',
      href: '#',
      icon: GlobeAltIcon,
    },
    {
      name: 'Email',
      href: '#',
      icon: EnvelopeIcon,
    },
    {
      name: 'Links',
      href: '#',
      icon: LinkIcon,
    },
  ];

  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8">
            <div className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo192.png"
                alt="E-Commerce Logo"
              />
              <span className="ml-2 text-xl font-bold text-white">E-Commerce</span>
            </div>
            <p className="text-sm leading-6 text-gray-300">
              Making the world a better place through constructing elegant hierarchies.
            </p>
            <div className="flex space-x-6">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-400"
                >
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
          <div className="mt-16 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Company</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Solutions</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.solutions.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold leading-6 text-white">Documentation</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.documentation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold leading-6 text-white">Legal</h3>
                <ul role="list" className="mt-6 space-y-4">
                  {footerLinks.legal.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className="text-sm leading-6 text-gray-300 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24">
          <p className="text-xs leading-5 text-gray-400">
            &copy; 2024 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
