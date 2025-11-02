"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  name: z.string().optional(),
  age: z.coerce.number().int().min(12).max(80),
  gender: z.string().optional(),
  heightCm: z.coerce.number().min(120).max(230).optional(),
  weightKg: z.coerce.number().min(30).max(250).optional(),
  goal: z.string(),
  level: z.string(),
  location: z.string(),
  diet: z.string(),
  notes: z.string().optional(),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(formData: FormData) {
  try {
    setLoading(true);
    const raw = Object.fromEntries(formData.entries());
    const parsed = schema.parse(raw);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed");

    /** IMPORTANT: reply is already JSON string */
    localStorage.setItem("plan", data.reply);

    router.push("/plan");

  } catch (e: any) {
    toast.error(e.message ?? "Something went wrong");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">AI Fitness Coach</h1>
        <p className="text-muted-foreground">Get your personalized 7-day workout and diet plan.</p>
      </div>

      <form action={onSubmit} className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">

            <div>
              <Label htmlFor="name">Name</Label>
              <Input name="name" id="name" placeholder="Om" />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input name="age" id="age" type="number" required />
            </div>

            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select name="gender">
                <SelectTrigger id="gender"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="heightCm">Height (cm)</Label>
              <Input name="heightCm" id="heightCm" type="number" />
            </div>

            <div>
              <Label htmlFor="weightKg">Weight (kg)</Label>
              <Input name="weightKg" id="weightKg" type="number" />
            </div>

            <div>
              <Label htmlFor="goal">Goal</Label>
              <Select name="goal" required>
                <SelectTrigger id="goal"><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="general_fitness">General Fitness</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Level</Label>
              <Select name="level" required>
                <SelectTrigger id="level"><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Workout Location</Label>
              <Select name="location" required>
                <SelectTrigger id="location"><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="gym">Gym</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="diet">Diet Preference</Label>
              <Select name="diet" required>
                <SelectTrigger id="diet"><SelectValue placeholder="Choose" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="veg">Veg</SelectItem>
                  <SelectItem value="non-veg">Non-Veg</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Label htmlFor="notes">Medical history / notes</Label>
              <Textarea id="notes" name="notes" placeholder="e.g., knee pain, lactose intolerance" />
            </div>

          </CardContent>
        </Card>

        <div className="md:col-span-2 flex gap-4">
          <Button type="submit" disabled={loading}>{loading ? "Generating…" : "Generate Plan"}</Button>
          <Button type="reset" variant="secondary">Reset</Button>
        </div>
      </form>
    </div>
  );
}
