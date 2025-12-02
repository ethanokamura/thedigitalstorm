"use client";

import { useState } from "react";
import { FaCaretDown, FaEnvelope } from "react-icons/fa";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

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
    hasLocation: "",
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
      }),
    });

    if (response.ok) {
      setComplete(true);
    } else {
      const error = await response.json();
      console.error("Form submission failed:", error);
    }
  };

  const showStateSelection =
    formData.country === "United States" || formData.country === "Canada";
  const stateOptions =
    formData.country === "United States" ? US_STATES : CANADIAN_PROVINCES;
  const stateLabel =
    formData.country === "Canada" ? "Province/Territory" : "State";

  return complete ? (
    <button className="btn">[Download Presentation]</button>
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
            <div className="flex gap-4">
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
            <div className="flex gap-4">
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
            <div className="flex gap-4">
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
                  placeholder="Education"
                  className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
                />
              </div>

              <div className="w-full flex-2 min-w-96">
                <label className="block text-sm font-medium mb-1">
                  LinkedIn
                  <span className="text-error">*</span>
                </label>
                <div className="mt-2 flex">
                  <div className="flex shrink-0 items-center rounded-l-md bg-base-100 px-3 text-base text-base-content/50 outline-1 -outline-offset-1 outline-base-300 sm:text-sm/6">
                    https://www.linkedin.com/in/
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
                Your Expertise on Presenting to Middle and High Schoolers? Or
                Other Expertise? <span className="text-error">*</span>
              </label>
              <textarea
                name="expertise"
                required
                value={formData.expertise}
                onChange={handleChange}
                rows={3}
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
                Do you already have location(s) in mind to present at?
                <span className="text-error">*</span>
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasLocation"
                    value="yes"
                    required
                    checked={formData.hasLocation === "yes"}
                    onChange={handleChange}
                    className="mr-2 radio radio-xs"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="hasLocation"
                    value="no"
                    required
                    checked={formData.hasLocation === "no"}
                    onChange={handleChange}
                    className="mr-2 radio radio-xs"
                  />
                  No
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Type of location you plan to present at?
                <span className="text-error">*</span>
              </label>
              <div className="mt-2 grid grid-cols-1">
                <select
                  name="locationType"
                  required
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
            <div>
              <label className="block text-sm font-medium mb-1">
                Tell us about your access to this location.
              </label>
              <textarea
                name="locationDetails"
                value={formData.locationDetails}
                placeholder="Example: Teacher at XYZ High School or Coach of ABC baseball team."
                onChange={handleChange}
                rows={4}
                className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Do you need authorization to present at this location?
                <span className="text-error">*</span>
              </label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="needsAuthorization"
                    value="yes"
                    required
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
                    required
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
                Expected Number of Attendees
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
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Help & Support</h2>
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-1">
              Additional Details and Support
            </label>
            <textarea
              name="otherDetails"
              value={formData.otherDetails}
              onChange={handleChange}
              placeholder="Please share any other details you think we might find helpful. We are trying to learn about the people, locations and audiences."
              rows={4}
              className="col-start-1 row-start-1 block w-full rounded-md bg-base-100 py-2 px-3 text-base text-base-content outline-1 -outline-offset-1 outline-base-300 placeholder:text-base-content/70 focus:outline-2 focus:-outline-offset-2 focus:outline-primary sm:text-sm/6"
            />
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
          <h2 className="text-xl font-semibold mb-4">Legal Acknowledgment</h2>

          <div className="space-y-4">
            <div className="p-4 h-fit rounded-md border border-warning/30 bg-warning/10">
              <p className="text-sm text-warning/90">
                <strong className="text-warning">Disclaimer:</strong> By
                submitting this form, you acknowledge that all information
                provided is accurate and complete to the best of your knowledge.
                You agree to comply with all applicable policies and regulations
                related to presenting at the specified location.
              </p>
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

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-base-100 rounded"
          >
            Submit
          </button>
        </div>

        <button className="mx-auto text-base-content/50 hover:text-base-content text-sm">
          View Privacy Policy
        </button>
      </form>
    </div>
  );
}
