import { Lobster } from "next/font/google";

const lobster = Lobster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Title({ className }: { className?: string }) {
  return <h1 className={`${lobster.className} ${className}`}>BlogType</h1>;
}
