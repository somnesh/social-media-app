import { Link } from "react-router-dom";

export default function Privacy() {
  const sections = [
    { id: "information-collected", title: "1. Information We Collect" },
    { id: "how-we-use", title: "2. How We Use Your Information" },
    { id: "public-content", title: "3. Public Content" },
    { id: "data-storage", title: "4. How Your Data Is Stored" },
    { id: "third-party", title: "5. Third-Party Services" },
    { id: "your-rights", title: "6. Your Rights" },
    { id: "cookies", title: "7. Cookies" },
    { id: "data-retention", title: "8. Data Retention" },
    { id: "children", title: "9. Children's Privacy" },
    { id: "changes", title: "10. Changes to This Policy" },
    { id: "contact", title: "11. Contact" },
  ];

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background border-b border-border backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1 group">
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
                  Privacy Policy
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Your Privacy Matters
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                We respect your privacy and are committed to transparency about
                how we handle your data. This privacy policy explains everything
                you need to know.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Last updated: November 2025
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-16">
              {/* Section 1 */}
              <section id="information-collected" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  1. Information We Collect
                </h2>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      Information You Provide
                    </h3>
                    <p className="text-foreground/80 leading-relaxed">
                      When creating an account or using the app, you may
                      provide:
                    </p>
                    <ul className="space-y-2 text-foreground/80">
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Username</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Email address</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Profile picture</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Bio or short description</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">•</span>
                        <span>
                          Posts, comments, likes, and other content you share
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-primary font-bold">•</span>
                        <span>Messages (if direct messaging is available)</span>
                      </li>
                    </ul>
                    <p className="text-sm text-muted-foreground italic mt-4">
                      We collect only the information needed for the app to
                      function.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      Automatically Collected Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          IP-Based Location (Approximate Only)
                        </h4>
                        <p className="text-foreground/80 text-sm mb-2">
                          We collect city, region, and country based on your IP
                          address for:
                        </p>
                        <ul className="space-y-1 text-foreground/80 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Basic
                            traffic analytics
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Security
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Preventing
                            spam or abuse
                          </li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          We do not collect precise GPS location and never ask
                          for location permission.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Device & Usage Data
                        </h4>
                        <p className="text-foreground/80 text-sm mb-2">
                          We automatically gather:
                        </p>
                        <ul className="space-y-1 text-foreground/80 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Device type
                            (mobile/desktop)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Operating
                            system
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Browser type
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Time of
                            visit
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span>{" "}
                            Pages/screens viewed
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Actions like
                            posting or liking
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-foreground mb-2">
                          Technical Data
                        </h4>
                        <ul className="space-y-1 text-foreground/80 text-sm">
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> IP address
                            (stored temporarily for security logs)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Error logs
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="text-primary">→</span> Request
                            information (standard server logs)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="how-we-use" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  2. How We Use Your Information
                </h2>

                <div className="bg-secondary/50 border border-border rounded-xl p-6 space-y-3">
                  <p className="text-foreground/80 leading-relaxed">
                    We use your data to:
                  </p>
                  <ul className="space-y-2 text-foreground/80">
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Create and manage your account</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>
                        Show your posts, comments, and profile to other users
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Improve the app and fix bugs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>
                        Analyze basic traffic (what regions visitors come from,
                        what features are used)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>
                        Protect the platform from spam, fake accounts, or misuse
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-primary font-bold">✓</span>
                      <span>Provide customer support if needed</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      We DO NOT sell your data
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Your information is yours alone.
                    </p>
                  </div>
                  <div className="border border-border rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-foreground">
                      We DO NOT use ads
                    </p>
                    <p className="text-xs text-muted-foreground">
                      No targeted advertising or tracking.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="public-content" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  3. Public Content
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Because this is a social media app, your posts, comments,
                  likes, and profile picture may be visible to other users. Only
                  content you choose to share publicly will be visible publicly.
                  Private messages (if implemented) are not visible to others.
                </p>
              </section>

              {/* Section 4 */}
              <section id="data-storage" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  4. How Your Data Is Stored
                </h2>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary text-sm font-bold">🔒</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Secure Cloud Database
                      </h4>
                      <p className="text-foreground/80 text-sm">
                        Your data is stored in a secure cloud database (e.g.,
                        Supabase/PostgreSQL or similar)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary text-sm font-bold">🔐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Encrypted Communication
                      </h4>
                      <p className="text-foreground/80 text-sm">
                        All communication between your device and the server is
                        encrypted (HTTPS)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-primary text-sm font-bold">🛡️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Restricted Access
                      </h4>
                      <p className="text-foreground/80 text-sm">
                        Access to the backend is restricted and protected
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="third-party" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  5. Third-Party Services We Use
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  To run the app efficiently, we may use trusted third-party
                  tools such as:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Cloud hosting (Vercel, Netlify, Render)",
                    "Supabase/PostgreSQL for database",
                    "Analytics tools (IP-based traffic insights only)",
                    "Cloud storage for images/media",
                  ].map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20"
                    >
                      <span className="text-primary font-bold flex-shrink-0 mt-0.5">
                        →
                      </span>
                      <span className="text-foreground/80 text-sm">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-foreground/80 text-sm mt-4">
                  These services may process limited technical data but only to
                  support the app.
                </p>
              </section>

              {/* Section 6 */}
              <section id="your-rights" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  6. Your Rights
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <div className="space-y-2">
                  {[
                    "Request a copy of your data",
                    "Delete your account",
                    "Request deletion of your posts or profile",
                    "Update or change your information",
                    "Ask questions about how data is used",
                  ].map((right, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border-l-2 border-primary"
                    >
                      <span className="text-primary font-bold flex-shrink-0">
                        ✓
                      </span>
                      <span className="text-foreground text-sm">{right}</span>
                    </div>
                  ))}
                </div>
                <p className="text-foreground/80 text-sm mt-6">
                  To request this, contact us at{" "}
                  <span className="font-mono text-primary">
                    cu360rent@gmail.com
                  </span>
                </p>
              </section>

              {/* Section 7 */}
              <section id="cookies" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  7. Cookies
                </h2>
                <div className="bg-muted/30 border border-border rounded-xl p-6 space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    We only use cookies for:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3 text-foreground/80">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Keeping you logged in
                    </li>
                    <li className="flex items-center gap-3 text-foreground/80">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Security
                    </li>
                    <li className="flex items-center gap-3 text-foreground/80">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      Remembering basic app preferences
                    </li>
                  </ul>
                  <p className="text-sm text-muted-foreground border-t border-border pt-4 mt-4">
                    We do not use ad cookies, trackers, or cross-site tracking.
                  </p>
                </div>
              </section>

              {/* Section 8 */}
              <section id="data-retention" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  8. Data Retention
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We keep your data only as long as your account exists.
                </p>
                <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg space-y-2">
                  <p className="font-semibold text-foreground">
                    If you delete your account:
                  </p>
                  <ul className="space-y-2 text-foreground/80 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="text-primary font-bold">•</span>
                      Your posts, comments, and profile will be removed
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-primary font-bold">•</span>
                      Backups (if any) will be cleaned automatically after
                      standard retention periods
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 9 */}
              <section id="children" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  9. Children's Privacy
                </h2>
                <div className="bg-secondary/50 border border-border rounded-xl p-6">
                  <p className="text-foreground/80 leading-relaxed mb-2">
                    This app is not intended for users under 13 years old.
                  </p>
                  <p className="text-foreground/80">
                    We do not knowingly collect data from children.
                  </p>
                </div>
              </section>

              {/* Section 10 */}
              <section id="changes" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  10. Changes to This Privacy Policy
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  As this is a hobby project, features may change over time. If
                  we update this Privacy Policy, we will update the "Last
                  Updated" date above.
                </p>
              </section>

              {/* Section 11 */}
              <section id="contact" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  11. Contact
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-6">
                  If you have questions, feedback, or data requests, reach out
                  to us:
                </p>
                <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Contact Email
                    </p>
                    <a
                      href="mailto:cu360rent@gmail.com"
                      className="text-lg font-semibold text-primary dark:hover:text-gray-500 transition-colors"
                    >
                      cu360rent@gmail.com
                    </a>
                  </div>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="mt-20 pt-12 border-t border-border/50">
              <p className="text-sm text-muted-foreground text-center">
                This Privacy Policy was last updated in November 2025. We
                appreciate your trust.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
