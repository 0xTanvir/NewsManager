import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">About Us</h1>
          <p className="text-xl text-muted-foreground">
            Welcome to News Manager, where we streamline your news consumption
            by bringing together the most important stories from across the web
            in one convenient location.
          </p>
        </section>

        {/* Mission Section */}
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe staying informed shouldn&apos;t mean visiting dozens of
              different news websites. Our mission is to simplify your daily
              news gathering by carefully curating and aggregating news from
              over 20 trusted sources, saving you valuable time and effort.
            </p>
          </CardContent>
        </Card>

        {/* Features Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">What Sets Us Apart</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Comprehensive Coverage</CardTitle>
                <CardDescription>
                  Access news from more than 20 leading news websites through a
                  single platform
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Time Efficiency</CardTitle>
                <CardDescription>
                  No more jumping between multiple sites – find all your news in
                  one place
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Easy Navigation</CardTitle>
                <CardDescription>
                  Our intuitive interface makes finding relevant news effortless
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Regular Updates</CardTitle>
                <CardDescription>
                  Stay current with fresh content throughout the day
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>

        {/* Journalists Section */}
        <Card>
          <CardHeader>
            <CardTitle>For Journalists</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We understand the challenges journalists face in monitoring
              multiple news sources. Our platform serves as an essential tool
              for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Quick news gathering and research</li>
              <li>Tracking developing stories across multiple outlets</li>
              <li>Identifying trending topics and patterns in news coverage</li>
              <li>Saving valuable time during deadline-driven situations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Commitment Section */}
        <Card>
          <CardHeader>
            <CardTitle>Our Commitment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">We are dedicated to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>
                Maintaining a reliable and fast-updating news aggregation
                service
              </li>
              <li>Providing easy access to diverse news sources</li>
              <li>
                Supporting journalists and news enthusiasts with efficient news
                discovery
              </li>
              <li>
                Respecting and properly attributing all original content sources
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Call to Action Section */}
        <section className="text-center space-y-6 py-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              Start Your Streamlined News Journey
            </h2>
            <p className="text-muted-foreground">
              Join thousands of journalists and news readers who have simplified
              their news gathering process with News Manager. Experience the
              convenience of accessing comprehensive news coverage through a
              single destination.
            </p>
          </div>
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            Contact Us
          </Button>
        </section>
      </div>
    </div>
  );
}
