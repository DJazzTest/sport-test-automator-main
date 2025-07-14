import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Play, 
  Save, 
  FileText, 
  Eye,
  Globe,
  TestTube2,
  BarChart3
} from "lucide-react";
import { TestVisualization } from "./TestVisualization";
import { FailureChart } from "./FailureChart";

const PREDEFINED_URLS = [
  "https://planetsportbet.com/inplay",
  "https://starsports.bet/inplay", 
  "https://dragonbet.co.uk/inplay",
  "https://akbets.bet/inplay",
  "https://betwright.com/inplay",
  "https://gentlemanjim.bet/inplay",
  "https://pricedup.bet/inplay",
  "https://nrg.bet/inplay",
  "https://bresbet.com/inplay",
  "https://sblive.io/inplay",
  "https://london.bet/inplay",
  "https://planetsport.com",
  "https://vodacomsoccer.com",
  "https://livescore.tennis365.com"
];

interface CreateTestProps {
  onCreateNew: () => void;
}

export function CreateTest({ onCreateNew }: CreateTestProps) {
  const [testName, setTestName] = useState("Animation Test Suite");
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [customUrl, setCustomUrl] = useState("");
  const [framework, setFramework] = useState("playwright");
  const [playwrightCode, setPlaywrightCode] = useState(`import { test, expect } from '@playwright/test';\n\ntest('my test', async ({ page }) => {\n  await page.goto('https://example.com');\n  // ...\n});`);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [gherkinContent, setGherkinContent] = useState(`Feature: Verify live match animations across platforms

  Scenario Outline: Animation visibility on in-play sports pages
    Given I navigate to "<URL>"
    When I locate and click on an in-play sport or match
    Then I should see a match animation canvas or live motion indicator
    And it should be visible and rendered correctly

    Examples:
      | URL                                    |
      | https://planetsportbet.com/inplay      |
      | https://starsports.bet/inplay          |
      | https://dragonbet.co.uk/inplay         |`);

  const addUrl = (url: string) => {
    if (url && !selectedUrls.includes(url)) {
      setSelectedUrls([...selectedUrls, url]);
    }
  };

  const removeUrl = (url: string) => {
    setSelectedUrls(selectedUrls.filter(u => u !== url));
  };

  const addCustomUrl = () => {
    if (customUrl.trim()) {
      addUrl(customUrl.trim());
      setCustomUrl("");
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Test</h1>
          <p className="text-muted-foreground mt-1">
            Enter a URL, Gherkin scenario, and Playwright automation code below.
          </p>
        </div>
        <Button onClick={onCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Test
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Test Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <Label htmlFor="test-url">Target URL</Label>
            <Input
              id="test-url"
              placeholder="https://example.com"
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="gherkin">Gherkin Scenario</Label>
            <Textarea
              id="gherkin"
              placeholder="Feature: ...\nScenario: ..."
              value={gherkinContent}
              onChange={e => setGherkinContent(e.target.value)}
              className="mt-1 min-h-[120px] font-mono"
            />
          </div>
          <div>
            <Label htmlFor="playwright">Playwright Automation Code</Label>
            <Textarea
              id="playwright"
              placeholder={`import { test, expect } from '@playwright/test';\n\ntest('my test', async ({ page }) => {\n  await page.goto('https://example.com');\n  // ...\n});`}
              value={playwrightCode}
              onChange={e => setPlaywrightCode(e.target.value)}
              className="mt-1 min-h-[180px] font-mono"
            />
          </div>
          <div className="flex gap-2">
            <Button
              className="gap-2"
              type="button"
              disabled={isRunning}
              onClick={async () => {
                setTestOutput(null);
                setIsRunning(true);
                setSaveStatus(null);
                try {
                  const resp = await fetch("/api/run-playwright", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code: playwrightCode })
                  });
                  const data = await resp.json();
                  setTestOutput(data.output || "No output");
                } catch (e) {
                  setTestOutput("Error running test: " + (e as any).message);
                } finally {
                  setIsRunning(false);
                }
              }}
            >
              <Play className="w-4 h-4" />
              {isRunning ? "Running..." : "Run Test"}
            </Button>
            <Button
              className="gap-2"
              type="button"
              variant="secondary"
              onClick={() => {
                try {
                  const tests = JSON.parse(localStorage.getItem("savedTests") || "[]");
                  const newTest = {
                    name: testName,
                    url: customUrl,
                    gherkin: gherkinContent,
                    code: playwrightCode,
                    date: new Date().toISOString()
                  };
                  localStorage.setItem("savedTests", JSON.stringify([...tests, newTest]));
                  setSaveStatus("Test saved!");
                } catch (e) {
                  setSaveStatus("Failed to save test");
                }
              }}
            >
              <Save className="w-4 h-4" />
              Save Test
            </Button>
          </div>
          <div className="mt-4 bg-muted rounded p-3 min-h-[60px] text-sm text-muted-foreground whitespace-pre-wrap">
            {testOutput ? testOutput : "Test output will appear here after running."}
          </div>
          {saveStatus && (
            <div className="mt-2 text-xs text-green-700">{saveStatus}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}