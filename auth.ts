import NextAuth from "next-auth";
import type {NextAuthConfig} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Email from "next-auth/providers/email";
import {PrismaAdapter} from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import {prisma} from "@/lib/prisma";
import type {Plan, Role} from "@prisma/client";

type JWTSessionRole = Role;

type JWTSession = {
  userId: string;
  tenantId: string;
  role: JWTSessionRole;
  tenantSlug: string;
  tenantName: string;
  plan: Plan;
};

async function resolveTenantFromRequest(request: Request) {
  const url = new URL(request.url);
  const hostname = url.hostname.toLowerCase();
  const searchParams = url.searchParams;

  if (hostname === "localhost" || hostname.startsWith("127.0.0.1")) {
    const headerTenant = request.headers.get("x-tenant");
    const queryTenant = searchParams.get("tenant");

    const slug = headerTenant ?? queryTenant;

    if (!slug) {
      return null;
    }

    const tenant = await prisma.tenant.findUnique({
      where: {slug},
    });

    return tenant;
  }

  if (hostname.endsWith(".tripsaas.com")) {
    const parts = hostname.split(".");

    if (parts.length >= 3) {
      const slug = parts[0];

      const tenant = await prisma.tenant.findUnique({
        where: {slug},
      });

      return tenant;
    }
  }

  const tenantByDomain = await prisma.tenant.findUnique({
    where: {domain: hostname},
  });

  return tenantByDomain;
}

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    newUser: "/auth/register",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).toLowerCase();

        const tenant = await resolveTenantFromRequest(request);

        const user = await prisma.user.findFirst({
          where: {
            email,
          },
          include: {
            tenant: true,
          },
        });

        if (!user || !user.tenant.isActive) {
          return null;
        }

        const passwordValid = await bcrypt.compare(String(credentials.password), user.hashedPassword);

        if (!passwordValid) {
          return null;
        }

        if (tenant && user.tenantId !== tenant.id) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          tenantId: user.tenantId,
          tenantSlug: user.tenant.slug,
          tenantName: user.tenant.name,
          role: user.role,
          plan: user.tenant.plan,
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST ?? "",
        port: Number(process.env.EMAIL_SERVER_PORT ?? "587"),
        auth: {
          user: process.env.EMAIL_SERVER_USER ?? "",
          pass: process.env.EMAIL_SERVER_PASSWORD ?? "",
        },
      },
      from: process.env.EMAIL_FROM ?? "",
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        const userId = typeof user.id === "string" ? user.id : token.sub;

        if (!userId) {
          return token;
        }

        const dbUser = await prisma.user.findUnique({
          where: {id: userId},
          include: {
            tenant: true,
          },
        });

        if (!dbUser || !dbUser.tenant) {
          return token;
        }

        const payload: JWTSession = {
          userId: dbUser.id,
          tenantId: dbUser.tenantId,
          role: dbUser.role,
          tenantSlug: dbUser.tenant.slug,
          tenantName: dbUser.tenant.name,
          plan: dbUser.tenant.plan,
        };

        return {
          ...token,
          ...payload,
        };
      }

      return token;
    },
    async session({session, token}) {
      if (session.user) {
        const user = session.user as any;
        user.id = token.userId;
        user.tenantId = token.tenantId;
        user.role = token.role;
        user.tenantSlug = token.tenantSlug;
        user.tenantName = token.tenantName;
        user.plan = token.plan;
      }

      return session;
    },
    async signIn({user}) {
      const dbUser = await prisma.user.findUnique({
        where: {id: String(user.id)},
        include: {tenant: true},
      });

      if (!dbUser || !dbUser.tenant.isActive) {
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;

export const {auth, handlers, signIn, signOut} = NextAuth(authConfig);
