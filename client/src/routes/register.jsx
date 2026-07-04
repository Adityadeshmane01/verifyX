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
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters")
});

export const Route = createFileRoute("/register")({
  beforeLoad: async ({ context }) => {
    const user = context.queryClient.getQueryData(["currentUser"]);
    if (user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  head: () => ({
    meta: [{
      title: "Create account — VerifyX"
    }]
  }),
  component: RegisterPage
});

function RegisterPage() {
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
      const user = await apiFetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(v)
      });
      await queryClient.setQueryData(["currentUser"], user);
      toast.success(`Account created for ${user.name}`);
      nav({
        to: "/dashboard"
      });
    } catch (err) {
      toast.error(err.message || "Registration failed");
    }
  };

  return <AuthCard title="Create your workspace" subtitle="Start verifying with 100 free checks." footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jane Cooper" {...register("name")} />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" {...register("password")} />
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <GlowButton type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating account…" : "Create account"}
        </GlowButton>
      </form>
    </AuthCard>;
}