/* ============================================================
   RULES PAGE — SkillScan Detection Rule Catalog
   ============================================================ */
import { useState } from "react";
import { Search, ExternalLink, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Severity = "BLOCK" | "WARN" | "INFO";
type Category = "MAL" | "ABU" | "EXF" | "INJ" | "CHN" | "CAP";

interface Rule {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  tags: string[];
}

const rules: Rule[] = [
  // MAL — Malware Patterns
  { id: "MAL-001", category: "MAL", severity: "BLOCK", title: "Remote Code Execution via Shell", description: "Detects instructions to execute shell commands, spawn subprocesses, or run arbitrary system commands.", tags: ["rce", "shell", "execution"] },
  { id: "MAL-002", category: "MAL", severity: "BLOCK", title: "Reverse Shell Establishment", description: "Identifies patterns for establishing reverse shell connections back to attacker-controlled infrastructure.", tags: ["reverse-shell", "c2", "persistence"] },
  { id: "MAL-003", category: "MAL", severity: "BLOCK", title: "Malicious File Download", description: "Detects instructions to download and execute files from remote URLs, a common malware delivery vector.", tags: ["download", "execution", "dropper"] },
  { id: "MAL-010", category: "MAL", severity: "BLOCK", title: "Credential Harvesting", description: "Identifies patterns that read environment variables, config files, or secret stores for credential extraction.", tags: ["credentials", "secrets", "harvest"] },
  { id: "MAL-025", category: "MAL", severity: "BLOCK", title: "MCP Tool Description Poisoning", description: "Detects hidden instruction blocks in MCP tool descriptions using IMPORTANT tags or similar concealment patterns.", tags: ["mcp", "tool-poisoning", "prompt-injection"] },
  { id: "MAL-026", category: "MAL", severity: "BLOCK", title: "Docker Socket Mount", description: "Identifies instructions to mount the Docker socket, granting full host control from within a container.", tags: ["container", "docker", "escape"] },
  { id: "MAL-027", category: "MAL", severity: "BLOCK", title: "Privileged Container Execution", description: "Detects --privileged flags, SYS_ADMIN capability grants, and disabled AppArmor/seccomp profiles.", tags: ["container", "privilege-escalation", "escape"] },
  { id: "MAL-028", category: "MAL", severity: "WARN", title: "Host Network Infrastructure Manipulation", description: "Identifies writes to /etc/hosts, iptables manipulation, and IP route changes that affect host networking.", tags: ["network", "host", "infrastructure"] },
  // ABU — Abuse Patterns
  { id: "ABU-001", category: "ABU", severity: "WARN", title: "Excessive Permission Request", description: "Detects skill files requesting permissions beyond what is needed for their stated functionality.", tags: ["permissions", "overprivileged"] },
  { id: "ABU-006", category: "ABU", severity: "BLOCK", title: "Stealth Instruction Concealment", description: "Identifies 'do not mention this to the user' and similar instructions designed to hide agent actions from humans.", tags: ["stealth", "deception", "transparency"] },
  { id: "ABU-007", category: "ABU", severity: "WARN", title: "Cross-Server MCP Tool Invocation", description: "Detects instructions to invoke tools from other MCP servers, exploiting MCP's flat namespace for lateral movement.", tags: ["mcp", "cross-server", "lateral-movement"] },
  // EXF — Exfiltration
  { id: "EXF-001", category: "EXF", severity: "BLOCK", title: "HTTP Exfiltration Channel", description: "Identifies patterns that send data to external HTTP endpoints, a primary data exfiltration vector.", tags: ["exfiltration", "http", "data-leak"] },
  { id: "EXF-002", category: "EXF", severity: "BLOCK", title: "DNS Exfiltration", description: "Detects DNS-based data exfiltration patterns where data is encoded in DNS queries.", tags: ["exfiltration", "dns", "covert-channel"] },
  { id: "EXF-003", category: "EXF", severity: "WARN", title: "Cloud Storage Upload", description: "Identifies instructions to upload files or data to cloud storage services (S3, GCS, Azure Blob).", tags: ["exfiltration", "cloud", "upload"] },
  // INJ — Injection
  { id: "INJ-001", category: "INJ", severity: "BLOCK", title: "Direct Prompt Injection", description: "Detects explicit prompt injection patterns where skill instructions attempt to override system prompts.", tags: ["prompt-injection", "llm", "jailbreak"] },
  { id: "INJ-002", category: "INJ", severity: "BLOCK", title: "Indirect Prompt Injection via Tool Output", description: "Identifies patterns where tool output is designed to inject instructions into the agent's context.", tags: ["prompt-injection", "indirect", "tool-output"] },
  { id: "INJ-005", category: "INJ", severity: "WARN", title: "System Prompt Leakage", description: "Detects instructions that attempt to read or expose the system prompt to unauthorized parties.", tags: ["prompt-leakage", "confidentiality"] },
  // CHN — Chain Rules
  { id: "CHN-001", category: "CHN", severity: "BLOCK", title: "Download + Execute Chain", description: "Multi-signal rule: file download instruction followed by execution instruction in the same skill.", tags: ["chain", "dropper", "execution"] },
  { id: "CHN-005", category: "CHN", severity: "BLOCK", title: "Secret Access + Network Exfiltration", description: "Multi-signal rule: credential/secret access followed by outbound network communication.", tags: ["chain", "credentials", "exfiltration"] },
  { id: "CHN-011", category: "CHN", severity: "BLOCK", title: "MCP Poison + Credential Exfil", description: "Full Invariant Labs attack pattern: poisoned MCP tool description combined with credential read and exfiltration.", tags: ["chain", "mcp", "credentials", "exfiltration"] },
  { id: "CHN-012", category: "CHN", severity: "BLOCK", title: "Stealth Conceal + Network Exfil", description: "Hide-from-user instructions combined with outbound network communication — covert exfiltration pattern.", tags: ["chain", "stealth", "exfiltration"] },
  { id: "CHN-013", category: "CHN", severity: "BLOCK", title: "Container Escape + Host Path Mount", description: "Privileged container execution combined with sensitive host path mounts.", tags: ["chain", "container", "escape", "host"] },
  { id: "CHN-014", category: "CHN", severity: "BLOCK", title: "Container Escape + Secret Access", description: "Privileged container execution combined with credential harvesting instructions.", tags: ["chain", "container", "escape", "credentials"] },
  // CAP — Capability Abuse
  { id: "CAP-001", category: "CAP", severity: "WARN", title: "Filesystem Write to Sensitive Paths", description: "Detects writes to /etc, /root, /sys, /proc, or other sensitive system directories.", tags: ["filesystem", "sensitive-paths", "persistence"] },
  { id: "CAP-002", category: "CAP", severity: "WARN", title: "Cron/Scheduled Task Creation", description: "Identifies instructions to create cron jobs or scheduled tasks for persistence.", tags: ["persistence", "cron", "scheduled-task"] },
];

const categoryColors: Record<Category, string> = {
  MAL: "oklch(0.65 0.22 25)",
  ABU: "oklch(0.72 0.19 45)",
  EXF: "oklch(0.60 0.20 320)",
  INJ: "oklch(0.58 0.22 290)",
  CHN: "oklch(0.65 0.18 200)",
  CAP: "oklch(0.70 0.15 160)",
};

const severityConfig: Record<Severity, { color: string; icon: typeof XCircle; label: string }> = {
  BLOCK: { color: "oklch(0.65 0.22 25)", icon: XCircle, label: "BLOCK" },
  WARN: { color: "oklch(0.72 0.19 45)", icon: AlertTriangle, label: "WARN" },
  INFO: { color: "oklch(0.65 0.18 200)", icon: Info, label: "INFO" },
};

function RuleCard({ rule }: { rule: Rule }) {
  const [expanded, setExpanded] = useState(false);
  const sev = severityConfig[rule.severity];
  const SevIcon = sev.icon;

  return (
    <div
      className="glow-card rounded-xl overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span
              className="text-xs font-bold px-2 py-1 rounded flex-shrink-0 mt-0.5"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                background: `${categoryColors[rule.category]} / 0.12`,
                color: categoryColors[rule.category],
                border: `1px solid ${categoryColors[rule.category]} / 0.25`,
              }}
            >
              {rule.id}
            </span>
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold mb-1 truncate"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.92 0.005 265)" }}
              >
                {rule.title}
              </h3>
              {expanded && (
                <p className="text-sm leading-relaxed mt-2" style={{ color: "oklch(0.60 0.015 265)" }}>
                  {rule.description}
                </p>
              )}
              {expanded && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {rule.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 rounded"
                      style={{
                        background: "oklch(0.20 0.025 265)",
                        color: "oklch(0.55 0.015 265)",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <SevIcon className="w-3.5 h-3.5" style={{ color: sev.color }} />
              <span
                className="text-xs font-semibold"
                style={{ color: sev.color, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {sev.label}
              </span>
            </div>
            {expanded ? (
              <ChevronUp className="w-4 h-4" style={{ color: "oklch(0.45 0.012 265)" }} />
            ) : (
              <ChevronDown className="w-4 h-4" style={{ color: "oklch(0.45 0.012 265)" }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Rules() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category | "ALL">("ALL");
  const [activeSeverity, setActiveSeverity] = useState<Severity | "ALL">("ALL");

  const filtered = rules.filter((r) => {
    const matchSearch =
      search === "" ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.includes(search.toLowerCase()));
    const matchCat = activeCategory === "ALL" || r.category === activeCategory;
    const matchSev = activeSeverity === "ALL" || r.severity === activeSeverity;
    return matchSearch && matchCat && matchSev;
  });

  const categories: Array<Category | "ALL"> = ["ALL", "MAL", "ABU", "EXF", "INJ", "CHN", "CAP"];
  const severities: Array<Severity | "ALL"> = ["ALL", "BLOCK", "WARN", "INFO"];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="container">
          {/* Header */}
          <div className="mb-12">
            <h1
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.95 0.005 265)" }}
            >
              Detection Rule Catalog
            </h1>
            <p className="text-lg max-w-2xl" style={{ color: "oklch(0.60 0.015 265)" }}>
              {rules.length} rules covering MCP attacks, prompt injection, data exfiltration, container escape, and more.
              Updated automatically as new threats emerge.
            </p>
            <a
              href="https://github.com/kurtpayne/skillscan-security/blob/main/PATTERN_UPDATES.md"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm transition-colors duration-200"
              style={{ color: "oklch(0.65 0.18 290)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.18 290)")}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View pattern update history
            </a>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-4 mb-8">
            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "oklch(0.50 0.015 265)" }} />
              <input
                type="text"
                placeholder="Search rules, IDs, or tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
                style={{
                  background: "oklch(0.16 0.022 265)",
                  border: "1px solid oklch(0.58 0.22 290 / 0.20)",
                  color: "oklch(0.85 0.01 265)",
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = "oklch(0.58 0.22 290 / 0.50)")}
                onBlur={(e) => (e.target.style.borderColor = "oklch(0.58 0.22 290 / 0.20)")}
              />
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    background: activeCategory === cat
                      ? cat === "ALL" ? "oklch(0.58 0.22 290)" : `${categoryColors[cat as Category]}`
                      : "oklch(0.18 0.022 265)",
                    color: activeCategory === cat ? "white" : "oklch(0.60 0.015 265)",
                    border: `1px solid ${activeCategory === cat ? "transparent" : "oklch(0.58 0.22 290 / 0.15)"}`,
                  }}
                >
                  {cat}
                </button>
              ))}
              <div className="w-px mx-1" style={{ background: "oklch(0.58 0.22 290 / 0.15)" }} />
              {severities.map((sev) => (
                <button
                  key={sev}
                  onClick={() => setActiveSeverity(sev)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    background: activeSeverity === sev
                      ? sev === "ALL" ? "oklch(0.58 0.22 290)" : severityConfig[sev as Severity]?.color || "oklch(0.58 0.22 290)"
                      : "oklch(0.18 0.022 265)",
                    color: activeSeverity === sev ? "white" : "oklch(0.60 0.015 265)",
                    border: `1px solid ${activeSeverity === sev ? "transparent" : "oklch(0.58 0.22 290 / 0.15)"}`,
                  }}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm mb-5" style={{ color: "oklch(0.50 0.015 265)" }}>
            Showing {filtered.length} of {rules.length} rules
          </p>

          {/* Rule list */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-16" style={{ color: "oklch(0.50 0.015 265)" }}>
                No rules match your search. Try a different query.
              </div>
            ) : (
              filtered.map((rule) => <RuleCard key={rule.id} rule={rule} />)
            )}
          </div>

          {/* Note about full catalog */}
          <div
            className="mt-10 p-5 rounded-xl text-sm"
            style={{
              background: "oklch(0.16 0.022 265 / 0.5)",
              border: "1px solid oklch(0.58 0.22 290 / 0.15)",
              color: "oklch(0.55 0.015 265)",
            }}
          >
            This catalog shows a representative selection of rules. The full rulepack ships with the package and is updated automatically.{" "}
            <a
              href="https://github.com/kurtpayne/skillscan-security/blob/main/src/skillscan/data/rules/default.yaml"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 transition-colors duration-200"
              style={{ color: "oklch(0.65 0.18 290)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.18 290)")}
            >
              View the full YAML rulepack on GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
