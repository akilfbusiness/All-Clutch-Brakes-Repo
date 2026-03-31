// Content templates for pre-filled document structures
// These help maintain consistency and speed up content creation

export const articleTemplates = {
  "faq-article": {
    title: "FAQ Article",
    _type: "article",
    content: [
      {
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "faq-intro",
            _type: "span",
            text: "Frequently Asked Question",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _key: "faq-content",
            _type: "span",
            text: "Enter the answer to your frequently asked question here. Keep it concise and helpful for your customers.",
          },
        ],
      },
    ],
    excerpt: "A common question from our customers.",
    seoTitle: "FAQ - [Your Question Here]",
    seoDescription:
      "Find answers to frequently asked questions about our clutch and brake services.",
  },
  "how-to-guide": {
    title: "How To: [Add Title]",
    _type: "article",
    content: [
      {
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "howto-intro",
            _type: "span",
            text: "How to [Add Your Topic]",
          },
        ],
      },
      {
        _type: "block",
        style: "h3",
        children: [
          {
            _key: "step1-title",
            _type: "span",
            text: "Step 1: [Add Step Title]",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _key: "step1-content",
            _type: "span",
            text: "Describe the first step in detail.",
          },
        ],
      },
    ],
    excerpt: "A step-by-step guide for [your topic].",
    seoTitle: "How to [Topic] - All Clutch & Brake Service",
    seoDescription:
      "Learn how to [topic] with our easy-to-follow guide. Expert tips from All Clutch & Brake Service.",
  },
  "service-explainer": {
    title: "[Service Name] Explained",
    _type: "article",
    content: [
      {
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "service-intro",
            _type: "span",
            text: "Understanding [Service Name]",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _key: "service-what",
            _type: "span",
            text: "What is [Service Name]? Explain the service and why customers might need it.",
          },
        ],
      },
      {
        _type: "block",
        style: "h3",
        children: [
          {
            _key: "service-benefits",
            _type: "span",
            text: "Benefits",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _key: "service-benefits-content",
            _type: "span",
            text: "List the key benefits of this service.",
          },
        ],
      },
    ],
    excerpt: "Everything you need to know about [Service Name].",
    seoTitle: "[Service Name] - All Clutch & Brake Service Adelaide",
    seoDescription:
      "Get expert [Service Name] from All Clutch & Brake Service. Learn more about our [Service Name] process.",
  },
}

export const serviceTemplates = {
  "standard-service": {
    title: "[Service Name]",
    _type: "service",
    description: "Add a detailed description of this service, what it includes, and why it matters.",
    shortDescription: "Brief one-line description of the service.",
    pricing: "Contact for quote",
    content: [
      {
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "service-overview",
            _type: "span",
            text: "Service Overview",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _key: "service-overview-text",
            _type: "span",
            text: "Describe what this service involves and the benefits.",
          },
        ],
      },
    ],
    seoTitle: "[Service Name] | All Clutch & Brake Service",
    seoDescription:
      "Professional [Service Name] in Adelaide. All makes and models. Same-day service available.",
  },
}

export const locationTemplates = {
  "standard-location": {
    title: "[Suburb Name] - Clutch & Brake Service",
    _type: "location",
    description:
      "All Clutch & Brake Service proudly serves the [Suburb Name] area. Visit our shop or call for mobile service.",
    address: "[Shop Address]",
    phone: "(08) 8277 8122",
    hours: "Monday - Friday: 8:00 AM - 5:00 PM, Saturday - Sunday: Closed",
    content: [
      {
        _type: "block",
        style: "h2",
        children: [
          {
            _key: "location-serving",
            _type: "span",
            text: "Serving [Suburb Name]",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _key: "location-intro",
            _type: "span",
            text: "We proudly serve [Suburb Name] and the surrounding areas. Describe the location and what makes it special.",
          },
        ],
      },
    ],
    seoTitle: "[Suburb Name] Clutch & Brake Repair | All Clutch & Brake Service",
    seoDescription:
      "Clutch and brake repairs in [Suburb Name]. Expert service for all makes. Call (08) 8277 8122.",
  },
}

export const pageTemplates = {
  "landing-page": {
    title: "[Campaign Name] Landing Page",
    _type: "page",
    slug: {
      current: "[campaign-slug]",
    },
    content: [
      {
        _type: "block",
        style: "h1",
        children: [
          {
            _key: "landing-headline",
            _type: "span",
            text: "[Headline] - Make it compelling and action-oriented.",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _key: "landing-intro",
            _type: "span",
            text: "A clear, benefit-focused introduction. What problem does this solve?",
          },
        ],
      },
    ],
    seoTitle: "[Campaign Name] - All Clutch & Brake Service",
    seoDescription: "Special offer: [Campaign Details]. Limited time only!",
  },
  "about-us": {
    title: "About Us",
    _type: "page",
    slug: {
      current: "about",
    },
    content: [
      {
        _type: "block",
        style: "h1",
        children: [
          {
            _key: "about-headline",
            _type: "span",
            text: "About All Clutch & Brake Service",
          },
        ],
      },
      {
        _type: "block",
        children: [
          {
            _key: "about-intro",
            _type: "span",
            text: "Tell your story. Share your company history, mission, and what makes you different.",
          },
        ],
      },
    ],
    seoTitle: "About All Clutch & Brake Service - Adelaide",
    seoDescription: "Learn about All Clutch & Brake Service. [Your story here].",
  },
}

// Helper to apply template
export function applyTemplate(templateName: string, category: "article" | "service" | "location" | "page") {
  const templateMap: any = {
    article: articleTemplates,
    service: serviceTemplates,
    location: locationTemplates,
    page: pageTemplates,
  }

  return templateMap[category]?.[templateName] || null
}
