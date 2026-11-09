import { env } from "cloudflare:workers";
import { getChatGPTUser } from "@/app/chatgpt-auth";

type ResultInput = {
  partnerA: string;
  partnerB: string;
  compatibility: number;
  scoreA: number;
  scoreB: number;
  archetype: string;
  greenPartner: string;
  redPartner: string;
};

const cleanText = (value: unknown, max: number) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const cleanScore = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100, Math.round(number))) : null;
};

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ saved: false, reason: "sign_in_required" }, { status: 401 });

  let body: Partial<ResultInput>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ saved: false, reason: "invalid_json" }, { status: 400 });
  }

  const partnerA = cleanText(body.partnerA, 40);
  const partnerB = cleanText(body.partnerB, 40);
  const archetype = cleanText(body.archetype, 120);
  const greenPartner = cleanText(body.greenPartner, 40);
  const redPartner = cleanText(body.redPartner, 40);
  const compatibility = cleanScore(body.compatibility);
  const scoreA = cleanScore(body.scoreA);
  const scoreB = cleanScore(body.scoreB);
  if (!partnerA || !partnerB || !archetype || !greenPartner || !redPartner || compatibility === null || scoreA === null || scoreB === null) {
    return Response.json({ saved: false, reason: "invalid_result" }, { status: 400 });
  }

  await env.DB.prepare(`
    INSERT INTO test_results
      (id, user_id, partner_a, partner_b, compatibility, score_a, score_b, archetype, green_partner, red_partner, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    crypto.randomUUID(), user.userId, partnerA, partnerB, compatibility, scoreA, scoreB,
    archetype, greenPartner, redPartner, Date.now(),
  ).run();

  return Response.json({ saved: true });
}
