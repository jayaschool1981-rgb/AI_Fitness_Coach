import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function POST(req: Request) {
  try {
    const { plan } = await req.json(); // full plan from localStorage

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 800;

    function write(line: string, size = 12) {
      page.drawText(line, { x: 50, y, size, font });
      y -= size + 4;
    }

    // Branding
    write("AI Fitness Coach", 22);
    y -= 8;
    write("Personalized 7 Day Fitness Plan", 16);
    y -= 20;

    // Loop days
    for (const day of plan.days) {
      write(`Day ${day.day}`, 16);
      y -= 4;
      write("Workout:", 14);

      for (const ex of day.workout) {
        write(`• ${ex.name} — ${ex.sets}x${ex.reps} (rest ${ex.rest_seconds}s)`);
      }

      y -= 8;
      write("Diet:", 14);

      for (const meal of day.diet) {
        write(`• ${meal.name} — ${meal.calories} kcal`);
      }

      y -= 20;
    }

    write("Tips:", 14);
    for (const t of plan.tips) write(`• ${t}`);

    y -= 10;
    write("Motivation:", 14);
    write(plan.motivation);

    const pdfBytes = await pdfDoc.save();
const uint8 = new Uint8Array(pdfBytes);

return new NextResponse(uint8, {

      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=plan.pdf",
      },
    });

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
