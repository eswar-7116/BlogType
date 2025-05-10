export default function VerifyLinkMail({
  link,
  name,
}: {
  link: string;
  name: string;
}) {
  return (
    <div className="font-sans text-gray-800 p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">
        Welcome to BlogType!
      </h2>

      <p className="mb-4">Hi {name},</p>

      <p className="mb-6">
        Thanks for signing up! BlogType is your new home for creating and
        sharing amazing content. To get started, please verify your email
        address by clicking the button below:
      </p>

      <table
        role="presentation"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        style={{ marginTop: "20px" }}
      >
        <tr>
          <td
            align="center"
            style={{ borderRadius: "6px", backgroundColor: "#4f46e5" }}
          >
            <a
              href={link}
              target="_blank"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                fontSize: "16px",
                color: "#ffffff",
                textDecoration: "none",
                borderRadius: "6px",
                backgroundColor: "#4f46e5",
                fontWeight: "bold",
              }}
            >
              Verify Email
            </a>
          </td>
        </tr>
      </table>

      <p className="text-sm text-gray-600 mb-2">
        If you didn&apos;t request this, you can safely ignore this email.
      </p>
    </div>
  );
}
