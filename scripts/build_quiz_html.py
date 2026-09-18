#!/usr/bin/env python3
"""Build quiz.html from quiz_parts/gift/*.txt (GIFT format)."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GIFT_DIR = ROOT / "quiz_parts" / "gift"
OUT = ROOT / "quiz.html"

SECTIONS = [
    ("01-cli-basics.txt", "§1", "CLI основи"),
    ("02-safety.txt", "§2", "Безпека"),
    ("03-interface.txt", "§3", "Інтерфейси"),
    ("04-ip-firewall.txt", "§4", "IP і Firewall"),
    ("05-vpn-cert.txt", "§5", "VPN і сертифікати"),
    ("06-daily-practice.txt", "§6", "Щоденна практика"),
]


def parse_gift(text: str) -> list[dict]:
    questions = []
    blocks = re.split(r"\n(?=::)", text.strip())
    for block in blocks:
        if not block.strip():
            continue
        m = re.match(r"::(.+?)::\s*\n(.*)", block, re.DOTALL)
        if not m:
            continue
        title = m.group(1).strip()
        rest = m.group(2).strip()
        bs, be = rest.find("{"), rest.rfind("}")
        if bs < 0 or be < 0:
            continue
        qtext = rest[:bs].strip()
        body = rest[bs + 1 : be]
        correct = ""
        wrong: list[str] = []
        feedback = ""
        for line in body.splitlines():
            line = line.strip()
            if not line:
                continue
            if line.startswith("="):
                correct = line[1:].strip()
            elif line.startswith("~"):
                wrong.append(line[1:].strip())
            elif line.startswith("####"):
                feedback = line[4:].strip()
        if correct and qtext:
            opts = [{"text": correct, "correct": True}]
            for w in wrong[:2]:
                opts.append({"text": w, "correct": False})
            while len(opts) < 3:
                opts.append({"text": "—", "correct": False})
            questions.append(
                {"title": title, "question": qtext, "options": opts, "feedback": feedback}
            )
    return questions


def place_correct(questions: list[dict], start: int) -> int:
    """FR-19: GIFT пише правильну відповідь першою. Ставимо її по черзі на позиції 0/1/2
    (детерміновано, щоб частка кожної позиції була ~33 %); на екрані варіанти ще й перемішуються."""
    n = start
    for q in questions:
        correct = [o for o in q["options"] if o["correct"]]
        wrong = [o for o in q["options"] if not o["correct"]]
        pos = n % 3
        q["options"] = wrong[:pos] + correct + wrong[pos:]
        n += 1
    return n


def load_data() -> list[dict]:
    sections = []
    counter = 0
    for fname, timecode, label in SECTIONS:
        path = GIFT_DIR / fname
        slug = fname.replace(".txt", "")
        qs = parse_gift(path.read_text(encoding="utf-8"))
        counter = place_correct(qs, counter)
        sections.append(
            {"id": slug, "file": fname, "timecode": timecode, "label": label, "questions": qs}
        )
    return sections


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Банк питань — MikroTik RouterOS CLI</title>
  <style>
    :root {
      --bg: #0d1117; --panel: #161b22; --border: #30363d; --text: #e6edf3;
      --muted: #8b949e; --green: #3fb950; --cyan: #39c5cf; --yellow: #d29922;
      --accent: #00a0e0; --blue: #58a6ff; --purple: #a371f7; --red: #f85149;
      --font: "SF Mono", Menlo, Consolas, monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh;
      background: radial-gradient(1200px 600px at 10% -10%, #0a2a3d 0%, var(--bg) 55%);
      color: var(--text); font-family: Inter, system-ui, sans-serif;
    }
    .wrap { max-width: 1100px; margin: 0 auto; padding: 20px; }
    :focus-visible { outline: 2px solid var(--cyan); outline-offset: 2px; }
    .skip-link { position: absolute; left: -9999px; top: 8px; background: var(--panel); color: var(--cyan); padding: 8px 12px; border-radius: 8px; z-index: 200; }
    .skip-link:focus { left: 8px; }
    .top-nav {
      display: flex; gap: 10px; align-items: center; margin-bottom: 16px; flex-wrap: wrap;
      padding-bottom: 12px; border-bottom: 1px solid var(--border);
    }
    .top-nav a {
      color: var(--muted); text-decoration: none; font-size: 0.88rem;
      padding: 6px 12px; border-radius: 8px; border: 1px solid transparent;
    }
    .top-nav a:hover { color: var(--text); background: #21262d; }
    .top-nav a.active {
      color: var(--accent); border-color: var(--accent);
      background: rgba(0, 160, 224, 0.12);
    }
    header h1 { font-size: 1.25rem; margin: 0 0 6px; }
    header p { margin: 0 0 14px; color: var(--muted); font-size: 0.9rem; line-height: 1.5; }
    .layout { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 14px; }
    @media (max-width: 860px) { .layout { grid-template-columns: minmax(0, 1fr); } .sidebar { order: 2; } }
    .sidebar, .main-panel {
      background: var(--panel); border: 1px solid var(--border); border-radius: 12px; min-width: 0;
    }
    .sidebar { padding: 14px; }
    .sidebar h2 {
      font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--muted); margin: 0 0 10px;
    }
    .sec-list { list-style: none; padding: 0; margin: 0 0 12px; }
    .sec-btn {
      width: 100%; padding: 7px 8px; border-radius: 6px; cursor: pointer; font-size: 0.8rem;
      display: flex; justify-content: space-between; gap: 6px; background: transparent; border: 0; color: var(--text); text-align: left;
    }
    .sec-btn:hover { background: #21262d; }
    .sec-btn[aria-current="true"] { background: #21262d; color: var(--accent); }
    .sec-btn.done { color: var(--green); }
    .sec-btn small { color: var(--muted); font-family: var(--font); }
    .progress { height: 6px; background: #21262d; border-radius: 99px; overflow: hidden; margin: 10px 0 6px; }
    .progress > div {
      height: 100%; background: linear-gradient(90deg, var(--accent), var(--cyan));
      width: 0%; transition: width 0.3s;
    }
    .stats { color: var(--muted); font-size: 0.78rem; margin-bottom: 12px; }
    .main-panel { padding: 18px; min-height: 480px; }
    .q-meta { color: var(--muted); font-size: 0.78rem; margin-bottom: 14px; }
    .q-meta span { color: var(--cyan); font-family: var(--font); }
    .q-card {
      border: 1px solid var(--border); border-radius: 10px; padding: 16px;
      margin-bottom: 16px; background: #0d1117;
    }
    .q-title { color: var(--purple); font-size: 0.82rem; font-weight: 600; margin-bottom: 8px; }
    .q-text { font-size: 0.95rem; line-height: 1.55; margin-bottom: 14px; overflow-wrap: anywhere; }
    .opt {
      display: block; width: 100%; text-align: left; margin-bottom: 8px;
      padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border);
      background: #161b22; color: var(--text); font-size: 0.88rem;
      cursor: pointer; line-height: 1.4; overflow-wrap: anywhere;
    }
    .opt:hover:not(:disabled) { border-color: var(--blue); background: #1c2128; }
    .opt.correct { border-color: var(--green); background: rgba(63, 185, 80, 0.12); }
    .opt.correct::after { content: " ✓"; color: var(--green); }
    .opt.wrong { border-color: var(--red); background: rgba(248, 81, 73, 0.1); }
    .opt.wrong::after { content: " ✗"; color: var(--red); }
    .opt:disabled { cursor: default; opacity: 0.95; }
    .feedback {
      margin-top: 12px; padding: 12px; border-radius: 8px;
      background: rgba(210, 153, 34, 0.1); border-left: 3px solid var(--yellow);
      color: #e6c87a; font-size: 0.86rem; line-height: 1.5; overflow-wrap: anywhere;
    }
    .feedback[hidden] { display: none; }
    .pager {
      display: flex; gap: 8px; justify-content: space-between; align-items: center;
      margin-top: 8px; flex-wrap: wrap;
    }
    .btn {
      background: #21262d; border: 1px solid var(--border); color: var(--text);
      border-radius: 8px; padding: 8px 14px; font-size: 0.82rem; cursor: pointer;
    }
    .btn:hover { background: #30363d; }
    .btn-primary { background: #0077a8; border-color: var(--accent); }
    .btn-primary:hover { background: var(--accent); color: #0d1117; }
    .btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .mode-btns { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
    .mode-btns .btn[aria-pressed="true"] { border-color: var(--blue); color: var(--blue); }
    code { font-family: var(--font); color: var(--cyan); }
    @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
  </style>
</head>
<body>
  <a class="skip-link" href="#quizArea">Перейти до питань</a>
  <div class="wrap">
    <nav class="top-nav" aria-label="Навігація курсу">
      <a href="index.html#/">← До курсу</a>
      <a href="trainer.html">Тренажер</a>
      <a href="index.html#/cheatsheet">Шпаргалка</a>
      <a href="quiz.html" class="active" aria-current="page">Банк питань (__TOTAL_Q__)</a>
    </nav>
    <header>
      <h1>Банк питань MikroTik RouterOS CLI</h1>
      <p>
        6 розділів з <code>quiz_parts/gift/</code> (формат GIFT для Moodle). Варіанти перемішуються при кожному відкритті сторінки;
        відповіді зберігаються в цьому браузері. Режим «По одному» або «Всі в розділі».
      </p>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <h2>Прогрес</h2>
        <div class="progress"><div id="progressBar"></div></div>
        <div class="stats" id="progressText" aria-live="polite">0 / 0</div>
        <h2>Розділи</h2>
        <ul class="sec-list" id="secList"></ul>
        <button type="button" class="btn" id="btnReset">Скинути відповіді</button>
      </aside>
      <section class="main-panel" id="mainPanel" aria-label="Питання">
        <div class="mode-btns">
          <button type="button" class="btn" id="btnModeOne" aria-pressed="true">По одному</button>
          <button type="button" class="btn" id="btnModeAll" aria-pressed="false">Всі в розділі</button>
        </div>
        <div id="quizArea" tabindex="-1"></div>
        <div class="pager" id="pager" hidden>
          <button type="button" class="btn" id="btnPrev">← Назад</button>
          <span class="stats" id="pagerText"></span>
          <button type="button" class="btn btn-primary" id="btnNext">Далі →</button>
        </div>
      </section>
    </div>
  </div>
  <script id="quizData" type="application/json">__QUIZ_JSON__</script>
  <script>
    const SECTIONS = JSON.parse(document.getElementById("quizData").textContent);
    const STORAGE_KEY = "cli-mikrotik-v1-quizbank";
    const state = {
      sectionIdx: 0,
      qIdx: 0,
      mode: "one",
      picked: {},   // qKey -> індекс обраного варіанта в даних (не на екрані)
      order: {}     // qKey -> порядок показу варіантів (перемішується раз на відкриття сторінки)
    };

    function esc(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }
    function fmt(s) { return esc(s).replace(/`([^`]+)`/g, "<code>$1</code>"); }
    function qKey(si, qi) { return SECTIONS[si].id + ":" + qi; }
    function isCorrect(si, qi) { const k = qKey(si, qi); return k in state.picked && !!SECTIONS[si].questions[qi].options[state.picked[k]]?.correct; }
    function shuffled(n) {
      const a = Array.from({ length: n }, (_, i) => i);
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    }
    function save() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 1, picked: state.picked })); } catch (e) { /* сховище недоступне */ }
    }
    function load() {
      try {
        const d = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
        if (d && d.picked && typeof d.picked === "object") {
          SECTIONS.forEach((s, si) => s.questions.forEach((q, qi) => {
            const k = qKey(si, qi), v = d.picked[k];
            if (Number.isInteger(v) && v >= 0 && v < q.options.length) state.picked[k] = v;
          }));
        }
      } catch (e) { /* немає збережених відповідей */ }
    }

    function updateProgress() {
      let total = 0, ans = 0, ok = 0;
      SECTIONS.forEach((s, si) => s.questions.forEach((_, qi) => {
        total++;
        if (qKey(si, qi) in state.picked) ans++;
        if (isCorrect(si, qi)) ok++;
      }));
      document.getElementById("progressBar").style.width = total ? (ok / total * 100) + "%" : "0%";
      document.getElementById("progressText").textContent = `Правильно: ${ok} / ${total} · Відповідей: ${ans}`;
      document.querySelectorAll("#secList .sec-btn").forEach((b, i) => {
        const qs = SECTIONS[i].questions;
        const done = qs.length > 0 && qs.every((_, qi) => isCorrect(i, qi));
        b.classList.toggle("done", done);
      });
    }

    function buildSidebar() {
      const ul = document.getElementById("secList");
      ul.innerHTML = SECTIONS.map((s, i) =>
        `<li><button type="button" class="sec-btn" data-i="${i}" aria-current="${i === state.sectionIdx}">
          <span>${esc(s.label)}</span><small>${s.questions.length}</small>
        </button></li>`
      ).join("");
      ul.querySelectorAll(".sec-btn").forEach(b => {
        b.addEventListener("click", () => {
          state.sectionIdx = +b.dataset.i;
          state.qIdx = 0;
          buildSidebar();
          render();
          document.getElementById("quizArea").focus();
        });
      });
    }

    // Стан картки завжди будується зі state.picked — повернення до відповіданого питання показує його відповідь.
    function renderQuestionCard(q, si, qi, container) {
      const k = qKey(si, qi);
      if (!state.order[k]) state.order[k] = shuffled(q.options.length);
      const answered = k in state.picked;
      const card = document.createElement("div");
      card.className = "q-card";
      card.innerHTML = `
        <div class="q-title">${esc(q.title)}</div>
        <div class="q-text">${fmt(q.question)}</div>
        <div class="opts" role="group" aria-label="Варіанти відповіді">${state.order[k].map(oi => {
          let cls = "opt";
          if (answered) {
            if (q.options[oi].correct) cls += " correct";
            else if (state.picked[k] === oi) cls += " wrong";
          }
          return `<button type="button" class="${cls}" data-oi="${oi}"${answered ? " disabled" : ""}>${fmt(q.options[oi].text)}</button>`;
        }).join("")}</div>
        <div class="feedback" aria-live="polite"${answered ? "" : " hidden"}>${answered ? (isCorrect(si, qi) ? "✓ Правильно. " : "✗ Ні. ") : ""}${fmt(q.feedback)}</div>
      `;
      card.querySelectorAll(".opt").forEach(btn => {
        btn.addEventListener("click", () => {
          if (k in state.picked) return;
          state.picked[k] = +btn.dataset.oi;
          save();
          const next = document.createElement("div");
          renderQuestionCard(q, si, qi, next);
          card.replaceWith(next.firstElementChild);
          updateProgress();
        });
      });
      container.appendChild(card);
    }

    function render() {
      const sec = SECTIONS[state.sectionIdx];
      const qs = sec.questions;
      const area = document.getElementById("quizArea");
      const pager = document.getElementById("pager");
      area.innerHTML = "";
      if (!qs.length) {
        area.innerHTML = "<p class='stats'>Немає питань у цьому розділі.</p>";
        pager.hidden = true;
        return;
      }
      const wrap = document.createElement("div");
      if (state.mode === "all") {
        pager.hidden = true;
        area.innerHTML = `<div class="q-meta"><span>${esc(sec.timecode)}</span> · ${esc(sec.label)} · ${qs.length} питань</div>`;
        qs.forEach((q, qi) => renderQuestionCard(q, state.sectionIdx, qi, wrap));
      } else {
        pager.hidden = false;
        state.qIdx = Math.min(state.qIdx, qs.length - 1);
        area.innerHTML = `<div class="q-meta"><span>${esc(sec.timecode)}</span> · ${esc(sec.label)} · питання ${state.qIdx + 1} / ${qs.length}</div>`;
        renderQuestionCard(qs[state.qIdx], state.sectionIdx, state.qIdx, wrap);
        document.getElementById("pagerText").textContent = `${state.qIdx + 1} / ${qs.length}`;
        document.getElementById("btnPrev").disabled = state.qIdx === 0;
        document.getElementById("btnNext").disabled = state.qIdx >= qs.length - 1;
      }
      area.appendChild(wrap);
      updateProgress();
    }

    function setMode(m) {
      state.mode = m;
      document.getElementById("btnModeOne").setAttribute("aria-pressed", String(m === "one"));
      document.getElementById("btnModeAll").setAttribute("aria-pressed", String(m === "all"));
      render();
    }
    document.getElementById("btnPrev").addEventListener("click", () => { if (state.qIdx > 0) { state.qIdx--; render(); } });
    document.getElementById("btnNext").addEventListener("click", () => {
      if (state.qIdx < SECTIONS[state.sectionIdx].questions.length - 1) { state.qIdx++; render(); }
    });
    document.getElementById("btnModeOne").addEventListener("click", () => setMode("one"));
    document.getElementById("btnModeAll").addEventListener("click", () => setMode("all"));
    document.getElementById("btnReset").addEventListener("click", () => {
      if (!confirm("Скинути всі відповіді банку питань?")) return;
      state.picked = {}; state.order = {};
      save(); render();
    });

    load();
    buildSidebar();
    render();
  </script>
</body>
</html>
"""



def main():
    sections = load_data()
    total_q = sum(len(s["questions"]) for s in sections)
    data_json = json.dumps(sections, ensure_ascii=False).replace("</", "<\\/")
    html = (
        HTML_TEMPLATE.replace("__QUIZ_JSON__", data_json)
        .replace("__TOTAL_Q__", str(total_q))
    )
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT} — {len(sections)} sections, {total_q} questions")


if __name__ == "__main__":
    main()