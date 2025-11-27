# Experience Catalyst FAQ

### What is Experience Catalyst?
Experience Catalyst (formerly called “Site Transfer Agent” and “Project Site Leap”) is an AI-driven assistant built by Adobe for automating website migration and onboarding to AEM Edge Delivery Services. It enables organizations to migrate entire sites from other CMSs, legacy AEM, or even from design files—rapidly launching modern, high-performing Edge Delivery projects with minimal manual effort.

### What problems does Experience Catalyst solve?
Experience Catalyst streamlines and accelerates the migration of websites to AEM Edge Delivery, reducing timelines from months to days. It automates project setup, content inventory, migration, and styling—eliminating the manual, developer-heavy, expensive, and error-prone processes traditionally required for large migrations.

### What are the main benefits for customers?

Speed: Migrates sites in days instead of months.
Cost Savings: Cuts migration costs by up to 50%.
Reduced Effort: Decreases manual workload and complexity by up to 70%.
Performance: Delivers better SEO, site speed, and conversion rates.
Quality & Control: Automated tooling ensures design fidelity and robust optimizations.
AI-Driven: Leverages Adobe’s AEMY AI for smarter workflows and content mapping.

### How does Experience Catalyst work?
Experience Catalyst is a GitHub-based automation framework using an AI assistant (AEMY) for:

Project Generation: Creates an Edge Delivery boilerplate and GitHub workflows.
URL Analysis & Inventory: Crawls legacy sites, inventories pages and blocks.
Block Detection: Identifies reusable components for migration.
Branding & Styling: AI-assisted workflows ensure brand consistency.
Content Import: Automates and customizes content migration scripts.

### Who can use Experience Catalyst today?
Currently, Experience Catalyst is available through an Early Access Program for new and existing Adobe customers and partners. In this phase, Adobe operates the tooling and delivers the migration collaboratively. End customers participate by providing source URLs, validating content, making branding decisions, and supporting go-live activities.

### When will Experience Catalyst be generally available?
The MVP for general availability is targeted towards the end of H2 2025, following the current Early Access Program.

### What kinds of projects are best suited for Experience Catalyst?
Experience Catalyst is ideal for:

Migrating sites with 50K+ pages.
Replatforming from legacy AEM or third-party CMS.
Rapid creation of new digital experiences from design files (e.g., Figma) or site URLs.
Reference: Summer 2025 Large Projects
What’s coming next for Experience Catalyst?
Ongoing AI enhancements for content mapping and design transformations.
Self-service tools and more UI features for business users.
Expansion beyond Adobe-led migrations to ecosystem usage.

### Is Experience Catalyst only for Edge Delivery Services?
Experience Catalyst currently only supports migrations to AEM Edge Delivery Services (EDS). It does not support other AEM deployment models or hosting environments like On-Premise (AEM 6.5) or Managed Services.

### What are the technical qualifications or prerequisites for Experience Catalyst?
For Universal Editor / Crosswalk integrations on AMS, the source AEM instance must be on at least Service Pack 21 (SP21). Sites on older service packs are not eligible.
Manual site inventory sometimes required for accurate migration of pages/blocks on simple or highly-custom sources.

### What is the Early Access Program for Experience Catalyst?
The Early Access Program is operated via collaborative engagements, not via self-serve tooling.
The customer, partner, or field team cannot directly run Experience Catalyst or AEMY; instead, Adobe operates it on their behalf until GA.
Many features teased at Summit/Sneaks (full UI, automated process) are being actively iterated on, and their final form and availability may evolve as the product develops.

### Complexity with Highly Custom or Commerce-Heavy Sites
Sites with deep backend dependencies (e.g., complex PIM, e-commerce) are generally not supported, as heavy data integrations are out of scope for the current toolset.
Example: Large ecommerce brands with dynamic content and PIM integration require special consideration and may fall outside the supported scope of the tool.

### The customer website has a firewall blocking Experience Catalyst. What could be done?
The customer needs to fine-tune the firewall rules to allow our public IPs to hit their system without being blocked (be detected as a bot). Our public IPs are:
- 68.154.123.137
- 20.161.80.210
- 18.232.5.47
- 3.94.219.54
- 34.205.100.249

### How can I reset my repository or start over with a new site?
If you want to try migrating another site or need to reset your current setup, you can use the automated backup and reset functionality. This allows you to safely backup your current work and reset your repository to a clean state for a new migration. See the [Backup and Reset Guide](backup-and-reset.md) for detailed instructions.


