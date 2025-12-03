"use client";

import { useEffect, useState } from "react";
import { FaCaretDown, FaEnvelope } from "react-icons/fa";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import Link from "next/link";

// US States
const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

// Canadian Provinces/Territories
const CANADIAN_PROVINCES = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

// Countries list
const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Netherlands",
  "Belgium",
  "Switzerland",
  "Austria",
  "Sweden",
  "Norway",
  "Denmark",
  "Finland",
  "Ireland",
  "Portugal",
  "Greece",
  "Poland",
  "Czech Republic",
  "Hungary",
  "Romania",
  "Bulgaria",
  "Croatia",
  "Slovakia",
  "Slovenia",
  "Lithuania",
  "Latvia",
  "Estonia",
  "Luxembourg",
  "Malta",
  "Cyprus",
  "Japan",
  "South Korea",
  "Singapore",
  "New Zealand",
  "Mexico",
  "Brazil",
  "Argentina",
  "Chile",
  "Colombia",
  "Peru",
  "India",
  "China",
  "Hong Kong",
  "Taiwan",
  "Thailand",
  "Vietnam",
  "Malaysia",
  "Indonesia",
  "Philippines",
  "Israel",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "Egypt",
  "Nigeria",
  "Kenya",
  "Turkey",
  "Russia",
  "Ukraine",
  "Other",
];

export default function PresentationForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [complete, setComplete] = useState(false);
  const [deviceType, setDeviceType] = useState("Unknown");
  const [browserName, setBrowserName] = useState("Unknown");

  useEffect(() => {
    const getDeviceData = () => {
      if (typeof window !== "undefined") {
        const userAgent = navigator.userAgent;
        const isMobile =
          /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
          );
        setDeviceType(isMobile ? "Mobile" : "Desktop");
        if (userAgent.includes("Chrome")) {
          setBrowserName("Chrome");
        } else if (userAgent.includes("Firefox")) {
          setBrowserName("Firefox");
        } else if (
          userAgent.includes("Safari") &&
          !userAgent.includes("Chrome")
        ) {
          setBrowserName("Safari");
        } else if (userAgent.includes("Edge")) {
          setBrowserName("Edge");
        } else {
          setBrowserName("Unknown");
        }
      }
    };
    getDeviceData();
  }, []);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    industry: "",
    country: "",
    state: "",
    username: "",
    expertise: "",
    hasAudience: "",
    locationType: "",
    locationTypeOther: "",
    locationDetails: "",
    needsAuthorization: "",
    expectedAttendees: "",
    timeframe: "",
    otherDetails: "",
    acknowledgement: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "country" && { state: "" }),
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();

    if (!executeRecaptcha) {
      console.log("reCAPTCHA not yet available");
      return;
    }
    const token = await executeRecaptcha("submit_form");

    const response = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        recaptchaToken: token,
        deviceType: deviceType,
        browserName: browserName,
      }),
    });

    if (response.ok) {
      setComplete(true);
    } else {
      const error = await response.json();
      console.error("Form submission failed:", error);
    }
    setLoading(false);
  };

  const showStateSelection =
    formData.country === "United States" || formData.country === "Canada";
  const stateOptions =
    formData.country === "United States" ? US_STATES : CANADIAN_PROVINCES;
  const stateLabel =
    formData.country === "Canada" ? "Province/Territory" : "State";

  return complete ? (
    <div className="space-y-4">
      <h1 className="text-4xl font-bold">Thank You!</h1>
      <p className="text-base-content/70">
        Thank you for registering your interest in this initiative. We will
        email you when the presentation is released.
      </p>
    </div>
  ) : (
    <div>
      <h1 className="text-4xl font-bold mb-6">Presenter Registration</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-base-200 p-6 rounded-lg flex flex-col gap-4"
      >
        {/* Professional Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>

          <div className="space-y-4">
            <div className="flex sm:flex-row flex-col gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  First Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Last Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>
            </div>
            <div className="flex sm:flex-row flex-col gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-error">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-1.5 pr-3 pl-10 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:pl-9 sm:text-sm/6"
                  />
                  <FaEnvelope
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center sm:size-4 text-base-content/50"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-base-100 outline-1 -outline-offset-1 outline-base-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-primary">
                    <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country"
                        aria-label="Country"
                        className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-base-100 py-1.5 pr-7 pl-3 text-base text-base-content/50 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                      >
                        <option>US</option>
                        <option>CA</option>
                        <option>EU</option>
                      </select>
                      <FaCaretDown
                        aria-hidden="true"
                        className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-base-content/50 sm:size-4"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="123-456-7890"
                      className="block min-w-0 grow bg-base-100 py-1.5 pr-3 pl-1 text-base text-base-content placeholder:text-base-content/70 focus:outline-none sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex sm:flex-row flex-col gap-4">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">
                  Country <span className="text-error">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="col-start-1 row-start-1 bg-base-100 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-base text-base-content/70 outline-1 -outline-offset-1 outline-base-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:text-sm/6"
                  >
                    <option value="">Select a country...</option>
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  <FaCaretDown
                    aria-hidden="true"
                    className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-base-content/50 sm:size-4"
                  />
                </div>
              </div>
              {showStateSelection && (
                <div className="w-full">
                  <label className="block text-sm font-medium mb-1">
                    {stateLabel} <span className="text-error">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      name="state"
                      value={formData.state}
                      required={showStateSelection}
                      onChange={handleChange}
                      className="col-start-1 row-start-1 bg-base-100 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-base text-base-content/70 outline-1 -outline-offset-1 outline-base-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:text-sm/6"
                    >
                      <option value="">
                        Select a {stateLabel.toLowerCase()}...
                      </option>
                      {stateOptions.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                    <FaCaretDown
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-base-content/50 sm:size-4"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="w-full flex-1 min-w-48">
                <label className="block text-sm font-medium mb-1">
                  Industry <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Example: Education"
                  className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>

              <div className="w-full flex-2 sm:min-w-96">
                <label className="block text-sm font-medium mb-1">
                  LinkedIn
                  <span className="text-error">*</span>
                </label>
                <div className="mt-2 flex">
                  <div className="hidden sm:flex shrink-0 items-center rounded-l-md bg-base-100 px-3 text-base text-base-content/50 outline-1 -outline-offset-1 outline-base-300 sm:text-sm/6">
                    https://www.linkedin.com/in/
                  </div>
                  <div className="flex sm:hidden shrink-0 items-center rounded-l-md bg-base-100 px-3 text-base text-base-content/50 outline-1 -outline-offset-1 outline-base-300 sm:text-sm/6">
                    linkedin.com/in/
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="-ml-px block w-full grow rounded-r-md bg-base-100 px-3 py-1.5 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Any additional details you would like to share?
              </label>
              <input
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
              />
            </div>
          </div>
        </div>

        {/* Audience & Location Details */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Audience & Presentation Location Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Do you already have an audience in mind?
                <span className="text-error">*</span>
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasAudience"
                    value="yes"
                    required
                    checked={formData.hasAudience === "yes"}
                    onChange={handleChange}
                    className="mr-2 radio radio-xs"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasAudience"
                    value="no"
                    required
                    checked={formData.hasAudience === "no"}
                    onChange={handleChange}
                    className="mr-2 radio radio-xs"
                  />
                  No
                </label>
              </div>
            </div>
            {formData.hasAudience === "yes" && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Expected Number of Attendees?
                  </label>
                  <input
                    type="number"
                    name="expectedAttendees"
                    min="0"
                    placeholder="10"
                    value={formData.expectedAttendees}
                    onChange={handleChange}
                    className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Any additional details you would like to share?
                  </label>
                  <input
                    name="locationDetails"
                    type="text"
                    value={formData.locationDetails}
                    placeholder="Example: Teacher at XYZ High School or Coach of ABC baseball team."
                    onChange={handleChange}
                    className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Do you need permission to present to this group?
                    <span className="text-error">*</span>
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="needsAuthorization"
                        value="yes"
                        required={formData.hasAudience === "yes"}
                        checked={formData.needsAuthorization === "yes"}
                        onChange={handleChange}
                        className="mr-2 radio radio-xs"
                      />
                      Yes
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="needsAuthorization"
                        value="no"
                        required={formData.hasAudience === "yes"}
                        checked={formData.needsAuthorization === "no"}
                        onChange={handleChange}
                        className="mr-2 radio radio-xs"
                      />
                      No
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    What is the location you plan to present at?
                    <span className="text-error">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      name="locationType"
                      required={formData.hasAudience === "yes"}
                      value={formData.locationType}
                      onChange={handleChange}
                      className="col-start-1 row-start-1 bg-base-100 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-base text-base-content/70 outline-1 -outline-offset-1 outline-base-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:text-sm/6"
                    >
                      <option value="">Select a location type...</option>
                      <option value="school">School</option>
                      <option value="sports-team">Sports Team</option>
                      <option value="business">Business</option>
                      <option value="church">Church</option>
                      <option value="other">Other</option>
                    </select>
                    <FaCaretDown
                      aria-hidden="true"
                      className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-base-content/50 sm:size-4"
                    />
                  </div>
                </div>

                {formData.locationType === "other" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Please specify:
                    </label>
                    <input
                      type="text"
                      name="locationTypeOther"
                      value={formData.locationTypeOther}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 bg-base-100 border-base-300"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Time Frame */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Time Frame</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Expected presentation timeframe{" "}
                <span className="text-error">*</span>
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  name="timeframe"
                  required
                  value={formData.timeframe}
                  onChange={handleChange}
                  className="col-start-1 bg-base-100 row-start-1 w-full appearance-none rounded-md py-1.5 pr-8 pl-3 text-base text-base-content/70 outline-1 -outline-offset-1 outline-base-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:text-sm/6"
                >
                  <option value="">Select a timeframe...</option>
                  <option value="next-month">Within the next month</option>
                  <option value="2-6-months">2 to 6 months out</option>
                  <option value="6-plus-months">6+ months out</option>
                </select>
                <FaCaretDown
                  aria-hidden="true"
                  className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-base-content/50 sm:size-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Legal Acknowledgment */}
        <div>
          <div className="flex sm:flex-row flex-col gap-4 items-centers mb-4">
            <h2 className="text-xl font-semibold">Legal Acknowledgment</h2>
            <Link
              href="/legal"
              target="_blank"
              className="text-sm text-base-content/70 mt-1"
            >
              Learn more
            </Link>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-md border border-base-300 bg-base-100 h-32 overflow-scroll space-y-4">
              <p className="text-base font-bold text-base-content">
                DISCLAIMER, TERMS, AND CONDITIONS
              </p>
              <ol className="space-y-2">
                <li className="text-sm text-base-content/70 list-decimal ml-4">
                  <b className="text-base-content">
                    GENERAL DISCLAIMER & INFORMATIONAL PURPOSES ONLY
                  </b>{" "}
                  This Presentation is provided strictly for informational and
                  educational purposes only. It does not constitute, and should
                  not be relied upon as, legal, medical, psychological, or
                  professional advice. The creators (&quot;The Providers&quot;)
                  are not licensed professionals. Users must seek the advice of
                  qualified professionals for specific concerns or situations.
                </li>
                <li className="text-sm text-base-content/70 list-decimal ml-4">
                  <b className="text-base-content">
                    USER RESPONSIBILITY & ASSUMPTION OF RISK
                  </b>{" "}
                  The User, and the operators of any venue (if applicable), are
                  solely responsible for determining the appropriateness of the
                  content for their specific audience. The Providers assume no
                  responsibility or liability for the manner in which the
                  Presentation is used, presented, or interpreted, or for any
                  reaction or outcome resulting from its use.
                </li>
                <li className="text-sm text-base-content/70 list-decimal ml-4">
                  <b className="text-base-content">
                    THIRD-PARTY CONTENT & REPRESENTATIONS
                  </b>{" "}
                  The Providers do not endorse any specific companies, products,
                  or platforms mentioned. All names, images, or scenarios are
                  fictional and for illustrative purposes only. AI-generated
                  images do not depict real individuals.
                </li>
                <li className="text-sm text-base-content/70 list-decimal ml-4">
                  <b className="text-base-content">
                    LIMITATION OF LIABILITY BY DOWNLOADING, DISTRIBUTING, OR
                    UTILIZING THIS PRESENTATION, YOU EXPRESSLY AGREE
                  </b>{" "}
                  that The Providers shall not be liable for any damages
                  (including direct, indirect, consequential, or punitive)
                  arising from the use or inability to use the Presentation. The
                  User waives all claims against The Providers to the fullest
                  extent permitted by law.
                </li>
                <li className="text-sm text-base-content/70 list-decimal ml-4">
                  <b className="text-base-content">LICENSE & USE</b> This
                  Presentation is released under a Creative Commons
                  Attribution-NonCommercial-ShareAlike 4.0 International License
                  (CC BY-NC-SA 4.0). Users are free to share and adapt the
                  material for non-commercial purposes, provided appropriate
                  credit is given.
                </li>
              </ol>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="acknowledgement"
                  required
                  checked={formData.acknowledgement}
                  onChange={handleCheckbox}
                  className="mr-2 checkbox checkbox-sm checkbox-neutral"
                />
                <span className="text-sm">
                  I acknowledge that I have read and agree to the disclaimer
                  above. <span className="text-error">*</span>
                </span>
              </label>
            </div>
          </div>
        </div>
        {/* Submit Button */}
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary rounded border border-primary disabled:bg-base-200 disabled:border-base-300"
            disabled={
              loading ||
              !formData.firstName ||
              !formData.lastName ||
              !formData.email ||
              !formData.industry ||
              !formData.country ||
              !formData.username ||
              !formData.hasAudience ||
              !formData.timeframe ||
              !formData.acknowledgement
            }
          >
            {loading ? "Submitting Response..." : "Submit"}
          </button>
          {(loading ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.industry ||
            !formData.country ||
            !formData.username ||
            !formData.hasAudience ||
            !formData.timeframe ||
            !formData.acknowledgement) && (
            <div className="px-2 py-1 text-center text-warning border border-warning/20 bg-warning/5 rounded-lg">
              <p>
                You have not completed all the required fields{" "}
                <span className="text-error">*</span>
              </p>
            </div>
          )}
        </div>

        <Link
          href="/privacy"
          target="_blank"
          className="mx-auto text-base-content/50 hover:text-base-content text-sm"
        >
          Privacy Policy
        </Link>
      </form>
    </div>
  );
}
