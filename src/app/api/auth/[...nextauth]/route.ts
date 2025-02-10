import NextAuth from "next-auth/next";
import { authOptions } from "@/../../kitwek-australia/auth.config";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };