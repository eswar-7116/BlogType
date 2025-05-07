import { Resend } from "resend";
import VerifyLinkMail from "./templates/verifyLinkMail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerifyLink(
  toMail: string,
  link: string,
  name: string
) {
  await resend.emails.send({
    from: "BlogType <onboarding@resend.dev>",
    to: toMail,
    subject: "BlogType Email Verification",
    react: <VerifyLinkMail link={link} name={name} />,
  });
  console.log("Sent verification link to", toMail);
}
