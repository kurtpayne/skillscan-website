/* ============================================================
   RULES PAGE — SkillScan Detection Rule Catalog
   ============================================================ */
import { useState } from "react";
import { Search, ExternalLink, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Severity = "BLOCK" | "WARN" | "INFO";
type Category = "MAL" | "ABU" | "EXF" | "INJ" | "CHN" | "CAP" | "PINJ" | "SUP" | "SE";

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
  { id: "MAL-029", category: "MAL", severity: "BLOCK", title: "Solana RPC C2 Resolution", description: "Detects Solana blockchain RPC getSignaturesForAddress transaction-memo lookup used as dead-drop C2 channel to resolve and execute remote payloads.", tags: ["c2", "blockchain", "solana", "dead-drop"] },
  { id: "MAL-030", category: "MAL", severity: "BLOCK", title: "IDE Deeplink MCP Server Install Abuse", description: "Detects cursor://, vscode://, or vscode-insiders:// deeplinks containing MCP server install parameters (CursorJack attack).", tags: ["ide", "deeplink", "mcp", "cursor"] },
  { id: "MAL-031", category: "MAL", severity: "BLOCK", title: "Deno Bring-Your-Own-Runtime Execution", description: "Detects Deno executing remote URLs, data: URI payloads, or eval with string arguments (LeakNet BYOR technique).", tags: ["deno", "byor", "runtime", "ransomware"] },
  { id: "MAL-032", category: "MAL", severity: "BLOCK", title: "GlassWorm Persistence Marker", description: "Detects the lzcdrtfxyqiplpd marker variable, ~/init.json persistence config, or ~/node-v22 bundled runtime (GlassWorm Wave 6).", tags: ["glassworm", "persistence", "marker"] },
  { id: "MAL-033", category: "MAL", severity: "BLOCK", title: "BlokTrooper VSX Extension Downloader", description: "Detects BlokTrooper GitHub-hosted payload host, fd.onlyOncePlease guard variable, /cldbs upload routes, and /api/service/makelog clipboard logging.", tags: ["vsx", "extension", "bloktrooper", "rat"] },
  { id: "MAL-034", category: "MAL", severity: "BLOCK", title: "Click-Fix WebDAV Share Execution", description: "Detects net use commands mapping attacker-controlled WebDAV shares followed by batch or script execution, a technique used in Click-Fix WebDAV variant campaigns.", tags: ["clickfix", "webdav", "execution", "social-engineering"] },
  { id: "MAL-035", category: "MAL", severity: "BLOCK", title: "Electron app.asar C2 Payload Injection", description: "Detects references to app.asar combined with execution primitives, indicating a trojanized Electron application with C2 beacon injection as seen in the SnappyClient campaign.", tags: ["electron", "asar", "c2", "trojan"] },
  { id: "MAL-036", category: "MAL", severity: "BLOCK", title: "AI-Gated Malware via LLM API C2", description: "Detects malware that uses OpenAI GPT-3.5-Turbo or similar LLM APIs for remote C2 decision-making, evasion technique generation, environment analysis, and obfuscated communication, as documented by Unit 42.", tags: ["ai", "llm", "c2", "evasion", "malware"] },
  { id: "MAL-037", category: "MAL", severity: "BLOCK", title: "GhostClaw/GhostLoader SKILL.md Malware Delivery", description: "Detects the GhostClaw campaign where malicious SKILL.md files in GitHub repositories deliver macOS infostealers via OpenClaw AI-assisted workflows, using fake OpenClawProvider dependencies and curl-to-bash payloads, as documented by Jamf Threat Labs.", tags: ["ghostclaw", "openclaw", "macos", "infostealer", "skill.md"] },
  { id: "MAL-038", category: "MAL", severity: "BLOCK", title: "LotAI — AI Assistant as Covert C2 Relay", description: "Detects the LotAI (Living off the AI) technique where malware uses hidden WebView2 sessions to route C2 traffic through trusted AI assistant domains like Copilot and Grok, as documented by BlackFog.", tags: ["lotai", "webview2", "copilot", "grok", "c2", "ai-assistant"] },
  { id: "MAL-039", category: "MAL", severity: "BLOCK", title: "GitHub Actions Credential Stealer (TeamPCP)", description: "Detects the TeamPCP supply chain attack targeting GitHub Actions Runner.Worker process memory for credential extraction and exfiltration to typosquatted domains, as seen in the second Trivy Action compromise.", tags: ["github-actions", "credential-stealer", "teampcp", "runner-worker", "supply-chain"] },
  { id: "MAL-040", category: "MAL", severity: "BLOCK", title: "CanisterWorm npm Self-Propagating Worm with ICP Blockchain C2", description: "Detects the CanisterWorm self-propagating npm worm that steals npm tokens to publish malicious package versions and uses Internet Computer Protocol (ICP) canisters for decentralized C2 communication, with pgmon Python backdoor persistence.", tags: ["canisterworm", "npm", "worm", "blockchain", "icp", "c2"] },
  { id: "MAL-042", category: "MAL", severity: "BLOCK", title: "CanisterWorm Kubernetes Wiper with Geopolitical Targeting", description: "Detects the CanisterWorm Kubernetes wiper variant that deploys privileged DaemonSets to wipe Iranian-targeted nodes via a container named kamikaze, while installing CanisterWorm backdoors on non-Iranian nodes. Spreads via SSH key theft and exposed Docker APIs.", tags: ["canisterworm", "kubernetes", "wiper", "daemonset", "geopolitical"] },
  // ABU — Abuse Patterns
  { id: "ABU-001", category: "ABU", severity: "WARN", title: "Excessive Permission Request", description: "Detects skill files requesting permissions beyond what is needed for their stated functionality.", tags: ["permissions", "overprivileged"] },
  { id: "ABU-006", category: "ABU", severity: "BLOCK", title: "Stealth Instruction Concealment", description: "Identifies 'do not mention this to the user' and similar instructions designed to hide agent actions from humans.", tags: ["stealth", "deception", "transparency"] },
  { id: "ABU-007", category: "ABU", severity: "WARN", title: "Cross-Server MCP Tool Invocation", description: "Detects instructions to invoke tools from other MCP servers, exploiting MCP's flat namespace for lateral movement.", tags: ["mcp", "cross-server", "lateral-movement"] },
  // EXF — Exfiltration
  { id: "EXF-001", category: "EXF", severity: "BLOCK", title: "HTTP Exfiltration Channel", description: "Identifies patterns that send data to external HTTP endpoints, a primary data exfiltration vector.", tags: ["exfiltration", "http", "data-leak"] },
  { id: "EXF-002", category: "EXF", severity: "BLOCK", title: "DNS Exfiltration", description: "Detects DNS-based data exfiltration patterns where data is encoded in DNS queries.", tags: ["exfiltration", "dns", "covert-channel"] },
  { id: "EXF-003", category: "EXF", severity: "WARN", title: "Cloud Storage Upload", description: "Identifies instructions to upload files or data to cloud storage services (S3, GCS, Azure Blob).", tags: ["exfiltration", "cloud", "upload"] },
  { id: "EXF-016", category: "EXF", severity: "BLOCK", title: "Azure MCP Resource ID URL Token Leak", description: "Detects Azure MCP tool abuse where a URL is supplied in resourceId/resourceIdentifier fields to capture managed identity tokens.", tags: ["exfiltration", "azure", "mcp", "token"] },
  { id: "EXF-017", category: "EXF", severity: "BLOCK", title: "OpenClaw Agent Memory Harvesting", description: "Detects access to MEMORY.md, SOUL.md, .openclaw/memory, .openclaw/identity, and agent-identity files used in the ClawHavoc campaign.", tags: ["exfiltration", "openclaw", "agent", "memory"] },
  { id: "EXEC-041", category: "EXF", severity: "BLOCK", title: "API Traffic Hijacking via AI Agent Settings Override", description: "Detects malicious skills that modify .claude/settings.json to redirect all AI agent API traffic to attacker-controlled servers, silently intercepting all user conversations and code context, as seen in the flyingtimes/podcast-using-skill attack.", tags: ["exfiltration", "api-hijack", "settings-override", "claude"] },
  { id: "MAL-043", category: "MAL", severity: "BLOCK", title: "SANDWORM_MODE npm Worm with McpInject AI Toolchain Poisoning", description: "Detects the SANDWORM_MODE self-replicating npm worm that uses typosquatting packages (claud-code, cloude-code, hardhta, rimarf, veim@2.46.2, yarsg@18.0.1, opencraw@2026, and others) to steal CI secrets, cryptocurrency keys, and LLM API tokens. The McpInject module deploys a rogue MCP server to poison AI coding assistant toolchains.", tags: ["supply-chain", "npm-worm", "mcp-poisoning", "credential-theft", "ai-toolchain"] },
  { id: "MAL-044", category: "MAL", severity: "BLOCK", title: "StoatWaffle Malware via Malicious SKILL.md", description: "Detects the StoatWaffle campaign where malicious SKILL.md files deliver multi-stage malware via PowerShell stagers, base64-encoded payloads, and GitHub raw content delivery, as documented by Secureworks CTU.", tags: ["stoatwaffle", "powershell", "stager", "malware", "skill.md"] },
  { id: "MAL-045", category: "MAL", severity: "BLOCK", title: "MCP Server CVE Exploit Payload", description: "Detects exploit payloads targeting known MCP server vulnerabilities including path traversal, SSRF, and command injection CVEs in popular MCP server packages.", tags: ["mcp", "cve", "exploit", "path-traversal", "ssrf"] },
  { id: "MAL-046", category: "MAL", severity: "BLOCK", title: "CursorJack MCP Deeplink Install Payload", description: "Detects malicious MCP server configurations that embed curl/wget payloads in installCommand fields, exploiting IDE deeplink handlers to execute attacker-controlled scripts (CursorJack attack vector).", tags: ["cursorjack", "mcp", "deeplink", "install-command", "rce"] },
  { id: "MAL-047", category: "MAL", severity: "BLOCK", title: "Claude Code Hooks RCE via enableAllProjectMcpServers", description: "Detects .claude/settings.json configurations that set enableAllProjectMcpServers: true inside hooks, enabling arbitrary code execution via untrusted MCP servers in the project directory.", tags: ["claude-code", "hooks", "mcp", "rce", "settings-override"] },
  // PINJ — Prompt/Pipeline Injection
  { id: "PINJ-005", category: "PINJ", severity: "BLOCK", title: "Clinejection Indirect Prompt Injection via External Data Fields", description: "Detects the Clinejection attack where malicious instructions embedded in GitHub issue titles, EC2 metadata tags, or CRM order comments are processed by AI triage bots (claude-code-action), enabling AI-induced lateral movement (AILM) and supply chain compromise.", tags: ["prompt-injection", "indirect-injection", "ai-agent", "supply-chain", "lateral-movement"] },
  { id: "PINJ-002", category: "PINJ", severity: "BLOCK", title: "MCP Tool Result MEDIA Directive Injection", description: "Detects MEDIA: directives followed by file paths in tool result content, used to exfiltrate local files through the media processing pipeline.", tags: ["injection", "media", "mcp", "exfiltration"] },
  { id: "PINJ-003", category: "PINJ", severity: "BLOCK", title: "Prompt Control Persistence via Heartbeat/Memory Store", description: "Detects prompt control persistence where attackers embed instructions in heartbeat files and memory stores that AI agents periodically read, creating a cognitive control plane for persistent C2 without traditional network beaconing.", tags: ["prompt-injection", "persistence", "heartbeat", "c2", "memory"] },
  { id: "PINJ-004", category: "PINJ", severity: "BLOCK", title: "Claudy Day Prompt Injection via URL Parameter", description: "Detects the Claudy Day attack chain against Claude.ai combining invisible prompt injection via URL parameters, data exfiltration via the Anthropic Files API, and an open redirect on claude.com, as documented by Oasis Security.", tags: ["prompt-injection", "claude", "exfiltration", "url-injection", "redirect"] },
  { id: "PINJ-006", category: "PINJ", severity: "BLOCK", title: "Indirect Prompt Injection via Encoded Payload", description: "Detects base64 or hex-encoded payloads embedded in skill files with instructions to decode and execute, a common obfuscation technique for prompt injection attacks.", tags: ["prompt-injection", "base64", "obfuscation", "encoded-payload"] },
  { id: "PINJ-007", category: "PINJ", severity: "BLOCK", title: "MCP Sampling/createMessage Context Exfiltration", description: "Detects abuse of the MCP sampling/createMessage feature to extract credentials, API keys, system prompts, and other sensitive context from the agent and forward them to external endpoints.", tags: ["mcp", "sampling", "context-exfil", "credentials", "create-message"] },
  // SUP — Supply Chain
  { id: "SUP-009", category: "SUP", severity: "WARN", title: "Bittensor Wallet Backdoor Indicators", description: "Detects indicators of the compromised bittensor-wallet 4.0.2 PyPI package with 3-layer C2 exfiltration system.", tags: ["supply-chain", "pypi", "bittensor", "backdoor"] },
  { id: "SUP-010", category: "SUP", severity: "BLOCK", title: "npm Postinstall Environment Variable Exfiltration", description: "Detects malicious npm postinstall scripts that collect process.env and exfiltrate environment variables to webhook.site or agentmail endpoints, as seen in the sbx-mask/touch-adv supply chain attack.", tags: ["supply-chain", "npm", "postinstall", "exfiltration"] },
  { id: "SUP-011", category: "SUP", severity: "BLOCK", title: "Open VSX extensionPack Transitive Dependency Attack", description: "Detects GlassWorm Wave 7 technique where malicious Open VSX extensions use extensionPack and extensionDependencies arrays to silently install payload extensions as transitive dependencies, bypassing marketplace review.", tags: ["supply-chain", "vscode", "extensionpack", "glassworm", "transitive"] },
  { id: "SUP-012", category: "SUP", severity: "BLOCK", title: "npm Dependency Chain Postinstall Loader", description: "Detects three-layer npm dependency chain attacks where hollow relay scoped packages deliver Solana blockchain C2 malware via postinstall hooks executing standalone JavaScript loader files, as seen in the GlassWorm/ForceMemo React Native compromise.", tags: ["supply-chain", "npm", "postinstall", "dependency-chain", "solana"] },
  { id: "SUP-013", category: "SUP", severity: "BLOCK", title: "MCP Server Command Injection via Git Parameters", description: "Detects command injection vulnerabilities in MCP server packages that pass unsanitized user input to shell commands. CVE-2026-4198 affects mcp-server-auto-commit and CVE-2026-4496 affects sigmade/Git-MCP-Server.", tags: ["supply-chain", "mcp", "command-injection", "rce", "git"] },
  { id: "SUP-014", category: "SUP", severity: "BLOCK", title: "Azure MCP Server SSRF Privilege Escalation (CVE-2026-26118)", description: "Detects CVE-2026-26118, a server-side request forgery vulnerability in Azure MCP Server Tools (CVSS 8.8) that allows an authorized attacker to escalate privileges over a network. Fixed in @azure/mcp@0.0.2.", tags: ["supply-chain", "azure", "mcp-server", "ssrf", "privilege-escalation", "cve"] },
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
  // SE — Social Engineering (v0.3.2)
  { id: "SE-001", category: "SE", severity: "BLOCK", title: "Social Engineering Credential Harvest", description: "Detects instructions that direct the AI to solicit credentials, tokens, API keys, or secrets from users on behalf of a service. Added in v0.3.2.", tags: ["social-engineering", "credential-harvest", "instruction-abuse"] },
];

const categoryColors: Record<Category, string> = {
  MAL: "oklch(0.65 0.22 25)",
  ABU: "oklch(0.72 0.19 45)",
  EXF: "oklch(0.60 0.20 320)",
  INJ: "oklch(0.58 0.22 290)",
  CHN: "oklch(0.65 0.18 200)",
  CAP: "oklch(0.70 0.15 160)",
  PINJ: "oklch(0.55 0.24 280)",
  SUP: "oklch(0.68 0.16 80)",
  SE: "oklch(0.62 0.20 340)",
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

  const categories: Array<Category | "ALL"> = ["ALL", "MAL", "ABU", "EXF", "INJ", "CHN", "CAP", "PINJ", "SUP", "SE"];
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
