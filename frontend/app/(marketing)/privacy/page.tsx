import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last Updated: October 25, 2024
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This Privacy Policy and Terms of Use document explains how we
              collect, use, and protect information obtained through our news
              aggregation service, and outlines specific terms for journalists
              and professional users.
            </p>
          </CardContent>
        </Card>

        <Separator />

        {/* Information Collection */}
        <Card>
          <CardHeader>
            <CardTitle>1. Information Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">1.1 User Information</h3>
              <p className="text-muted-foreground mb-2">We collect:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Basic account information (email, name, profession)</li>
                <li>Usage statistics and preferences</li>
                <li>
                  Access patterns and browsing history within our platform
                </li>
                <li>
                  Technical information (IP address, browser type, device
                  information)
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">1.2 News Content</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  We aggregate news content from various sources in accordance
                  with fair use principles
                </li>
                <li>All original sources are clearly attributed</li>
                <li>
                  We maintain timestamps of original publication and aggregation
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Terms for Journalists */}
        <Card>
          <CardHeader>
            <CardTitle>2. Terms for Journalists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">2.1 Service Access</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Journalists must register with a verified professional email
                  address
                </li>
                <li>
                  Access to aggregated content is provided through our unified
                  platform
                </li>
                <li>
                  We provide a comprehensive news feed covering multiple sources
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">2.2 Usage Limitations</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Maximum of 500 article accesses per day</li>
                <li>Content must be independently verified before use</li>
                <li>
                  Direct republishing of our aggregated content is prohibited
                </li>
                <li>
                  Users must comply with rate limiting and API restrictions
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">2.3 Source Attribution</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Original sources must be credited in any derived work</li>
                <li>
                  Links to original articles should be maintained where possible
                </li>
                <li>
                  Our platform should be cited as an aggregation tool, not a
                  primary source
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle>3. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">3.1 Protection Measures</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Industry-standard encryption for all data transmission</li>
                <li>Regular security audits and updates</li>
                <li>Secure user authentication systems</li>
                <li>Automated threat detection and prevention</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">3.2 Data Retention</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  User account information retained while account is active
                </li>
                <li>Search and access history stored for 90 days</li>
                <li>Aggregated analytics data retained for 12 months</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* User Privacy Rights */}
        <Card>
          <CardHeader>
            <CardTitle>4. User Privacy Rights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">4.1 Access and Control</h3>
              <p className="text-muted-foreground mb-2">
                Users have the right to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Access their personal data</li>
                <li>Request data correction or deletion</li>
                <li>Export their usage history</li>
                <li>Opt-out of non-essential data collection</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">4.2 Data Sharing</h3>
              <p className="text-muted-foreground mb-2">We do not:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Sell user data to third parties</li>
                <li>Share individual usage patterns</li>
                <li>Disclose professional affiliations without consent</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Service Limitations to Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>5-6. Service Limitations and Compliance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">5. Service Limitations</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  We aim for 99.9% uptime but do not guarantee uninterrupted
                  service
                </li>
                <li>
                  Scheduled maintenance will be announced 48 hours in advance
                </li>
                <li>Emergency maintenance may be performed without notice</li>
                <li>
                  Users should verify information through original sources
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">6. Compliance</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>
                  Compliant with GDPR, CCPA, and applicable data protection laws
                </li>
                <li>
                  Regular updates to maintain compliance with news aggregation
                  regulations
                </li>
                <li>Adherence to copyright and fair use guidelines</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>7. Contact Information</CardTitle>
            <CardDescription>
              For questions or concerns regarding this policy:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>privacy@newsmanager.com</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>123 Privacy Street, Security City, ST 12345</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle>8. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By using our service, you acknowledge that you have read,
              understood, and agree to be bound by these terms and conditions.
            </p>
          </CardContent>
        </Card>

        {/* Contact Button */}
        <section className="text-center space-y-6 py-8">
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            Contact Us About Privacy
          </Button>
        </section>
      </div>
    </div>
  );
}
