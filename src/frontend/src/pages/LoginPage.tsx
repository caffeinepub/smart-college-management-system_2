import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { GraduationCap, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const ROLES = [
  { id: "admin", label: "Admin", hint: "admin / admin123" },
  { id: "teacher", label: "Teacher", hint: "teacher / teacher123" },
  { id: "security", label: "Security", hint: "security / security123" },
  { id: "student", label: "Student", hint: "student / student123" },
];

export function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState("admin");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const hint = ROLES.find((r) => r.id === role)?.hint || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    const result = login(username, password);
    if (!result.success) {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-card border-border">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4">
              <GraduationCap size={28} className="text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">Smart College</CardTitle>
            <CardDescription>
              Management System — Sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-5">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Select Role
              </Label>
              <Tabs value={role} onValueChange={setRole}>
                <TabsList
                  className="grid grid-cols-4 w-full"
                  data-ocid="login.role.tab"
                >
                  {ROLES.map((r) => (
                    <TabsTrigger key={r.id} value={r.id} className="text-xs">
                      {r.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Hint: {hint}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  data-ocid="login.username.input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  data-ocid="login.password.input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              {error && (
                <p
                  className="text-sm text-destructive"
                  data-ocid="login.error_state"
                >
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-ocid="login.submit_button"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-muted-foreground mt-6">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
