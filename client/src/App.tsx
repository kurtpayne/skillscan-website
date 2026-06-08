import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Route-level code splitting: each page is its own lazily-loaded chunk so the
// initial bundle only carries the shell + the first route a visitor lands on.
const Home = lazy(() => import("./pages/Home"));
const Rules = lazy(() => import("./pages/Rules"));
const Docs = lazy(() => import("./pages/Docs"));
const Updates = lazy(() => import("./pages/Updates"));
const Feed = lazy(() => import("./pages/Feed"));
const Model = lazy(() => import("./pages/Model"));
const Trace = lazy(() => import("./pages/Trace"));
const LintPage = lazy(() => import("./pages/LintPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogSkillsSecurity = lazy(() => import("./pages/BlogSkillsSecurity"));
const BlogV12Training = lazy(() => import("./pages/BlogV12Training"));
const BlogV15Training = lazy(() => import("./pages/BlogV15Training"));
const BlogGenerativePivot = lazy(() => import("./pages/BlogGenerativePivot"));
const BlogV42Richer = lazy(() => import("./pages/BlogV42Richer"));
const TraceRun = lazy(() => import("./pages/TraceRun"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function RouteFallback() {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ minHeight: "100vh" }}
      aria-label="Loading page"
    />
  );
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/rules" component={Rules} />
        <Route path="/docs" component={Docs} />
        <Route path="/linter" component={LintPage} />
        <Route path="/updates" component={Updates} />
        <Route path="/feed" component={Feed} />
        <Route path="/model" component={Model} />
        <Route path="/trace" component={Trace} />
        <Route path="/trace/run" component={TraceRun} />
        <Route path="/lint" component={LintPage} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/skills-security-model" component={BlogSkillsSecurity} />
        <Route path="/blog/v12-training-methodology" component={BlogV12Training} />
        <Route path="/blog/v15-model" component={BlogV15Training} />
        <Route path="/blog/generative-pivot" component={BlogGenerativePivot} />
        <Route path="/blog/v42-richer" component={BlogV42Richer} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
