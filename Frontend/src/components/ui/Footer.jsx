import Logo from '../../assets/logo.png';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const defaultSections = [
    {
        title: "Product",
        links: [
            { name: "Features", href: "#features" },
            { name: "Analytics", href: "#analytics" },
            { name: "Security", href: "#" },
            { name: "Pricing", href: "#" },
        ],
    },
    {
        title: "Company",
        links: [
            { name: "About Us", href: "#" },
            { name: "Careers", href: "#" },
            { name: "Blog", href: "#" },
            { name: "Contact", href: "#" },
        ],
    },
    {
        title: "Resources",
        links: [
            { name: "Documentation", href: "#" },
            { name: "Help Center", href: "#" },
            { name: "Community", href: "#" },
            { name: "Partners", href: "#" },
        ],
    },
];

const defaultSocialLinks = [
    { icon: <FaInstagram className="w-5 h-5" />, href: "#", label: "Instagram" },
    { icon: <FaFacebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <FaTwitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <FaLinkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
];

const defaultLegalLinks = [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
];

export const Footer = ({
    logo = {
        title: "InventoryX",
    },
    sections = defaultSections,
    description = "Orchestrate your entire manufacturing inventory with intelligent automation.",
    socialLinks = defaultSocialLinks,
    copyright = "© 2026 InventoryX Inc. All rights reserved.",
    legalLinks = defaultLegalLinks,
}) => {
    return (
        <section className="py-24 bg-white border-t border-secondary-100">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
                    <div className="flex w-full flex-col justify-between gap-6 lg:items-start">
                        {/* Logo */}
                        <div className="flex items-center gap-2 lg:justify-start">
                            <img src={Logo} alt="InventoryX Logo" className="w-8 h-8 object-contain" />
                            <h2 className="text-xl font-bold tracking-tight text-secondary-900">{logo.title}</h2>
                        </div>
                        <p className="max-w-[70%] text-sm text-secondary-500 leading-relaxed">
                            {description}
                        </p>
                        <ul className="flex items-center space-x-6 text-secondary-400">
                            {socialLinks.map((social, idx) => (
                                <li key={idx} className="font-medium hover:text-primary-500 transition-colors">
                                    <a href={social.href} aria-label={social.label}>
                                        {social.icon}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="grid w-full gap-8 md:grid-cols-3 lg:gap-20">
                        {sections.map((section, sectionIdx) => (
                            <div key={sectionIdx}>
                                <h3 className="mb-4 font-bold text-secondary-900">{section.title}</h3>
                                <ul className="space-y-3 text-sm text-secondary-500">
                                    {section.links.map((link, linkIdx) => (
                                        <li
                                            key={linkIdx}
                                            className="font-medium hover:text-primary-500 transition-colors"
                                        >
                                            <a href={link.href}>{link.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-16 flex flex-col justify-between gap-4 border-t border-secondary-100 py-8 text-xs font-medium text-secondary-400 md:flex-row md:items-center md:text-left">
                    <p className="order-2 lg:order-1">{copyright}</p>
                    <ul className="order-1 flex flex-col gap-4 md:order-2 md:flex-row">
                        {legalLinks.map((link, idx) => (
                            <li key={idx} className="hover:text-primary-500 transition-colors">
                                <a href={link.href}> {link.name}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
