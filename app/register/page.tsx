"use client";

import React from "react";
import PresentationForm from "@/components/AppForm";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
export default function RegistrationPage() {
  return (
    <React.Fragment>
      <main>
        {" "}
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
        >
          <PresentationForm />
        </GoogleReCaptchaProvider>
      </main>
    </React.Fragment>
  );
}
