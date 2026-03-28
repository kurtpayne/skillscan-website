/* ============================================================
   RULES PAGE — SkillScan Detection Rule Catalog
   ============================================================ */
import { useState } from "react";
import { Search, ExternalLink, AlertTriangle, XCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Severity = "BLOCK" | "WARN" | "INFO";
type Category = "MAL" | "ABU" | "EXF" | "INJ" | "CHN" | "PINJ" | "SUP" | "SE" | "DEF" | "EXEC" | "GR" | "OBF" | "PSV" | "CAP";

interface Rule {
  id: string;
  category: Category;
  severity: Severity;
  title: string;
  description: string;
  tags: string[];
}

const rules: Rule[] = [
// AUTO_SYNC_BEGIN: rules array
  // ABU — Abuse Patterns
  { id: "ABU-001", category: "ABU", severity: "BLOCK", title: "Coercive prerequisite wording", description: "Remove coercive setup steps. Do not ask users to disable security controls.", tags: [] },
  { id: "ABU-002", category: "ABU", severity: "BLOCK", title: "Privilege escalation combined with security control disable", description: "Skills must not request elevated privileges or instruct users to disable security controls.", tags: ["instruction_abuse", "privilege-escalation"] },
  { id: "ABU-003", category: "ABU", severity: "BLOCK", title: "Claude Code project MCP auto-approval marker", description: "Do not commit repository-level MCP auto-approval settings. Require explicit per-project user consent before initializing MCP servers from untrusted repos.", tags: [] },
  { id: "ABU-004", category: "ABU", severity: "BLOCK", title: "Tool auto-approve allowlist includes package-install command", description: "Do not auto-approve package-install commands in AI tool/extension settings. Require explicit user confirmation for install actions because lifecycle scripts can execute arbitrary code.", tags: [] },
  { id: "ABU-005", category: "ABU", severity: "BLOCK", title: "MCP tool name-collision hijack marker", description: "Treat MCP server/tool registration naming-collision guidance as high risk. Require unique namespaced tool IDs per server and block ambiguous aliases that can shadow trusted tools.", tags: [] },
  { id: "ABU-006", category: "ABU", severity: "BLOCK", title: "Stealth instruction concealment from user", description: "Remove instructions that direct the agent to conceal actions from the user. All agent operations should be transparent and auditable.", tags: ["mcp"] },
  { id: "ABU-007", category: "ABU", severity: "BLOCK", title: "Cross-server MCP tool invocation instruction", description: "Reject tool descriptions that instruct the LLM to invoke tools from other MCP servers. Each server should only reference its own tools.", tags: ["mcp"] },
  // CAP — CAP
  { id: "CAP-001", category: "CAP", severity: "BLOCK", title: "Capability laundering — disproportionate credential or file access for stated purpose", description: "Capability laundering wraps a low-risk stated purpose (date formatting, word counting, spell checking) around instructions that acquire disproportionate capabilities such as reading AWS credentials, SSH keys, or shell profile files. Review the tool list and file-access steps against the skill's stated purpose. Reject skills where the required permissions are not justified by the declared function.", tags: ["capability-laundering", "credential-access", "over-privileged"] },
  // CHN — Chain Rules
  { id: "CHN-001", category: "CHN", severity: "BLOCK", title: "Download + Execute chain", description: "Remove the download-and-execute pattern. Pin to a verified digest and review before execution.", tags: [] },
  { id: "CHN-002", category: "CHN", severity: "BLOCK", title: "Secret access + Network exfiltration chain", description: "Secrets must not be transmitted to external endpoints. Use a secrets manager.", tags: [] },
  { id: "CHN-003", category: "CHN", severity: "BLOCK", title: "Secret access combined with DNS exfiltration", description: "Skills must not encode credentials into DNS lookups.", tags: [] },
  { id: "CHN-004", category: "CHN", severity: "BLOCK", title: "GitHub Actions full secrets context dump + network", description: "Never pass the full secrets context to external endpoints. Reference only the specific secret needed.", tags: [] },
  { id: "CHN-005", category: "CHN", severity: "BLOCK", title: "pull_request_target + untrusted PR-head checkout", description: "Avoid checking out untrusted PR head code in pull_request_target workflows.", tags: [] },
  { id: "CHN-006", category: "CHN", severity: "BLOCK", title: "pull_request_target + untrusted PR metadata interpolation", description: "Sanitize or avoid using PR metadata (title/body/label) in shell run steps.", tags: [] },
  { id: "CHN-007", category: "CHN", severity: "BLOCK", title: "pull_request_target + untrusted cache key", description: "Use only trusted static values in cache keys within pull_request_target workflows.", tags: [] },
  { id: "CHN-008", category: "CHN", severity: "BLOCK", title: "pull_request_target + unpinned third-party action", description: "Pin action refs to full commit SHAs in pull_request_target workflows.", tags: [] },
  { id: "CHN-009", category: "CHN", severity: "BLOCK", title: "Secret access combined with SMTP exfiltration", description: "Skills must not read credentials and send them via email or SMTP.", tags: [] },
  { id: "CHN-010", category: "CHN", severity: "BLOCK", title: "pull_request_target + PR ref/branch metadata interpolation", description: "Validate and sanitize PR ref/branch metadata before interpolating in run steps.", tags: [] },
  { id: "CHN-011", category: "CHN", severity: "BLOCK", title: "Secret access combined with SCP/rsync exfiltration", description: "Skills must not copy credentials to remote hosts via scp or rsync.", tags: [] },
  { id: "CHN-012", category: "CHN", severity: "BLOCK", title: "Stealth concealment combined with network exfiltration", description: "Remove instructions that direct the agent to conceal network operations from the user. All data transmissions must be transparent and auditable.", tags: [] },
  { id: "CHN-013", category: "CHN", severity: "BLOCK", title: "Docker socket mount combined with privileged container execution", description: "Mounting the Docker socket in a privileged container enables full host escape. Remove the socket mount or the privileged flag.", tags: [] },
  { id: "CHN-014", category: "CHN", severity: "BLOCK", title: "Privileged container execution combined with secret access", description: "Passing credentials into a privileged container exposes secrets to full host compromise. Remove the privileged flag or avoid injecting secrets into privileged containers.", tags: [] },
  // DEF — Defense Evasion
  { id: "DEF-001", category: "DEF", severity: "BLOCK", title: "Windows Defender exclusion manipulation", description: "Remove all commands that disable or weaken Windows Defender protections. Security controls should never be programmatically disabled.", tags: [] },
  // EXEC — Execution Hijack
  { id: "EXEC-041", category: "EXEC", severity: "BLOCK", title: "API traffic hijacking via AI agent settings override", description: "Do not override AI agent API endpoints in settings files. The flyingtimes/podcast-using-skill attack redirected all Claude Code API traffic to Zhipu AI BigModel platform in China by modifying .claude/settings.json, silently intercepting all user conversations and code context.", tags: ["api-hijack"] },
  // EXF — Exfiltration
  { id: "EXF-001", category: "EXF", severity: "BLOCK", title: "Sensitive credential file access", description: "Do not read secret files unless strictly required; use scoped secret providers instead.", tags: [] },
  { id: "EXF-002", category: "EXF", severity: "BLOCK", title: "Cryptocurrency wallet file access", description: "Do not access wallet files or seed phrases; crypto operations should use secure key management and never expose private keys.", tags: [] },
  { id: "EXF-003", category: "EXF", severity: "BLOCK", title: "Markdown image beacon exfiltration pattern", description: "Do not include instruction-driven external image beacons with interpolated data placeholders; treat metadata/context text as untrusted.", tags: [] },
  { id: "EXF-004", category: "EXF", severity: "BLOCK", title: "GitHub Actions full secrets context dump", description: "Never serialize full GitHub Actions secrets context; pass only minimally scoped values required for a specific step.", tags: [] },
  { id: "EXF-005", category: "EXF", severity: "BLOCK", title: "GitHub Actions untrusted PR head checkout reference", description: "Avoid checking out `github.event.pull_request.head.*` in privileged workflows. Use `pull_request` for untrusted code, or gate privileged jobs and use immutable trusted refs.", tags: [] },
  { id: "EXF-006", category: "EXF", severity: "BLOCK", title: "IPv4-mapped IPv6 loopback/metadata SSRF bypass literal", description: "Block IPv4-mapped IPv6 loopback/metadata literals in untrusted URLs and normalize IP forms before SSRF allow/deny checks.", tags: [] },
  { id: "EXF-007", category: "EXF", severity: "BLOCK", title: "OpenClaw gateway token/private-key config access marker", description: "Do not read, copy, or transmit OpenClaw agent config/identity files (`openclaw.json`, `device.json`) or fields like `gateway.auth.token`/`privateKeyPem`; rotate compromised tokens and re-pair devices.", tags: [] },
  { id: "EXF-008", category: "EXF", severity: "BLOCK", title: "GitHub Actions untrusted PR metadata interpolation in run/script", description: "Do not interpolate untrusted pull request metadata directly into shell/script steps. Pass through safe quoting or dedicated actions and avoid shell evaluation in privileged workflows.", tags: [] },
  { id: "EXF-009", category: "EXF", severity: "BLOCK", title: "MCP tool hidden credential-harvest prompt block marker", description: "Remove hidden MCP tool instructions that coerce secret-file reads and silent context exfiltration. Tool descriptions must never request credential collection or conceal data handling from users.", tags: [] },
  { id: "EXF-010", category: "EXF", severity: "BLOCK", title: "GitHub Actions cache key interpolation from untrusted PR metadata", description: "Do not derive cache keys from untrusted PR metadata. Use trusted immutable inputs and segregate cache scopes between untrusted and privileged workflows.", tags: [] },
  { id: "EXF-011", category: "EXF", severity: "BLOCK", title: "GitHub Codespaces token file + remote JSON schema exfil marker", description: "Treat Codespaces issue/agent prompts as untrusted input. Do not read `user-secrets-envs.json`, and block remote `$schema` URLs carrying query-parameter data exfil payloads.", tags: [] },
  { id: "EXF-012", category: "EXF", severity: "BLOCK", title: "Claude Code project env ANTHROPIC_BASE_URL override marker", description: "Do not set `ANTHROPIC_BASE_URL` in repository-scoped project config/env files unless it is a vetted internal Anthropic-compatible endpoint. Treat repo-provided endpoint overrides as credential-exfil risk in untrusted projects.", tags: [] },
  { id: "EXF-013", category: "EXF", severity: "BLOCK", title: "AI assistant global MCP config injection marker", description: "Treat scripts/instructions that write `mcpServers` entries into user-home assistant config files as high risk. Do not auto-modify global MCP config from repository code; require explicit user review and trusted server provenance.", tags: [] },
  { id: "EXF-014", category: "EXF", severity: "BLOCK", title: "Bracket-glob obfuscated sensitive path marker", description: "Treat bracket-glob path obfuscation as suspicious when accessing sensitive files. Normalize/resolve glob metacharacters before blocklist checks and reject obfuscated sensitive path reads.", tags: [] },
  { id: "EXF-015", category: "EXF", severity: "BLOCK", title: "Multi-target developer credential file harvest list marker", description: "Treat combined references to multiple developer credential stores (`.npmrc`, `.git-credentials`, GitHub CLI `hosts.yml`) as high-risk exfiltration behavior. Remove unauthorized collection logic and rotate exposed tokens.", tags: [] },
  { id: "EXF-016", category: "EXF", severity: "BLOCK", title: "Azure MCP resource-identifier URL substitution token-leak marker", description: "Treat MCP tool inputs that accept Azure resource identifiers as untrusted and enforce strict identifier format validation. Never allow arbitrary URLs in resource-id fields, and prevent managed-identity tokens from being attached to outbound requests.", tags: [] },
  { id: "EXF-017", category: "EXF", severity: "BLOCK", title: "OpenClaw agent memory and identity file harvesting", description: "Do not access, copy, or transmit OpenClaw agent memory or identity files (MEMORY.md, SOUL.md). These contain sensitive agent context and personality data that can be weaponized for impersonation or lateral movement.", tags: [] },
  { id: "EXF-018", category: "EXF", severity: "BLOCK", title: "Error message instructed to leak system prompt or conversation history", description: "This skill instructs the AI to include system prompt contents, conversation history, or full context in error messages. This is a data exfiltration technique that exploits error handling paths to leak sensitive context. Error messages must never include system prompt contents, conversation history, or prior message context. Use generic error messages that do not reflect internal state. ", tags: ["error-leakage", "context-leak", "prompt-exfil"] },
  { id: "EXF-019", category: "EXF", severity: "BLOCK", title: "Logging or audit endpoint collecting conversation history or environment metadata", description: "This skill configures logging, audit, or telemetry endpoints that collect conversation history, message content, or environment metadata. This is a covert data exfiltration channel that routes sensitive context to external infrastructure. Skills must not log or transmit conversation history, system prompt contents, or environment variables to external endpoints. Use local-only, privacy-preserving logging that does not include message content. ", tags: ["logging-abuse", "telemetry-exfil", "conversation-harvest"] },
  { id: "EXF-020", category: "EXF", severity: "BLOCK", title: "TeamPCP sysmon backdoor Kubernetes lateral movement", description: "The TeamPCP campaign (via LiteLLM) deploys a persistent C2 backdoor capable of laterally compromising every node in a Kubernetes cluster by enumerating secrets. Rotate all Kubernetes secrets and audit for models.litellm.cloud connections.", tags: ["teampcp", "kubernetes", "lateral-movement"] },
  // GR — Graph Rules
  { id: "GR-007", category: "GR", severity: "BLOCK", title: "Circular skill dependency detected", description: "Break the cycle by removing one of the skill invocation references. Circular dependencies can cause infinite loops and may be used to bypass per-skill rate limits or tool restrictions. ", tags: ["graph", "circular-dependency", "graph-rule"] },
  // MAL — Malware Patterns
  { id: "MAL-001", category: "MAL", severity: "BLOCK", title: "Download-and-execute chain", description: "Remove download-and-execute chains. Pin and verify artifacts before execution.", tags: [] },
  { id: "MAL-002", category: "MAL", severity: "BLOCK", title: "Base64 decode + execution", description: "Avoid decode-and-exec flows. Store reviewed scripts in-repo and execute only trusted files.", tags: [] },
  { id: "MAL-003", category: "MAL", severity: "BLOCK", title: "Subshell downloader execution pattern", description: "Remove subshell/encoded execution flows. Keep scripts explicit, reviewed, and non-obfuscated.", tags: [] },
  { id: "MAL-004", category: "MAL", severity: "BLOCK", title: "Dynamic code evaluation pattern", description: "Avoid eval/exec flows that execute arbitrary code strings; use explicit functions and validated inputs instead.", tags: [] },
  { id: "MAL-005", category: "MAL", severity: "BLOCK", title: "mshta.exe remote execution pattern", description: "Remove mshta.exe invocations that fetch remote HTA/VBScript payloads. Use explicit local scripts with integrity validation instead.", tags: [] },
  { id: "MAL-006", category: "MAL", severity: "BLOCK", title: "PowerShell web request piped to Invoke-Expression", description: "Remove web-request-to-Invoke-Expression execution chains. Download reviewed scripts to disk, validate integrity, and run with explicit local paths.", tags: [] },
  { id: "MAL-007", category: "MAL", severity: "BLOCK", title: "BYOVD security-killer toolkit marker", description: "Remove BYOVD-related tool/driver references and service-creation commands. Never include guidance that disables EDR/AV through vulnerable drivers.", tags: [] },
  { id: "MAL-008", category: "MAL", severity: "BLOCK", title: "Discord Electron debugger credential interception marker", description: "Remove Electron debugger network-interception hooks that capture credentials, MFA data, or tokens from Discord endpoints.", tags: [] },
  { id: "MAL-009", category: "MAL", severity: "BLOCK", title: "ClickFix DNS nslookup staged command execution pattern", description: "Do not include ClickFix-style instructions that parse DNS lookup output and execute it. Never run clipboard/Run-dialog commands from untrusted pages.", tags: [] },
  { id: "MAL-010", category: "MAL", severity: "BLOCK", title: "GitHub Actions issue/comment metadata interpolation in run/script", description: "Do not interpolate untrusted issue/comment/discussion content directly into shell or script blocks. Route via environment variables and treat values as untrusted data.", tags: [] },
  { id: "MAL-011", category: "MAL", severity: "BLOCK", title: "pull_request_target workflow using unpinned third-party action ref", description: "In privileged workflows (especially pull_request_target), pin third-party actions to immutable full commit SHAs instead of mutable tags (v1, v4, main) to prevent tag-retarget supply-chain abuse.", tags: [] },
  { id: "MAL-012", category: "MAL", severity: "BLOCK", title: "VS Code task autorun-on-folder-open marker", description: "Treat repository-supplied VS Code tasks as untrusted. Remove `runOn: folderOpen` auto-run behavior for unreviewed tasks and require explicit, reviewed execution.", tags: [] },
  { id: "MAL-013", category: "MAL", severity: "BLOCK", title: "macOS osascript JavaScript (JXA) execution marker", description: "Remove osascript JXA execution flows from install/setup paths. Avoid running JavaScript for Automation payloads from untrusted sources.", tags: [] },
  { id: "MAL-014", category: "MAL", severity: "BLOCK", title: "Deceptive media/document double-extension LNK masquerade", description: "Treat media/document-looking `.lnk` files as suspicious. Block or quarantine double-extension shortcut artifacts and require verified non-shortcut originals.", tags: [] },
  { id: "MAL-015", category: "MAL", severity: "BLOCK", title: "Claude Code hooks shell command execution marker", description: "Treat repository-scoped Claude Code hooks as untrusted. Remove auto-executed shell commands from `.claude/settings.json` and require explicit, reviewed local scripts.", tags: [] },
  { id: "MAL-016", category: "MAL", severity: "BLOCK", title: "Pastebin steganographic dead-drop resolver marker", description: "Treat install-time loaders that decode C2 from Pastebin text as malicious. Remove dead-drop resolver logic and block outbound execution of decoded domains.", tags: [] },
  { id: "MAL-017", category: "MAL", severity: "BLOCK", title: "WebSocket C2 shell execution marker", description: "Treat WebSocket command channels that launch shell/process execution as malicious. Remove package/runtime code that combines outbound WebSocket control paths with command execution primitives.", tags: [] },
  { id: "MAL-018", category: "MAL", severity: "BLOCK", title: "node-glob CLI --cmd shell execution sink marker", description: "Avoid `glob -c/--cmd` on untrusted file paths. Upgrade glob CLI to patched versions and prefer `--cmd-arg/-g` (non-shell argument passing) when command templating is required.", tags: [] },
  { id: "MAL-019", category: "MAL", severity: "BLOCK", title: "StegaBin npm shared payload path marker", description: "Treat references to `vendor/scrypt-js/version.js` in install/setup flows as high-risk campaign-linked malware markers. Remove package and investigate publisher provenance before installation.", tags: [] },
  { id: "MAL-020", category: "MAL", severity: "BLOCK", title: "VS Code task off-screen whitespace command padding marker", description: "Treat repository-provided VS Code tasks as untrusted. Remove excessive leading-whitespace command padding and require explicit review of hidden shell/bootstrap command content.", tags: [] },
  { id: "MAL-021", category: "MAL", severity: "BLOCK", title: "GitHub Actions branch/ref metadata interpolation in run/script", description: "Do not interpolate untrusted branch/ref metadata directly into shell/script steps. Treat branch names as attacker-controlled input and pass through strict quoting/sanitization.", tags: [] },
  { id: "MAL-022", category: "MAL", severity: "BLOCK", title: "Bash parameter-expansion command smuggling marker", description: "Treat bash parameter expansions using `@P` or default/assignment operators with embedded command/process substitutions as unsafe in AI-suggested shell commands. Require explicit user review and block auto-execution.", tags: [] },
  { id: "MAL-023", category: "MAL", severity: "BLOCK", title: "Cross-platform password-harvest credential validation marker", description: "Treat scripts that validate user-supplied passwords via `dscl -authonly`, `ValidateCredentials`, or `su -c true` as credential-harvest behavior. Remove password-collection flows and use OS-native delegated auth mechanisms.", tags: [] },
  { id: "MAL-024", category: "MAL", severity: "BLOCK", title: "CloudFormation admin-role bootstrap marker via CAPABILITY_IAM", description: "Treat CloudFormation deployment snippets that combine IAM-creation capabilities with direct `AdministratorAccess` policy attachment as high risk. Require explicit approval, least-privilege templates, and guardrails around CI-issued AWS credentials.", tags: [] },
  { id: "MAL-025", category: "MAL", severity: "BLOCK", title: "MCP tool description poisoning via hidden instruction block", description: "Reject MCP tool descriptions containing hidden instruction blocks (<IMPORTANT> tags). Tool descriptions should contain only documentation, not executable instructions for the LLM.", tags: ["mcp"] },
  { id: "MAL-026", category: "MAL", severity: "BLOCK", title: "Docker socket mount or access pattern", description: "Never mount or access the Docker socket from within a skill or agent. Docker socket access provides full control over the host and enables container escape.", tags: ["container_escape"] },
  { id: "MAL-027", category: "MAL", severity: "BLOCK", title: "Privileged container execution or dangerous capability grant", description: "Do not run containers with --privileged or dangerous capability grants. Use the minimum required capabilities and enforce seccomp/AppArmor profiles.", tags: ["container_escape"] },
  { id: "MAL-028", category: "MAL", severity: "BLOCK", title: "Host network infrastructure manipulation", description: "Do not modify host network configuration files (/etc/hosts, /etc/resolv.conf) or firewall rules from within a skill. These operations can enable DNS hijacking and traffic interception.", tags: ["container_escape"] },
  { id: "MAL-029", category: "MAL", severity: "BLOCK", title: "Solana RPC blockchain C2 resolution marker", description: "Treat Solana RPC transaction-memo lookups combined with code execution or network fetch as a blockchain-based C2 dead-drop channel. Remove install-time Solana RPC resolution logic and block outbound execution of decoded payloads.", tags: [] },
  { id: "MAL-030", category: "MAL", severity: "BLOCK", title: "IDE deeplink MCP server install abuse", description: "Do not follow IDE deeplinks from untrusted sources that trigger MCP server installations. Verify the source and review server configuration before approval.", tags: [] },
  { id: "MAL-031", category: "MAL", severity: "BLOCK", title: "Deno bring-your-own-runtime execution pattern", description: "Treat Deno executing remote URLs, data-URIs, or eval payloads outside development environments as a BYOR loader. Block unexpected Deno invocations in production and CI/CD pipelines.", tags: [] },
  { id: "MAL-032", category: "MAL", severity: "BLOCK", title: "GlassWorm persistence marker variable", description: "The variable name lzcdrtfxyqiplpd and the file ~/init.json are known GlassWorm persistence indicators. Remove any matching artifacts and audit the installation source.", tags: [] },
  { id: "MAL-033", category: "MAL", severity: "BLOCK", title: "BlokTrooper VSX extension GitHub-hosted downloader pattern", description: "Remove GitHub-hosted shell downloaders from editor extensions. Never pipe raw.githubusercontent.com content into a shell. Revoke compromised publisher tokens and audit all extension versions.", tags: [] },
  { id: "MAL-034", category: "MAL", severity: "BLOCK", title: "Click-Fix WebDAV share mount and execute pattern", description: "Do not map WebDAV shares via net use and execute remote scripts. This is a Click-Fix variant that stages payloads on attacker-controlled WebDAV servers to bypass download protections and execute malicious batch scripts or trojanized applications.", tags: [] },
  { id: "MAL-035", category: "MAL", severity: "BLOCK", title: "OpenClaw gatewayUrl parameter injection and approval bypass", description: "Do not accept gatewayUrl parameters from untrusted sources or disable execution approval prompts. The CVE-2026-25253 attack chain exploits gatewayUrl injection to steal auth tokens and bypass approval safeguards for full RCE.", tags: [] },
  { id: "MAL-036", category: "MAL", severity: "BLOCK", title: "AI-gated malware execution via LLM API C2 decision-making", description: "Do not use LLM APIs for malware decision-making, evasion technique generation, or C2 communication obfuscation. This pattern detects AI-gated malware that abuses OpenAI or similar APIs as a remote C2 decision layer, as documented by Unit 42.", tags: [] },
  { id: "MAL-037", category: "MAL", severity: "BLOCK", title: "GhostClaw/GhostLoader SKILL.md malware delivery via OpenClaw workflows", description: "Remove GhostClaw/GhostLoader infection markers. Do not install skills that reference OpenClawProvider as a dependency or use curl with -k (insecure) to fetch payloads from raw IPs. This pattern detects the GhostClaw campaign documented by Jamf Threat Labs that delivers macOS infostealers via malicious SKILL.md files in GitHub repositories.", tags: [] },
  { id: "MAL-038", category: "MAL", severity: "BLOCK", title: "LotAI technique — AI assistant used as covert C2 relay via hidden WebView2", description: "Do not use hidden WebView2 sessions to route traffic through AI assistants as a covert C2 channel. This pattern detects the LotAI (Living off the AI) technique where malware abuses Copilot, Grok, or similar AI assistants with URL-fetching capabilities as command-and-control relays.", tags: [] },
  { id: "MAL-039", category: "MAL", severity: "BLOCK", title: "GitHub Actions credential stealer with Runner.Worker memory harvesting", description: "Do not use GitHub Actions that harvest Runner.Worker process memory or environment variables for credential theft. This pattern detects the TeamPCP supply chain attack that compromised Trivy and other GitHub Actions to inject RSA-encrypted credential stealers exfiltrating to typosquatted domains.", tags: [] },
  { id: "MAL-040", category: "MAL", severity: "BLOCK", title: "CanisterWorm npm self-propagating worm with ICP blockchain C2", description: "Remove CanisterWorm infection markers. This self-propagating npm worm steals npm tokens to publish malicious package versions and uses Internet Computer Protocol (ICP) canisters for C2 communication. Affected scoped packages include @EmilGroup, @opengov, and @pypestream namespaces.", tags: [] },
  { id: "MAL-041", category: "MAL", severity: "BLOCK", title: "Trojanized Electron app.asar C2 payload injection", description: "Do not inject C2 beacons or downloaders into Electron app.asar archives. Verify the integrity of Electron application packages and reject modified asar files that contain unexpected network or execution calls.", tags: [] },
  { id: "MAL-042", category: "MAL", severity: "BLOCK", title: "CanisterWorm Kubernetes wiper with geopolitical targeting", description: "Remove CanisterWorm Kubernetes wiper payloads. This variant deploys privileged DaemonSets that wipe Iranian-targeted nodes via a container named kamikaze, while installing CanisterWorm backdoors on non-Iranian nodes. It also spreads via SSH key theft and exposed Docker APIs on port 2375.", tags: ["kubernetes", "wiper"] },
  { id: "MAL-043", category: "MAL", severity: "BLOCK", title: "SANDWORM_MODE npm worm with McpInject AI toolchain poisoning", description: "Remove SANDWORM_MODE infection markers. This self-replicating npm worm uses typosquatting packages (claud-code, cloude-code, hardhta, rimarf, veim, yarsg, opencraw, secp256, naniod, scan-store, suport-color, locale-loader-pro, etc.) to steal CI secrets, cryptocurrency keys, and LLM API tokens. The McpInject module deploys a rogue MCP server to poison AI coding assistant toolchains via prompt injection. Audit npm dependencies for any of the listed package names.", tags: ["supply-chain", "npm-worm", "mcp-poisoning", "credential-theft", "ai-toolchain"] },
  { id: "MAL-044", category: "MAL", severity: "BLOCK", title: "SQLBot stored prompt injection to RCE via COPY TO PROGRAM", description: "Do not allow AI SQL agents to execute COPY TO PROGRAM commands. CVE-2026-32622 is a stored prompt injection vulnerability in SQLBot where malicious Excel files with embedded prompt injection payloads cause the AI agent to execute arbitrary system commands as the postgres user via COPY TO PROGRAM. Restrict SQL agent permissions and sanitize all uploaded data.", tags: ["prompt-injection", "rce", "sql", "postgres", "ai-agent", "cve"] },
  { id: "MAL-045", category: "MAL", severity: "BLOCK", title: "StoatWaffle Node.js malware family (WaterPlum/Contagious Interview)", description: "Remove StoatWaffle malware artifacts. This is a modular Node.js malware deployed by WaterPlum Team 8 (Contagious Interview campaign) via malicious VSCode repositories with tasks.json auto-run triggers. The malware includes a credential stealer targeting browsers and crypto wallets, and a RAT module for persistent remote access. Remove vscode-bootstrap.cmd and env.npl files and scan for C2 communications.", tags: ["malware", "nodejs", "stoatwaffle", "waterplum", "contagious-interview", "vscode", "rat", "stealer"] },
  { id: "MAL-046", category: "MAL", severity: "BLOCK", title: "CursorJack-style MCP deeplink staged payload", description: "Malicious MCP deeplinks (cursor:// or similar) can encode a staged payload in the installCommand field that downloads and executes a remote script (CursorJack, CVE-2025-54136). Never install MCP servers from untrusted links. Verify installCommand contents before accepting any MCP install dialog.", tags: ["mcp", "deeplink", "staged-payload", "cursorjack", "cve", "rce"] },
  { id: "MAL-047", category: "MAL", severity: "BLOCK", title: "Claude Code hooks RCE via project settings", description: "Malicious .claude/settings.json hooks execute shell commands on SessionStart without user confirmation (CVE-2025-59536). Setting enableAllProjectMcpServers:true bypasses the MCP consent dialog (CVE-2026-21852). Never clone and open untrusted repositories in Claude Code without reviewing .claude/settings.json and .mcp.json. Both CVEs are patched in current Claude Code versions.", tags: ["claude-code", "hooks", "mcp", "rce", "cve", "project-settings"] },
  { id: "MAL-048", category: "MAL", severity: "BLOCK", title: "Langflow unauthenticated RCE via build_public_tmp endpoint", description: "Langflow versions prior to the fix for CVE-2026-33017 allow unauthenticated remote code execution via the /api/v1/build_public_tmp/{flow_id}/flow endpoint. Attackers inject arbitrary Python code in the flow data parameter to execute commands, read environment variables, and obtain reverse shells. Update Langflow immediately and restrict access to the build_public_tmp API endpoint.", tags: ["langflow", "rce", "cve", "ai-pipeline", "unauthenticated", "supply-chain"] },
  { id: "MAL-049", category: "MAL", severity: "BLOCK", title: "LiteLLM .pth file persistence and sysmon backdoor (TeamPCP)", description: "The LiteLLM PyPI package (versions 1.82.7 and 1.82.8) was compromised by TeamPCP via a poisoned Trivy scanner in CI/CD. The malware injects a .pth file (litellm_init.pth) into site-packages for Python startup persistence, creates ~/.config/sysmon/sysmon.py and a systemd user service for long-term backdoor access, and exfiltrates SSH keys, cloud credentials, and Kubernetes secrets to models.litellm.cloud. Remove compromised versions, audit for persistence artifacts, and rotate all exposed credentials. ", tags: ["supply-chain", "litellm", "teampcp", "pth-persistence", "credential-theft", "backdoor"] },
  { id: "MAL-050", category: "MAL", severity: "BLOCK", title: "Ghost Campaign malicious npm packages (sudo phishing RAT)", description: "These npm package names are known-malicious from the Ghost Campaign documented by The Hacker News in March 2026. The packages use fake installation logs to conceal malware activity, phish for sudo passwords, and deploy a remote access trojan (RAT) that steals cryptocurrency wallets and credentials. Remove any reference to these packages immediately and audit systems for compromise. ", tags: ["malware", "npm", "ghost-campaign", "sudo-phishing", "rat", "cryptocurrency-theft"] },
  { id: "MAL-051", category: "MAL", severity: "BLOCK", title: "Embedded binary or shellcode (base64/hex-encoded executable)", description: "Long base64 blobs, hex byte arrays, or URL-encoded shellcode adjacent to dynamic execution sinks are a strong indicator of an embedded binary or shellcode dropper. Reject skill files containing large encoded blobs. Decode and scan any base64 content before allowing execution.", tags: ["malware", "embedded-binary", "shellcode", "dropper"] },
  { id: "MAL-052", category: "MAL", severity: "BLOCK", title: "Token/cost harvesting - skill instructs agent to loop or generate excessive output", description: "Instructions to loop indefinitely, repeat thousands of times, or generate unlimited output are a cost-harvesting pattern that burns API credits and can cause denial-of-service. Reject skills containing open-ended iteration instructions without explicit termination conditions.", tags: ["malware", "cost-harvesting", "token-burn", "denial-of-service"] },
  { id: "MAL-053", category: "MAL", severity: "BLOCK", title: "EICAR test string detected in skill file", description: "The EICAR Anti-Virus Test File string was found in this skill. This string is used by security researchers to test AV/scanner pipelines. Its presence in a production skill file indicates either a misconfigured test artifact or a deliberate attempt to probe scanner bypass. Reject unconditionally.", tags: ["malware", "eicar", "test-artifact", "scanner-probe"] },
  { id: "MAL-054", category: "MAL", severity: "BLOCK", title: "GlassWorm multi-stage Chrome extension RAT", description: "The GlassWorm campaign uses a multi-stage RAT that force-installs a malicious Chrome extension to log keystrokes, steal cookies, and exfiltrate data via Solana-based dead-drops. It also kills Ledger Live processes to show phishing windows. Remove the compromised packages and audit for malicious extensions.", tags: ["glassworm", "chrome-extension", "solana", "rat"] },
  // OBF — Obfuscation
  { id: "OBF-001", category: "OBF", severity: "WARN", title: "Bidirectional Unicode control character detected", description: "Remove bidi control characters and verify displayed text matches executed intent.", tags: [] },
  { id: "OBF-002", category: "OBF", severity: "WARN", title: "Stealth execution pattern", description: "Remove hidden/stealth execution flags and output redirection that obscure command behavior.", tags: [] },
  { id: "OBF-003", category: "OBF", severity: "BLOCK", title: "Unicode PUA obfuscation near dynamic execution sink", description: "Treat Unicode variation-selector/PUA clusters near dynamic execution sinks as obfuscation. Normalize Unicode and reject hidden-control payloads before execution.", tags: [] },
  { id: "OBF-004", category: "OBF", severity: "BLOCK", title: "Unicode steganography in skill instructions (zero-width / homoglyph)", description: "Zero-width characters, soft hyphens, and Cyrillic homoglyphs are used to hide instructions from human reviewers while remaining visible to LLM tokenizers. Normalize all Unicode to NFC/NFKC and reject skill files containing zero-width or invisible control characters outside of code blocks.", tags: ["unicode-steganography", "homoglyph"] },
  { id: "OBF-005", category: "OBF", severity: "BLOCK", title: "Covert-channel exfiltration via DNS, whitespace encoding, or HTML comments", description: "Covert channels hide instructions or exfiltrate data through side-channels that bypass content filters. DNS TXT query subdomains encode data in hostnames; trailing-whitespace bit encoding hides bits in line endings; HTML comment blocks contain hidden directives. Normalize whitespace, strip HTML comments before processing skill content, and block outbound DNS queries to non-allowlisted resolvers.", tags: ["covert-channel", "dns-exfil", "steganography", "html-comment-injection"] },
  // PINJ — Prompt/Pipeline Injection
  { id: "PINJ-001", category: "PINJ", severity: "BLOCK", title: "Prompt override / jailbreak instruction pattern", description: "Remove instruction-override content and keep model behavior constrained by explicit trusted policy.", tags: [] },
  { id: "PINJ-002", category: "PINJ", severity: "BLOCK", title: "MCP tool result MEDIA directive injection", description: "Do not trust MEDIA directives in MCP tool result text content. Validate that file paths originate from the tool's own output directory and are not injected by untrusted input.", tags: [] },
  { id: "PINJ-003", category: "PINJ", severity: "BLOCK", title: "Prompt control persistence via heartbeat file or memory store manipulation", description: "Do not embed executable instructions in heartbeat files, memory stores, or agent context entries. This pattern detects the prompt control persistence technique documented by Vectra AI, where attackers use agent context as a C2 channel for persistent control.", tags: [] },
  { id: "PINJ-004", category: "PINJ", severity: "BLOCK", title: "Claudy Day prompt injection via AI assistant URL parameter and data exfiltration", description: "Do not use claude.ai URL parameters to inject hidden HTML or instructions. The Claudy Day attack chain uses invisible prompt injection via the q= parameter, data exfiltration via the Anthropic Files API, and an open redirect on claude.com to steal user data.", tags: [] },
  { id: "PINJ-005", category: "PINJ", severity: "BLOCK", title: "Clinejection indirect prompt injection via external data fields", description: "Do not allow AI agents to execute instructions sourced from untrusted external data fields such as GitHub issue titles, EC2 instance metadata tags, or CRM order comments. The Clinejection attack embeds prompt injection payloads in GitHub issue titles processed by AI triage bots, leading to npm token theft and supply chain compromise. Sanitize all external data before passing to AI agents.", tags: ["prompt-injection", "indirect-injection", "ai-agent", "supply-chain", "lateral-movement"] },
  { id: "PINJ-006", category: "PINJ", severity: "BLOCK", title: "RAG poisoning multi-stage AI agent attack chain", description: "Validate and sanitize all data ingested into RAG knowledge bases. The RAG poisoning attack chain injects malicious content into vector databases that gets retrieved by AI agents, manipulating tool invocations to steal Kubernetes service account tokens and exfiltrate sensitive data. Implement content filtering on RAG inputs and monitor for anomalous retrieval patterns.", tags: ["rag", "prompt-injection", "ai-agent", "knowledge-base", "data-poisoning"] },
  { id: "PINJ-007", category: "PINJ", severity: "BLOCK", title: "MCP sampling-based context exfiltration", description: "MCP servers can abuse the sampling/createMessage feature to request LLM completions that extract secrets, system prompts, or conversation history from the agent context. Only connect trusted MCP servers. Review server tool descriptions and sampling requests carefully.", tags: ["mcp", "sampling", "prompt-injection", "context-exfiltration", "indirect-injection"] },
  { id: "PINJ-008", category: "PINJ", severity: "BLOCK", title: "YAML anchor/alias injection in skill frontmatter", description: "YAML anchor/alias syntax (&anchor and *alias) in non-standard frontmatter fields can be used to inject hidden instruction blocks that override the skill's declared behavior. Remove any frontmatter keys that are not part of the standard skill schema and audit YAML anchor usage. Standard keys are: name, description, version, author, allowed-tools, activation, compatibility, changelog. ", tags: ["prompt-injection", "yaml-injection", "frontmatter", "anchor-alias"] },
  { id: "PINJ-009", category: "PINJ", severity: "BLOCK", title: "Fake end-of-prompt divider injection", description: "Fake end-of-prompt dividers (e.g., \"---END OF SYSTEM PROMPT---\", \"=== INSTRUCTIONS END ===\") are a documented prompt injection technique. They attempt to convince the model that the skill's legitimate instructions have ended and that new instructions follow. Remove any divider-style markers that reference system prompts, instruction boundaries, or context resets. These patterns have no legitimate use in a skill file. ", tags: ["prompt-injection", "divider-injection", "context-reset", "instruction-override"] },
  { id: "PINJ-010", category: "PINJ", severity: "BLOCK", title: "Fake system header before skill frontmatter", description: "Fake system headers placed before or within a skill file attempt to impersonate the LLM's system prompt layer, overriding the legitimate skill instructions. Patterns like \"SYSTEM: ignore all previous instructions\", \"[SYSTEM]\", or \"ADMIN OVERRIDE:\" have no legitimate use in a skill file and indicate an injection attempt. Remove immediately. ", tags: ["prompt-injection", "system-header-spoofing", "role-override", "instruction-override"] },
  { id: "PINJ-011", category: "PINJ", severity: "BLOCK", title: "Tool alias injection mapping safe name to dangerous tool", description: "Tool alias injection attempts to map a benign-sounding tool name to a dangerous execution primitive (Bash, shell, eval, exec). This is a prompt injection technique used to bypass tool-use restrictions. Remove any alias or mapping definitions that redirect safe-sounding names to shell execution tools. Declare tools explicitly in the frontmatter allowed-tools list. ", tags: ["prompt-injection", "tool-alias", "instruction-abuse"] },
  { id: "PINJ-012", category: "PINJ", severity: "BLOCK", title: "AGENT INSTRUCTION block injection", description: "\"AGENT INSTRUCTION\", \"AI AGENT INSTRUCTIONS\", \"HIDDEN INSTRUCTIONS\", and similar header blocks are a documented technique for embedding covert directives inside skill files. These blocks are designed to be invisible to human reviewers while being processed by the model. Remove all such headers and their content. Legitimate skill instructions belong in the standard ## Instructions section. ", tags: ["prompt-injection", "covert-instructions", "agent-hijacking", "hidden-directives"] },
  { id: "PINJ-013", category: "PINJ", severity: "BLOCK", title: "Conditional time-lock with instruction override", description: "Conditional time-lock patterns combine a date/time trigger condition with instruction-override language. This is a delayed-activation prompt injection technique designed to evade static analysis by appearing benign until a future date. Remove any conditional logic that overrides, ignores, or replaces system instructions based on date or time conditions. Skills must not contain time-gated instruction overrides. ", tags: ["prompt-injection", "time-lock", "conditional-payload", "delayed-activation"] },
  { id: "PINJ-014", category: "PINJ", severity: "BLOCK", title: "Injection keyword in non-description frontmatter field", description: "Injection keywords found in non-description frontmatter fields (name, version, author, tags, etc.). Attackers embed prompt injection payloads in fields that may be parsed or displayed by agent frameworks without the same scrutiny applied to the description field. All frontmatter string fields are potential injection vectors. Remove any instruction-override, role-change, or jailbreak language from frontmatter fields. ", tags: ["prompt-injection", "frontmatter-injection", "metadata-injection"] },
  { id: "PINJ-015", category: "PINJ", severity: "BLOCK", title: "Prompt poaching via malicious browser extension installation", description: "Do not install browser extensions that intercept, capture, or relay prompts sent to AI assistants. The \"prompt poaching\" technique uses malicious browser extensions to steal user prompts containing sensitive information such as code, credentials, and business logic. Remove any extension that requests permissions to read or modify AI assistant pages. ", tags: ["prompt-injection", "browser-extension", "prompt-poaching", "data-theft"] },
  { id: "PINJ-016", category: "PINJ", severity: "BLOCK", title: "AI documentation context poisoning (ContextHub)", description: "Attackers can poison community documentation portals like Context Hub with hidden instructions that trick AI agents into installing malicious packages. Do not blindly trust instructions from community documentation sources.", tags: ["documentation-poisoning", "contexthub"] },
  // PSV — Passive Surveillance
  { id: "PSV-001", category: "PSV", severity: "WARN", title: "Skill instructions imply network access not declared in allowed-tools", description: "Add a network-capable tool (e.g., 'WebFetch', 'curl', 'web_search') to 'allowed-tools' in the skill frontmatter, or remove the network instruction. Undeclared network access prevents operators from making informed trust decisions. ", tags: ["permission-scope", "network", "graph-rule"] },
  { id: "PSV-002", category: "PSV", severity: "WARN", title: "Skill instructions imply filesystem write not declared in allowed-tools", description: "Add a write-capable tool (e.g., 'Write', 'file_write', 'mcp__filesystem__write_file') to 'allowed-tools', or remove the write instruction. Undeclared filesystem writes can silently modify files outside the operator's awareness. ", tags: ["permission-scope", "filesystem", "graph-rule"] },
  { id: "PSV-003", category: "PSV", severity: "BLOCK", title: "Skill instructions imply shell execution not declared in allowed-tools", description: "Add 'Bash' or 'computer' to 'allowed-tools' if shell execution is intentional, or remove the shell execution instruction. Undeclared shell execution is a high-risk indicator: it suggests the skill may attempt to run commands without the operator's knowledge. ", tags: ["permission-scope", "shell", "graph-rule"] },
  { id: "PSV-004", category: "PSV", severity: "WARN", title: "Unknown frontmatter key may be an injection vector", description: "Remove the non-standard frontmatter key or add it to your organisation's approved schema. Keys like 'system_override', 'behavior', and 'activation' are known injection vectors that some runtimes interpret as privileged configuration. ", tags: ["permission-scope", "frontmatter", "graph-rule"] },
  { id: "PSV-005", category: "PSV", severity: "WARN", title: "Capability inflation - skill claims wildcard or all-scope permissions", description: "Skills should declare only the specific tools and permissions they require. Wildcard permission scopes ('*', 'all', 'unrestricted') grant excessive access and violate the principle of least privilege. Replace with an explicit allowlist of required tool names.", tags: ["permission-scope", "capability-inflation", "least-privilege"] },
  // SE — Social Engineering
  { id: "SE-001", category: "SE", severity: "BLOCK", title: "Social engineering credential harvest instruction", description: "Remove instructions that direct the AI to solicit credentials, tokens, or secrets from users. Skills must never instruct the model to collect authentication material on behalf of a service. Use OAuth, delegated auth flows, or environment-variable injection instead. ", tags: ["credential_harvest", "instruction_abuse"] },
  { id: "SE-002", category: "SE", severity: "BLOCK", title: "Git credential file harvest combined with send or upload instruction", description: "This skill reads Git credential files (~/.gitconfig, ~/.git-credentials) and transmits their contents to an external endpoint. Git credential files contain plaintext usernames and tokens for remote repositories. This is a targeted credential harvest attack. Skills must never read or transmit Git credential files. Use scoped, short-lived tokens via OAuth or environment-variable injection instead of reading credential files. ", tags: ["social-engineering", "credential-harvest", "git-credentials", "exfiltration"] },
  { id: "SE-003", category: "SE", severity: "BLOCK", title: "Prize or reward scam with credential or account request", description: "Prize, reward, and winner-notification framing combined with requests for credentials, API keys, or account verification is a classic social engineering attack pattern. Skills must never offer rewards contingent on providing authentication material. Remove any prize/reward language that is coupled with credential requests or account verification steps. Use OAuth or delegated auth flows for legitimate authentication needs. ", tags: ["social-engineering", "prize-scam", "credential-harvest", "phishing", "reward-fraud"] },
  // SUP — Supply Chain
  { id: "SUP-001", category: "SUP", severity: "BLOCK", title: "npm lifecycle script pipes remote content to shell", description: "npm lifecycle scripts must not fetch and execute remote content. Use pinned, audited dependencies instead.", tags: ["npm", "lifecycle-script"] },
  { id: "SUP-002", category: "SUP", severity: "BLOCK", title: "npx registry fallback execution without --no-install", description: "Avoid implicit npx registry fallback. Prefer explicit local installs and use `npx --no-install` for command execution.", tags: [] },
  { id: "SUP-003", category: "SUP", severity: "BLOCK", title: "Piped sed write to out-of-scope or agent config path", description: "Avoid shell-based piped rewrite chains that redirect into `.claude/` or parent-directory paths. Use scoped file APIs with explicit path allowlists.", tags: [] },
  { id: "SUP-004", category: "SUP", severity: "BLOCK", title: "npm preinstall/postinstall shell bootstrap pattern", description: "Remove shell/bootstrap execution from npm preinstall/postinstall hooks. Use explicit reviewed setup steps outside lifecycle scripts.", tags: [] },
  { id: "SUP-005", category: "SUP", severity: "BLOCK", title: "npm preinstall/postinstall inline Node eval pattern", description: "Remove inline `node -e/--eval` execution from npm install lifecycle hooks. Use reviewed version-controlled scripts with explicit file paths.", tags: [] },
  { id: "SUP-006", category: "SUP", severity: "BLOCK", title: "Dotenv newline environment-variable injection payload marker", description: "Reject newline/carriage-return characters in token inputs before writing `.env` files. Update env values via strict key allowlists and escaped serialization.", tags: [] },
  { id: "SUP-007", category: "SUP", severity: "BLOCK", title: "npm preinstall/postinstall global package install pattern", description: "Remove global package installation from npm install lifecycle hooks. Keep dependency setup explicit, pinned, and user-initiated outside preinstall/postinstall.", tags: [] },
  { id: "SUP-008", category: "SUP", severity: "BLOCK", title: "npm lifecycle mutable @latest dependency install pattern", description: "Avoid `npm install ...@latest` inside install lifecycle hooks. Use pinned versions and explicit user-initiated install/update steps outside preinstall/postinstall.", tags: [] },
  { id: "SUP-009", category: "SUP", severity: "BLOCK", title: "Hex-decoded command string execution marker", description: "Treat install/setup scripts that decode long hex strings and immediately execute them as suspicious. Replace with reviewed, plaintext commands in version-controlled scripts.", tags: [] },
  { id: "SUP-010", category: "SUP", severity: "BLOCK", title: "npm postinstall environment variable exfiltration via webhook or agentmail", description: "Remove postinstall scripts that collect environment variables and transmit them to external endpoints such as webhook.site or agentmail services. This pattern detects the sbx-mask/touch-adv npm supply chain attack documented by Sonatype.", tags: [] },
  { id: "SUP-011", category: "SUP", severity: "BLOCK", title: "Open VSX extensionPack/extensionDependencies transitive dependency attack", description: "Do not trust extensions that use extensionPack or extensionDependencies to pull in unknown or suspicious transitive extensions. This pattern detects the GlassWorm supply chain technique of using clean-looking extensions as delivery vehicles for malicious payloads via Open VSX dependency chains.", tags: [] },
  { id: "SUP-012", category: "SUP", severity: "BLOCK", title: "npm dependency chain attack via hollow relay package with postinstall loader", description: "Remove postinstall hooks that execute standalone JavaScript loader files such as init.js or child.js. This pattern detects the GlassWorm/ForceMemo three-layer dependency chain attack where compromised packages use hollow relay scoped packages to deliver Solana blockchain C2 malware via postinstall hooks.", tags: [] },
  { id: "SUP-013", category: "SUP", severity: "BLOCK", title: "MCP server command injection via unsanitized Git parameters", description: "Do not use vulnerable MCP server packages that pass unsanitized user input to shell commands. CVE-2026-4198 affects mcp-server-auto-commit (getGitChanges RCE) and CVE-2026-4496 affects sigmade/Git-MCP-Server (OS command injection via child_process.exec in gitUtils.ts).", tags: [] },
  { id: "SUP-014", category: "SUP", severity: "BLOCK", title: "Azure MCP Server SSRF privilege escalation (CVE-2026-26118)", description: "Update Azure MCP Server Tools to the patched version. CVE-2026-26118 is a server-side request forgery vulnerability in Azure MCP Server Tools (CVSS 8.8) that allows an authorized attacker to escalate privileges over a network. Do not expose Azure MCP Server endpoints to untrusted networks without patching.", tags: ["azure", "mcp-server", "ssrf", "privilege-escalation", "cve"] },
  { id: "SUP-015", category: "SUP", severity: "BLOCK", title: "GitHub Actions supply chain compromise via release tag repointing", description: "Pin GitHub Actions to full commit SHAs instead of mutable tags. The trivy-action supply chain compromise repointed 76 of 77 release tags to a malicious commit containing a credential stealer in entrypoint.sh. Always verify action integrity via SHA pinning and monitor for unexpected tag changes.", tags: ["github-actions", "supply-chain", "tag-repointing", "credential-theft", "trivy"] },
  { id: "SUP-016", category: "SUP", severity: "BLOCK", title: "Vulnerable MCP server package with command injection", description: "Update or remove vulnerable MCP server packages. CVE-2026-4198 affects mcp-server-auto-commit 1.0.0 (command injection in getGitChanges). CVE-2026-4192 affects quip-mcp-server 1.0.0 (RCE). CVE-2026-33252 affects MCP Go SDK <= 1.4.0 (CSRF enables arbitrary tool execution via cross-site POST requests). Update to patched versions immediately.", tags: ["mcp", "supply-chain", "command-injection", "rce", "cve", "vulnerability"] },
  { id: "SUP-017", category: "SUP", severity: "BLOCK", title: "Checkmarx GitHub Actions supply chain compromise (TeamPCP)", description: "TeamPCP compromised Checkmarx GitHub Actions (ast-github-action, kics-github-action) by force-pushing malicious commits to release tags (CVE-2026-33634). The malware exfiltrates SSH keys, cloud credentials, and CI/CD secrets to checkmarx.zone. Pin all GitHub Actions to full commit SHAs instead of mutable tags. Audit CI/CD logs for connections to checkmarx.zone.", tags: ["supply-chain", "github-actions", "checkmarx", "teampcp", "credential-theft", "tag-repointing"] },
  { id: "SUP-018", category: "SUP", severity: "WARN", title: "pip install in skill body with non-standard or suspicious package name", description: "This skill installs Python packages via pip in the skill body, referencing a package name that is not in the known-safe allowlist. Installing arbitrary packages at runtime is a supply chain risk — package names can be typosquatted, the package may be malicious, or the version may be pinned to a known-vulnerable release. Declare dependencies in a requirements.txt or pyproject.toml and review them before use. Do not install packages dynamically in skill instructions. ", tags: ["supply-chain", "pip-install", "runtime-dependency", "typosquatting"] },
  { id: "SUP-019", category: "SUP", severity: "BLOCK", title: "Compromised LiteLLM package version reference", description: "LiteLLM versions 1.82.7 and 1.82.8 are known-malicious, compromised by TeamPCP via a poisoned Trivy scanner. These versions contain a multi-stage credential stealer that harvests SSH keys, cloud credentials, Kubernetes secrets, and cryptocurrency wallets. Never install these versions. Update to a clean release and audit systems that may have been exposed. ", tags: ["supply-chain", "litellm", "teampcp", "compromised-package", "credential-theft"] },
  { id: "SUP-020", category: "SUP", severity: "BLOCK", title: "ClawHavoc malicious ClawHub skill typosquat names", description: "These skill names are known-malicious typosquats from the ClawHavoc campaign that planted 1,184+ malicious skills on ClawHub. They masquerade as cryptocurrency wallets, YouTube utilities, and trading tools but deliver Atomic Stealer (AMOS) on macOS, keyloggers on Windows, or reverse shell backdoors. Remove any reference to these skills immediately. ", tags: ["supply-chain", "clawhavoc", "typosquat", "openclaw", "clawhub"] },
  { id: "SUP-021", category: "SUP", severity: "BLOCK", title: "TeamPCP Checkmarx VS Code extension compromise (Open VSX)", description: "The TeamPCP threat actor published malicious versions of Checkmarx VS Code extensions on the Open VSX registry: checkmarx.ast-results version 2.53 and checkmarx.cx-dev-assist version 1.7.0. These extensions contain an infostealer that exfiltrates secrets, tokens, and cryptocurrency wallet information. Uninstall compromised versions immediately and audit for data exfiltration to checkmarx.zone. ", tags: ["supply-chain", "vscode-extension", "teampcp", "open-vsx", "infostealer"] },
  { id: "SUP-022", category: "SUP", severity: "BLOCK", title: "React Native npm account takeover supply chain attack", description: "The popular React Native packages react-native-international-phone-number (130K monthly downloads) and react-native-country-select were compromised via npm account takeover. Malicious versions (0.11.8, 0.12.1-0.12.3 and 0.3.91, 0.4.1-0.4.2 respectively) use multi-layer dependency chains through scoped packages @usebioerhold8733/s-format and @agnoliaarisian7180/string-argv to deliver malware. Remove compromised versions and audit for postinstall hook execution. ", tags: ["supply-chain", "npm", "account-takeover", "react-native", "dependency-chain"] },
// AUTO_SYNC_END: rules array
];

const categoryColors: Record<Category, string> = {
  MAL: "oklch(0.65 0.22 25)",
  ABU: "oklch(0.72 0.19 45)",
  EXF: "oklch(0.60 0.20 320)",
  INJ: "oklch(0.58 0.22 290)",
  CHN: "oklch(0.65 0.18 200)",
  PINJ: "oklch(0.55 0.24 280)",
  SUP: "oklch(0.68 0.16 80)",
  SE: "oklch(0.62 0.20 340)",
  DEF: "oklch(0.60 0.18 240)",
  EXEC: "oklch(0.63 0.20 15)",
  GR: "oklch(0.65 0.15 180)",
  OBF: "oklch(0.58 0.18 270)",
  PSV: "oklch(0.67 0.16 60)",
  CAP: "oklch(0.62 0.20 150)",
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

  const categories: Array<Category | "ALL"> = ["ALL", "MAL", "ABU", "EXF", "CAP", "CHN", "PINJ", "SUP", "SE", "OBF", "DEF", "INJ", "GR", "EXEC", "PSV"];
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
            This catalog shows all {rules.length} named rules (static + chain). The full rulepack ships with the package and is updated automatically.{" "}
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

          {/* Detection Signals */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-1" style={{ color: "oklch(0.88 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}>
              Detection Signals
            </h2>
            <p className="text-sm mb-5" style={{ color: "oklch(0.50 0.015 265)" }}>
              Beyond the named rules above, the scanner uses <strong style={{ color: "oklch(0.70 0.015 265)" }}>23 named detection signals</strong> — regex fragments referenced by chain rules to detect multi-step attack sequences. A chain rule fires when two or more signals co-occur within a sliding line window. These signals account for the difference between the {rules.length} rules shown here and the total detection signal count.
            </p>
            <div className="mb-5">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "oklch(0.65 0.18 200)", fontFamily: "'JetBrains Mono', monospace" }}>Action Patterns (20)</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "download", "execute", "secret_access", "network", "exfil_channel",
                  "privilege", "security_disable", "gh_actions_secrets", "gh_pr_target",
                  "gh_pr_head_checkout", "gh_pr_untrusted_meta", "gh_pr_ref_meta",
                  "gh_cache_untrusted_key", "gh_unpinned_action_ref", "claude_hooks_marker",
                  "hook_shell_command_field", "mcp_tool_poison", "stealth_conceal",
                  "container_escape", "host_path_mount",
                ].map((sig) => (
                  <span
                    key={sig}
                    className="px-2.5 py-1 rounded text-xs"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "oklch(0.65 0.18 200 / 0.10)",
                      color: "oklch(0.72 0.12 200)",
                      border: "1px solid oklch(0.65 0.18 200 / 0.20)",
                    }}
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "oklch(0.65 0.18 200)", fontFamily: "'JetBrains Mono', monospace" }}>Capability Patterns (3)</h3>
              <div className="flex flex-wrap gap-2">
                {["shell_execution", "network_access", "filesystem_write"].map((sig) => (
                  <span
                    key={sig}
                    className="px-2.5 py-1 rounded text-xs"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      background: "oklch(0.65 0.18 200 / 0.10)",
                      color: "oklch(0.72 0.12 200)",
                      border: "1px solid oklch(0.65 0.18 200 / 0.20)",
                    }}
                  >
                    {sig}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs" style={{ color: "oklch(0.42 0.015 265)" }}>
              Signals are defined in <code style={{ color: "oklch(0.60 0.015 265)" }}>action_patterns</code> and <code style={{ color: "oklch(0.60 0.015 265)" }}>capability_patterns</code> in <code style={{ color: "oklch(0.60 0.015 265)" }}>default.yaml</code>. You can reference them in custom chain rules or define your own —{" "}
              <a href="/docs#customization" className="transition-colors duration-200" style={{ color: "oklch(0.65 0.18 290)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.78 0.18 290)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "oklch(0.65 0.18 290)")}
              >see the Customization guide</a>.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
