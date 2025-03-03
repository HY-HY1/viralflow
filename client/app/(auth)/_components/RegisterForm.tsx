"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterForm({ className, ...props }: UserAuthFormProps) {
  const router = useRouter();
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      toast.error("Something went wrong with Google sign in.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-4">
        <Button
          variant="outline"
          type="button"
          disabled={isGoogleLoading}
          onClick={handleGoogleSignIn}
          className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800"
        >
          <div className="absolute inset-0 w-3 bg-gradient-to-r from-purple-400 to-pink-600 transition-all duration-[250ms] ease-out group-hover:w-full" />
          <div className="relative flex items-center justify-center gap-2">
            {isGoogleLoading ? (
              <Icons.spinner className="h-5 w-5 animate-spin" />
            ) : (
              <Icons.google className="h-5 w-5" />
            )}
            <span className="relative group-hover:text-white transition-colors duration-200">
              Continue with Google
            </span>
          </div>
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t dark:border-zinc-800" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background dark:text-zinc-400 px-2">
              Or continue with email
            </span>
          </div>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label className="text-zinc-500 dark:text-zinc-400" htmlFor="firstName">
                First name
              </Label>
              <Input
                {...form.register("firstName")}
                className="border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-400"
                placeholder="John"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label className="text-zinc-500 dark:text-zinc-400" htmlFor="lastName">
                Last name
              </Label>
              <Input
                {...form.register("lastName")}
                className="border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-400"
                placeholder="Doe"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="text-zinc-500 dark:text-zinc-400" htmlFor="email">
              Email
            </Label>
            <Input
              {...form.register("email")}
              className="border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-400"
              placeholder="name@example.com"
              type="email"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label className="text-zinc-500 dark:text-zinc-400" htmlFor="password">
              Password
            </Label>
            <Input
              {...form.register("password")}
              className="border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-purple-400"
              placeholder="Create a password"
              type="password"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
            )}
          </div>
          <Button
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-400 to-pink-600 text-white hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              <Icons.spinner className="h-5 w-5 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
