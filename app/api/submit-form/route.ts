export async function POST(request: Request) {
  const data = await request.json();

  if (!data.email || !data.firstName || !data.lastName) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const response = await fetch(process.env.GOOGLE_SCRIPT_URL!, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    return Response.json({ error: "Failed to submit form" }, { status: 500 });
  }

  return Response.json({ success: true });
}
