import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    membershipStatus: string;
  }

  interface Session {
    user: User & {
      membershipStatus: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    membershipStatus: string;
  }
}