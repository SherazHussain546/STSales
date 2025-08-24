# **App Name**: SyncSalesAI

## Core Features:

- AI Lead Finder: Use the OpenAI API as a tool for AI-powered business lead discovery, allowing users to input industry and location to find potential leads. The tool identifies and structures company names, summaries, and tech needs, and presents the results in a card format in the UI.
- AI Outreach Generator: Leverage the OpenAI API to generate personalized outreach content, including cold emails and proposal outlines. Users can view the generated content in collapsible sections, with copy buttons for easy use.
- Mobile Navigation: Implement bottom tab navigation for mobile devices, featuring icons and labels for Lead Finder, Outreach Generator, and Invoice Generator. The active state is highlighted with the cyan accent color, ensuring easy thumb access and intuitive navigation on mobile devices with a maximum width of 448px.
- Invoice Generator: Build a component for creating professional invoices, allowing users to input client information, manage service items, and calculate taxes. Quick-add feature for common SYNC services. Generates invoice previews
- Loading State Management: Loading states should appear while AI models and other remote resources are generating, creating, or retrieving data. Display these both on initial data fetch and during all asynchronous operations.

## Style Guidelines:

- Primary color: Cyan (#14c99e) for a modern and tech-forward feel, echoing the SYNC TECH brand. Chosen for its vibrant yet professional appeal.
- Background color: Very dark desaturated blue (#09090b), to establish a dark theme.
- Accent color: Saturated green (#98FF98) to provide good contrast with the primary and background colors. Chosen because its placement to the 'left' of cyan on the color wheel makes it analogous to cyan.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and short amounts of body text, and 'Inter' (sans-serif) for longer blocks of body text. 'Space Grotesk' evokes a techy feel, and 'Inter' offers excellent readability for longer text passages.
- Code font: 'Source Code Pro' for displaying code snippets.
- Mobile-first design with a maximum width of 448px, ensuring a consistent and optimized experience on mobile devices.
- Utilize flat, minimalist icons that complement the modern design. Use the provided Business and LocationOn icons