export async function POST(request: Request) {
  const reqBody = await request.json();

  return Response.json({
    req: reqBody,
  });
}
