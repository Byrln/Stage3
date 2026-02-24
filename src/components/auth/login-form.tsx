"use client";

import {useTransition} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {signIn} from "next-auth/react";
import {sileo} from "sileo";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  async function handleSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl,
      });

      if (result?.error) {
        sileo.error({
          title: "Unable to sign in",
          description: result.error,
        });

        return;
      }

      sileo.success({
        title: "Welcome back",
      });
      router.push(callbackUrl);
    });
  }

  return (
    <form
      className="space-y-6 rounded-2xl border border-neutral-200/80 bg-white/80 p-6 shadow-lg shadow-emerald-500/10 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90"
      onSubmit={form.handleSubmit(handleSubmit)}
    >
      <div className="space-y-2">
        <h2 className="font-heading text-2xl tracking-tight">Sign in</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Access your Tripsaas workspace</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Email</label>
          <input
            type="email"
            autoComplete="email"
            className="h-10 w-full rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-rose-500">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-neutral-800 dark:text-neutral-100">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            className="h-10 w-full rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-rose-500">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <label className="inline-flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              {...form.register("rememberMe")}
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            className="text-xs font-medium text-primary-600 hover:text-primary-500"
            onClick={() => router.push("./forgot-password")}
          >
            Forgot password?
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center rounded-full bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-offset-neutral-950"
        >
          {isPending ? "Signing in..." : "Sign in"}
        </button>

        <button
          type="button"
          disabled={isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800 dark:focus-visible:ring-offset-neutral-950"
          onClick={() => {
            startTransition(async () => {
              await signIn("google");
            });
          }}
        >
          <span className="h-4 w-4 rounded-full bg-white shadow-sm" />
          <span>Continue with Google</span>
        </button>
      </div>

      <p className="text-center text-xs text-neutral-500 dark:text-neutral-400">
        <span>New to Tripsaas?</span>{" "}
        <button
          type="button"
          className="font-medium text-primary-600 hover:text-primary-500"
          onClick={() => router.push("./register")}
        >
          Create an account
        </button>
      </p>
    </form>
  );
}
