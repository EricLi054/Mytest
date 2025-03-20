import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

const ensureValidSession = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/signIn");
  }
};

export default ensureValidSession;
