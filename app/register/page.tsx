"use client";

import React, { ViewTransition } from "react";
import PresentationForm from "@/app/components/AppForm";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
export default function RegistrationPage() {
  return (
    <React.Fragment>
      <ViewTransition>
        <main>
          {" "}
          <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          >
            <div>
              <p className="text-base font-semibold text-primary">Register</p>
              <h1 className="text-xl font-semibold tracking-tight text-balance sm:text-2xl text-base-content">
                Presenter Registration
              </h1>
            </div>
            <PresentationForm />
          </GoogleReCaptchaProvider>
        </main>
      </ViewTransition>
    </React.Fragment>
  );
}
