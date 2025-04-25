# LinguaAI

**LinguaAI** is a voice-first language learning app that lets users practice speaking with a multilingual AI tutor in real time.  
Built with **Next.js**, **MUI**, **Prisma**, and **PostgreSQL**, LinguaAI focuses on creating immersive, natural conversation experiences.

After noticing flaws with existing AI voice tools for language practice, this project was started to build something more adaptive. LinguaAI introduces a conversational tutor agent — designed to adjust dynamically to the user's language proficiency and guide them naturally along their learning journey.

---

## Project Structure

This project follows a **feature-driven structure** to maximize scalability and maintainability.

```
/app
  /signin              # Sign-in page (Next.js App Router)
  /signup              # Sign-up page
/components
  /auth                # Authentication components (form, layout, headings)
  /common              # Shared reusable UI components
/lib
  /api                 # API interaction functions (sign-in, sign-up)
/hooks               # Custom React hooks (e.g., form validation)
/styles
  theme.ts             # MUI theme customization (palette, typography)
  fonts.ts             # Google fonts imports using @next/font/google
/public
  /patterns            # SVG background patterns for visual polish
```

---

## Design System

### Fonts
- **Outfit** for brand elements ("LinguaAI")
- **Manrope** or **Inter** for UI and body text

### Colors
- Primary brand color: `#F7941D`
- Background: Soft beige (`#f9f6f1`) for a warm, welcoming look

### Styling Approach
- MUI's `sx` prop for lightweight, theme-driven styling
- No hardcoded colors — all styling flows through the theme configuration

---

## Core Components

| Component        | Description                                      |
|------------------|--------------------------------------------------|
| `AuthLayout`     | Standard background and centering for auth flows |
| `AuthHeading`    | Brand-styled heading for login and signup flows  |
| `FormTextField`  | Consistent styled MUI text fields for forms      |
| `SocialLogin`    | Placeholder for future social login buttons     |

---

## How to Run Locally

**Prerequisites**
- Node.js >= 18
- PostgreSQL database (local or cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/linguaai.git
cd linguaai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/linguaai?schema=public"
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

_(You can skip the OpenAI key setup if only testing the frontend.)_

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

# LinguaAI — Learning Languages the Way We Actually Speak
