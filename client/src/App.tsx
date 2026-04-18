import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Rules from "./pages/Rules";
import Docs from "./pages/Docs";
import Updates from "./pages/Updates";
import Feed from "./pages/Feed";
import Model from "./pages/Model";
import Trace from "./pages/Trace";
import LintPage from "./pages/LintPage";
import Blog from "./pages/Blog";
import BlogSkillsSecurity from "./pages/BlogSkillsSecurity";
import BlogV12Training from "./pages/BlogV12Training";
import BlogV15Training from "./pages/BlogV15Training";
import BlogGenerativePivot from "./pages/BlogGenerativePivot";
import BlogV42Richer from "./pages/BlogV42Richer";
import TraceRun from "./pages/TraceRun";

function Router() {
  return (
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
