/* ============================================================
   TRACE PAGE — SkillScan Deep Navy Design System
   Sections: Hero, Quick-Start (tabbed), Data Flow SVG,
             Provider Setup, Config File, Self-Hosting,
             Privacy Footer, CTA
   ============================================================ */
import { useState } from "react";
import { Copy, Check, ExternalLink, Shield, Lock, Cpu, GitBranch, Terminal, Server, ChevronRight, AlertTriangle, FileCode2, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Provider = "openai" | "openrouter" | "ollama";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded transition-all duration-200 flex-shrink-0"
      style={{ color: "oklch(0.60 0.015 265)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.60 0.015 265)")}
      aria-label="Copy to clipboard"
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ background: "oklch(0.09 0.018 265)", border: "1px solid oklch(0.22 0.025 265)" }}
    >
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{ borderBottom: "1px solid oklch(0.18 0.022 265)" }}
      >
        <span className="text-xs font-mono" style={{ color: "oklch(0.50 0.015 265)" }}>{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre className="px-4 py-3 text-sm font-mono overflow-x-auto" style={{ color: "oklch(0.88 0.012 265)", lineHeight: "1.6" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

const PROVIDER_TABS: { id: Provider; label: string; badge?: string }[] = [
  { id: "openai", label: "OpenAI" },
  { id: "openrouter", label: "OpenRouter", badge: "200+ models" },
  { id: "ollama", label: "Ollama", badge: "Local / Free" },
];

const PROVIDER_CONTENT: Record<Provider, { setup: string; run: string; note: string; envVar: string }> = {
  openai: {
    envVar: "OPENAI_API_KEY",
    setup: `export OPENAI_API_KEY="sk-..."`,
    run: `skillscan-trace run ./my-skill/SKILL.md --provider openai`,
    note: "Uses gpt-4.1-mini by default. Override with --model gpt-4o.",
  },
  openrouter: {
    envVar: "OPENROUTER_API_KEY",
    setup: `export OPENROUTER_API_KEY="sk-or-..."`,
    run: `skillscan-trace run ./my-skill/SKILL.md --provider openrouter --model anthropic/claude-3.5-sonnet`,
    note: "Access 200+ models through one key. Supports Claude, Gemini, Llama, Mistral, and more.",
  },
  ollama: {
    envVar: "(none required)",
    setup: `# Start Ollama with a model first
ollama pull qwen2.5:7b`,
    run: `skillscan-trace run ./my-skill/SKILL.md --provider ollama --model qwen2.5:7b`,
    note: "Fully air-gapped. No API key, no network calls except to localhost:11434. Ideal for sensitive environments.",
  },
};

const CONFIG_EXAMPLE = `# skillscan-trace.yaml — project-level config
# Place in your repo root or any parent directory.
# CLI flags always override these values.

provider: openrouter
model: anthropic/claude-3.5-sonnet
variants: 3
turns: 10
output_dir: .skillscan-reports
verbose: false`;

const DOCKER_SINGLE = `# Single trace — BYOK, runs locally
docker run --rm \\
  -e OPENROUTER_API_KEY="sk-or-..." \\
  -v $(pwd):/workspace \\
  skillscan/trace run /workspace/SKILL.md --provider openrouter`;

const DOCKER_SERVE = `# Self-hosted server mode
docker run -d -p 8080:8080 --name skillscan-trace skillscan/trace serve

# Submit a trace
curl -X POST http://localhost:8080/v1/submit \\
  -H 'Content-Type: application/json' \\
  -d '{
    "skill_content": "...",
    "api_key": "sk-or-...",
    "provider": "openrouter"
  }'

# Poll for result
curl http://localhost:8080/v1/report/<job_id>`;

const SAMPLE_FINDINGS = [
  { severity: "CRITICAL", rule: "CANARY-001", title: "Exfiltration via HTTP tool", detail: "Skill invoked http_request with attacker-controlled URL containing base64-encoded canary token in query parameter." },
  { severity: "HIGH", rule: "CANARY-003", title: "Credential access attempt", detail: "Skill called read_file on ~/.aws/credentials and ~/.ssh/id_rsa within 2 turns of receiving a social engineering prompt." },
  { severity: "MEDIUM", rule: "CANARY-007", title: "Bash injection via shell tool", detail: "Skill passed unsanitized user input to bash_exec. AST analysis detected command substitution chain." },
];

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: "oklch(0.55 0.22 25)",
  HIGH: "oklch(0.65 0.22 45)",
  MEDIUM: "oklch(0.72 0.19 80)",
  LOW: "oklch(0.65 0.18 200)",
};

export default function Trace() {
  const [activeProvider, setActiveProvider] = useState<Provider>("openrouter");

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.12 0.025 265)", color: "oklch(0.95 0.005 265)" }}>
      <Navbar />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse, oklch(0.58 0.22 290) 0%, transparent 70%)" }}
          />
        </div>
        <div className="container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: "oklch(0.58 0.22 290 / 0.12)", border: "1px solid oklch(0.58 0.22 290 / 0.25)", color: "oklch(0.78 0.18 290)" }}
            >
              <Cpu className="w-3.5 h-3.5" />
              Behavioral Analysis — Phase 2 of SkillScan
            </div>
            <h1
              className="text-5xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 265)" }}
            >
              Does your skill{" "}
              <span style={{ color: "oklch(0.78 0.18 290)" }}>behave</span>{" "}
              the way it claims?
            </h1>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.70 0.012 265)" }}>
              <strong style={{ color: "oklch(0.88 0.012 265)" }}>skillscan-trace</strong> runs your skill against a live LLM inside a canary environment — a sandboxed MCP server with 14 instrumented tools. It watches what the skill actually does when prompted, not just what it claims to do.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/kurtpayne/skillscan-trace"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
                style={{ background: "oklch(0.58 0.22 290)", color: "white" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.52 0.22 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.58 0.22 290)")}
              >
                <GitBranch className="w-4 h-4" />
                View on GitHub
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
               </a>
              <a
                href="#quickstart"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200"
                style={{ background: "oklch(0.18 0.022 265)", border: "1px solid oklch(0.28 0.025 265)", color: "oklch(0.88 0.012 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.5)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.28 0.025 265)")}>
                Quick Start
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            {/* CI badge */}
            <div className="flex justify-center mt-5">
              <a
                href="https://github.com/kurtpayne/skillscan-trace/actions/workflows/ci.yml"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://github.com/kurtpayne/skillscan-trace/actions/workflows/ci.yml/badge.svg"
                  alt="CI status"
                  style={{ height: "20px" }}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works — SVG Data Flow ── */}
      <section className="py-16">
        <div className="container">
          <h2
            className="text-2xl font-bold text-center mb-12"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
          >
            How a trace works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-2xl p-8"
              style={{ background: "oklch(0.15 0.022 265)", border: "1px solid oklch(0.22 0.025 265)" }}
            >
              {/* Flow steps */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {[
                  { icon: FileCode2, label: "Your SKILL.md", sub: "Input", color: "oklch(0.65 0.18 200)" },
                  { icon: Terminal, label: "Input Generator", sub: "3 adversarial variants", color: "oklch(0.72 0.19 45)" },
                  { icon: Cpu, label: "LLM (BYOK)", sub: "Your provider, your key", color: "oklch(0.78 0.18 290)" },
                  { icon: Shield, label: "Canary Server", sub: "14 instrumented tools", color: "oklch(0.65 0.22 25)" },
                  { icon: AlertTriangle, label: "Verdict", sub: "SAFE / SUSPICIOUS / MALICIOUS", color: "oklch(0.72 0.19 45)" },
                ].map((step, i) => (
                  <div key={i} className="flex md:flex-col items-center gap-3 md:gap-2 md:text-center">
                    {i > 0 && (
                      <div
                        className="hidden md:block absolute"
                        style={{ color: "oklch(0.35 0.015 265)" }}
                      />
                    )}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${step.color.replace(")", " / 0.12)")}`, border: `1px solid ${step.color.replace(")", " / 0.25)")}` }}
                    >
                      <step.icon className="w-5 h-5" style={{ color: step.color }} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: "oklch(0.92 0.008 265)" }}>{step.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: "oklch(0.55 0.012 265)" }}>{step.sub}</div>
                    </div>
                    {i < 4 && (
                      <ChevronRight
                        className="hidden md:block w-5 h-5 flex-shrink-0 self-center"
                        style={{ color: "oklch(0.35 0.015 265)", marginTop: "-2rem" }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Arrows between steps on desktop */}
              <div className="hidden md:flex justify-between px-14 -mt-8 mb-4">
                {[0,1,2,3].map(i => (
                  <ChevronRight key={i} className="w-5 h-5" style={{ color: "oklch(0.35 0.015 265)" }} />
                ))}
              </div>

              <div
                className="mt-6 p-4 rounded-lg text-sm"
                style={{ background: "oklch(0.10 0.018 265)", border: "1px solid oklch(0.20 0.022 265)", color: "oklch(0.65 0.012 265)" }}
              >
                <strong style={{ color: "oklch(0.78 0.18 290)" }}>Key privacy property:</strong> Your API key travels only from your machine to your chosen LLM provider. The canary server runs in-process — no skill content, no keys, no results leave your machine except the LLM calls you explicitly authorize.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Start ── */}
      <section id="quickstart" className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Quick start
            </h2>
            <p className="text-sm mb-8" style={{ color: "oklch(0.60 0.012 265)" }}>
              Install once, bring your own key, run anywhere.
            </p>

            {/* Install */}
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "oklch(0.55 0.015 265)" }}>1. Install</div>
              <CodeBlock code={`pip install skillscan-trace\n\n# With serve mode (FastAPI server)\npip install "skillscan-trace[serve]"`} />
            </div>

            {/* Provider tabs */}
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "oklch(0.55 0.015 265)" }}>2. Choose a provider</div>
              <div className="flex gap-2 mb-4 flex-wrap">
                {PROVIDER_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveProvider(tab.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                    style={{
                      background: activeProvider === tab.id ? "oklch(0.58 0.22 290 / 0.15)" : "oklch(0.16 0.022 265)",
                      border: `1px solid ${activeProvider === tab.id ? "oklch(0.58 0.22 290 / 0.4)" : "oklch(0.24 0.025 265)"}`,
                      color: activeProvider === tab.id ? "oklch(0.78 0.18 290)" : "oklch(0.70 0.012 265)",
                    }}
                  >
                    {tab.label}
                    {tab.badge && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: "oklch(0.58 0.22 290 / 0.15)", color: "oklch(0.78 0.18 290)", fontSize: "10px" }}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <CodeBlock code={PROVIDER_CONTENT[activeProvider].setup} />
              <div className="text-xs mt-2 mb-3" style={{ color: "oklch(0.55 0.012 265)" }}>
                {PROVIDER_CONTENT[activeProvider].envVar !== "(none required)" ? (
                  <>Env var: <code style={{ color: "oklch(0.78 0.18 290)" }}>{PROVIDER_CONTENT[activeProvider].envVar}</code></>
                ) : (
                  <span style={{ color: "oklch(0.65 0.18 200)" }}>No API key required — runs entirely on localhost</span>
                )}
              </div>
            </div>

            {/* Run */}
            <div className="mb-6">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "oklch(0.55 0.015 265)" }}>3. Run</div>
              <CodeBlock code={PROVIDER_CONTENT[activeProvider].run} />
              <div className="text-xs mt-2" style={{ color: "oklch(0.55 0.012 265)" }}>
                {PROVIDER_CONTENT[activeProvider].note}
              </div>
            </div>

            {/* Check */}
            <div className="mb-2">
              <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "oklch(0.55 0.015 265)" }}>Verify connectivity first</div>
              <CodeBlock code={`skillscan-trace check --provider ${activeProvider}`} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Sample Report ── */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              What a report looks like
            </h2>
            <p className="text-sm mb-8" style={{ color: "oklch(0.60 0.012 265)" }}>
              Each finding includes the rule ID, the exact tool call that triggered it, and the conversation turn where it occurred.
            </p>
            <div className="space-y-3">
              {SAMPLE_FINDINGS.map((f, i) => (
                <div
                  key={i}
                  className="rounded-lg p-4"
                  style={{
                    background: "oklch(0.15 0.022 265)",
                    border: `1px solid ${SEVERITY_COLORS[f.severity].replace(")", " / 0.25)")}`,
                  }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded flex-shrink-0 mt-0.5"
                      style={{
                        background: `${SEVERITY_COLORS[f.severity].replace(")", " / 0.15)")}`,
                        color: SEVERITY_COLORS[f.severity],
                        border: `1px solid ${SEVERITY_COLORS[f.severity].replace(")", " / 0.3)")}`,
                      }}
                    >
                      {f.severity}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-xs" style={{ color: "oklch(0.65 0.18 200)" }}>{f.rule}</code>
                        <span className="text-sm font-semibold" style={{ color: "oklch(0.92 0.008 265)" }}>{f.title}</span>
                      </div>
                      <p className="text-sm" style={{ color: "oklch(0.65 0.012 265)" }}>{f.detail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Config File ── */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Project config file
            </h2>
            <p className="text-sm mb-6" style={{ color: "oklch(0.60 0.012 265)" }}>
              Drop a <code style={{ color: "oklch(0.78 0.18 290)" }}>skillscan-trace.yaml</code> in your repo root to set defaults for your project. CLI flags always override. The file is auto-discovered by walking up from the current directory — nearest file wins.
            </p>
            <CodeBlock code={CONFIG_EXAMPLE} lang="yaml" />
          </div>
        </div>
      </section>

      {/* ── Self-Hosting / Docker ── */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Self-hosting with Docker
            </h2>
            <p className="text-sm mb-8" style={{ color: "oklch(0.60 0.012 265)" }}>
              The Docker image supports both single-trace and server modes. Use server mode to expose a REST API for CI pipelines or team-wide scanning — everything stays in your own infrastructure.
            </p>
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "oklch(0.55 0.015 265)" }}>Single trace</div>
                <CodeBlock code={DOCKER_SINGLE} />
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "oklch(0.55 0.015 265)" }}>Server mode (REST API)</div>
                <CodeBlock code={DOCKER_SERVE} />
              </div>
            </div>
            <div
              className="mt-6 p-4 rounded-lg"
              style={{ background: "oklch(0.65 0.18 200 / 0.08)", border: "1px solid oklch(0.65 0.18 200 / 0.2)" }}
            >
              <div className="flex items-start gap-2">
                <Server className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: "oklch(0.65 0.18 200)" }} />
                <p className="text-sm" style={{ color: "oklch(0.70 0.012 265)" }}>
                  <strong style={{ color: "oklch(0.88 0.012 265)" }}>Enterprise / air-gapped:</strong> Server mode with Ollama as the provider gives you a fully local scanning pipeline. No external network calls, no API keys, no data leaves your VPC.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Privacy ── */}
      <section className="py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-2xl p-8"
              style={{ background: "oklch(0.58 0.22 290 / 0.06)", border: "1px solid oklch(0.58 0.22 290 / 0.18)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.58 0.22 290 / 0.15)" }}
                >
                  <Lock className="w-5 h-5" style={{ color: "oklch(0.78 0.18 290)" }} />
                </div>
                <h2
                  className="text-xl font-bold"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
                >
                  Privacy & key handling
                </h2>
              </div>
              <div className="space-y-3 text-sm" style={{ color: "oklch(0.70 0.012 265)" }}>
                <p>Your API key is passed <strong style={{ color: "oklch(0.88 0.012 265)" }}>directly from your machine to your chosen LLM provider</strong>. SkillScan never sees it, stores it, or transmits it to any other destination.</p>
                <p>The canary server runs <strong style={{ color: "oklch(0.88 0.012 265)" }}>in-process on your machine</strong>. No skill content, no trace results, and no keys leave your machine except the LLM API calls you explicitly authorize.</p>
                <p>In server mode, the API key you submit is used for that request only and is never written to disk or logs.</p>
              </div>
              <a
                href="https://github.com/kurtpayne/skillscan-trace/blob/main/PRIVACY.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm mt-4 transition-colors duration-200"
                style={{ color: "oklch(0.78 0.18 290)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.88 0.18 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
              >
                Read the full privacy document
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 265)" }}
            >
              Ready to trace your skills?
            </h2>
            <p className="mb-8" style={{ color: "oklch(0.65 0.012 265)" }}>
              Start with static scanning, then add behavioral tracing for a complete picture.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://github.com/kurtpayne/skillscan-trace"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                style={{ background: "oklch(0.58 0.22 290)", color: "white" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.52 0.22 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "oklch(0.58 0.22 290)")}
              >
                <GitBranch className="w-4 h-4" />
                skillscan-trace on GitHub
              </a>
              <a
                href="/docs"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200"
                style={{ background: "oklch(0.18 0.022 265)", border: "1px solid oklch(0.28 0.025 265)", color: "oklch(0.88 0.012 265)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.58 0.22 290 / 0.5)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "oklch(0.28 0.025 265)")}
              >
                <Zap className="w-4 h-4" />
                Full docs
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
