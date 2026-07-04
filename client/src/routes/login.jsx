import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthCard } from "../features/auth/AuthCard";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { GlowButton } from "../components/common/GlowButton";
import { apiFetch } from "../lib/api";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "At least 6 characters")
});

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ context }) => {
    const user = context.queryClient.getQueryData(["currentUser"]);
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [{
      title: "Login — VerifyX"
    }]
  }),
  component: LoginPage
});

function LoginPage() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    }
  } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async v => {
    try {
      const user = await apiFetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(v)
      });
      await queryClient.setQueryData(["currentUser"], user);
      toast.success(`Welcome back, ${user.name}`);
      nav({
        to: "/dashboard"
      });
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    }
  };

  return <AuthCard title="Welcome back" subtitle="Sign in to your VerifyX workspace." footer={<>New here? <Link to="/register" className="text-primary hover:underline">Create an account</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <GlowButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </GlowButton>
      </form>
    </AuthCard>;
}