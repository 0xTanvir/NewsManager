import { redirect } from "next/navigation";

export default function Home() {
  // This ensures anyone hitting the root gets redirected
  redirect("/dashboard");
}
