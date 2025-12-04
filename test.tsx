"use client";

import { useEffect, useState, useRef } from "react";
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

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  industry: string;
  country: string;
  state: string;
  username: string;
  expertise: string;
  hasAudience: string;
  locationType: string;
  locationTypeOther: string;
  locationDetails: string;
  needsAuthorization: string;
  expectedAttendees: string;
  timeframe: string;
  otherDetails: string;
  acknowledgement: boolean;
};

export default function PresentationForm() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const disclaimerRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<FormData>({
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

  // Detect device type and browser on mount
  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isMobile =
      /Mobile|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    let browser = "Unknown";
    if (userAgent.includes("Chrome")) browser = "Chrome";
    else if (userAgent.includes("Firefox")) browser = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome"))
      browser = "Safari";
    else if (userAgent.includes("Edge")) browser = "Edge";

    // Store for later use in submission
    (window as any).__deviceData = {
      deviceType: isMobile ? "Mobile" : "Desktop",
      browserName: browser,
    };
  }, []);

  // Handle scroll detection for disclaimer
  const handleDisclaimerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrolledToBottom =
      Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) <
      5;

    if (scrolledToBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

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
    e.preventDefault();

    if (!hasScrolledToBottom) {
      disclaimerRef.current?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setLoading(true);

    try {
      if (!executeRecaptcha) {
        console.error("reCAPTCHA not yet available");
        return;
      }

      const token = await executeRecaptcha("submit_form");
      const deviceData = (window as any).__deviceData || {
        deviceType: "Unknown",
        browserName: "Unknown",
      };

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: token,
          ...deviceData,
        }),
      });

      if (response.ok) {
        setComplete(true);
      } else {
        const error = await response.json();
        console.error("Form submission failed:", error);
        alert("Form submission failed. Please try again.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const showStateSelection =
    formData.country === "United States" || formData.country === "Canada";
  const stateOptions =
    formData.country === "United States" ? US_STATES : CANADIAN_PROVINCES;
  const stateLabel =
    formData.country === "Canada" ? "Province/Territory" : "State";

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.industry &&
    formData.country &&
    (!showStateSelection || formData.state) &&
    formData.username &&
    formData.hasAudience &&
    formData.timeframe &&
    formData.acknowledgement &&
    hasScrolledToBottom;

  if (complete) {
    return (
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Success!</h1>
        <h2 className="text-xl font-bold">Your Interest is Registered!</h2>
        <p>
          Thank you for submitting your details. We sincerely appreciate your
          energy and drive to educate your community on{" "}
          <b>"Navigating the Digital Storm"</b> and protecting young people from
          online threats.
        </p>
        <h2 className="text-xl font-bold">What Happens Next?</h2>
        <ul className="space-y-2 list-disc marker:text-primary pl-4">
          <li>
            We have received your information about your plans for utilizing the
            presentation. This helps us better support the community.
          </li>
          <li>
            The presentation package will be officially released and sent to you
            via email in January.
          </li>
        </ul>
        <p>
          As we work toward the New Year, we wish you a wonderful and safe
          holiday season, whatever your traditions may be.
        </p>
        <div>
          <h2 className="text-xl font-bold">Happy Holidays!</h2>
          <p>- The Digital Storm Education Team</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Presenter Registration</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-base-200 p-6 rounded-lg flex flex-col gap-4"
      >
        {/* Professional Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>

          <div className="space-y-4">
            <div className="flex sm:flex-row flex-col gap-4">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium mb-1"
                >
                  First Name <span className="text-error">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium mb-1"
                >
                  Last Name <span className="text-error">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>
            </div>

            <div className="flex sm:flex-row flex-col gap-4">
              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email <span className="text-error">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <input
                    id="email"
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
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium mb-1"
                >
                  Phone Number
                </label>
                <div className="mt-2">
                  <div className="flex rounded-md bg-base-100 outline-1 -outline-offset-1 outline-base-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-primary">
                    <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                      <select
                        id="countryCode"
                        name="countryCode"
                        autoComplete="country"
                        aria-label="Country Code"
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
                      id="phoneNumber"
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
                <label
                  htmlFor="country"
                  className="block text-sm font-medium mb-1"
                >
                  Country <span className="text-error">*</span>
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="country"
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
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium mb-1"
                  >
                    {stateLabel} <span className="text-error">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="state"
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
                <label
                  htmlFor="industry"
                  className="block text-sm font-medium mb-1"
                >
                  Industry <span className="text-error">*</span>
                </label>
                <input
                  id="industry"
                  type="text"
                  name="industry"
                  required
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Example: Education"
                  className="block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>

              <div className="w-full flex-2 sm:min-w-96">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  LinkedIn <span className="text-error">*</span>
                </label>
                <div className="mt-2 flex">
                  <div className="hidden sm:flex shrink-0 items-center rounded-l-md bg-base-100 px-3 text-base text-base-content/50 outline-1 -outline-offset-1 outline-base-300 sm:text-sm/6">
                    https://www.linkedin.com/in/
                  </div>
                  <div className="flex sm:hidden shrink-0 items-center rounded-l-md bg-base-100 px-3 text-base text-base-content/50 outline-1 -outline-offset-1 outline-base-300 sm:text-sm/6">
                    linkedin.com/in/
                  </div>
                  <input
                    id="username"
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
              <label
                htmlFor="expertise"
                className="block text-sm font-medium mb-1"
              >
                Any additional details you would like to share?
              </label>
              <input
                id="expertise"
                type="text"
                name="expertise"
                value={formData.expertise}
                onChange={handleChange}
                className="block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
              />
            </div>
          </div>
        </section>

        {/* Audience & Location Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            Audience & Presentation Location Details
          </h2>

          <div className="space-y-4">
            <fieldset>
              <legend className="block text-sm font-medium mb-1">
                Do you already have an audience in mind?
                <span className="text-error">*</span>
              </legend>
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
            </fieldset>

            {formData.hasAudience === "yes" && (
              <>
                <div>
                  <label
                    htmlFor="expectedAttendees"
                    className="block text-sm font-medium mb-1"
                  >
                    Expected Number of Attendees?
                  </label>
                  <input
                    id="expectedAttendees"
                    type="number"
                    name="expectedAttendees"
                    min="0"
                    placeholder="10"
                    value={formData.expectedAttendees}
                    onChange={handleChange}
                    className="block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                  />
                </div>

                <div>
                  <label
                    htmlFor="locationDetails"
                    className="block text-sm font-medium mb-1"
                  >
                    Any additional details you would like to share?
                  </label>
                  <input
                    id="locationDetails"
                    name="locationDetails"
                    type="text"
                    value={formData.locationDetails}
                    placeholder="Example: Teacher at XYZ High School or Coach of ABC baseball team."
                    onChange={handleChange}
                    className="block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                  />
                </div>

                <fieldset>
                  <legend className="block text-sm font-medium mb-1">
                    Do you need permission to present to this group?
                    <span className="text-error">*</span>
                  </legend>
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
                </fieldset>

                <div>
                  <label
                    htmlFor="locationType"
                    className="block text-sm font-medium mb-1"
                  >
                    What is the location you plan to present at?
                    <span className="text-error">*</span>
                  </label>
                  <div className="mt-2 grid grid-cols-1">
                    <select
                      id="locationType"
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
                    <label
                      htmlFor="locationTypeOther"
                      className="block text-sm font-medium mb-1"
                    >
                      Please specify:
                    </label>
                    <input
                      id="locationTypeOther"
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
        </section>

        {/* Time Frame */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Time Frame</h2>

          <div>
            <label
              htmlFor="timeframe"
              className="block text-sm font-medium mb-1"
            >
              Expected presentation timeframe{" "}
              <span className="text-error">*</span>
            </label>
            <div className="mt-2 grid grid-cols-1">
              <select
                id="timeframe"
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
        </section>

        {/* Legal Acknowledgment */}
        <section ref={disclaimerRef}>
          <div className="flex sm:flex-row flex-col gap-4 items-center mb-4">
            <h2 className="text-xl font-semibold">Legal Acknowledgment</h2>
            <Link
              href="/legal"
              target="_blank"
              className="text-sm text-base-content/70"
            >
              Learn more
            </Link>
          </div>

          <div className="space-y-4">
            <div
              onScroll={handleDisclaimerScroll}
              className="p-4 rounded-md border border-base-300 bg-base-100 h-32 overflow-y-auto space-y-4 relative"
            >
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

            {!hasScrolledToBottom && (
              <p className="text-sm text-warning">
                Please scroll to the bottom of the disclaimer to continue
              </p>
            )}

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="acknowledgement"
                  required
                  checked={formData.acknowledgement}
                  onChange={handleCheckbox}
                  disabled={!hasScrolledToBottom}
                  className="mr-2 checkbox checkbox-sm checkbox-neutral disabled:opacity-50"
                />
                <span className="text-sm">
                  I acknowledge that I have read and agree to the disclaimer
                  above. <span className="text-error">*</span>
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="pt-4 space-y-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary rounded border border-primary disabled:bg-base-200 disabled:border-base-300 disabled:cursor-not-allowed transition-colors"
            disabled={loading || !isFormValid}
          >
            {loading ? "Submitting Response..." : "Submit"}
          </button>

          {!isFormValid && (
            <div className="px-2 py-1 text-center text-sm text-warning border border-warning/20 bg-warning/5 rounded-lg">
              <p>
                {!hasScrolledToBottom
                  ? "Please scroll through the disclaimer and check all required fields"
                  : "Please complete all required fields"}{" "}
                <span className="text-error">*</span>
              </p>
            </div>
          )}
        </div>

        <Link
          href="/privacy"
          target="_blank"
          className="mx-auto text-base-content/50 hover:text-base-content text-sm text-center block"
        >
          Privacy Policy
        </Link>
      </form>
    </div>
  );
}
