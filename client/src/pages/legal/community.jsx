import { Link } from "react-router-dom";

export default function CommunityGuidelines() {
  const sections = [
    { id: "respectful", title: "1. Be Respectful" },
    { id: "allowed-content", title: "2. Allowed Content" },
    { id: "not-allowed", title: "3. Not Allowed" },
    { id: "safety", title: "4. Safety" },
    { id: "consequences", title: "5. Consequences" },
    { id: "contact", title: "6. Contact" },
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
                  Community Guidelines
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Community Guidelines
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Help us build a positive, respectful community where everyone
                feels welcome and safe.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Last updated: November 2025
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-16">
              {/* Section 1 */}
              <section id="respectful" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  1. Be Respectful
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Treat all community members with kindness and respect:
                </p>
                <div className="space-y-3">
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <span className="text-accent text-lg flex-shrink-0">✓</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        No Harassment or Bullying
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Do not harass, bully, or make personal attacks against
                        other users.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <span className="text-accent text-lg flex-shrink-0">✓</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Practice Empathy
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Consider other perspectives and be patient with those
                        who think differently.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <span className="text-accent text-lg flex-shrink-0">✓</span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Constructive Feedback
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Offer feedback that is helpful and kind, not hurtful or
                        insulting.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="allowed-content" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  2. Allowed Content
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  We encourage sharing content that is:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Helpful",
                      desc: "Content that informs, educates, or assists others",
                    },
                    {
                      title: "Positive",
                      desc: "Constructive and encouraging interactions",
                    },
                    {
                      title: "Creative",
                      desc: "Original art, writing, ideas, and projects",
                    },
                    {
                      title: "Authentic",
                      desc: "Genuine thoughts and genuine experiences",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="border border-border rounded-lg p-4 space-y-2 bg-secondary/30"
                    >
                      <p className="font-semibold text-foreground text-sm">
                        {item.title}
                      </p>
                      <p className="text-foreground/80 text-xs">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3 */}
              <section id="not-allowed" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  3. Not Allowed
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  The following content is not permitted:
                </p>
                <div className="space-y-3">
                  {[
                    "Hate speech, discrimination, or threats of violence",
                    "Adult, explicit, or sexually inappropriate content",
                    "False information, misinformation, or harmful rumors",
                    "Spam, scams, phishing, or commercial solicitation",
                    "Bot activity, automated spam, or artificial engagement",
                    "Content that violates intellectual property rights",
                    "Illegal content or content promoting illegal activities",
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20"
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
              <section id="safety" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  4. Safety
                </h2>
                <div className="space-y-4">
                  <div className="bg-muted/30 border border-border rounded-xl p-6 space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span>🆘</span> Protect Yourself
                    </h4>
                    <ul className="space-y-2 text-foreground/80 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary flex-shrink-0 mt-1">
                          →
                        </span>
                        <span>
                          Never share personal information like addresses or
                          phone numbers
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary flex-shrink-0 mt-1">
                          →
                        </span>
                        <span>
                          Be skeptical of unsolicited messages or offers
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary flex-shrink-0 mt-1">
                          →
                        </span>
                        <span>Report suspicious activity immediately</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-muted/30 border border-border rounded-xl p-6 space-y-3">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <span>🚨</span> Mental Health & Self-Harm
                    </h4>
                    <p className="text-foreground/80 text-sm">
                      Do not encourage self-harm, dangerous behavior, or
                      substance abuse. If you're struggling, please reach out to
                      mental health professionals or crisis services.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section id="consequences" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  5. Consequences
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Violations of these guidelines may result in:
                </p>
                <div className="border-l-4 border-destructive bg-destructive/5 p-4 rounded-r-lg space-y-2">
                  <ul className="space-y-2 text-foreground/80 text-sm">
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-destructive rounded-full"></span>
                      <span>Content removal or editing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-destructive rounded-full"></span>
                      <span>Temporary suspension or warning</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-destructive rounded-full"></span>
                      <span>Permanent account suspension or ban</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 6 */}
              <section id="contact" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  6. Contact
                </h2>
                <div className="bg-secondary/50 border border-border rounded-xl p-6 space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    Have questions or want to report a violation? Contact our
                    community team:
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
