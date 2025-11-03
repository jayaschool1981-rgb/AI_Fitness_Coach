"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const p = localStorage.getItem("plan");
    if (!p) return;
    try {
      setPlan(JSON.parse(p));
    } catch (e) {
      console.error("cannot parse plan JSON");
    }
  }, []);

  if (!plan || !plan.days) return <div className="p-6 text-lg">No plan loaded yet.</div>;

  async function downloadPDF() {
    const res = await fetch("/api/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plan.pdf";
    a.click();
  }

  function resetPlan() {
    localStorage.removeItem("plan");
    router.push("/");
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your AI Fitness Plan (7 Days)</h1>

        <div className="flex gap-3">
          <Button variant="destructive" onClick={resetPlan}>Reset Plan</Button>
          <Button onClick={downloadPDF}>Download PDF (A4)</Button>
        </div>
      </div>

      {plan.days.map((day: any, i: number) => (
        <Card key={i} className="border border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle>Day {day.day}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">

            <div>
              <h3 className="font-semibold text-xl">Workout</h3>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                {day.workout.map((ex: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-medium">{ex.name}</span> — {ex.sets} sets x {ex.reps} reps, rest {ex.rest_seconds}s
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-xl">Diet</h3>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                {day.diet.map((m: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-medium">{m.name}</span> — {m.calories} kcal, protein {m.protein_g}g, carbs {m.carbs_g}g, fats {m.fats_g}g
                  </li>
                ))}
              </ul>
            </div>

          </CardContent>
        </Card>
      ))}

      <Card className="border border-primary/20 shadow-md">
        <CardHeader><CardTitle>Tips</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc ml-6 space-y-1">
            {plan.tips.map((t: string, i: number) => <li key={i}>{t}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card className="border border-primary/20 shadow-md">
        <CardHeader><CardTitle>Motivation</CardTitle></CardHeader>
        <CardContent>
          <p className="text-lg font-semibold">{plan.motivation}</p>
        </CardContent>
      </Card>
    </div>
  );
}
