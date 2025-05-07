"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  RectangleEllipsis,
  CircleUserRound,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Title from "@/components/title";
import loginSchema from "@/validations/loginSchema";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      oauthId: "",
      oauthProvider: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError("");
    setIsLoading(true);
    console.log("Form values:", values);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 md:py-5">
      <Title className="text-4xl md:text-6xl lg:text-7xl mb-6 md:mb-10" />
      <Card className="w-full max-w-md md:max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-lg md:text-xl mb-2">
            Log in to your account
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
                name="username"
                render={({ field }) => (
                  <FormItem className="mb-3 md:mb-4">
                    <FormLabel className="flex items-center gap-1 text-sm">
                      <User size={16} /> Username/E-mail
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username or E-mail"
                        {...field}
                        className="h-9 md:h-10"
                      />
                    </FormControl>
                    <FormDescription className="text-xs md:text-sm">
                      Enter your account username/email.
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mb-3 md:mb-4">
                    <FormLabel className="flex items-center gap-1 text-sm">
                      <RectangleEllipsis size={16} /> Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••••••••••"
                          {...field}
                          className="h-9 md:h-10 pr-10"
                          type={showPassword ? "text" : "password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff size={16} className="cursor-pointer" />
                          ) : (
                            <Eye size={16} className="cursor-pointer" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs md:text-sm">
                      Enter your account password.
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="cursor-pointer will-change-transform transition-transform duration-300
                  w-full md:w-auto md:px-8 h-10 mt-6 md:mt-8 mx-auto block hover:scale-105
                  active:scale-95 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Logging in...
                  </>
                ) : (
                  <>
                    <CircleUserRound size={18} /> Log in
                  </>
                )}
              </Button>
            </form>
          </Form>

          <p className="text-sm md:text-base mt-4 text-center">
            Don&apos;t have an account?&nbsp;
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
