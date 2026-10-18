# Abhay Chothani &mdash; QA Engineer Portfolio

A responsive single-page Resume Portfolio website built for **Abhay Chothani**, Jr. Quality Assurance Engineer. Engineered with a SaaS dashboard aesthetic, dark/light theme switching, interactive project filters, timeline animation, and print-ready PDF resume generation.

---

## 🌟 Key Features

1. **Modern SaaS & QA Console Aesthetic**:
   - Dark/Light professional theme toggle with persistent `localStorage` memory and OS system preference sync.
   - Live QA Execution Terminal simulator showing real-time test run metrics (1,500+ test cases, 0 critical escaped bugs, 99.8% defect resolution).
   - Micro-interactions, hover glow effects, and smooth scroll animations.

2. **Semantic & Accessible HTML5 Architecture**:
   - Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`).
   - Accessible ARIA roles, labels, and focus rings.

3. **Interactive Career Timeline**:
   - Vertical timeline displaying career progression at **Giriraj Digital** with animated pulse nodes.
   - Comprehensive responsibilities, defect management impact, and verification methodology tags.

4. **Featured Technical Projects with Filter Matrix**:
   - Filter tabs: *All Projects*, *FinTech & Banking*, *Fitness & Multi-Branch*, *Enterprise CSR & Governance*.
   - In-depth cards for:
     - 🏦 **Banking & Digital Financial Site** (ADA/WCAG compliance, security verification, transaction pipelines).
     - 🏋️ **Fitness & Membership Management Platform** (LambdaTest cross-browser tests, GTMetrix performance audits, Asana/ClickUp defect management).
     - 🏢 **L&T CSR Budgeting & Execution Portal** (Role-based access controls for Unit, IC Coordinator, and Apex Authority).

5. **Split-Column Skills & Education Matrix**:
   - Core QA competencies with active status indicators.
   - Tools Matrix cards for Jira, Asana, ClickUp, LambdaTest, and GTMetrix.
   - Academic credentials (B.E. in Computer Engineering &bull; CGPA: 8.37) and verified certifications.

6. **Contact Section & 1-Click Utilities**:
   - 1-Click "Copy to Clipboard" with instant toast feedback for email (`abhaychothani6@gmail.com`) and phone (`+91 9328041411`).
   - Interactive message form with validation and `mailto:` email generation.
   - Direct links for LinkedIn and Email.

7. **Print & PDF Resume View**:
   - Modal preview with dedicated `@media print` CSS styling for 1-click clean executive PDF generation via `window.print()`.

---

## 📁 File Structure

```text
C:\Portfolio\
├── index.html       # Semantic HTML5 markup and layout
├── style.css        # CSS3 variables, responsive grid, dark/light themes, animations & print media
├── script.js        # Vanilla JS: Theme switcher, project filters, clipboard, scroll spy, modal
└── README.md        # Project overview and documentation
```

---

## 🚀 Running Locally

No build tools or NPM dependencies required! Simply double-click `index.html` or run any local static server:

```powershell
# Using Python
python -m http.server 8000

# Using Node (npx)
npx serve .
```

Then open `http://localhost:8000` in your web browser.
