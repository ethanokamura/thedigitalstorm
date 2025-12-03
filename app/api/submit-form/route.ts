// app/api/submit-form/route.ts
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Validate required fields
    if (
      !data.firstName ||
      !data.lastName ||
      !data.email ||
      !data.industry ||
      !data.country ||
      !data.username ||
      !data.hasAudience ||
      !data.timeframe ||
      !data.acknowledgement ||
      !data.recaptchaToken
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Verifying reCAPTCHA token...");

    // Verify reCAPTCHA token
    const recaptchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          secret: process.env.RECAPTCHA_SECRET_KEY!,
          response: data.recaptchaToken,
        }),
      }
    );

    const recaptchaResult = await recaptchaResponse.json();
    console.log("reCAPTCHA verification result:", recaptchaResult);

    // Check if verification was successful
    if (!recaptchaResult.success) {
      console.error("reCAPTCHA verification failed:", recaptchaResult);
      return Response.json(
        {
          error: "reCAPTCHA verification failed",
          details: recaptchaResult["error-codes"],
        },
        { status: 403 }
      );
    }

    // Check score (v3 returns a score from 0.0 to 1.0)
    if (recaptchaResult.score < 0.5) {
      console.log("reCAPTCHA score too low:", recaptchaResult.score);
      return Response.json(
        {
          error: "reCAPTCHA score too low",
          score: recaptchaResult.score,
        },
        { status: 403 }
      );
    }

    console.log(
      "reCAPTCHA verified successfully, score:",
      recaptchaResult.score
    );

    // Forward to Google Apps Script
    console.log("Submitting to Google Sheets...");
    const response = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log("Google Script Response:", responseText);

    if (!response.ok) {
      console.error("Google Script Error:", responseText);
      return Response.json(
        {
          error: "Failed to submit form",
          details: responseText,
        },
        { status: 500 }
      );
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Server error:", error);
    return Response.json(
      {
        error: "Server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
