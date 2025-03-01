"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorType, setErrorType] = useState<string>("");

  useEffect(() => {
    const error = searchParams?.get("error");

    if (error) {
      setErrorType(error);

      // Map error codes to user-friendly messages
      switch (error) {
        case "Configuration":
          setErrorMessage(
            "There is a problem with the server configuration. Please try again later or contact support."
          );
          break;
        case "AccessDenied":
          setErrorMessage(
            "Access denied. You do not have permission to sign in."
          );
          break;
        case "Verification":
          setErrorMessage(
            "The verification link has expired or has already been used."
          );
          break;
        case "OAuthSignin":
          setErrorMessage(
            "Error in the OAuth sign-in process. Please try again."
          );
          break;
        case "OAuthCallback":
          setErrorMessage(
            "Error in the OAuth callback process. Please try again."
          );
          break;
        case "OAuthCreateAccount":
          setErrorMessage(
            "Could not create an account using the OAuth provider. Please try again."
          );
          break;
        case "EmailCreateAccount":
          setErrorMessage(
            "Could not create an account using the email provider. Please try again."
          );
          break;
        case "Callback":
          setErrorMessage(
            "Error in the authentication callback. Please try again."
          );
          break;
        case "OAuthAccountNotLinked":
          setErrorMessage(
            "This email is already associated with another account. Please sign in using your original account."
          );
          break;
        case "EmailSignin":
          setErrorMessage("Error sending the email. Please try again.");
          break;
        case "CredentialsSignin":
          setErrorMessage(
            "Invalid credentials. Please check your email and password and try again."
          );
          break;
        case "SessionRequired":
          setErrorMessage("You must be signed in to access this page.");
          break;
        default:
          setErrorMessage("An unknown error occurred. Please try again.");
      }
    } else {
      setErrorMessage("An unknown error occurred. Please try again.");
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errorType ? `Error: ${errorType}` : "Authentication Error"}
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{errorMessage}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create a New Account
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:text-indigo-500 focus:outline-none"
          >
            Return to Home
          </Link>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help?{" "}
            <Link
              href="/contact"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for the Suspense boundary
function AuthErrorLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Loading...</h2>
        <p className="text-gray-500">
          Please wait while we process your request
        </p>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<AuthErrorLoading />}>
      <AuthErrorContent />
    </Suspense>
  );
}
