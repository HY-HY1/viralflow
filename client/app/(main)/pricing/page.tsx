"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";

const features = [
  "Unlimited video transcriptions",
  "Advanced AI processing",
  "Priority support",
  "Early access to new features",
  "Custom branding",
];

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscription = async (priceId: string) => {
    if (!session) {
      toast.error("Please sign in to continue");
      router.push("/onboarding");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId } = await response.json();
      router.push(`/checkout?session_id=${sessionId}`);
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error("Failed to start checkout process");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Simple, transparent pricing</h1>
          <p className="text-muted-foreground">
            Choose the plan that best fits your needs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
          {/* Free Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$0</div>
              <p className="text-sm text-muted-foreground">per month</p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  5 transcriptions per month
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Basic features
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Community support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => session ? router.push("/dashboard") : router.push("/onboarding")}
              >
                {session ? "Go to Dashboard" : "Get Started"}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Best for professionals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$9.99</div>
              <p className="text-sm text-muted-foreground">per month</p>
              <ul className="mt-4 space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscription("price_monthly")}
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {session ? "Upgrade to Pro" : "Sign in to Upgrade"}
              </Button>
            </CardFooter>
          </Card>

          {/* Enterprise Plan */}
          <Card>
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>For large organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">$99.99</div>
              <p className="text-sm text-muted-foreground">per month</p>
              <ul className="mt-4 space-y-2">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="mr-2 h-4 w-4" />
                    {feature}
                  </li>
                ))}
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Dedicated support
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Custom integrations
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleSubscription("price_yearly")}
                disabled={isLoading}
              >
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {session ? "Contact Sales" : "Sign in to Contact Sales"}
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            All plans include a 14-day free trial. No credit card required.
            <br />
            Need help choosing?{" "}
            <Button variant="link" className="p-0">
              Contact our sales team
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
} 