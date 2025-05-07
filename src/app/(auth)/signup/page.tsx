"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import signupSchema from "@/validations/signupSchema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  User,
  RectangleEllipsis,
  CircleUserRound,
  Eye,
  EyeOff,
  CheckCircle2,
  LogIn,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Title from "@/components/title";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  // States
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // AppRouter instance
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    try {
      const res = await axios.post("/api/signup", values);
      if (res.data.success) {
        setError("");
        setIsSuccess(true);
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data || error.message;
        console.error("Axios error:", errorMessage);
        setError(
          typeof errorMessage === "string"
            ? errorMessage
            : errorMessage?.message || "Internal server error"
        );
      } else {
        console.error("Unexpected error:", error);
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleLoginRedirect = () => {
    router.push("/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5">
      <Title className="text-7xl mb-10" />
      <Card className="w-120 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl mb-2">
            {isSuccess ? "Registration Successful" : "Create an account"}
          </CardTitle>
          <hr />
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="mb-6 text-green-600">
                <CheckCircle2 size={64} />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-center">
                Account Created Successfully!
              </h3>
              <p className="text-center mb-6 text-gray-400">
                We've sent a verification link to your email address. Please
                check your inbox and verify your account.
              </p>
              <Button
                onClick={handleLoginRedirect}
                className="flex items-center justify-center cursor-pointer gap-2 w-full max-w-xs will-change-transform transition-transform duration-300
                hover:scale-105 hover:animate-[pulse_1s_ease-in-out_forwards] active:scale-95"
              >
                <LogIn size={18} /> Proceed to Login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        <User /> Full Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-10"
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your full name as it will appear on your profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        <User /> Username
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe"
                          {...field}
                          className="h-10"
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        Choose a unique username for your account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        <Mail /> E-mail
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="johndoe@example.com"
                          type="email"
                          {...field}
                          className="h-10"
                          required
                        />
                      </FormControl>
                      <FormDescription>
                        We&apos;ll send a verification OTP to this email.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        <RectangleEllipsis /> Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••••••••••"
                            {...field}
                            className="h-10 pr-10"
                            required
                            type={showPassword ? "text" : "password"}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff
                                className="cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                              />
                            ) : (
                              <Eye
                                className="cursor-pointer"
                                onClick={() => setShowPassword((prev) => !prev)}
                              />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Use at least 8 characters, including a number and a
                        symbol.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>
                        <RectangleEllipsis /> Confirm Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="••••••••••••••••"
                            {...field}
                            className="h-10 pr-10"
                            required
                            type={showConfirmPassword ? "text" : "password"}
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff
                                className="cursor-pointer"
                                onClick={() =>
                                  setShowConfirmPassword((prev) => !prev)
                                }
                              />
                            ) : (
                              <Eye
                                className="cursor-pointer"
                                onClick={() =>
                                  setShowConfirmPassword((prev) => !prev)
                                }
                              />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Use at least 8 characters, including a number and a
                        symbol.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="cursor-pointer will-change-transform transition-transform duration-300
                  w-25 h-10 mt-8 mx-auto block hover:scale-105 hover:animate-[pulse_1s_ease-in-out_forwards]
                  active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing Up...
                    </>
                  ) : (
                    <>
                      <CircleUserRound /> Sign Up
                    </>
                  )}
                </Button>
              </form>
            </Form>
          )}

          {!isSuccess && (
            <p className="flex-col mt-2 text-center">
              Already have an account?&nbsp;
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
