## ADDED Requirements

### Requirement: Product landing page structure

The system SHALL provide a single responsive smartphone landing page that includes a hero section, standout feature section, technical specification section, product showcase, newsletter registration form, and footer.

#### Scenario: Required sections are visible

- **WHEN** a visitor opens the landing page
- **THEN** the page MUST display the hero, features, technical specifications, product showcase, newsletter form, and footer in a coherent scrollable layout

#### Scenario: Hero presents a product-first message

- **WHEN** the hero section is rendered
- **THEN** it MUST show a clear smartphone-focused headline, supporting value copy, primary call to action, and product imagery or product-backed visual content

### Requirement: DummyJSON smartphone integration

The system SHALL fetch smartphone product data from `https://dummyjson.com/products/category/smartphones` and use the response to populate product-focused landing page content.

#### Scenario: Products load successfully

- **WHEN** the DummyJSON endpoint returns smartphone products
- **THEN** the page MUST render product names, images, prices or discounts, ratings, and relevant product details from the API response

#### Scenario: Products are loading

- **WHEN** product data has not finished loading
- **THEN** the page MUST show skeleton or placeholder content without causing layout jumps

#### Scenario: Products fail to load

- **WHEN** the DummyJSON request fails
- **THEN** the page MUST show a graceful error or fallback state while preserving access to the main landing page sections

### Requirement: Responsive visual design

The system SHALL provide a modern, polished, and responsive UI that works on desktop and mobile without broken layout, clipped text, or horizontal overflow.

#### Scenario: Mobile viewport layout

- **WHEN** the page is viewed on a mobile viewport
- **THEN** navigation, hero content, product cards, specifications, and form controls MUST fit within the viewport and remain readable

#### Scenario: Desktop viewport layout

- **WHEN** the page is viewed on a desktop viewport
- **THEN** the page MUST use available horizontal space for richer product presentation while preserving clear hierarchy and spacing

### Requirement: SEO metadata

The system SHALL define core SEO metadata for the landing page, including page title, description, and Open Graph fields.

#### Scenario: Metadata is available

- **WHEN** crawlers or social preview tools inspect the landing page
- **THEN** they MUST receive a meaningful title, description, and Open Graph metadata for the smartphone landing page

### Requirement: Performance-conscious implementation

The system SHALL optimize frontend loading behavior and media handling to support a Google PageSpeed Insights Mobile score target of at least 85/100.

#### Scenario: Optimized media rendering

- **WHEN** product imagery is displayed
- **THEN** images MUST be sized, constrained, lazy-loaded where appropriate, and rendered without avoidable cumulative layout shift

#### Scenario: Production build is generated

- **WHEN** the frontend production build command runs
- **THEN** the build MUST complete without TypeScript, lint, or framework errors

### Requirement: Newsletter registration form

The system SHALL provide a newsletter registration form with client-side validation, a clear success or failure state, and optional webhook delivery when a webhook URL is configured.

#### Scenario: Valid newsletter submission

- **WHEN** a visitor submits a valid email address
- **THEN** the form MUST acknowledge the submission and keep the visitor on the landing page

#### Scenario: Invalid newsletter submission

- **WHEN** a visitor submits an empty or invalid email address
- **THEN** the form MUST show a validation message and MUST NOT show a success state

#### Scenario: Webhook newsletter submission is configured

- **WHEN** a visitor submits a valid email address and a newsletter webhook URL is configured
- **THEN** the form MUST send the submission payload to the configured webhook and show a clear success or failure state based on the result

#### Scenario: Webhook newsletter submission is not configured

- **WHEN** a visitor submits a valid email address and no newsletter webhook URL is configured
- **THEN** the form MUST keep the required landing page flow usable with a local success or demo state

### Requirement: Interactive bonus features

The system SHALL include lightweight interactive enhancements that improve the submission quality without requiring a backend.

#### Scenario: Theme preference changes

- **WHEN** a visitor toggles between light and dark mode
- **THEN** the page MUST update the visual theme and remember the preference for later visits on the same browser

#### Scenario: Product interaction is saved locally

- **WHEN** a visitor marks a product as favorite, adds it to a cart preview, or views product details
- **THEN** the interaction MUST update visible UI state and MAY persist locally in the browser

#### Scenario: Scrollytelling and parallax enhance product story

- **WHEN** a visitor scrolls through the landing page
- **THEN** the page MUST present a coherent product story with lightweight parallax or scroll-linked visual transitions that respect reduced-motion preferences

#### Scenario: Behavior tracking is visible

- **WHEN** a visitor clicks an interactive element or crosses a tracked scroll-depth milestone
- **THEN** the page MUST send the behavior event to the backend and show a short non-blocking notification confirming the interaction was tracked

#### Scenario: Behavior events are retained for demo evidence

- **WHEN** behavior events are submitted through the tracking endpoint
- **THEN** the backend MUST retain a bounded recent-event summary that can be inspected during verification

### Requirement: Optional product assistant chatbot

The system SHALL provide an optional product assistant chatbot for smartphone questions when OpenAI or Gemini credentials are configured, while keeping the landing page functional when credentials are absent.

#### Scenario: Chatbot credentials are configured

- **WHEN** a visitor asks a smartphone product question through the chatbot
- **THEN** the chatbot MUST respond using the available product context and the configured AI provider

#### Scenario: Chatbot credentials are absent

- **WHEN** a visitor opens the chatbot without configured AI credentials
- **THEN** the chatbot MUST show a graceful disabled, demo, or setup-needed state without breaking the landing page

### Requirement: Tooling and deploy readiness

The system SHALL include frontend project tooling for TypeScript, ESLint, Prettier, Tailwind CSS, deployment-ready scripts, and final submission evidence.

#### Scenario: Developer checks run

- **WHEN** a developer runs the documented lint, format check, type check, and build commands
- **THEN** the commands MUST complete successfully or report actionable errors

#### Scenario: Free cloud deployment is prepared

- **WHEN** the project is deployed to a free cloud platform that supports Next.js
- **THEN** the landing page MUST render the same product experience using the public DummyJSON API

#### Scenario: Final submission checklist is prepared

- **WHEN** the project is ready to submit
- **THEN** the delivery package MUST include a public GitHub repository link, a live landing page link, Google PageSpeed Insights Mobile screenshot or evidence, and proof of completed bonus features
