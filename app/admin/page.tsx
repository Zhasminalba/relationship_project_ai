import { env } from "cloudflare:workers";
import { requireChatGPTUser } from "@/app/chatgpt-auth";

export const dynamic = "force-dynamic";

type ResultRow = {
  id: string;
  partner_a: string;
  partner_b: string;
  compatibility: number;
  score_a: number;
  score_b: number;
  archetype: string;
  green_partner: string;
  red_partner: string;
  created_at: number;
};

export default async function AdminPage() {
  const user = await requireChatGPTUser("/admin");
  if (user.email.toLowerCase() !== "zoludiek@gmail.com") {
    return (
      <main className="min-h-screen bg-[#fff8fa] p-8 text-[#30272b]">
        <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-3xl font-bold">Доступ закрыт</h1>
          <p className="mt-3 text-zinc-600">Эта страница доступна только администратору проекта.</p>
          <a className="mt-6 inline-block rounded-full bg-[#30272b] px-5 py-3 font-semibold text-white" href="/">На главную</a>
        </section>
      </main>
    );
  }

  const results = await env.DB.prepare(`
    SELECT id, partner_a, partner_b, compatibility, score_a, score_b,
           archetype, green_partner, red_partner, created_at
    FROM test_results
    ORDER BY created_at DESC
    LIMIT 250
  `).all<ResultRow>();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#fff4f7] to-[#eefbff] p-4 text-[#30272b] sm:p-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-widest text-[#9b6977]">Relationship AI Test</p><h1 className="mt-2 text-4xl font-bold">Результаты прохождений</h1><p className="mt-2 text-zinc-600">Хранятся только итоги — личные ответы не записываются.</p></div>
          <a className="rounded-full bg-[#30272b] px-5 py-3 font-semibold text-white" href="/">На сайт</a>
        </div>
        <div className="overflow-x-auto rounded-3xl bg-white shadow-xl">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#30272b] text-white"><tr><th className="p-4">Дата</th><th className="p-4">Пара</th><th className="p-4">Совместимость</th><th className="p-4">Баллы</th><th className="p-4">Тип пары</th><th className="p-4">Green flag</th><th className="p-4">Red flag</th></tr></thead>
            <tbody>{results.results.map((row) => <tr key={row.id} className="border-b border-zinc-100 last:border-0"><td className="p-4 whitespace-nowrap">{new Date(row.created_at).toLocaleString("ru-RU", { timeZone: "Asia/Almaty" })}</td><td className="p-4 font-semibold">{row.partner_a} + {row.partner_b}</td><td className="p-4 text-lg font-bold">{row.compatibility}%</td><td className="p-4">{row.score_a}% / {row.score_b}%</td><td className="p-4">{row.archetype}</td><td className="p-4">{row.green_partner}</td><td className="p-4">{row.red_partner}</td></tr>)}</tbody>
          </table>
          {!results.results.length && <p className="p-10 text-center text-zinc-500">Пока нет сохранённых прохождений.</p>}
        </div>
      </section>
    </main>
  );
}
