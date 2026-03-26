import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Rules from "./pages/Rules";
import Docs from "./pages/Docs";
import Linter from "./pages/Linter";
import Updates from "./pages/Updates";
import Feed from "./pages/Feed";
import Model from "./pages/Model";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/rules" component={Rules} />
      <Route path="/docs" component={Docs} />
      <Route path="/linter" component={Linter} />
      <Route path="/updates" component={Updates} />
      <Route path="/feed" component={Feed} />
      <Route path="/model" component={Model} />
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
