const story = {
  hero: {
    title: "About BlackCore AI",
    subtitle: "Revolutionizing audit processes with AI-first automation, reducing audit time by 60-80% while maintaining compliance excellence.",
    backgroundImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1350&q=80"
  },
  sections: [
    {
      id: "our-company",
      title: "About the Company",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1350&q=80",
      imageAlt: "Modern office with team collaboration",
      content: [
        {
          type: "paragraph",
          text: "BlackCore AI is transforming the audit industry through cutting-edge artificial intelligence and automation. Founded by industry veterans who saw the inefficiencies in traditional audit processes, we've built a platform that revolutionizes how audits are conducted.",
          style: "secondary"
        },
        {
          type: "paragraph",
          text: "Our mission: Eliminate 60-80% of manual audit work through intelligent automation.",
          style: "primary-bold"
        },
        {
          type: "paragraph",
          text: "We serve both internal and external audit teams across federal, commercial, and international frameworks. Our AI-powered platform handles everything from audit work program generation to evidence collection, testing, and report drafting - allowing auditors to focus on high-value review and strategic insights.",
          style: "secondary"
        },
        {
          type: "paragraph",
          text: "With deep expertise in compliance frameworks like SOX, FISMA, NIST, HIPAA, and ISO standards, BlackCore AI ensures that automation doesn't compromise quality. Instead, it enhances consistency, reduces human error, and accelerates time to completion.",
          style: "secondary"
        }
      ]
    },
    {
      id: "our-product",
      title: "About the Product",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1350&q=80",
      imageAlt: "AI-powered audit dashboard",
      imagePosition: "left",
      content: [
        {
          type: "paragraph",
          text: "Two Powerful Domains. One Revolutionary Platform.",
          style: "primary-bold"
        },
        {
          type: "paragraph",
          text: "BlackCore AI offers comprehensive audit automation through two specialized domains - Internal Audit and External Audit - each with modules tailored to specific compliance frameworks and industries.",
          style: "secondary"
        },
        {
          type: "paragraph",
          text: "Internal Audit Domain: Autonomous testing of internal controls, risk assessments, and compliance frameworks. Features automated AWP generation, PBC list creation, walkthrough automation, and AI-powered report generation.",
          style: "secondary"
        },
        {
          type: "paragraph",
          text: "External Audit Domain: AI-first preparation with auditor-as-reviewer workflow. BlackCore performs all scoping, testing, and documentation while auditors focus on review and sign-off, achieving 60-80% time reduction.",
          style: "secondary"
        },
        {
          type: "paragraph",
          text: "Supporting Federal (FISMA, NIST, FedRAMP), Commercial (SOX, HIPAA, PCI DSS), and International frameworks with intelligent, framework-specific automation.",
          style: "primary-bold"
        }
      ]
    }
  ],
  team: {
    title: "Leadership Team",
    subtitle: "Visionaries driving the future of automated auditing",
    members: [
      {
        id: "ceo",
        name: "John Smith",
        role: "Chief Executive Officer",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
        bio: "With over 20 years in audit and compliance, John founded BlackCore AI after witnessing countless hours wasted on manual processes. His vision of AI-augmented auditing has attracted top talent and major enterprise & Federal clients.",
        primary: true
      },
      {
        id: "caio",
        name: "Sarah Chen",
        role: "Chief AI Officer",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
        bio: "Former researcher assistant in Munich, Masters in NLP from .... Sarah leads our AI innovation, ensuring BlackCore stays at the cutting edge of automation technology."
      },
      {
        id: "cto",
        name: "Michael Rodriguez",
        role: "Chief Technology Officer",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
        bio: "Previously CTO at a Big Four audit firm's innovation lab. Michael architects our scalable, secure platform that processes millions of audit documents daily."
      },
      {
        id: "chief-engineer",
        name: "Coming Soon",
        role: "Chief Engineer",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80",
        bio: "We're searching for an exceptional engineering leader to drive our technical excellence forward. Join us in revolutionizing the audit industry.",
        placeholder: true
      }
    ]
  },
  values: [
    {
      id: "automation-first",
      title: "Automation First",
      description: "We believe repetitive audit tasks should be automated, freeing professionals for strategic work.",
      icon: "settings",
      color: "primary"
    },
    {
      id: "accuracy-assured",
      title: "Accuracy Assured",
      description: "AI-powered consistency and precision that exceeds human capabilities in routine testing.",
      icon: "verified",
      color: "accent"
    },
    {
      id: "compliance-focused",
      title: "Compliance Focused",
      description: "Deep expertise in regulatory frameworks ensures automation meets all standards.",
      icon: "shield",
      color: "primary"
    },
    {
      id: "time-optimized",
      title: "Time Optimized",
      description: "60-80% reduction in audit time through intelligent process automation.",
      icon: "schedule",
      color: "accent"
    }
  ]
};

export default story;