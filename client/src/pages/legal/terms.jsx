import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  const sections = [
    { id: "using-service", title: "1. Using the Service" },
    { id: "user-content", title: "2. User Content" },
    { id: "prohibited", title: "3. Prohibited Activities" },
    { id: "suspension", title: "4. Account Suspension" },
    { id: "availability", title: "5. Availability" },
    { id: "liability", title: "6. Liability" },
    { id: "third-party", title: "7. Third-Party Services" },
    { id: "changes", title: "8. Changes" },
    { id: "contact", title: "9. Contact" },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-semibold leckerli-one-regular text-foreground hidden sm:inline-block text-2xl">
              Connectify
            </span>
          </Link>
          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to App
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-32 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                On this page
              </p>
              <nav className="flex flex-col gap-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-200 py-1"
                  >
                    {section.title.split(".")[1]?.trim()}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Hero Section */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded-full">
                <span className="text-xs font-medium text-secondary-foreground">
                  Terms & Conditions
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Please read these terms carefully. By using our app, you agree
                to be bound by these terms and conditions.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Last updated: November 2025
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-16">
              {/* Section 1 */}
              <section id="using-service" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  1. Using the Service
                </h2>
                <ul className="space-y-3 text-foreground/80">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      You must be 13 years or older to use this service
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      Keep your account secure and maintain confidentiality of
                      your password
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      Do not engage in illegal, harmful, or abusive activity
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">•</span>
                    <span>
                      Do not attempt impersonation or hacking of any kind
                    </span>
                  </li>
                </ul>
              </section>

              {/* Section 2 */}
              <section id="user-content" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  2. User Content
                </h2>
                <div className="bg-secondary/50 border border-border rounded-xl p-6 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Content Ownership
                    </h3>
                    <p className="text-foreground/80 text-sm">
                      You retain ownership of all content you create and upload
                      to the app.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Usage Rights
                    </h3>
                    <p className="text-foreground/80 text-sm">
                      By uploading content, you grant us a non-exclusive license
                      to display it within the app and to other users as you
                      have configured.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">
                      Restrictions
                    </h3>
                    <p className="text-foreground/80 text-sm">
                      Do not upload illegal, copyrighted, or infringing material
                      without proper rights.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="prohibited" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  3. Prohibited Activities
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  The following activities are strictly prohibited:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Harassment, bullying, or personal attacks",
                    "Hate speech or discriminatory content",
                    "Explicit or adult content",
                    "Spam, scams, or bot activity",
                    "Attempts to hack or exploit the platform",
                    "Spreading false information or rumors",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/20"
                    >
                      <span className="text-destructive font-bold flex-shrink-0 mt-0.5">
                        ✕
                      </span>
                      <span className="text-foreground/80 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 4 */}
              <section id="suspension" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  4. Account Suspension
                </h2>
                <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg space-y-3">
                  <p className="text-foreground font-semibold">
                    We may suspend or terminate your account if:
                  </p>
                  <ul className="space-y-2 text-foreground/80 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      You violate these terms and conditions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      You engage in prohibited activities
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Your account is used for harassment or abuse
                    </li>
                  </ul>
                </div>
                <p className="text-foreground/80 text-sm mt-4">
                  You can delete your account at any time through your account
                  settings.
                </p>
              </section>

              {/* Section 5 */}
              <section id="availability" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  5. Availability
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-foreground text-sm font-bold">
                        ⚠
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        No Guarantees
                      </h4>
                      <p className="text-foreground/80 text-sm">
                        This service may experience bugs, downtime, or
                        unavailability without notice.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <span className="text-foreground text-sm font-bold">
                        ○
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        As-Is Basis
                      </h4>
                      <p className="text-foreground/80 text-sm">
                        The app is provided on an "as-is" basis without
                        warranties or guarantees of any kind.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section id="liability" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  6. Liability
                </h2>
                <div className="bg-muted/30 border border-border rounded-xl p-6 space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    <strong>You use this app at your own risk.</strong> We are
                    not responsible for any losses, damages, or harm resulting
                    from:
                  </p>
                  <ul className="space-y-2 text-foreground/80 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-foreground/40 rounded-full"></span>
                      Data loss or corruption
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-foreground/40 rounded-full"></span>
                      Service interruptions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-foreground/40 rounded-full"></span>
                      Third-party actions or content
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-foreground/40 rounded-full"></span>
                      Unauthorized access to your account
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 7 */}
              <section id="third-party" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  7. Third-Party Services
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We use third-party services for hosting, analytics, storage,
                  and other functions. These services are governed by their own
                  terms and privacy policies. We are not responsible for their
                  actions or policies.
                </p>
              </section>

              {/* Section 8 */}
              <section id="changes" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  8. Changes
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  We may update these terms at any time. Continued use of the
                  app constitutes acceptance of the updated terms. We recommend
                  reviewing this page periodically for changes.
                </p>
              </section>

              {/* Section 9 */}
              <section id="contact" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  9. Contact
                </h2>
                <div className="bg-secondary/50 border border-border rounded-xl p-6 space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    If you have questions, concerns, or need to report
                    violations of these terms, please reach out to us:
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold">📧</span>
                    <a
                      href="mailto:cu360rent@gmail.com"
                      className="text-primary hover:underline"
                    >
                      cu360rent@gmail.com
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
