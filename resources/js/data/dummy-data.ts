import type {
    AboutPageContent,
    BusinessPageContent,
    CareerApplication,
    CareerPageContent,
    ContactInquiry,
    ContactPageContent,
    HomePageContent,
    InvestmentPageContent,
    JobOpening,
    LandWantedPageContent,
    MediaPageContent,
    NewsArticle,
    Project,
    ProjectsPageContent,
    ProductsPageContent,
    Service,
    ServicesPageContent,
    SiteSettings,
    Testimonial,
} from '@/types/cms';

// ================================
// SITE SETTINGS
// ================================

export const dummySiteSettings: SiteSettings = {
    siteName: 'Nex Real Estate',
    tagline: 'Quality. Comfort. Legacy.',
    logo: {
        id: 'logo-1',
        url: '/images/logo.png',
        alt: 'Nex Real Estate Logo',
    },
    logoDark: {
        id: 'logo-dark-1',
        url: '/images/logo-dark.png',
        alt: 'Nex Real Estate Logo Dark',
    },
    favicon: {
        id: 'favicon-1',
        url: '/images/favicon.ico',
        alt: 'Nex Real Estate Favicon',
    },
    contactEmail: 'hello.nexrealestate@gmail.com',
    contactPhone: ['+880 1677-600000', '+880 1312-124545', '+880 1984-886886', '+880 1817-221100'],
    address: 'House: 50, Level-5, Lake Circus Kalabagan, Dhaka 1209, Bangladesh',
    socialLinks: {
        facebook: 'https://www.facebook.com/NexRealEstateLtd',
        youtube: 'https://www.youtube.com/@NexRealEstateLtd',
        linkedin: 'https://www.linkedin.com/company/nex-realestate/',
    },
    footer: {
        copyright: '© 2025 Nex Real Estate. All rights reserved.',
        developedBy: {
            name: 'NexKraft',
            url: 'https://nexkraft.com',
        },
    },
    seo: {
        title: 'Nex Real Estate - Quality. Comfort. Legacy.',
        description: 'Discover premium properties, connect with trusted experts, and find a space that perfectly reflects your lifestyle — only at Nex Real Estate.',
        keywords: ['real estate', 'property', 'bangladesh', 'dhaka', 'investment', 'luxury homes'],
        ogImage: {
            id: 'og-1',
            url: '/images/og-image.jpg',
            alt: 'Nex Real Estate',
        },
    },
    maintenanceMode: false,
};

// ================================
// HOME PAGE CONTENT
// ================================

export const dummyHomeContent: HomePageContent = {
    heroBanner: {
        id: 'hero-1',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        tagline: 'Quality. Comfort. Legacy.',
        title: 'Quility Meets Comfort Building Your Lasting Legacy',
        subtitle: 'Find Premium Properties with the help of Nex Realstate Experts',
        backgroundImage: {
            id: 'hero-bg-1',
            url: 'https://images.unsplash.com/photo-1544829728-e5cb9eedc20e?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            alt: 'Clear blue sky',
        },
        foregroundImage: {
            id: 'hero-fg-1',
            url: '/building.png',
            alt: 'Transparent modern building',
        },
        ctaButtons: {
            primary: { text: 'Explore Properties', link: '/projects' },
            secondary: { text: 'Book a Visit', link: '/contact' },
        },
    },
    featuredProjects: [
        {
            id: 'fp-1',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Nex Premium Heights',
            description: 'Luxury apartments in the heart of Dhaka with stunning city views.',
            location: 'Gulshan, Dhaka',
            price: 'Starting from ৳2.5 Crore',
            image: {
                id: 'fp-img-1',
                url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
                alt: 'Nex Premium Heights',
            },
            category: 'residential',
            status: 'ongoing',
            slug: 'nex-premium-heights',
            featured: true,
        },
        {
            id: 'fp-2',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Nex Business Tower',
            description: 'Modern commercial spaces designed for the future of work.',
            location: 'Banani, Dhaka',
            price: 'Starting from ৳3.8 Crore',
            image: {
                id: 'fp-img-2',
                url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
                alt: 'Nex Business Tower',
            },
            category: 'commercial',
            status: 'ongoing',
            slug: 'nex-business-tower',
            featured: true,
        },
        {
            id: 'fp-3',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Nex Garden Residences',
            description: 'Eco-friendly living with lush green surroundings.',
            location: 'Dhanmondi, Dhaka',
            price: 'Starting from ৳1.8 Crore',
            image: {
                id: 'fp-img-3',
                url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
                alt: 'Nex Garden Residences',
            },
            category: 'residential',
            status: 'completed',
            slug: 'nex-garden-residences',
            featured: true,
        },
    ],
    ceoMessage: {
        name: 'Arch Md Abdur Rahman Nipu',
        title: 'CEO, Nex Real Estate',
        message: `Welcome to Nex Real Estate — your partner in real estate project management in Bangladesh.

We don't just build homes and buildings — we manage every step of your project with care, honesty, and expertise. From planning to handover, our goal is to make the process smooth and stress-free for you.

Whether you're buying a home, starting a commercial project, or investing in land — Nex Real Estate is here to guide you.

Thank you for choosing us. Let's build a better future together.`,
        image: {
            id: 'ceo-1',
            url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
            alt: 'CEO Arch Md Abdur Rahman Nipu',
        },
    },
    valuePropositions: [
        {
            id: 'vp-1',
            title: 'Quality',
            description: 'Built to the highest standards with unmatched attention to detail.',
            icon: 'Shield',
        },
        {
            id: 'vp-2',
            title: 'Comfort',
            description: 'Thoughtfully designed spaces that feel like home from the moment you enter.',
            icon: 'Home',
        },
        {
            id: 'vp-3',
            title: 'Legacy',
            description: 'Creating timeless value through properties that last for generations.',
            icon: 'Crown',
        },
    ],
    marketingLines: [
        'Step into a legacy — your dream property awaits with Nex.',
        'Secure your space where comfort meets craftsmanship.',
        'Invest in a lifestyle, not just a location — choose Nex.',
        'Build your future on a foundation of quality and trust.',
        'Explore modern living redefined by Nex Real Estate.',
        'Your vision, our design — let\'s build it together.',
        'From blueprint to keys — Nex delivers excellence.',
        'Comfort today, legacy forever — discover Nex homes.',
        'Begin your next chapter with Nex Real Estate.',
        'Luxury. Location. Lifestyle. It\'s all here with Nex.',
    ],
};

// ================================
// ABOUT PAGE CONTENT
// ================================

export const dummyAboutContent: AboutPageContent = {
    ourStory: {
        title: 'Our Story',
        content: `Nex Real Estate started with a vision to make property ownership easier, safer, and more rewarding in Bangladesh. With a team of passionate professionals, we've grown into a trusted name in real estate project management—offering services that go beyond transactions to build lasting value.

Since our founding, we have successfully delivered numerous projects across Dhaka and beyond, earning the trust of hundreds of satisfied clients. Our commitment to excellence and customer satisfaction continues to drive our growth and innovation in the real estate sector.`,
        image: {
            id: 'story-1',
            url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
            alt: 'Our Story',
        },
    },
    mission: {
        title: 'Our Mission',
        content: 'To simplify the real estate journey through trust, innovation, and customer-first service.',
    },
    vision: {
        title: 'Our Vision',
        content: 'To become a leading real estate company in Bangladesh, known for delivering quality developments, transparent service, and long-term satisfaction.',
    },
    values: [
        {
            id: 'val-1',
            title: 'Integrity',
            description: 'We do what\'s right, always.',
            icon: 'Shield',
        },
        {
            id: 'val-2',
            title: 'Quality',
            description: 'We never compromise on standards.',
            icon: 'Star',
        },
        {
            id: 'val-3',
            title: 'Commitment',
            description: 'We keep our word and stay focused on your success.',
            icon: 'Target',
        },
        {
            id: 'val-4',
            title: 'Innovation',
            description: 'We build for the future with smart, sustainable solutions.',
            icon: 'Lightbulb',
        },
        {
            id: 'val-5',
            title: 'Community',
            description: 'We believe in creating spaces where people truly belong.',
            icon: 'Users',
        },
    ],
    leadershipTeam: [
        {
            id: 'leader-1',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Arch Md Abdur Rahman Nipu',
            position: 'CEO',
            bio: 'Leading Nex Real Estate with a vision for excellence and innovation.',
            image: {
                id: 'leader-img-1',
                url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80',
                alt: 'CEO',
            },
            order: 1,
            category: 'leadership',
            socialLinks: {
                linkedin: 'https://linkedin.com',
            },
        },
        {
            id: 'leader-2',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Mohammad Rahman',
            position: 'Chairman',
            bio: 'Guiding the strategic direction of Nex Real Estate.',
            image: {
                id: 'leader-img-2',
                url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
                alt: 'Chairman',
            },
            order: 2,
            category: 'leadership',
        },
        {
            id: 'leader-3',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Fatima Ahmed',
            position: 'Vice Chairman',
            bio: 'Overseeing operations and business development.',
            image: {
                id: 'leader-img-3',
                url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
                alt: 'Vice Chairman',
            },
            order: 3,
            category: 'leadership',
        },
        {
            id: 'leader-4',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Karim Hassan',
            position: 'Managing Director',
            bio: 'Driving business growth and market expansion.',
            image: {
                id: 'leader-img-4',
                url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
                alt: 'Managing Director',
            },
            order: 4,
            category: 'leadership',
        },
        {
            id: 'leader-5',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Sarah Khan',
            position: 'COO',
            bio: 'Managing day-to-day operations and project delivery.',
            image: {
                id: 'leader-img-5',
                url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
                alt: 'COO',
            },
            order: 5,
            category: 'leadership',
        },
    ],
    boardOfAdvisors: [
        {
            id: 'advisor-1',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Dr. Ahmed Khan',
            position: 'Advisory Board Member',
            bio: 'Expert in urban development and sustainable architecture.',
            image: {
                id: 'advisor-img-1',
                url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
                alt: 'Advisor',
            },
            order: 1,
            category: 'advisor',
        },
        {
            id: 'advisor-2',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Prof. Nasreen Akhter',
            position: 'Advisory Board Member',
            bio: 'Specialist in real estate economics and market analysis.',
            image: {
                id: 'advisor-img-2',
                url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80',
                alt: 'Advisor',
            },
            order: 2,
            category: 'advisor',
        },
    ],
    awards: [
        {
            id: 'award-1',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Best Real Estate Developer 2024',
            year: '2024',
            description: 'Recognized for excellence in property development and customer service.',
        },
        {
            id: 'award-2',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Green Building Excellence Award',
            year: '2023',
            description: 'For sustainable and eco-friendly construction practices.',
        },
    ],
};

// ================================
// SERVICES PAGE CONTENT
// ================================

export const dummyServicesContent: ServicesPageContent = {
    heroSection: {
        title: 'Our Services',
        subtitle: 'Comprehensive real estate solutions tailored to your needs',
        backgroundImage: {
            id: 'services-hero-1',
            url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80',
            alt: 'Services',
        },
    },
    services: [],
    whyChooseUs: {
        title: 'Why Choose Our Services',
        subtitle: 'We deliver excellence at every step',
        points: [
            {
                title: 'Expert Team',
                description: 'Experienced professionals dedicated to your success.',
            },
            {
                title: 'Quality Assurance',
                description: 'Rigorous standards for every project we undertake.',
            },
            {
                title: 'Timely Delivery',
                description: 'Committed to meeting deadlines without compromising quality.',
            },
            {
                title: '24/7 Support',
                description: 'Always available to address your concerns and queries.',
            },
        ],
    },
};

export const dummyServices: Service[] = [
    {
        id: 'srv-1',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Project Management',
        slug: 'project-management',
        shortDescription: 'End-to-end project management',
        fullDescription: 'We provide comprehensive project management services that cover every aspect of your real estate project, from initial planning to final handover.',
        icon: 'ClipboardList',
        image: {
            id: 'srv-img-1',
            url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
            alt: 'Project Management',
        },
        features: ['Planning & Strategy', 'Budget Management', 'Timeline Control', 'Quality Assurance'],
        order: 1,
    },
    {
        id: 'srv-2',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Consultancy',
        slug: 'consultancy',
        shortDescription: 'Expert advice for all your real estate decisions.',
        fullDescription: 'Our consultancy services help you make informed decisions about property investments, market analysis, and development strategies.',
        icon: 'MessageSquare',
        image: {
            id: 'srv-img-2',
            url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
            alt: 'Consultancy',
        },
        features: ['Market Analysis', 'Investment Advisory', 'Legal Guidance', 'Property Valuation'],
        order: 2,
    },
    {
        id: 'srv-3',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Property Buy & Sales',
        slug: 'property-buy-sales',
        shortDescription: 'Seamless buying and selling experience for properties.',
        fullDescription: 'We facilitate smooth property transactions with transparent processes and expert negotiation.',
        icon: 'Home',
        image: {
            id: 'srv-img-3',
            url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
            alt: 'Property Buy Sales',
        },
        features: ['Property Listing', 'Buyer Matching', 'Price Negotiation', 'Documentation'],
        order: 3,
    },
    {
        id: 'srv-4',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Land Development',
        slug: 'land-development',
        shortDescription: 'Transform raw land into valuable real estate assets.',
        fullDescription: 'Our land development services include site analysis, planning, and development execution.',
        icon: 'Map',
        image: {
            id: 'srv-img-4',
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            alt: 'Land Development',
        },
        features: ['Site Analysis', 'Master Planning', 'Infrastructure Development', 'Zoning Compliance'],
        order: 4,
    },
    {
        id: 'srv-5',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Construction Services',
        slug: 'construction-services',
        shortDescription: 'Quality construction with modern techniques.',
        fullDescription: 'We deliver construction projects with attention to quality, safety, and timely completion.',
        icon: 'HardHat',
        image: {
            id: 'srv-img-5',
            url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
            alt: 'Construction Services',
        },
        features: ['Modern Techniques', 'Quality Materials', 'Safety Standards', 'Timely Delivery'],
        order: 5,
    },
    {
        id: 'srv-6',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Interior & Design',
        slug: 'interior-design',
        shortDescription: 'Beautiful interiors that reflect your style.',
        fullDescription: 'Our interior design team creates stunning spaces that combine aesthetics with functionality.',
        icon: 'Palette',
        image: {
            id: 'srv-img-6',
            url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
            alt: 'Interior Design',
        },
        features: ['Custom Designs', 'Space Planning', 'Material Selection', 'Turnkey Solutions'],
        order: 6,
    },
    {
        id: 'srv-7',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'After-Sales Support',
        slug: 'after-sales-support',
        shortDescription: 'Continued support after your purchase.',
        fullDescription: 'We provide ongoing support to ensure your complete satisfaction with your property.',
        icon: 'HeadphonesIcon',
        image: {
            id: 'srv-img-7',
            url: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?w=800&q=80',
            alt: 'After Sales Support',
        },
        features: ['Maintenance Support', 'Warranty Services', 'Customer Care', 'Property Management'],
        order: 7,
    },
];

// ================================
// PRODUCTS PAGE CONTENT
// ================================

export const dummyProductsContent: ProductsPageContent = {
    heroSection: {
        title: 'Our Products',
        subtitle: 'Diverse property types to suit every need',
        backgroundImage: {
            id: 'products-hero-1',
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80',
            alt: 'Products',
        },
    },
    categories: [
        {
            id: 'cat-1',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Residential',
            slug: 'residential',
            description: 'Premium homes and apartments for comfortable living.',
            icon: 'Home',
            image: {
                id: 'cat-img-1',
                url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
                alt: 'Residential',
            },
            order: 1,
        },
        {
            id: 'cat-2',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Commercial',
            slug: 'commercial',
            description: 'Modern office spaces and retail properties.',
            icon: 'Building',
            image: {
                id: 'cat-img-2',
                url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
                alt: 'Commercial',
            },
            order: 2,
        },
        {
            id: 'cat-3',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Land',
            slug: 'land',
            description: 'Prime land parcels for development or investment.',
            icon: 'Map',
            image: {
                id: 'cat-img-3',
                url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
                alt: 'Land',
            },
            order: 3,
        },
        {
            id: 'cat-4',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Resorts',
            slug: 'resorts',
            description: 'Luxury resort properties for hospitality ventures.',
            icon: 'Palmtree',
            image: {
                id: 'cat-img-4',
                url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
                alt: 'Resorts',
            },
            order: 4,
        },
        {
            id: 'cat-5',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Hospitals',
            slug: 'hospitals',
            description: 'Healthcare facility properties and medical centers.',
            icon: 'Hospital',
            image: {
                id: 'cat-img-5',
                url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
                alt: 'Hospitals',
            },
            order: 5,
        },
        {
            id: 'cat-6',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Hotels',
            slug: 'hotels',
            description: 'Premium hotel properties for hospitality investment.',
            icon: 'Hotel',
            image: {
                id: 'cat-img-6',
                url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
                alt: 'Hotels',
            },
            order: 6,
        },
    ],
};

// ================================
// PROJECTS
// ================================

export const dummyProjects: Project[] = [
    {
        id: 'proj-1',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Nex Premium Heights',
        slug: 'nex-premium-heights',
        description: 'Luxury apartments in the heart of Gulshan with stunning city views and world-class amenities.',
        fullDescription: 'Nex Premium Heights represents the pinnacle of luxury living in Dhaka. Located in the prestigious Gulshan area, this project offers spacious apartments with panoramic city views, state-of-the-art amenities, and premium finishes throughout.',
        location: 'Gulshan, Dhaka',
        address: 'Plot 45, Road 11, Gulshan-2, Dhaka 1212',
        price: 'Starting from ৳2.5 Crore',
        images: [
            { id: 'proj-1-img-1', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', alt: 'Project Image 1' },
            { id: 'proj-1-img-2', url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', alt: 'Project Image 2' },
        ],
        category: 'residential',
        status: 'ongoing',
        features: ['24/7 Security', 'Swimming Pool', 'Gym', 'Rooftop Garden'],
        amenities: ['Covered Parking', 'Elevator', 'Generator Backup', 'Community Hall'],
        specifications: {
            landArea: '15 Katha',
            floors: 12,
            units: 24,
            parking: 48,
            completion: 'December 2026',
        },
        featured: true,
        order: 1,
    },
    {
        id: 'proj-2',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Nex Business Tower',
        slug: 'nex-business-tower',
        description: 'Modern commercial spaces designed for the future of work.',
        fullDescription: 'A Grade-A commercial tower offering premium office spaces with cutting-edge infrastructure and amenities for businesses.',
        location: 'Banani, Dhaka',
        address: 'Plot 22, Road 17, Banani, Dhaka 1213',
        price: 'Starting from ৳3.8 Crore',
        images: [
            { id: 'proj-2-img-1', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', alt: 'Business Tower' },
        ],
        category: 'commercial',
        status: 'ongoing',
        features: ['High-speed Elevator', 'Central AC', 'Fire Safety', 'Smart Building'],
        amenities: ['Conference Rooms', 'Cafeteria', 'Underground Parking', '24/7 Access'],
        specifications: {
            landArea: '20 Katha',
            floors: 18,
            units: 54,
            parking: 120,
            completion: 'March 2027',
        },
        featured: true,
        order: 2,
    },
    {
        id: 'proj-3',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Nex Garden Residences',
        slug: 'nex-garden-residences',
        description: 'Eco-friendly living with lush green surroundings.',
        fullDescription: 'A green living concept project featuring extensive landscaping and sustainable design principles.',
        location: 'Dhanmondi, Dhaka',
        address: 'House 161/2, Dr Kudrat E Khuda Road, Dhanmondi, Dhaka 1205',
        price: 'Starting from ৳1.8 Crore',
        images: [
            { id: 'proj-3-img-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', alt: 'Garden Residences' },
        ],
        category: 'residential',
        status: 'completed',
        features: ['Green Landscaping', 'Solar Panels', 'Rainwater Harvesting', 'Kids Play Area'],
        amenities: ['Community Garden', 'Walking Paths', 'Yoga Deck', 'BBQ Area'],
        specifications: {
            landArea: '12 Katha',
            floors: 8,
            units: 16,
            parking: 32,
            completion: 'Completed 2024',
        },
        featured: true,
        order: 3,
    },
    {
        id: 'proj-4',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Nex Lakeside Villas',
        slug: 'nex-lakeside-villas',
        description: 'Exclusive lakeside villas with private gardens.',
        fullDescription: 'Luxury villas offering serene lakeside living with private outdoor spaces.',
        location: 'Uttara, Dhaka',
        address: 'Sector 14, Uttara, Dhaka 1230',
        price: 'Starting from ৳5.5 Crore',
        images: [
            { id: 'proj-4-img-1', url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', alt: 'Lakeside Villas' },
        ],
        category: 'residential',
        status: 'upcoming',
        features: ['Private Garden', 'Lake View', 'Smart Home', 'Private Pool'],
        amenities: ['Clubhouse', 'Tennis Court', 'Jogging Track', 'Security Gate'],
        specifications: {
            landArea: '25 Katha',
            floors: 3,
            units: 12,
            parking: 24,
            completion: 'Q4 2027',
        },
        featured: false,
        order: 4,
    },
];

// ================================
// PROJECTS PAGE CONTENT
// ================================

export const dummyProjectsContent: ProjectsPageContent = {
    heroSection: {
        title: 'Our Projects',
        subtitle: 'Discover our portfolio of exceptional properties',
        backgroundImage: {
            id: 'projects-hero-1',
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80',
            alt: 'Projects',
        },
    },
    ongoingProjects: dummyProjects.filter((p) => p.status === 'ongoing'),
    completedProjects: dummyProjects.filter((p) => p.status === 'completed'),
    upcomingProjects: dummyProjects.filter((p) => p.status === 'upcoming'),
};

// ================================
// INVESTMENT PAGE CONTENT
// ================================

export const dummyInvestmentContent: InvestmentPageContent = {
    heroSection: {
        title: 'Investment Opportunities',
        subtitle: 'Grow your wealth with strategic real estate investments',
        backgroundImage: {
            id: 'investment-hero-1',
            url: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=1920&q=80',
            alt: 'Investment',
        },
    },
    whyInvest: {
        title: 'Why Invest with Nex',
        content: 'Nex Real Estate offers carefully selected investment opportunities backed by thorough market analysis and expert guidance.',
        points: [
            {
                title: 'Proven Track Record',
                description: 'Consistently delivering strong returns on investment.',
                icon: 'TrendingUp',
            },
            {
                title: 'Expert Management',
                description: 'Professional team managing every aspect of your investment.',
                icon: 'Users',
            },
            {
                title: 'Transparent Process',
                description: 'Complete visibility into your investment performance.',
                icon: 'Eye',
            },
            {
                title: 'Diverse Portfolio',
                description: 'Multiple property types to diversify your investment.',
                icon: 'Grid',
            },
        ],
    },
    roiProjections: [
        {
            id: 'roi-1',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Residential Projects',
            percentage: '15-20%',
            description: 'Average annual appreciation on residential investments.',
            timeframe: '3-5 Years',
        },
        {
            id: 'roi-2',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Commercial Projects',
            percentage: '18-25%',
            description: 'Average annual returns on commercial properties.',
            timeframe: '5-7 Years',
        },
        {
            id: 'roi-3',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Land Development',
            percentage: '25-35%',
            description: 'Potential returns on land development projects.',
            timeframe: '2-4 Years',
        },
    ],
    landOwnerPartnership: {
        title: 'Landowner Partnership',
        content: 'Partner with us and transform your land into a profitable venture. We handle everything from planning to construction while you retain equity in the project.',
        benefits: [
            'Retain ownership stake in the development',
            'Zero investment required from landowner',
            'Professional project management',
            'Transparent profit sharing',
            'Complete legal compliance',
        ],
        image: {
            id: 'landowner-1',
            url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
            alt: 'Landowner Partnership',
        },
    },
    jointVenture: {
        title: 'Joint Venture Opportunities',
        content: 'Explore collaborative development opportunities with Nex Real Estate. We bring expertise and resources, you bring the vision.',
        benefits: [
            'Shared risk and reward',
            'Access to our expertise and network',
            'Flexible partnership structures',
            'Comprehensive project support',
            'Market-backed project selection',
        ],
        image: {
            id: 'jv-1',
            url: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80',
            alt: 'Joint Venture',
        },
    },
};

// ================================
// TESTIMONIALS
// ================================

export const dummyTestimonials: Testimonial[] = [
    {
        id: 'test-1',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        name: 'Rafiq Ahmed',
        position: 'Business Owner',
        company: 'Ahmed Enterprises',
        content: 'Nex Real Estate made our dream home a reality. Their professionalism and attention to detail exceeded our expectations. Highly recommended!',
        rating: 5,
        image: {
            id: 'test-img-1',
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
            alt: 'Rafiq Ahmed',
        },
        featured: true,
    },
    {
        id: 'test-2',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        name: 'Fatima Khan',
        position: 'Doctor',
        company: 'Square Hospital',
        content: 'The investment advisory from Nex helped me make informed decisions. Their transparency and expertise are unmatched in the industry.',
        rating: 5,
        image: {
            id: 'test-img-2',
            url: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&q=80',
            alt: 'Fatima Khan',
        },
        featured: true,
    },
    {
        id: 'test-3',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        name: 'Mohammad Hassan',
        position: 'IT Professional',
        company: 'Tech Solutions Ltd',
        content: 'From property selection to documentation, Nex handled everything seamlessly. Best real estate experience I\'ve had!',
        rating: 5,
        image: {
            id: 'test-img-3',
            url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
            alt: 'Mohammad Hassan',
        },
        featured: true,
    },
];

// ================================
// LAND WANTED PAGE CONTENT
// ================================

export const dummyLandWantedContent: LandWantedPageContent = {
    heroSection: {
        title: 'Land Wanted',
        subtitle: 'We are actively seeking land for our upcoming development projects. If you have land to sell or are interested in a joint venture, we\'d love to hear from you.',
        backgroundImage: {
            id: 'land-hero-1',
            url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
            alt: 'Land Wanted',
        },
    },
    benefits: [
        {
            icon: 'Shield',
            title: 'Fair Market Value',
            description: 'We offer competitive prices based on current market conditions and location analysis.',
        },
        {
            icon: 'FileText',
            title: 'Hassle-Free Process',
            description: 'Our legal team handles all documentation and ensures a smooth transfer process.',
        },
        {
            icon: 'Users',
            title: 'Joint Venture Options',
            description: 'Partner with us on development projects and share in the profits.',
        },
        {
            icon: 'Phone',
            title: 'Quick Response',
            description: 'We respond to all inquiries within 24 hours and move quickly on promising opportunities.',
        },
    ],
    requirements: {
        title: 'What We\'re Looking For',
        description: 'We are interested in acquiring land in prime locations across Dhaka and other major cities in Bangladesh.',
        items: [
            {
                id: 'req-1',
                title: 'Residential Land',
                description: 'Minimum 5 katha in prime residential areas',
            },
            {
                id: 'req-2',
                title: 'Commercial Land',
                description: 'Minimum 10 katha in commercial zones',
            },
            {
                id: 'req-3',
                title: 'Industrial Land',
                description: 'Minimum 1 acre for industrial development',
            },
            {
                id: 'req-4',
                title: 'Clear Documentation',
                description: 'Must have clear title and proper documentation',
            },
        ],
    },
    preferredLocations: [
        'Gulshan',
        'Banani',
        'Dhanmondi',
        'Uttara',
        'Bashundhara',
        'Mirpur',
        'Mohammadpur',
        'Motijheel',
        'Tejgaon',
        'Khilgaon',
    ],
    landTypes: [
        'Residential Plot',
        'Commercial Plot',
        'Industrial Land',
        'Agricultural Land',
        'Mixed Use',
    ],
    ctaSection: {
        title: 'Have Land to Sell or Partner?',
        content: 'Contact us to discuss partnership opportunities or sell your land at the best price.',
        buttonText: 'Contact Us',
        buttonLink: '/contact',
    },
};

// ================================
// MEDIA & NEWS PAGE CONTENT
// ================================

export const dummyNewsArticles: NewsArticle[] = [
    {
        id: 'news-1',
        createdAt: '2025-01-15',
        updatedAt: '2025-01-15',
        title: 'Nex Real Estate Launches Premium Heights Project',
        slug: 'nex-launches-premium-heights',
        excerpt: 'Nex Real Estate announces the launch of its flagship residential project in Gulshan.',
        content: 'Full article content here...',
        image: {
            id: 'news-img-1',
            url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
            alt: 'Premium Heights Launch',
        },
        category: 'launch',
        author: 'Nex Media Team',
        publishDate: '2025-01-15',
        featured: true,
        tags: ['launch', 'residential', 'gulshan'],
    },
    {
        id: 'news-2',
        createdAt: '2025-01-10',
        updatedAt: '2025-01-10',
        title: 'Real Estate Market Trends in Bangladesh 2025',
        slug: 'real-estate-trends-2025',
        excerpt: 'An analysis of the real estate market trends and predictions for 2025 in Bangladesh.',
        content: 'Full article content here...',
        image: {
            id: 'news-img-2',
            url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
            alt: 'Market Trends',
        },
        category: 'blog',
        author: 'Research Team',
        publishDate: '2025-01-10',
        featured: true,
        tags: ['market', 'trends', 'analysis'],
    },
    {
        id: 'news-3',
        createdAt: '2025-01-05',
        updatedAt: '2025-01-05',
        title: 'Nex Real Estate Wins Best Developer Award',
        slug: 'nex-wins-developer-award',
        excerpt: 'Nex Real Estate recognized as the best real estate developer of 2024.',
        content: 'Full article content here...',
        image: {
            id: 'news-img-3',
            url: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800&q=80',
            alt: 'Award Ceremony',
        },
        category: 'press',
        author: 'PR Team',
        publishDate: '2025-01-05',
        featured: false,
        tags: ['award', 'recognition'],
    },
];

export const dummyMediaContent: MediaPageContent = {
    heroSection: {
        title: 'Media & News',
        subtitle: 'Stay updated with the latest from Nex Real Estate',
        backgroundImage: {
            id: 'media-hero-1',
            url: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1920&q=80',
            alt: 'Media & News',
        },
    },
    articles: dummyNewsArticles,
};

// ================================
// CAREER PAGE CONTENT
// ================================

export const dummyJobOpenings: JobOpening[] = [
    {
        id: 'job-1',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Senior Architect',
        slug: 'senior-architect',
        department: 'Design & Architecture',
        location: 'Dhaka',
        type: 'full-time',
        experience: '5+ years',
        salary: 'Competitive',
        description: 'We are looking for a Senior Architect to lead our design team.',
        requirements: [
            'Bachelor\'s degree in Architecture',
            '5+ years of experience',
            'AutoCAD and 3D modeling proficiency',
            'Project management experience',
        ],
        responsibilities: [
            'Lead architectural design projects',
            'Mentor junior architects',
            'Client presentations',
            'Quality control',
        ],
        benefits: ['Health Insurance', 'Festival Bonus', 'Professional Development'],
        deadline: '2025-02-28',
        active: true,
    },
    {
        id: 'job-2',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        title: 'Sales Executive',
        slug: 'sales-executive',
        department: 'Sales & Marketing',
        location: 'Dhaka',
        type: 'full-time',
        experience: '2+ years',
        salary: 'Base + Commission',
        description: 'Join our dynamic sales team and help clients find their dream properties.',
        requirements: [
            'Bachelor\'s degree',
            '2+ years in real estate sales',
            'Excellent communication skills',
            'Valid driving license',
        ],
        responsibilities: [
            'Property showings',
            'Client relationship management',
            'Sales target achievement',
            'Market research',
        ],
        benefits: ['Health Insurance', 'Commission', 'Transport Allowance'],
        deadline: '2025-02-15',
        active: true,
    },
];

export const dummyCareerContent: CareerPageContent = {
    heroSection: {
        title: 'Careers at Nex',
        subtitle: 'Build your future with us',
        backgroundImage: {
            id: 'career-hero-1',
            url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1920&q=80',
            alt: 'Careers',
        },
    },
    lifeAtNex: {
        title: 'Life at Nex',
        content: 'At Nex Real Estate, we believe in fostering a collaborative and innovative work environment. Our team is our greatest asset, and we invest in their growth and well-being.',
        images: [
            { id: 'life-1', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', alt: 'Team' },
            { id: 'life-2', url: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80', alt: 'Office' },
        ],
        perks: [
            { title: 'Health Coverage', description: 'Comprehensive health insurance for you and your family.', icon: 'Heart' },
            { title: 'Learning Budget', description: 'Annual budget for courses and certifications.', icon: 'GraduationCap' },
            { title: 'Flexible Hours', description: 'Work-life balance with flexible scheduling.', icon: 'Clock' },
            { title: 'Team Events', description: 'Regular team outings and celebrations.', icon: 'Users' },
        ],
    },
    jobOpenings: dummyJobOpenings,
    internshipProgram: {
        title: 'Internship Program',
        content: 'Kickstart your career in real estate with our comprehensive internship program. Gain hands-on experience and learn from industry experts.',
        benefits: [
            'Mentorship from senior professionals',
            'Real project experience',
            'Networking opportunities',
            'Certificate upon completion',
            'Potential for full-time offer',
        ],
        image: {
            id: 'intern-1',
            url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80',
            alt: 'Internship',
        },
    },
};

// ================================
// CONTACT PAGE CONTENT
// ================================

export const dummyContactContent: ContactPageContent = {
    heroSection: {
        title: 'Contact Us',
        subtitle: 'Get in touch with our team',
        backgroundImage: {
            id: 'contact-hero-1',
            url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
            alt: 'Contact',
        },
    },
    offices: [
        {
            id: 'office-1',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Head Office',
            type: 'hq',
            address: 'House: 50, Level-5, Lake Circus Kalabagan, Dhaka 1209, Bangladesh',
            phone: ['+880 1677-600000', '+880 1312-124545'],
            email: 'hello.nexrealestate@gmail.com',
        },
        {
            id: 'office-2',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            title: 'Corporate Office',
            type: 'corporate',
            address: 'House: 35/B, Level-5, Road: 9/A, Dhanmondi, Dhaka 1205, Bangladesh',
            phone: ['+880 1984-886886', '+880 1817-221100'],
            email: 'corporate@nexrealestate.com',
        },
    ],
    socialLinks: {
        facebook: 'https://www.facebook.com/NexRealEstateLtd',
        youtube: 'https://www.youtube.com/@NexRealEstateLtd',
        linkedin: 'https://www.linkedin.com/company/nex-realestate/',
    },
    workingHours: {
        weekdays: 'Saturday - Thursday: 10:00 AM - 6:00 PM',
        weekends: 'Friday: Closed',
    },
};

// ================================
// BUSINESS PAGE CONTENT
// ================================

export const dummyBusinessContent: BusinessPageContent = {
    heroSection: {
        title: 'Our Business Ventures',
        subtitle: 'Diverse businesses under the Nex umbrella',
        backgroundImage: {
            id: 'business-hero-1',
            url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80',
            alt: 'Business',
        },
    },
    partners: [
        {
            id: 'biz-1',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Mechanix Interior',
            slug: 'mechanix-interior',
            description: 'Premium interior design and execution services.',
            logo: { id: 'biz-logo-1', url: 'https://via.placeholder.com/200x100?text=Mechanix', alt: 'Mechanix' },
            category: 'Design',
            order: 1,
        },
        {
            id: 'biz-2',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Fervent Architecture',
            slug: 'fervent-architecture',
            description: 'Innovative architectural design solutions.',
            logo: { id: 'biz-logo-2', url: 'https://via.placeholder.com/200x100?text=Fervent', alt: 'Fervent' },
            category: 'Architecture',
            order: 2,
        },
        {
            id: 'biz-3',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'NexKraft',
            slug: 'nexkraft',
            description: 'Digital solutions and technology services.',
            logo: { id: 'biz-logo-3', url: 'https://via.placeholder.com/200x100?text=NexKraft', alt: 'NexKraft' },
            website: 'https://nexkraft.com',
            category: 'Technology',
            order: 3,
        },
        {
            id: 'biz-4',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'NexAcademy',
            slug: 'nexacademy',
            description: 'Education and training programs.',
            logo: { id: 'biz-logo-4', url: 'https://via.placeholder.com/200x100?text=NexAcademy', alt: 'NexAcademy' },
            category: 'Education',
            order: 4,
        },
        {
            id: 'biz-5',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'Beans & Buddy',
            slug: 'beans-buddy',
            description: 'Premium coffee and cafe experience.',
            logo: { id: 'biz-logo-5', url: 'https://via.placeholder.com/200x100?text=Beans', alt: 'Beans & Buddy' },
            category: 'F&B',
            order: 5,
        },
        {
            id: 'biz-6',
            createdAt: '2025-01-01',
            updatedAt: '2025-01-01',
            name: 'ICT Olympiad Bangladesh',
            slug: 'ict-olympiad',
            description: 'Technology competition platform.',
            logo: { id: 'biz-logo-6', url: 'https://via.placeholder.com/200x100?text=ICT', alt: 'ICT Olympiad' },
            category: 'Education',
            order: 6,
        },
    ],
    partnershipTypes: [
        {
            id: 'vendor',
            icon: 'Briefcase',
            title: 'Vendors & Suppliers',
            description: 'Supply construction materials, fixtures, and fittings for our projects.',
            benefits: [
                'Long-term business relationships',
                'Regular high-volume orders',
                'Timely payments',
                'Quality partnership',
            ],
        },
        {
            id: 'contractor',
            icon: 'Building2',
            title: 'Contractors & Subcontractors',
            description: 'Partner with us for construction, electrical, plumbing, and other specialized work.',
            benefits: [
                'Steady project flow',
                'Fair compensation',
                'Professional development',
                'Safety compliance support',
            ],
        },
        {
            id: 'consultant',
            icon: 'Users',
            title: 'Consultants & Professionals',
            description: 'Architects, engineers, legal experts, and other professionals who can add value.',
            benefits: [
                'Diverse project portfolio',
                'Collaborative environment',
                'Industry recognition',
                'Growth opportunities',
            ],
        },
        {
            id: 'investor',
            icon: 'TrendingUp',
            title: 'Investment Partners',
            description: 'Invest in our projects and earn attractive returns on your capital.',
            benefits: [
                'Competitive returns',
                'Asset-backed investments',
                'Transparent reporting',
                'Exit flexibility',
            ],
        },
    ],
    whyPartner: [
        {
            icon: 'ShieldCheck',
            title: 'Trusted Name',
            description: 'Over 15 years of excellence in real estate development with a proven track record.',
        },
        {
            icon: 'Handshake',
            title: 'Fair Dealings',
            description: 'We believe in transparent, ethical business practices and mutually beneficial partnerships.',
        },
        {
            icon: 'TrendingUp',
            title: 'Growth Potential',
            description: 'Partner with a growing company and expand your business alongside us.',
        },
    ],
};

// ================================
// FORM SUBMISSIONS (DUMMY)
// ================================

export const dummyContactInquiries: ContactInquiry[] = [
    {
        id: 'inq-1',
        createdAt: '2025-01-20',
        updatedAt: '2025-01-20',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+880 1711-111111',
        subject: 'Property Inquiry',
        message: 'I am interested in Nex Premium Heights. Please share more details.',
        type: 'property',
        status: 'pending',
        propertyInterest: 'Nex Premium Heights',
    },
    {
        id: 'inq-2',
        createdAt: '2025-01-19',
        updatedAt: '2025-01-20',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+880 1722-222222',
        subject: 'Investment Opportunity',
        message: 'Looking for investment opportunities in real estate.',
        type: 'investment',
        status: 'responded',
    },
];

export const dummyCareerApplications: CareerApplication[] = [
    {
        id: 'app-1',
        createdAt: '2025-01-18',
        updatedAt: '2025-01-18',
        jobId: 'job-1',
        jobTitle: 'Senior Architect',
        name: 'Ahmed Rahman',
        email: 'ahmed@example.com',
        phone: '+880 1733-333333',
        resume: '/uploads/resumes/ahmed-resume.pdf',
        coverLetter: 'I am excited to apply for the Senior Architect position...',
        linkedIn: 'https://linkedin.com/in/ahmedrahman',
        status: 'pending',
    },
    {
        id: 'app-2',
        createdAt: '2025-01-17',
        updatedAt: '2025-01-19',
        jobId: 'job-2',
        jobTitle: 'Sales Executive',
        name: 'Fatima Begum',
        email: 'fatima@example.com',
        phone: '+880 1744-444444',
        resume: '/uploads/resumes/fatima-resume.pdf',
        status: 'shortlisted',
    },
];
