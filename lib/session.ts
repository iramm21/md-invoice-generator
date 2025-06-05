import { getServerSession } from "next-auth";
import { authConfig } from "./auth";

export const requireSession = async () => {
  const session = await getServerSession(authConfig);

  if (!session?.user?.id) {
    console.error("🔒 No session found in requireSession()");
    throw new Error("Unauthorized");
  }

  return session;
};
