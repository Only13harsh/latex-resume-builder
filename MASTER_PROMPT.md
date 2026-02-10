# Complete Rexume - LaTeX Resume Builder Requirements

Build a full-stack web application called **Rexume** that creates ATS-friendly LaTeX resumes from user input and compiles them into downloadable PDFs. The app should be production-grade, responsive, with a cyberpunk-inspired dark theme and 3D effects.

---

## 1. CORE PURPOSE

Build a web app where:
- The user is guided step-by-step to enter all resume information
- The app generates LaTeX code automatically for a well-formatted, ATS-friendly resume
- The app compiles the LaTeX on the server and returns:
  - A downloadable PDF resume
  - The raw LaTeX code so the user can copy or edit it
- The user can paste any job description and the app will adapt the resume content (mainly summary and bullet points) for that role while staying truthful to the provided data

**Target users:** Students, freshers, and working professionals applying for jobs who don't know LaTeX but want a clean, ATS-friendly resume.

---

## 2. HIGH-LEVEL FEATURES

### Guided Multi-Step Form (9 Steps):

**Step 0: Upload Professional Photo (optional)**
- File upload component accepting .jpg, .jpeg, .png
- Shows a small preview
- Basic validations (file size limit 2-5 MB)
- **Exact wording required:**
  - Title: "Professional Photo"
  - Subtitle: "Upload a professional photo for your resume (optional)"
  - Alert box: "ATS Recommendation: Many Applicant Tracking Systems cannot parse images. Consider skipping the photo for better ATS compatibility."
  - Button text: "Skip Photo (Recommended for ATS)"

**Step 1: Basic Details**
- Full name, professional title, location (city, country)
- Phone number, email (validate format)
- LinkedIn URL, Portfolio/GitHub URL (optional)

**Step 2: Target Role and Job Description**
- Role you are applying for (text)
- Company name (optional)
- Paste job description here (large text area)
- AI behavior: When user clicks "Generate Summary & Keywords":
  - Extract key skills and requirements from job description
  - Generate a concise 2-4 line summary targeted to that role
  - Generate a list of role-specific keywords (for ATS)
  - Let user edit the summary and select/deselect keywords

**Step 3: Experience**
- Ability to add multiple experience entries
- Each entry: Job title, Company, Location, Start date, End date (or "Present"), Experience level selector
- Responsibilities/achievements (free text area or separate bullet items)
- Button: "Generate bullet points from description" that uses the job description + user input to create 3-6 bullet points with action verbs and measurable impact

**Step 4: Skills**
- Technical skills (tags or comma-separated)
- Soft skills (tags or comma-separated)
- Tools & technologies
- Option to auto-group into categories for LaTeX

**Step 5: Education**
- Support multiple education entries
- Each entry: Degree, Specialization/major, College/university name, Location, Start year/end year, CGPA/percentage
- Option to specify 10th and 12th marks: School name, Board, Year, Percentage/marks

**Step 6: Certifications**
- Multiple entries: Certification name, Issuing organization, Issue date, Expiry date (optional), Credential ID/URL (optional)

**Step 7: Key Achievements & Projects**
- Multiple entries: Title, Short description, Technologies used, Links (GitHub, live demo)
- Button to generate 2-4 concise bullet points emphasizing outcomes and impact

**Step 8: Preview & Generate**
- Show a summary of all entered data
- Allow the user to edit any section inline
- Buttons: "Generate LaTeX", "Compile & Preview PDF"
- Right panel with two tabs:
  - "LaTeX Code": syntax-highlighted read-only editor with "Copy" button
  - "PDF Preview": embedded PDF viewer (use `<object>` tag with fallback)

### AI-Assisted Content:
- Use the job description + user data to:
  - Generate a tailored professional summary for that specific role
  - Rephrase experience and achievements into strong, ATS-friendly bullet points with impact
- Allow the user to regenerate or manually edit these suggestions before finalizing
- **Critical:** Use real AI (Claude Sonnet 4) via custom endpoint (see implementation details below)

### LaTeX Resume Generator:
- Take structured data from the form and fill it into an ATS-friendly, single-column LaTeX template
- Simple, no graphics, minimal formatting, fonts that ATS can parse, no tables for main content
- Sections: Header, Summary, Skills, Experience, Education, Certifications, Projects/Achievements
- Include the photo only if the user opted in, placed in a small, clean way that does not break ATS parsing
- Generate the full LaTeX document string on the backend

### LaTeX Compilation:
- Compile the LaTeX code on the server into a PDF
- Use LaTeX Online API with base64-encoded content
- If compilation fails, show a readable error and allow user to:
  - Download/copy the LaTeX code anyway
  - Fix input and retry
- **PDF Preview must work**: Use `<object>` tag with proper fallback for browsers that can't display PDFs inline

### Output & Download:
- Show: Live LaTeX code view (read-only, with copy button), PDF preview
- Provide buttons: "Download PDF", "Copy LaTeX code", "Download .tex file"

### Resume Retargeting for New Job:
- After the first resume is created, allow user to paste a new job description
- Keep all existing data but regenerate: Summary, Experience bullet points (only wording, not fake content)
- Then generate a new LaTeX code + PDF for that job

---

## 3. UI/UX REQUIREMENTS

### Branding:
- **App name:** Rexume (NOT "LaTeX Resume Builder")
- Logo: FileText icon with gradient text "Rexume" using `bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent`

### Design Theme - Cyberpunk Dark with 3D Effects:

**Overall Style:**
- Pure black to dark charcoal background (#0A0A0A to #14141A) with subtle vertical/diagonal gradients
- Accent colors: neon purple (#8B5CF6), cyan (#06B6D4), electric blue (#3B82F6), magenta (#EC4899)
- Use accents sparingly for highlights, borders, icons, and CTAs
- Minimal, clean, single-column layout that feels high-end and professional

**Hero Section (Landing Page):**
- Full-width dark section with soft neon gradient background (purple → blue → cyan)
- Subtle grain or glow for cyberpunk atmosphere
- Large, bold headline in clean, futuristic sans-serif
- Neon accent underline or glow on key words like "AI" or "ATS-Friendly"
- Primary "Get Started" button with strong neon glow, soft outer shadow, and micro-interaction (scale up and glow intensity on hover)
- Subtle 3D/parallax illustration on the right (floating holographic resume cards, neon grids, or futuristic interface panel)
- Parallax moves slightly with mouse movement

**Navigation and Header:**
- Translucent dark glassmorphism bar with slight blur and thin neon border at bottom
- Logo with floating animation
- Minimal nav items with hover states showing neon underlines or glow

**Feature Cards:**
- Floating glassmorphism cards: semi-transparent panels with blurred background, subtle inner glow, fine neon borders on top or left edge
- Simple line icons in neon colors with 3D depth using soft shadows
- On hover: cards lift (translateY or scale), increase glow, gentle floating animation

**How It Works Section:**
- Step-by-step layout with each step in small neon-outlined chip or circular badge
- Faint animated grid or moving gradient line behind steps
- Keep subtle so text remains readable

**Typography:**
- Clean, geometric sans-serif font (Inter or similar)
- Strong contrast: light gray to off-white (#E5E5E5 to #F5F5F5) on dark backgrounds
- Use letter-spacing and all-caps for small headings
- Avoid pure white walls of text

**3D and Motion Details:**
- Smooth parallax effect on hero illustration and floating elements (multiple depth layers)
- Subtle 3D transforms on hover for buttons, icons, and cards (slight rotation, depth shadows)
- Short, smooth transitions (200-400ms) with easing
- Avoid overwhelming or distracting motion

**Sections Below the Fold:**
- Alternating dark backgrounds with different gradients or textures
- Small floating cards with neon borders and soft glows

**Responsiveness:**
- Fully responsive on mobile, tablet, and desktop
- Maintain good readability: sufficient contrast, legible font sizes
- Non-blinding neon accents
- Accessible interactions (no motion that causes discomfort)

**CSS Classes to Use:**
- `.cyberpunk-bg` - Dark gradient background with subtle grid overlay
- `.card-3d` - Glassmorphism card with 3D hover effects
- `.button-3d` - Neon button with glow and depth effects
- `.glass-morphism` - Translucent glass effect with backdrop blur
- `.neon-glow` - Neon glow effect
- `.neon-border` - Animated neon border
- `.floating-3d` - Floating animation
- `.perspective-container` - 3D perspective container
- `.neon-text` - Text with neon glow
- `.grid-pattern` - Subtle cyberpunk grid pattern
- `.pulse-glow` - Pulsing glow animation

---

## 4. LATEX TEMPLATE REQUIREMENTS

Use or adapt a single-column, ATS-friendly LaTeX resume template with:
- Simple documentclass (no fancy CV-specific class that might break ATS parsing)
- Standard fonts that are readable and ATS-safe (Latin Modern, Tinos, or similar)
- Minimal use of boxes, icons, or graphics
- Section structure: Header (Name, title, contact info), Summary, Skills (grouped into categories), Experience (title, company, location, dates, bullet points), Education, Certifications, Projects/Achievements
- Ensure: No multi-column layout for main content, No image-only icons for contact info (use text), Bullet points are simple itemize environments, Use bold only for key elements

### ATS-Friendly Behavior:
- If user chooses no photo, generate completely text-based resume
- Avoid tables for main content; use plain text and itemized lists
- No colored backgrounds or heavy graphics
- Use clear section headings
- Option: "Strict ATS mode" (force no photo, no icons, plain layout)

---

## 5. BACKEND / ARCHITECTURE

### Tech Stack:
- Next.js 16 with App Router
- React 19 with TypeScript
- Tailwind CSS v4 for styling
- shadcn/ui components
- Custom AI endpoint (no API keys required from users)

### API Routes:

**AI Generation Routes (use real Claude Sonnet 4):**
- `/api/generate-summary` - Generate professional summary from job description
- `/api/ai/extract-keywords` - Extract ATS keywords
- `/api/generate-bullets` - Generate experience bullet points
- `/api/generate-project-bullets` - Generate project achievement bullets

**AI Configuration (CRITICAL - Use these exact settings):**
```typescript
// Custom endpoint configuration (no API keys required)
const AI_ENDPOINT = 'https://llm.blackbox.ai/chat/completions';
const AI_HEADERS = {
  'customerId': 'cus_TiS2BshC1sXuLc',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};
const DEFAULT_MODEL = 'openrouter/claude-sonnet-4';

// Example request format:
const response = await fetch(AI_ENDPOINT, {
  method: 'POST',
  headers: AI_HEADERS,
  body: JSON.stringify({
    model: DEFAULT_MODEL,
    messages: [
      { role: "system", content: "You are a professional resume writer..." },
      { role: "user", content: userPrompt }
    ]
  })
});
```

**LaTeX Generation Route:**
- `/api/generate-latex` - Takes ResumeData JSON, returns LaTeX code string

**PDF Compilation Route:**
- `/api/compile-pdf` - Takes LaTeX code, compiles to PDF using LaTeX Online
- Use base64-encoded LaTeX content with GET request:
  ```typescript
  const base64Latex = Buffer.from(latexCode).toString('base64');
  const compileUrl = `https://latexonline.cc/compile?text=${encodeURIComponent(base64Latex)}&command=pdflatex`;
  const response = await fetch(compileUrl, { method: 'GET' });
  ```
- Return PDF as binary with proper headers
- If compilation fails, return error with helpful message

### Data Model (TypeScript interfaces):
```typescript
interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  location: string;
  phone: string;
  email: string;
  linkedin?: string;
  portfolio?: string;
  photoUrl?: string;
}

interface TargetRole {
  role: string;
  company?: string;
  jobDescription: string;
  generatedSummary?: string;
  keywords?: string[];
}

interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  level: string;
  description: string;
  bulletPoints: string[];
}

interface Skills {
  technical: string[];
  soft: string[];
  tools: string[];
}

interface Education {
  id: string;
  degree: string;
  specialization?: string;
  institution: string;
  location?: string;
  startYear?: string;
  endYear: string;
  gradeType: string;
  grade?: string;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string;
  link?: string;
  bullets: string[];
}

interface ResumeSettings {
  strictATSMode: boolean;
  includePhoto: boolean;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  targetRole: TargetRole;
  experience: Experience[];
  skills: Skills;
  education: Education[];
  schoolEducation?: {
    tenth?: { school: string; board: string; year: string; percentage: string; };
    twelfth?: { school: string; board: string; year: string; percentage: string; };
  };
  certifications: Certification[];
  projects: Project[];
  settings: ResumeSettings;
}
```

Keep all data on client for the current session; backend only processes it to generate LaTeX and PDF.

---

## 6. AI / TEXT-GENERATION BEHAVIOR

Wherever AI is used:
- Do NOT invent fake experience, education, or certifications
- Only rephrase and structure what the user provided
- For metrics, only infer plausible phrasing if user already hints at impact; do not create fake numbers
- Make bullet points:
  - 1 line each (70-180 characters)
  - Start with a strong verb
  - Avoid ending with a period

---

## 7. ADDITIONAL QUALITY DETAILS

- Include client-side validation and helpful error messages
- Use placeholders and helper text to guide users
- Provide a simple landing section on the home page describing what the app does
- Add a footer with basic links (About, Contact placeholder, etc.)
- Use debug logging with `console.log("[v0] ...")` format during development

---

## 8. WHAT YOU SHOULD NOT DO

- Do not hard-code a single resume; everything must be data-driven
- Do not require users to know LaTeX
- Do not remove functionality for changing job description and regenerating tailored resumes
- Do not skip LaTeX compilation; the app must be able to compile and return a PDF
- Do not use mock AI implementations; use real Claude Sonnet 4 API

---

## 9. FILE STRUCTURE

Required files:
```
/app/
  layout.tsx (with "Rexume" branding)
  page.tsx (main entry point)
  globals.css (cyberpunk theme with 3D effects)
  api/
    generate-summary/route.ts
    ai/extract-keywords/route.ts
    generate-bullets/route.ts
    generate-project-bullets/route.ts
    generate-latex/route.ts
    compile-pdf/route.ts
/components/
  landing-page.tsx (cyberpunk design)
  resume-builder.tsx (main builder component)
  WelcomeSection.tsx (welcome screen)
  retarget-resume.tsx (job retargeting feature)
  steps/
    step-photo-upload.tsx (Step 0)
    step-basic-details.tsx (Step 1)
    step-target-role.tsx (Step 2)
    step-experience.tsx (Step 3)
    step-skills.tsx (Step 4)
    step-education.tsx (Step 5)
    step-certifications.tsx (Step 6)
    step-projects.tsx (Step 7)
    step-preview.tsx (Step 8)
    step-indicator.tsx (progress indicator)
  ui/ (shadcn components)
/lib/
  types.ts (TypeScript interfaces)
  latex-generator.ts (LaTeX generation logic)
  resume-context.tsx (React Context for state management)
  utils.ts (utility functions)
/contexts/
  ResumeContext.tsx (global state provider)
```

---

## 10. COLOR PALETTE (Cyberpunk Theme)

Use these exact color values:
- Background: `oklch(0.08 0 0)` (pure black)
- Card: `oklch(0.12 0.01 280)` (dark charcoal with purple tint)
- Foreground: `oklch(0.95 0 0)` (off-white)
- Neon Purple: `oklch(0.65 0.28 285)` - Primary accent
- Neon Cyan: `oklch(0.70 0.20 195)` - Secondary accent
- Neon Blue: `oklch(0.60 0.25 240)` - Tertiary accent
- Neon Magenta: `oklch(0.70 0.26 320)` - Quaternary accent
- Border: `oklch(0.20 0.03 280)` (dark with purple tint)
- Muted: `oklch(0.15 0.01 280)` (very dark purple)

---

## 11. DEPLOYMENT CHECKLIST

Before considering the app complete, ensure:
- All 9 steps are implemented and functional
- AI generation works with real API calls (not mocks)
- LaTeX generation produces valid code
- PDF compilation works and preview displays correctly
- All buttons have 3D cyberpunk styling
- Responsive design works on mobile, tablet, desktop
- Dark theme with neon accents is consistent throughout
- "Rexume" branding is used everywhere (not "LaTeX Resume Builder")
- Photo upload has exact wording specified in Step 0
- Resume retargeting feature is accessible from preview step
- Error handling is graceful with helpful messages
- All animations are smooth and non-distracting

---

## FINAL NOTES

This prompt contains the complete specification for building Rexume. Follow all requirements exactly as specified. The result should be a production-ready, beautiful, cyberpunk-themed LaTeX resume builder with real AI capabilities and proper PDF generation.
