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
    try {
      const res = await axios.post("/api/signup", values);
      if (res.data.success) {
        router.push("/login");
      } else {
        setError(res.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error))
        console.error("Axios error:", error.response?.data || error.message);
      else console.error("Unexpected error:", error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-5">
      <Title className="text-7xl mb-10" />
      <Card className="w-120 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl mb-2">
            Create an account
          </CardTitle>
          <hr />
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

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
                      We'll send a verification OTP to this email.
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
                className="cursor-pointer will-change-transform transition-transform duration-300
            w-25 h-10 mt-8 mx-auto block hover:scale-107 hover:hover:animate-[pulse_1s_ease-in-out_forwards]
            active:scale-95 flex items-center justify-center"
              >
                <CircleUserRound /> Sign Up
              </Button>
            </form>
          </Form>

          <p className="flex-col mt-2 text-center">
            Already have an account?&nbsp;
            <Link href="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
