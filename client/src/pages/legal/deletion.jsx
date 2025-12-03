import { Link } from "react-router-dom";

export default function DataDeletionPolicy() {
  const sections = [
    { id: "user-rights", title: "1. User Rights" },
    { id: "how-to-request", title: "2. How to Request Deletion" },
    { id: "after-deletion", title: "3. What Happens After Deletion" },
    { id: "exceptions", title: "4. Exceptions" },
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
                  Data Deletion Policy
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-balance leading-tight">
                Data Deletion Policy
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Your data, your choice. Learn how to request deletion of your
                account and personal information.
              </p>
              <p className="text-sm text-muted-foreground italic">
                Last updated: November 2025
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-16">
              {/* Section 1 */}
              <section id="user-rights" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  1. User Rights
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  You have the right to request deletion of your information at
                  any time:
                </p>
                <div className="space-y-3">
                  <div className="flex gap-4 items-start p-4 rounded-lg border border-border bg-secondary/30">
                    <span className="text-primary font-bold text-lg flex-shrink-0">
                      01
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Your Account
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Request complete account deletion, which removes all
                        associated data from active systems.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg border border-border bg-secondary/30">
                    <span className="text-primary font-bold text-lg flex-shrink-0">
                      02
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Your Posts & Comments
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Request deletion of specific posts, comments, or all
                        your content.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg border border-border bg-secondary/30">
                    <span className="text-primary font-bold text-lg flex-shrink-0">
                      03
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Your Profile Data
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Request removal of your profile picture, bio, and
                        personal information.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section id="how-to-request" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  2. How to Request Deletion
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Follow these simple steps to request data deletion:
                </p>

                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          1
                        </span>
                        Send an Email
                      </h4>
                      <p className="text-foreground/80 text-sm ml-8">
                        Email us with your deletion request at{" "}
                        <span className="font-mono text-primary">
                          cu360rent@gmail.com
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          2
                        </span>
                        Use Subject Line
                      </h4>
                      <p className="text-foreground/80 text-sm ml-8">
                        Use the subject line:{" "}
                        <span className="font-mono text-primary">
                          "Data Deletion Request"
                        </span>
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          3
                        </span>
                        Include Details
                      </h4>
                      <p className="text-foreground/80 text-sm ml-8">
                        Include your username, email address, and specify what
                        you want deleted.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                          4
                        </span>
                        Verification
                      </h4>
                      <p className="text-foreground/80 text-sm ml-8">
                        We will verify your identity and process your request
                        within 30 days.
                      </p>
                    </div>
                  </div>

                  <div className="border border-accent rounded-xl p-4 bg-accent/5 space-y-2">
                    <p className="text-sm font-semibold text-foreground flex items-start gap-2">
                      <span>📝</span> Email Template
                    </p>
                    <div className="bg-muted/50 rounded p-3 font-mono text-xs text-foreground/80 space-y-1">
                      <p>Subject: Data Deletion Request</p>
                      <p></p>
                      <p>{"Hi,"}</p>
                      <p>
                        I would like to request deletion of my account and all
                        associated data.
                      </p>
                      <p>Username: [Your Username]</p>
                      <p>Email: [Your Email]</p>
                      <p>
                        Request Type: [Account Deletion / Post Deletion / All
                        Data]
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section id="after-deletion" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  3. What Happens After Deletion
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Once we process your deletion request:
                </p>

                <div className="space-y-3">
                  <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/20 border border-border">
                    <span className="text-primary text-lg flex-shrink-0">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Account Removal
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Your account will be permanently removed and you won't
                        be able to log in.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/20 border border-border">
                    <span className="text-primary text-lg flex-shrink-0">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Content Deletion
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Your posts, comments, profile picture, and bio will be
                        deleted or anonymized.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/20 border border-border">
                    <span className="text-primary text-lg flex-shrink-0">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Backup Cleanup
                      </p>
                      <p className="text-foreground/80 text-sm">
                        Backups may retain data temporarily but will be
                        automatically overwritten according to our retention
                        schedule.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-lg bg-muted/20 border border-border">
                    <span className="text-primary text-lg flex-shrink-0">
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm mb-1">
                        Confirmation Email
                      </p>
                      <p className="text-foreground/80 text-sm">
                        You'll receive a confirmation email once your deletion
                        request is complete.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section id="exceptions" className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">
                  4. Exceptions
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  In certain circumstances, we may retain limited data:
                </p>

                <div className="border-l-4 border-accent bg-accent/5 p-4 rounded-r-lg space-y-3">
                  <div className="space-y-2">
                    <p className="font-semibold text-foreground text-sm">
                      Legal Obligations
                    </p>
                    <p className="text-foreground/80 text-sm">
                      We may retain data if required by law, court orders, or
                      regulatory requirements.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-foreground text-sm">
                      Security Prevention
                    </p>
                    <p className="text-foreground/80 text-sm">
                      We may keep limited information to prevent fraud, abuse,
                      or security threats.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-semibold text-foreground text-sm">
                      Anonymized Data
                    </p>
                    <p className="text-foreground/80 text-sm">
                      We may retain anonymized data for analytics and improving
                      our service, but it cannot identify you.
                    </p>
                  </div>
                </div>

                <div className="bg-secondary/50 border border-border rounded-xl p-6 mt-6 space-y-4">
                  <p className="text-foreground/80 leading-relaxed">
                    If you have questions about your data deletion request or
                    our data retention practices:
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
