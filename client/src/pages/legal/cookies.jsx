import { Link } from "react-router-dom";

export default function CookiePolicy() {
  const sections = [
    { id: "what-are", title: "1. What Are Cookies?" },
    { id: "how-we-use", title: "2. How We Use Cookies" },
    { id: "types", title: "3. Types of Cookies" },
    { id: "managing", title: "4. Managing Cookies" },
    { id: "contact", title: "5. Contact" },
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
                  Cookie Policy
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Cookie Policy
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Learn how we use cookies to enhance your experience and keep
                your data secure.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Last updated: November 2025
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-16">
              {/* Section 1 */}
              <section id="what-are" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  1. What Are Cookies?
                </h2>
                <div className="bg-secondary/50 border border-border rounded-xl p-6">
                  <p className="text-foreground/80 leading-relaxed">
                    Cookies are small files that are stored on your device
                    (computer, tablet, or smartphone) when you visit websites or
                    use applications. These files contain information that helps
                    the application function better and provide a smoother user
                    experience.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section id="how-we-use" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  2. How We Use Cookies
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We use cookies for specific, essential purposes:
                </p>
                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-4 rounded-lg border border-border bg-muted/20">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-lg">🔐</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Keeping You Logged In
                      </h4>
                      <p className="text-foreground/80 text-sm">
                        Session cookies maintain your login state so you don't
                        have to re-enter credentials on every page.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg border border-border bg-muted/20">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-lg">🛡️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Security
                      </h4>
                      <p className="text-foreground/80 text-sm">
                        Cookies help protect your account from unauthorized
                        access and detect suspicious activity.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg border border-border bg-muted/20">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary text-lg">⚙️</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">
                        Preferences
                      </h4>
                      <p className="text-foreground/80 text-sm">
                        We remember your app preferences, such as theme choice
                        and language settings.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="types" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  3. Types of Cookies
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We only use two types of cookies, both essential to app
                  functionality:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-border rounded-xl p-6 space-y-3 bg-background">
                    <h4 className="font-bold text-foreground text-lg">
                      Essential Cookies
                    </h4>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      These cookies are necessary for the app to function. They
                      manage sessions, authenticate users, and prevent fraud.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Always active</span>
                    </div>
                  </div>

                  <div className="border border-border rounded-xl p-6 space-y-3 bg-background">
                    <h4 className="font-bold text-foreground text-lg">
                      Preference Cookies
                    </h4>
                    <p className="text-foreground/80 text-sm leading-relaxed">
                      These cookies store your preferences and settings to
                      personalize your experience and remember your choices.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Optional but recommended</span>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-destructive bg-destructive/5 p-4 rounded-r-lg mt-6 space-y-2">
                  <p className="font-semibold text-foreground text-sm">
                    What We Do NOT Use:
                  </p>
                  <ul className="space-y-1 text-foreground/80 text-sm">
                    <li>• Advertising or tracking cookies</li>
                    <li>• Cross-site tracking cookies</li>
                    <li>• Third-party analytics cookies</li>
                    <li>• Cookies for profiling or targeting</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section id="managing" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  4. Managing Cookies
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  You have full control over cookies on your device:
                </p>

                <div className="space-y-4">
                  <div className="bg-muted/30 border border-border rounded-xl p-6 space-y-3">
                    <h4 className="font-semibold text-foreground">
                      Browser Settings
                    </h4>
                    <p className="text-foreground/80 text-sm mb-3">
                      Most web browsers allow you to control cookies through
                      settings. You can:
                    </p>
                    <ul className="space-y-2 text-foreground/80 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary flex-shrink-0 mt-0.5">
                          →
                        </span>
                        <span>Accept all cookies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary flex-shrink-0 mt-0.5">
                          →
                        </span>
                        <span>
                          Reject all cookies (may affect functionality)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary flex-shrink-0 mt-0.5">
                          →
                        </span>
                        <span>Delete existing cookies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary flex-shrink-0 mt-0.5">
                          →
                        </span>
                        <span>Receive notifications when cookies are set</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                    <p className="text-foreground/80 text-sm">
                      <strong>Note:</strong> Disabling essential cookies may
                      prevent you from logging in or using certain app features
                      properly.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="contact" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  5. Contact
                </h2>
                <div className="bg-secondary/50 border border-border rounded-xl p-6 space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    If you have questions about our cookie policy or how we use
                    cookies, please contact us:
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
