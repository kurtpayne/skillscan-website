/* ============================================================
   BLOG INDEX PAGE — SkillScan
   Design: Deep Navy system, violet accent — matches site design
   ============================================================ */
import { Link } from "wouter";
import { ArrowRight, Clock, Calendar, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Post {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  tags: string[];
  excerpt: string;
  featured?: boolean;
}

const posts: Post[] = [
  {
    slug: "/blog/generative-pivot",
    title: "From Pattern Matching to Reasoning: SkillScan's Pivot to Generative Detection",
    subtitle: "Why encoder-only classifiers failed and how a 1.5B-param reasoning model replaced them",
    date: "April 15, 2026",
    readTime: "11 min read",
    tags: ["ML / Training", "Generative AI", "Qwen", "Transparency"],
    excerpt:
      "For months our ML detector was a DeBERTa LoRA adapter that, on a clean eval with labels stripped, landed at macro F1 0.113. We threw it out. Here's the honest story of what went wrong, why encoder-only classifiers are the wrong tool for this problem, and how a Qwen2.5-1.5B model that reasons about code ended up at macro F1 0.731.",
    featured: true,
  },
  {
    slug: "/blog/skills-security-model",
    title: "The Invisible Attack Surface: How Malicious Instructions Hide in AI Agent Skills",
    subtitle: "A security model for agentic AI",
    date: "March 29, 2026",
    readTime: "12 min read",
    tags: ["Security", "AI Agents", "Prompt Injection", "Skills"],
    excerpt:
      "AI agent skills are runbooks written in plain Markdown — not code. But they carry executable intent. We walk through five real attack archetypes, explain where SkillScan fits in the broader security stack, and show exactly what hard-to-spot malicious instructions look like.",
  },
  {
    slug: "/blog/v12-training-methodology",
    title: "How We Built a Cleaner ML Model: The v12 Training Methodology",
    subtitle: "Contamination, clean eval, and what 19.6% recall actually means",
    date: "March 29, 2026",
    readTime: "8 min read",
    tags: ["ML / Training", "Transparency", "DeBERTa", "LoRA"],
    excerpt:
      "When we discovered that 44% of our evaluation set had leaked into training, we didn't paper over the number. We fixed the process, rebuilt the corpus, and retrained from scratch. Here's exactly what we did and why it matters.",
  },
  {
    slug: "/blog/v15-model",
    title: "v15: Improved Class Balance with Fine-Tuned DeBERTa Adapter",
    subtitle: "Class weighting, ProtectAI base model, and the ONNX phase 0 tooling pipeline",
    date: "April 3, 2026",
    readTime: "8 min read",
    tags: ["ML / Training", "DeBERTa", "ONNX", "Class Balance"],
    excerpt:
      "v15 addresses the underlying class imbalance in the SkillScan corpus with calibrated class weights (benign=0.866, injection=1.183) and adapter fine-tuning on top of ProtectAI/deberta-v3-base-prompt-injection-v2. Corpus grows from 20,865 to 21,468 examples.",
  },
];

function FeaturedPost({ post }: { post: Post }) {
  return (
    <Link href={post.slug}>
      <div
        className="group rounded-2xl p-8 cursor-pointer transition-all duration-300"
        style={{
          background: "oklch(0.14 0.022 265)",
          border: "1px solid oklch(0.58 0.22 290 / 0.20)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.58 0.22 290 / 0.50)";
          (e.currentTarget as HTMLDivElement).style.background = "oklch(0.16 0.025 265)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.58 0.22 290 / 0.20)";
          (e.currentTarget as HTMLDivElement).style.background = "oklch(0.14 0.022 265)";
        }}
      >
        {/* Featured label */}
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-5"
          style={{
            background: "oklch(0.58 0.22 290 / 0.12)",
            border: "1px solid oklch(0.58 0.22 290 / 0.30)",
            color: "oklch(0.78 0.18 290)",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          Featured post
        </div>

        <h2
          className="text-2xl sm:text-3xl font-bold mb-3 leading-snug group-hover:text-white transition-colors duration-200"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.93 0.005 265)" }}
        >
          {post.title}
        </h2>

        <p
          className="text-base leading-relaxed mb-6"
          style={{ color: "oklch(0.62 0.015 265)", maxWidth: "680px" }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{
                background: "oklch(0.58 0.22 290 / 0.08)",
                border: "1px solid oklch(0.58 0.22 290 / 0.18)",
                color: "oklch(0.70 0.12 290)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Meta + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs" style={{ color: "oklch(0.50 0.015 265)" }}>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
          <div
            className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-2.5"
            style={{ color: "oklch(0.78 0.18 290)" }}
          >
            Read post
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={post.slug}>
      <div
        className="group rounded-xl p-6 cursor-pointer transition-all duration-300 h-full"
        style={{
          background: "oklch(0.13 0.020 265)",
          border: "1px solid oklch(0.58 0.22 290 / 0.15)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.58 0.22 290 / 0.40)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "oklch(0.58 0.22 290 / 0.15)";
        }}
      >
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-xs"
              style={{
                background: "oklch(0.58 0.22 290 / 0.08)",
                color: "oklch(0.65 0.10 290)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <h3
          className="text-lg font-bold mb-2 leading-snug"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.90 0.005 265)" }}
        >
          {post.title}
        </h3>
        <p className="text-sm leading-relaxed mb-4" style={{ color: "oklch(0.58 0.015 265)" }}>
          {post.excerpt.slice(0, 120)}…
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs" style={{ color: "oklch(0.45 0.015 265)" }}>
            {post.date} · {post.readTime}
          </span>
          <ArrowRight
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: "oklch(0.65 0.15 290)" }}
          />
        </div>
      </div>
    </Link>
  );
}

export default function Blog() {
  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="pt-32 pb-16" style={{ borderBottom: "1px solid oklch(0.58 0.22 290 / 0.10)" }}>
        <div className="container">
          <div className="max-w-2xl">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "oklch(0.58 0.22 290 / 0.10)",
                border: "1px solid oklch(0.58 0.22 290 / 0.28)",
                color: "oklch(0.78 0.18 290)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <Tag className="w-3 h-3" />
              SkillScan Blog
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif", color: "oklch(0.97 0.005 265)" }}
            >
              Research &amp; Security Writing
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "oklch(0.60 0.015 265)" }}>
              In-depth posts on AI agent security, prompt injection, skill file threat modeling,
              and the engineering behind SkillScan.
            </p>
          </div>
        </div>
      </section>

      {/* ── POSTS ── */}
      <section className="py-20">
        <div className="container">
          {/* Featured post */}
          {featured && (
            <div className="mb-12">
              <FeaturedPost post={featured} />
            </div>
          )}

          {/* Remaining posts grid */}
          {rest.length > 0 && (
            <>
              <div
                className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: "oklch(0.45 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                More posts
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          )}

          {/* Coming soon placeholder when only one post */}
          {posts.length === 1 && (
            <div
              className="mt-8 rounded-xl p-8 text-center"
              style={{
                background: "oklch(0.12 0.018 265)",
                border: "1px dashed oklch(0.58 0.22 290 / 0.18)",
              }}
            >
              <div
                className="text-sm font-semibold mb-2"
                style={{ color: "oklch(0.55 0.015 265)", fontFamily: "'JetBrains Mono', monospace" }}
              >
                More posts coming soon
              </div>
              <p className="text-sm" style={{ color: "oklch(0.42 0.015 265)" }}>
                Next up: a deep-dive on the v12 training methodology and how we fixed the injection recall collapse.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
