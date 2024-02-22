type MarketplaceAssistant = {
    id: string;
    name: string;
    description: string;
    categories: string[];
};

export const marketplaceWorkers: Array<MarketplaceAssistant> = [
    {
        id: 'personal-trainer',
        name: 'Personal Trainer',
        description: 'Provides custom fitness plans and tracks progress.',
        categories: ['personalDevelopment']
    }, {
        id: 'finance-manager',
        name: 'Finance Manager',
        description: 'Helps manage income, expenses and guides for better financial decisions.',
        categories: ['personalDevelopment']
    }, {
        id: 'dietician',
        name: 'Dietician',
        description: 'Offers personalized diet plans and nutrition advice.',
        categories: ['personalDevelopment']
    }, {
        id: 'tutor',
        name: 'Tutor',
        description: 'Provides personalized learning and study assistance.',
        categories: ['education']
    }, {
        id: 'academic-counsellor',
        name: 'Academic Counsellor',
        description: 'Helps with course selection, college application process, etc.',
        categories: ['education']
    }, {
        id: 'learning-assistant',
        name: 'Learning Assistant',
        description: 'Facilitates interactive learning and provides resources.',
        categories: ['education']
    }, {
        id: 'inventory-manager',
        name: 'Inventory Manager',
        description: 'Tracks stocked goods and predicts future needs.',
        categories: ['businessOps']
    }, {
        id: 'human-resources',
        name: 'Human Resources',
        description: 'Automates HR processes like recruiting, employee records etc.',
        categories: ['businessOps']
    }, {
        id: 'customer-service',
        name: 'Customer Service',
        description: 'Answers customer queries, complaints and feedback.',
        categories: ['businessOps']
    }, {
        id: 'bug-tester',
        name: 'Bug Tester',
        description: 'Detects and reports software bugs and issues.',
        categories: ['softwareDevelopment']
    }, {
        id: 'code-review-assistant',
        name: 'Code Review Assistant',
        description: 'Assists in reviewing and improving code quality.',
        categories: ['softwareDevelopment']
    }, {
        id: 'process-optimizer',
        name: 'Process Optimizer',
        description: 'Streamlines and optimizes the development process',
        categories: ['softwareDevelopment']
    }, {
        id: 'sales-assistant',
        name: 'Sales Assistant',
        description: 'Tracks leads, helps close sales deals and manages client relationships.',
        categories: ['salesAndMarketing']
    }, {
        id: 'marketing-strategist',
        name: 'Marketing Strategist',
        description: 'Collects and analyzes market data to create strategic plans.',
        categories: ['salesAndMarketing']
    }, {
        id: 'customer-relationship',
        name: 'Customer Relationship',
        description: 'Builds and maintains customer relationships, manages loyalty programs.',
        categories: ['salesAndMarketing']
    }, {
        id: 'virtual-tour-guide',
        name: 'Virtual Tour Guide',
        description: 'Provides rich, interactive virtual travel experiences.',
        categories: ['entertainment']
    }, {
        id: 'gaming-assistant',
        name: 'Gaming Assistant',
        description: 'Helps improve gaming skills, provides walkthroughs and game suggestions.',
        categories: ['entertainment']
    }, {
        id: 'music-recommendation',
        name: 'Music Recommendation',
        description: 'Suggests music based on preferences, moods, and activities.',
        categories: ['entertainment']
    }, {
        id: 'travel-planner',
        name: 'Travel Planner',
        description: 'Creates detailed travel itineraries based on preferences.',
        categories: ['travel']
    }, {
        id: 'hotel-concierge',
        name: 'Hotel Concierge',
        description: 'Facilitates hotel service like bookings, room service, facilities.',
        categories: ['travel']
    }, {
        id: 'flight-booking',
        name: 'Flight Booking',
        description: 'Finds and books flights based on travel needs.',
        categories: ['travel']
    }, {
        id: 'personal-chef',
        name: 'Personal Chef',
        description: 'Suggests recipes based on available ingredients, dietary restrictions.',
        categories: ['lifestyle']
    }, {
        id: 'home-organizer',
        name: 'Home Organizer',
        description: 'Helps declutter and organize living space.',
        categories: ['lifestyle']
    }, {
        id: 'interior-design',
        name: 'Interior Design',
        description: 'Gives advice on home decor and interior design.',
        categories: ['lifestyle']
    }, {
        id: 'loan-advisor',
        name: 'Loan Advisor',
        description: 'Guides on the selection of suitable loan offers based on user\'s requirements and financial health.',
        categories: ['finance']
    }, {
        id: 'investment-assistant',
        name: 'Investment Assistant',
        description: 'Provides advice on potential investment opportunities and strategies, and keeps track of portfolio performance.',
        categories: ['finance']
    }, {
        id: 'tax-planner',
        name: 'Tax Planner',
        description: 'Helps users prepare and file their taxes, identify tax-saving opportunities, and comply with tax laws.',
        categories: ['finance', 'businessOps']
    }, {
        id: 'personal-budgeter',
        name: 'Personal Budgeter',
        description: 'Assists users in creating, managing, and tracking their personal or household budgets.',
        categories: ['finance', 'personalDevelopment', 'travel']
    },
];
