import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-muted-foreground">
            Last Updated: October 25, 2024
          </p>
        </div>

        <Separator />

        {/* Terms Sections */}
        <section className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Welcome to News Manager (&quot;we&quot;, &quot;our&quot;, or
                &quot;us&quot;). By accessing or using our news aggregation
                service, you agree to be bound by these Terms and Conditions
                (&quot;Terms&quot;). If you disagree with any part of these
                terms, please do not use our service.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle>2. Service Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                News Manager is a news aggregation platform that compiles and
                presents news content from various sources for the convenience
                of journalists and media professionals.
              </p>
            </CardContent>
          </Card>

          {/* Content and Copyright */}
          <Card>
            <CardHeader>
              <CardTitle>3. Content and Copyright</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">3.1 Third-Party Content</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    Our service aggregates news content from multiple
                    third-party sources
                  </li>
                  <li>
                    All original content remains the intellectual property of
                    their respective owners
                  </li>
                  <li>
                    Links to original sources are provided where applicable
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">3.2 Fair Use</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Our service operates under fair use principles</li>
                  <li>
                    We provide brief excerpts and headlines with proper
                    attribution
                  </li>
                  <li>
                    Users must respect copyright laws when using our service
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle>4. User Responsibilities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Users of our service agree to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Use the content for legitimate journalistic and research
                  purposes only
                </li>
                <li>
                  Not redistribute, sell, or commercially exploit our aggregated
                  content
                </li>
                <li>
                  Properly attribute original sources when using the content
                </li>
                <li>
                  Not attempt to circumvent any technical measures we implement
                </li>
                <li>Not use automated systems or bots to scrape our service</li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card>
            <CardHeader>
              <CardTitle>5. Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">5.1 Accuracy</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    While we strive to provide accurate information, we do not
                    guarantee the accuracy, completeness, or timeliness of any
                    content
                  </li>
                  <li>
                    Users should independently verify information before
                    publication
                  </li>
                  <li>
                    We are not responsible for errors or omissions in the
                    content
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">5.2 Availability</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>
                    We do not guarantee uninterrupted access to our service
                  </li>
                  <li>
                    We reserve the right to modify or discontinue any feature
                    without notice
                  </li>
                  <li>
                    We are not liable for any service interruptions or technical
                    issues
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Sections 6-12 */}
          {/* License to Use */}
          <Card>
            <CardHeader>
              <CardTitle>6. License to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                We grant users a limited, non-exclusive, non-transferable
                license to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Access and view the content for professional use</li>
                <li>
                  Use the content in accordance with standard journalistic
                  practices
                </li>
                <li>
                  Share individual articles through proper attribution and
                  linking
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card>
            <CardHeader>
              <CardTitle>7. Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Users are strictly prohibited from:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Reproducing our aggregation service or creating competing
                  services
                </li>
                <li>Mass downloading or scraping content</li>
                <li>
                  Removing or altering any copyright notices or attributions
                </li>
                <li>
                  Using our service for any illegal or unauthorized purpose
                </li>
                <li>Attempting to gain unauthorized access to our systems</li>
              </ul>
            </CardContent>
          </Card>

          {/* Remaining sections */}
          <Card>
            <CardHeader>
              <CardTitle>8-12. Additional Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-semibold">8. Termination</h3>
                <p className="text-muted-foreground">
                  We reserve the right to terminate or suspend access to our
                  service immediately without prior notice and take appropriate
                  legal action for any violations.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">9. Changes to Terms</h3>
                <p className="text-muted-foreground">
                  We may modify these Terms at any time with notice of material
                  changes posted on our website.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">10. Contact Information</h3>
                <p className="text-muted-foreground">
                  For questions about these Terms, please contact us using the
                  button below.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">11. Governing Law</h3>
                <p className="text-muted-foreground">
                  These Terms shall be governed by and construed in accordance
                  with the applicable laws, without regard to its conflict of
                  law provisions.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">12. Severability</h3>
                <p className="text-muted-foreground">
                  If any provision of these Terms is found to be unenforceable,
                  that provision shall be limited or eliminated while preserving
                  the remaining provisions.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact Section */}
        <section className="text-center space-y-6 py-8">
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            Contact Us About These Terms
          </Button>
        </section>
      </div>
    </div>
  );
}
