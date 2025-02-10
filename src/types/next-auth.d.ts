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
    update: (data?: any) => Promise<void>; // Add the update function
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    membershipStatus: string;
  }
}