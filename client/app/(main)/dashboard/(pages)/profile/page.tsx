"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "",
    lastName: session?.user?.name?.split(" ")[1] || "",
    email: session?.user?.email || "",
    bio: "",
    avatar: session?.user?.image || "",
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      await update();
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubscription = async (priceId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

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
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and subscription
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information and avatar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.avatar} />
                      <AvatarFallback>
                        {formData.firstName?.[0]}
                        {formData.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={formData.avatar}
                        onChange={(e) =>
                          setFormData({ ...formData, avatar: e.target.value })
                        }
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({ ...formData, firstName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({ ...formData, bio: e.target.value })
                      }
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and billing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Current Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.role === "premium"
                        ? "Premium Plan"
                        : "Free Plan"}
                    </p>
                  </div>

                  {session?.user?.role !== "premium" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Upgrade to Premium</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle>Monthly</CardTitle>
                            <CardDescription>Perfect for individuals</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">$9.99</div>
                            <ul className="mt-4 space-y-2">
                              <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" />
                                Unlimited transcriptions
                              </li>
                              <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" />
                                Advanced features
                              </li>
                              <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" />
                                Priority support
                              </li>
                            </ul>
                            <Button
                              className="mt-4 w-full"
                              onClick={() =>
                                handleSubscription("price_monthly")
                              }
                              disabled={isLoading}
                            >
                              {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Upgrade to Monthly
                            </Button>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Yearly</CardTitle>
                            <CardDescription>Best value for long-term users</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">$99.99</div>
                            <div className="text-sm text-muted-foreground">
                              Save 17% compared to monthly
                            </div>
                            <ul className="mt-4 space-y-2">
                              <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" />
                                Unlimited transcriptions
                              </li>
                              <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" />
                                Advanced features
                              </li>
                              <li className="flex items-center">
                                <Icons.check className="mr-2 h-4 w-4" />
                                Priority support
                              </li>
                            </ul>
                            <Button
                              className="mt-4 w-full"
                              onClick={() =>
                                handleSubscription("price_yearly")
                              }
                              disabled={isLoading}
                            >
                              {isLoading && (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                              )}
                              Upgrade to Yearly
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {session?.user?.role === "premium" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Manage Subscription</h3>
                      <Button
                        variant="outline"
                        onClick={() => router.push("/api/customer-portal")}
                      >
                        Manage Billing
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 