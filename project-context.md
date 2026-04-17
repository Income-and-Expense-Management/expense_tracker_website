# Project Context & AI Instructions

## 1. Project Overview & Tech Stack
This project is a modern Frontend web application built for high performance, maintainability, and scalability. 
- **Core Framework**: React.js 
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (>= v6)

## 2. Directory Structure & Responsibilities
The `src/` directory is strictly organized by feature-type and responsibility:

- `assets/`: Static resources such as images, SVG icons, and fonts.
- `components/`: Highly reusable, "dumb" UI components (e.g., Buttons, Inputs, Modals). These should ideally not contain complex business logic or fetch their own data.
- `context/`: React Context providers for global state management (e.g., AuthProvider, ThemeProvider).
- `hooks/`: Custom React hooks (`use*`). All complex component state and reusable business logic must be extracted here.
- `layouts/`: Structural layout components (e.g., MainLayout, AuthLayout, Sidebar, Navbar). Pages are wrapped in these layouts.
- `pages/`: Route-level components. These should be thin, acting primarily as orchestrators that combine reusable components, connect to custom hooks for data, and handle routing.
- `services/`: API integration layer. All external network requests (fetch/axios) and API endpoint definitions live here. **No API calls should be made directly inside a React component.**
- `utils/`: Pure JavaScript functions, helpers, formatters, and constants. Must be framework-agnostic where possible.

## 3. Architectural Principles

### Separation of Concerns (SoC)
- **UI Presentation vs. Business Logic:** React components must be focused exclusively on rendering the UI.
- **Custom Hooks:** Any non-trivial state management, side effects, or business logic must be extracted into Custom Hooks within the `hooks/` folder. 
- **Data Fetching:** Isolate all external API calls in the `services/` directory.

### Clean Code & Scalability
- **Component Size:** Components should be small and focused (ideally under 150-200 lines). If a component grows larger, extract parts of it into sub-components.
- **Composition over Prop Drilling:** Avoid passing props down more than 2 levels. Use React children composition (`children` prop) or Context API where appropriate.
- **Modularity:** Code should be modular. If a piece of logic or UI is used in more than two places, extract it.

### Styling Guidelines (Tailwind CSS)
- **Utility-First:** Prefer Tailwind utility classes over custom CSS. Avoid inline styles (`style={{...}}`) entirely unless calculating dynamic values.
- **Readability:** Keep class name strings manageable. If class lists become too long, extract them or use utility functions.
- **Dynamic Classes:** Use libraries like `clsx` and `tailwind-merge` to safely combine conditional Tailwind classes without conflicts.

## 4. Naming Conventions
- **Folders:** Apply `kebab-case` (e.g., `pages/user-dashboard/`).
- **Components:** Apply `PascalCase` for both the filename and the component name (e.g., `UserProfile.jsx`, `<UserProfile />`).
- **Hooks:** Apply `camelCase` starting with the prefix `use` (e.g., `useAuth.js`, `useFetchData.js`).
- **Utility & Service Files:** Apply `camelCase` (e.g., `formatCurrency.js`, `authService.js`).
- **Constants:** Apply `UPPER_SNAKE_CASE` for global constant variables (e.g., `MAX_RETRY_COUNT`).

## 5. Strict Rules for AI Assistants
Any AI system generating or modifying code in this repository **MUST** adhere to the following directives:

- **ALWAYS read this context** before suggesting architecture changes or generating new features.
- **NEVER mix API calls directly inside UI components (`pages/` or `components/`).** Always create or update a service in `services/` and consume it via a custom hook.
- **ALWAYS extract complex logic into Custom Hooks.** Components must remain declarative and focused on the View.
- **ALWAYS prioritize creating reusable components.** Check if a UI element already exists before building a redundant one.
- **ENSURE all new code matches the existing styling guidelines.** Use Tailwind classes properly and avoid arbitrary custom CSS unless absolutely necessary.
- **DO NOT hallucinate third-party dependencies.** Ask before installing new packages unless explicitly requested by the user.
- **MAINTAIN clean, self-documenting code.** Prefer descriptive variable names over excessive commenting.