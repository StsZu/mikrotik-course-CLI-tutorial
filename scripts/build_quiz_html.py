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


def load_data() -> list[dict]:
    sections = []
    for fname, timecode, label in SECTIONS:
        path = GIFT_DIR / fname
        slug = fname.replace(".txt", "")
        qs = parse_gift(path.read_text(encoding="utf-8"))
        sections.append(
            {"id": slug, "file": fname, "timecode": timecode, "label": label, "questions": qs}
        )
    return sections


HTML_TEMPLATE = r"""<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MikroTik RouterOS CLI Quiz</title>
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
    .top-nav {
      display: flex; gap: 10px; align-items: center; margin-bottom: 16px;
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
    header p { margin: 0; color: var(--muted); font-size: 0.9rem; line-height: 1.5; }
    .layout { display: grid; grid-template-columns: 260px 1fr; gap: 14px; }
    @media (max-width: 860px) { .layout { grid-template-columns: 1fr; } .sidebar { order: 2; } }
    .sidebar, .main-panel {
      background: var(--panel); border: 1px solid var(--border); border-radius: 12px;
    }
    .sidebar { padding: 14px; max-height: calc(100vh - 140px); overflow-y: auto; }
    .sidebar h2 {
      font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em;
      color: var(--muted); margin: 0 0 10px;
    }
    .sec-list { list-style: none; padding: 0; margin: 0; }
    .sec-list li {
      padding: 7px 8px; border-radius: 6px; cursor: pointer; font-size: 0.78rem;
      display: flex; justify-content: space-between; gap: 6px;
    }
    .sec-list li:hover { background: #21262d; }
    .sec-list li.active { background: #21262d; color: var(--accent); }
    .sec-list li.done { color: var(--green); }
    .sec-list small { color: var(--muted); font-family: var(--font); }
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
    .q-text { font-size: 0.95rem; line-height: 1.55; margin-bottom: 14px; }
    .opt {
      display: block; width: 100%; text-align: left; margin-bottom: 8px;
      padding: 10px 12px; border-radius: 8px; border: 1px solid var(--border);
      background: #161b22; color: var(--text); font-size: 0.88rem;
      cursor: pointer; line-height: 1.4;
    }
    .opt:hover:not(:disabled) { border-color: var(--blue); background: #1c2128; }
    .opt.correct { border-color: var(--green); background: rgba(63, 185, 80, 0.12); }
    .opt.wrong { border-color: var(--red); background: rgba(248, 81, 73, 0.1); }
    .opt:disabled { cursor: default; opacity: 0.95; }
    .feedback {
      margin-top: 12px; padding: 12px; border-radius: 8px;
      background: rgba(210, 153, 34, 0.1); border-left: 3px solid var(--yellow);
      color: #e6c87a; font-size: 0.86rem; line-height: 1.5; display: none;
    }
    .feedback.show { display: block; }
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
    .mode-btns .btn.active { border-color: var(--blue); color: var(--blue); }
    .all-view .q-card { scroll-margin-top: 12px; }
  </style>
</head>
<body>
  <div class="wrap">
    <nav class="top-nav">
      <a href="index.html">Тренажер CLI</a>
      <a href="quiz.html" class="active">Quiz (__TOTAL_Q__ питань)</a>
    </nav>
    <header>
      <h1>MikroTik RouterOS CLI Quiz</h1>
      <p>
        6 розділів з <code>quiz_parts/gift/</code> (GIFT Moodle).
        Обери розділ зліва · режим «По одному» або «Всі в розділі».
      </p>
    </header>
    <div class="layout">
      <aside class="sidebar">
        <h2>Прогрес</h2>
        <div class="progress"><div id="progressBar"></div></div>
        <div class="stats" id="progressText">0 / 0</div>
        <h2>Розділи</h2>
        <ul class="sec-list" id="secList"></ul>
      </aside>
      <section class="main-panel" id="mainPanel">
        <div class="mode-btns">
          <button type="button" class="btn active" id="btnModeOne">По одному</button>
          <button type="button" class="btn" id="btnModeAll">Всі в розділі</button>
        </div>
        <div id="quizArea"></div>
        <div class="pager" id="pager" style="display:none">
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
    const state = {
      sectionIdx: 0,
      qIdx: 0,
      mode: "one",
      answered: new Set(),
      correct: new Set()
    };

    function esc(s) {
      return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    }

    function qKey(si, qi) { return si + ":" + qi; }

    function currentQuestions() {
      return SECTIONS[state.sectionIdx]?.questions || [];
    }

    function updateProgress() {
      let total = 0, ans = 0, ok = 0;
      SECTIONS.forEach((s, si) => {
        s.questions.forEach((_, qi) => {
          total++;
          const k = qKey(si, qi);
          if (state.answered.has(k)) ans++;
          if (state.correct.has(k)) ok++;
        });
      });
      document.getElementById("progressBar").style.width = total ? (ok / total * 100) + "%" : "0%";
      document.getElementById("progressText").textContent =
        `Правильно: ${ok} / ${total} · Відповідей: ${ans}`;
      document.querySelectorAll("#secList li").forEach((li, i) => {
        const sec = SECTIONS[i];
        let done = 0;
        sec.questions.forEach((_, qi) => {
          if (state.correct.has(qKey(i, qi))) done++;
        });
        li.classList.toggle("done", done === sec.questions.length && sec.questions.length > 0);
      });
    }

    function buildSidebar() {
      const ul = document.getElementById("secList");
      ul.innerHTML = SECTIONS.map((s, i) =>
        `<li data-i="${i}" class="${i === state.sectionIdx ? "active" : ""}">
          <span>${esc(s.label)}</span>
          <small>${s.questions.length}</small>
        </li>`
      ).join("");
      ul.querySelectorAll("li").forEach(li => {
        li.addEventListener("click", () => {
          state.sectionIdx = +li.dataset.i;
          state.qIdx = 0;
          buildSidebar();
          render();
        });
      });
    }

    function renderQuestionCard(q, si, qi, container) {
      const k = qKey(si, qi);
      const answered = state.answered.has(k);
      const card = document.createElement("div");
      card.className = "q-card";
      card.dataset.qi = qi;
      let optsHtml = q.options.map((o, oi) => {
        let cls = "opt";
        if (answered) {
          if (o.correct) cls += " correct";
          else if (card.dataset.picked === String(oi)) cls += " wrong";
        }
        return `<button type="button" class="${cls}" data-oi="${oi}" ${answered ? "disabled" : ""}>${esc(o.text)}</button>`;
      }).join("");
      card.innerHTML = `
        <div class="q-title">${esc(q.title)}</div>
        <div class="q-text">${esc(q.question)}</div>
        <div class="opts">${q.options.map((o, oi) =>
          `<button type="button" class="opt" data-oi="${oi}">${esc(o.text)}</button>`
        ).join("")}</div>
        <div class="feedback">${esc(q.feedback)}</div>
      `;
      card.querySelectorAll(".opt").forEach(btn => {
        btn.addEventListener("click", () => {
          if (state.answered.has(k)) return;
          const oi = +btn.dataset.oi;
          card.dataset.picked = oi;
          state.answered.add(k);
          if (q.options[oi].correct) state.correct.add(k);
          card.querySelectorAll(".opt").forEach((b, j) => {
            b.disabled = true;
            if (q.options[j].correct) b.classList.add("correct");
            else if (j === oi) b.classList.add("wrong");
          });
          card.querySelector(".feedback").classList.add("show");
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
      area.className = state.mode === "all" ? "all-view" : "";

      if (!qs.length) {
        area.innerHTML = "<p class='stats'>Немає питань у цьому розділі.</p>";
        pager.style.display = "none";
        return;
      }

      if (state.mode === "all") {
        pager.style.display = "none";
        area.innerHTML = `<div class="q-meta"><span>${esc(sec.timecode)}</span> · ${esc(sec.label)} · ${qs.length} питань</div>`;
        const wrap = document.createElement("div");
        qs.forEach((q, qi) => renderQuestionCard(q, state.sectionIdx, qi, wrap));
        area.appendChild(wrap);
      } else {
        pager.style.display = "flex";
        state.qIdx = Math.min(state.qIdx, qs.length - 1);
        area.innerHTML = `<div class="q-meta"><span>${esc(sec.timecode)}</span> · ${esc(sec.label)} · питання ${state.qIdx + 1} / ${qs.length}</div>`;
        const wrap = document.createElement("div");
        renderQuestionCard(qs[state.qIdx], state.sectionIdx, state.qIdx, wrap);
        area.appendChild(wrap);
        document.getElementById("pagerText").textContent = `${state.qIdx + 1} / ${qs.length}`;
        document.getElementById("btnPrev").disabled = state.qIdx === 0;
        document.getElementById("btnNext").disabled = state.qIdx >= qs.length - 1;
      }
      updateProgress();
    }

    document.getElementById("btnPrev").addEventListener("click", () => {
      if (state.qIdx > 0) { state.qIdx--; render(); }
    });
    document.getElementById("btnNext").addEventListener("click", () => {
      const qs = currentQuestions();
      if (state.qIdx < qs.length - 1) { state.qIdx++; render(); }
    });
    document.getElementById("btnModeOne").addEventListener("click", () => {
      state.mode = "one";
      document.getElementById("btnModeOne").classList.add("active");
      document.getElementById("btnModeAll").classList.remove("active");
      render();
    });
    document.getElementById("btnModeAll").addEventListener("click", () => {
      state.mode = "all";
      document.getElementById("btnModeAll").classList.add("active");
      document.getElementById("btnModeOne").classList.remove("active");
      render();
    });

    buildSidebar();
    render();
  </script>
</body>
</html>
"""


def main():
    sections = load_data()
    total_q = sum(len(s["questions"]) for s in sections)
    data_json = json.dumps(sections, ensure_ascii=False)
    html = (
        HTML_TEMPLATE.replace("__QUIZ_JSON__", data_json)
        .replace("__TOTAL_Q__", str(total_q))
    )
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT} — {len(sections)} sections, {total_q} questions")


if __name__ == "__main__":
    main()