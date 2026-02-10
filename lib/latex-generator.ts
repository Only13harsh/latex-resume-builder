import { ResumeData } from './types';

export function generateLatexCode(data: ResumeData): string {
  const { personalInfo, targetRole, experience, skills, education, schoolEducation, certifications, projects, settings } = data;

  // Enhanced escape function for special LaTeX characters
  const escape = (str: string): string => {
    if (!str) return '';
    return str
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/\{/g, '\\{')
      .replace(/\}/g, '\\}')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}')
      .replace(/\n/g, ' ');
  };

  // Build professional ATS-friendly LaTeX document
  let latex = `\\documentclass[10pt,letterpaper]{article}

% ============================================================================
% PACKAGES
% ============================================================================
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{lmodern}
\\usepackage[letterpaper,margin=0.6in,top=0.5in,bottom=0.5in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}
\\usepackage{tabularx}
\\usepackage{multicol}

% ============================================================================
% COLORS
% ============================================================================
\\definecolor{linkcolor}{RGB}{0,102,204}
\\definecolor{headercolor}{RGB}{40,40,40}

% ============================================================================
% FORMATTING
% ============================================================================
% Remove page numbers
\\pagestyle{empty}

% Section title formatting
\\titleformat{\\section}
  {\\large\\bfseries\\color{headercolor}}
  {}{0em}
  {}[\\color{headercolor}\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{6pt}

% Subsection formatting for job titles
\\titleformat{\\subsection}[runin]
  {\\normalsize\\bfseries}
  {}{0em}
  {}
\\titlespacing{\\subsection}{0pt}{8pt}{0pt}

% Compact lists with proper spacing
\\setlist[itemize]{leftmargin=*, itemsep=1pt, parsep=1pt, topsep=2pt, partopsep=0pt}

% Hyperlink setup
\\hypersetup{
    colorlinks=true,
    linkcolor=linkcolor,
    urlcolor=linkcolor,
    pdfborder={0 0 0}
}

% Custom commands for consistency
\\newcommand{\\resumeheading}[1]{%
  \\vspace{-2pt}%
  \\textbf{\\large #1}%
  \\vspace{2pt}%
}

\\newcommand{\\resumesubheading}[4]{%
  \\vspace{-1pt}\\item[]
  \\begin{tabular*}{\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} & \\textit{\\small #2} \\\\
    \\textit{\\small #3} & \\textit{\\small #4} \\\\
  \\end{tabular*}\\vspace{-4pt}
}

\\newcommand{\\resumeitem}[1]{%
  \\item\\small{#1\\vspace{-1pt}}
}

% Reduce space before document
\\setlength{\\parindent}{0pt}

% ============================================================================
% DOCUMENT START
% ============================================================================
\\begin{document}

`;

  // ============================================================================
  // HEADER SECTION - Professional contact information
  // ============================================================================
  latex += `% ============================================================================\n`;
  latex += `% HEADER - Contact Information\n`;
  latex += `% ============================================================================\n`;
  latex += `\\begin{center}\n`;
  latex += `  {\\Huge\\bfseries\\color{headercolor} ${escape(personalInfo.fullName)}}\\\\[8pt]\n`;
  
  if (personalInfo.professionalTitle) {
    latex += `  {\\Large\\color{headercolor} ${escape(personalInfo.professionalTitle)}}\\\\[6pt]\n`;
  }
  
  // Contact line with separators
  const contactParts = [];
  if (personalInfo.location) contactParts.push(escape(personalInfo.location));
  if (personalInfo.phone) contactParts.push(escape(personalInfo.phone));
  if (personalInfo.email) contactParts.push(`\\href{mailto:${escape(personalInfo.email)}}{${escape(personalInfo.email)}}`);
  
  if (contactParts.length > 0) {
    latex += `  {\\small ${contactParts.join(' \\textbar{} ')}}\\\\[4pt]\n`;
  }
  
  // Social links
  const socialLinks = [];
  if (personalInfo.linkedin) {
    socialLinks.push(`\\href{${escape(personalInfo.linkedin)}}{LinkedIn}`);
  }
  if (personalInfo.portfolio) {
    socialLinks.push(`\\href{${escape(personalInfo.portfolio)}}{Portfolio/Website}`);
  }
  
  if (socialLinks.length > 0) {
    latex += `  {\\small ${socialLinks.join(' \\textbar{} ')}}\\\\[2pt]\n`;
  }
  
  latex += `\\end{center}\n`;
  latex += `\\vspace{-8pt}\n\n`;

  // ============================================================================
  // PROFESSIONAL SUMMARY - Tailored to target role
  // ============================================================================
  if (targetRole.generatedSummary || targetRole.jobDescription) {
    latex += `% ============================================================================\n`;
    latex += `% PROFESSIONAL SUMMARY\n`;
    latex += `% ============================================================================\n`;
    latex += `\\section{Professional Summary}\n`;
    
    if (targetRole.generatedSummary) {
      latex += `${escape(targetRole.generatedSummary)}\n\n`;
    }
    
    // Add target role if specified
    if (targetRole.targetRole) {
      latex += `\\vspace{2pt}\n`;
      latex += `\\textbf{Target Position:} ${escape(targetRole.targetRole)}`;
      if (targetRole.company) {
        latex += ` at ${escape(targetRole.company)}`;
      }
      latex += `\n\n`;
    }
  }

  // ============================================================================
  // CORE COMPETENCIES / SKILLS - Organized by category
  // ============================================================================
  if (skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0) {
    latex += `% ============================================================================\n`;
    latex += `% CORE COMPETENCIES\n`;
    latex += `% ============================================================================\n`;
    latex += `\\section{Core Competencies \\& Technical Skills}\n`;
    latex += `\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    latex += `  \\small{\\item{\n`;
    
    if (skills.technical.length > 0) {
      latex += `   \\textbf{Technical Skills:} ${skills.technical.map(escape).join(', ')} \\\\\n`;
    }
    
    if (skills.tools.length > 0) {
      latex += `   \\textbf{Tools \\& Technologies:} ${skills.tools.map(escape).join(', ')} \\\\\n`;
    }
    
    if (skills.soft.length > 0) {
      latex += `   \\textbf{Professional Skills:} ${skills.soft.map(escape).join(', ')}\n`;
    }
    
    latex += `  }}\n`;
    latex += `\\end{itemize}\n`;
    latex += `\\vspace{-8pt}\n\n`;
  }

  // ============================================================================
  // PROFESSIONAL EXPERIENCE - Detailed work history
  // ============================================================================
  if (experience.length > 0) {
    latex += `% ============================================================================\n`;
    latex += `% PROFESSIONAL EXPERIENCE\n`;
    latex += `% ============================================================================\n`;
    latex += `\\section{Professional Experience}\n`;
    latex += `\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    
    experience.forEach((exp, index) => {
      const dateRange = `${escape(exp.startDate)} -- ${exp.current ? '\\textbf{Present}' : escape(exp.endDate)}`;
      const location = exp.location ? escape(exp.location) : '';
      
      latex += `  \\resumesubheading\n`;
      latex += `    {${escape(exp.jobTitle)}}{${dateRange}}\n`;
      latex += `    {${escape(exp.company)}}{${location}}\n`;
      
      // Experience level badge (optional)
      if (exp.level && exp.level !== 'Not specified') {
        latex += `    \\vspace{2pt}\n`;
        latex += `    {\\small\\textit{Level: ${escape(exp.level)}}}\n`;
      }
      
      // Bullet points for responsibilities and achievements
      if (exp.bulletPoints && exp.bulletPoints.length > 0) {
        latex += `    \\vspace{-2pt}\n`;
        latex += `    \\begin{itemize}\n`;
        exp.bulletPoints.forEach((bullet) => {
          latex += `      \\resumeitem{${escape(bullet)}}\n`;
        });
        latex += `    \\end{itemize}\n`;
      } else if (exp.description) {
        latex += `    \\vspace{2pt}\n`;
        latex += `    {\\small ${escape(exp.description)}}\n`;
      }
      
      // Add spacing between experiences
      if (index < experience.length - 1) {
        latex += `    \\vspace{4pt}\n`;
      }
    });
    
    latex += `\\end{itemize}\n`;
    latex += `\\vspace{-6pt}\n\n`;
  }

  // ============================================================================
  // PROJECTS & KEY ACHIEVEMENTS - Showcase portfolio work
  // ============================================================================
  if (projects.length > 0) {
    latex += `% ============================================================================\n`;
    latex += `% PROJECTS \\& KEY ACHIEVEMENTS\n`;
    latex += `% ============================================================================\n`;
    latex += `\\section{Projects \\& Key Achievements}\n`;
    latex += `\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    
    projects.forEach((project, index) => {
      latex += `  \\item\n`;
      latex += `    \\textbf{${escape(project.title)}}`;
      
      // Add project link if available
      if (project.link) {
        latex += ` -- \\href{${escape(project.link)}}{\\small View Project}`;
      }
      latex += `\n`;
      
      // Project description or bullets
      if (project.bullets && project.bullets.length > 0) {
        latex += `    \\vspace{-2pt}\n`;
        latex += `    \\begin{itemize}\n`;
        project.bullets.forEach((bullet) => {
          latex += `      \\resumeitem{${escape(bullet)}}\n`;
        });
        latex += `    \\end{itemize}\n`;
      } else if (project.description) {
        latex += `    \\vspace{2pt}\n`;
        latex += `    {\\small ${escape(project.description)}}\n`;
      }
      
      // Technologies used
      if (project.technologies) {
        const techArray = typeof project.technologies === 'string' 
          ? project.technologies.split(',').map(t => t.trim()).filter(t => t)
          : [];
        if (techArray.length > 0) {
          latex += `    \\vspace{2pt}\n`;
          latex += `    {\\small\\textit{Technologies:} ${techArray.map(escape).join(', ')}}\n`;
        }
      }
      
      // Add spacing between projects
      if (index < projects.length - 1) {
        latex += `    \\vspace{6pt}\n`;
      }
    });
    
    latex += `\\end{itemize}\n`;
    latex += `\\vspace{-6pt}\n\n`;
  }

  // ============================================================================
  // EDUCATION - Academic credentials
  // ============================================================================
  if (education.length > 0 || schoolEducation) {
    latex += `% ============================================================================\n`;
    latex += `% EDUCATION\n`;
    latex += `% ============================================================================\n`;
    latex += `\\section{Education}\n`;
    latex += `\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    
    // Higher education
    education.forEach((edu) => {
      const dateRange = edu.startYear 
        ? `${escape(edu.startYear)} -- ${escape(edu.endYear)}`
        : escape(edu.endYear);
      
      latex += `  \\resumesubheading\n`;
      latex += `    {${escape(edu.degree)}${edu.specialization ? ' -- ' + escape(edu.specialization) : ''}}{${dateRange}}\n`;
      latex += `    {${escape(edu.institution)}}{${edu.location ? escape(edu.location) : ''}}\n`;
      
      // GPA/Grades
      if (edu.grade) {
        latex += `    \\vspace{2pt}\n`;
        latex += `    {\\small ${escape(edu.gradeType)}: ${escape(edu.grade)}}\n`;
      }
      
      latex += `    \\vspace{4pt}\n`;
    });
    
    // Secondary education (10th and 12th)
    if (schoolEducation) {
      if (schoolEducation.twelfth?.school) {
        latex += `  \\item\n`;
        latex += `    \\textbf{Higher Secondary (Class XII)} \\hfill ${escape(schoolEducation.twelfth.year || '')}\\\\\n`;
        latex += `    \\textit{${escape(schoolEducation.twelfth.school)}${schoolEducation.twelfth.board ? ', ' + escape(schoolEducation.twelfth.board) : ''}}`;
        if (schoolEducation.twelfth.percentage) {
          latex += ` \\hfill ${escape(schoolEducation.twelfth.percentage)}`;
        }
        latex += `\n    \\vspace{4pt}\n`;
      }
      
      if (schoolEducation.tenth?.school) {
        latex += `  \\item\n`;
        latex += `    \\textbf{Secondary (Class X)} \\hfill ${escape(schoolEducation.tenth.year || '')}\\\\\n`;
        latex += `    \\textit{${escape(schoolEducation.tenth.school)}${schoolEducation.tenth.board ? ', ' + escape(schoolEducation.tenth.board) : ''}}`;
        if (schoolEducation.tenth.percentage) {
          latex += ` \\hfill ${escape(schoolEducation.tenth.percentage)}`;
        }
        latex += `\n`;
      }
    }
    
    latex += `\\end{itemize}\n`;
    latex += `\\vspace{-6pt}\n\n`;
  }

  // ============================================================================
  // CERTIFICATIONS & LICENSES - Professional credentials
  // ============================================================================
  if (certifications.length > 0) {
    latex += `% ============================================================================\n`;
    latex += `% CERTIFICATIONS \\& PROFESSIONAL DEVELOPMENT\n`;
    latex += `% ============================================================================\n`;
    latex += `\\section{Certifications \\& Professional Development}\n`;
    latex += `\\begin{itemize}[leftmargin=0.15in, label={}]\n`;
    
    certifications.forEach((cert) => {
      latex += `  \\item\n`;
      latex += `    \\textbf{${escape(cert.name)}}`;
      
      // Date range
      latex += ` \\hfill ${escape(cert.issueDate)}`;
      if (cert.expiryDate) {
        latex += ` -- ${escape(cert.expiryDate)}`;
      }
      latex += `\\\\\n`;
      
      // Issuing organization
      latex += `    \\textit{${escape(cert.issuer)}}`;
      
      // Credential ID or URL
      if (cert.url) {
        latex += ` \\hfill \\href{${escape(cert.url)}}{\\small View Credential}`;
      } else if (cert.credentialId) {
        latex += ` \\hfill {\\small Credential ID: ${escape(cert.credentialId)}}`;
      }
      
      latex += `\n    \\vspace{4pt}\n`;
    });
    
    latex += `\\end{itemize}\n`;
  }

  // ============================================================================
  // DOCUMENT END
  // ============================================================================
  latex += `\n\\end{document}`;

  return latex;
}
