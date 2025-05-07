"use client";

import Title from "@/components/title";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function MailVerificationPage() {
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axios.get("/api/verify/" + encodeURIComponent(token));
        if (res.data.success) {
          setStatus("success");
          // Redirect after showing success message for 2 seconds
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        } else {
          setStatus("error");
          setError(res.data.message || "Verification failed");
        }
      } catch (error) {
        setStatus("error");
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message || error.message;
          setError(errorMessage);
        } else {
          console.error("Unexpected error:", error);
          setError("Unexpected error occurred");
        }
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Title className="text-5xl md:text-7xl mb-10" />

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h2 className="text-2xl font-semibold">Email Verification</h2>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center space-y-4 ">
          {status === "verifying" && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin" />
              <p className="text-lg">Verifying your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <div className="w-full text-center">
                <AlertTitle className="mb-2 text-center text-xl">
                  Success!
                </AlertTitle>
                <Alert variant="default" className="border-green-200">
                  <AlertDescription className="text-green-100 justify-center text-lg w-full">
                    Your email has been successfully verified.
                  </AlertDescription>
                </Alert>
                <p className="text-md mt-3">Redirecting to login page...</p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center gap-4 w-full">
              <XCircle className="h-16 w-16 text-red-500" />
              <div className="w-full">
                <AlertTitle className="text-center text-xl mb-2 text-destructive">
                  Verification Failed
                </AlertTitle>
                <Alert variant="destructive" className="text-wrap">
                  <AlertDescription className="justify-center text-lg w-full">
                    {error}
                  </AlertDescription>
                </Alert>
                <p className="text-md mt-3 text-center">
                  Please try signing up again.
                </p>
              </div>
            </div>
          )}
        </CardContent>

        {status === "error" && (
          <CardFooter className="flex justify-center">
            <Button variant="default" asChild>
              <a href="/signup">Back to Sign Up</a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
