import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Save, 
  Edit3, 
  Globe,
  Code2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import ChromeIcon from '@/assets/browsers/chrome.svg';
import FirefoxIcon from '@/assets/browsers/firefox.svg';
import SafariIcon from '@/assets/browsers/safari.svg';
import { useToast } from "@/hooks/use-toast";

interface PlaywrightTestEditorProps {
  onBack: () => void;
}

export function PlaywrightTestEditor({ onBack }: PlaywrightTestEditorProps) {
  const [testUrl, setTestUrl] = useState("https://planetsportbet.com");
  const [testName, setTestName] = useState("Navigate to in-play football game");
  const [gherkinContent, setGherkinContent] = useState(`Feature: Navigate to an in-play football game

  Scenario: Click into a live football match from the homepage
    Given I open the Planet Sport Bet homepage
    And I accept any cookie or promotional pop-ups
    When I click on the "In Play" tab
    And I wait for the In Play page to load
    And I click on a live game from the list
    Then I should be taken to the match details page`);

  const [playwrightCode, setPlaywrightCode] = useState(`import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium, Page } from 'playwright';

let page: Page;

Given('I open the Planet Sport Bet homepage', async () => {
  const browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
  await page.goto('https://planetsportbet.com');
});

Given('I accept any cookie or promotional pop-ups', async () => {
  const cookieButton = await page.$('button:has-text("Accept")');
  if (cookieButton) await cookieButton.click();
});

When('I click on the "In Play" tab', async () => {
  await page.click('a[href="/inplay"]');
});

When('I wait for the In Play page to load', async () => {
  await page.waitForURL('**/inplay');
  await page.waitForSelector('.live-events');
});

When('I click on a live game from the list', async () => {
  const liveGame = await page.$('.live-event');
  if (liveGame) await liveGame.click();
});

Then('I should be taken to the match details page', async () => {
  await page.waitForSelector('.match-details');
});`);

  const [isRunning, setIsRunning] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [executionLog, setExecutionLog] = useState<string[]>([]);
  const [selectedBrowser, setSelectedBrowser] = useState<'chrome' | 'firefox' | 'safari'>('chrome');
  const [savedTests, setSavedTests] = useState<any[]>(() => {
    const stored = localStorage.getItem('savedTests');
    return stored ? JSON.parse(stored) : [];
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const { toast } = useToast();

  const runTest = async () => {
    setIsRunning(true);
    setTestStatus('running');
    setExecutionLog([`Starting test execution in ${selectedBrowser.charAt(0).toUpperCase() + selectedBrowser.slice(1)}...`]);

    const steps = [
      `Opening ${selectedBrowser.charAt(0).toUpperCase() + selectedBrowser.slice(1)} browser...`,
      'Navigating to ' + testUrl,
      'Accepting cookies...',
      'Clicking In Play tab...',
      'Waiting for page load...',
      'Looking for live games...',
      'Clicking on live game...',
      'Verifying match details page...'
    ];

    let cancelled = false;
    let stepIndex = 0;

    const animate = async () => {
      while (stepIndex < steps.length && isRunning) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setExecutionLog(prev => [...prev, steps[stepIndex]]);
        stepIndex++;
      }
    };
    animate();

    try {
      const browserMap = { chrome: 'chromium', firefox: 'firefox', safari: 'webkit' };
      const response = await fetch('http://localhost:5174/api/run-playwright', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: playwrightCode, browser: browserMap[selectedBrowser] })
      });
      const data = await response.json();
      setIsRunning(false);
      if (!response.ok || !data) {
        setTestStatus('failed');
        setExecutionLog(prev => [...prev, 'Test failed: No response from backend.']);
        toast({ title: 'Test Failed', description: 'No response from backend.' });
        return;
      }
      if (data.success) {
        setTestStatus('success');
        setExecutionLog(prev => [...prev, ...data.output.split('\n').filter(Boolean), 'Test passed successfully!']);
        toast({ title: 'Test Passed', description: 'Your test ran successfully in Playwright.' });
        setSuggestions([]);
      } else {
        setTestStatus('failed');
        setExecutionLog(prev => [...prev, ...data.output.split('\n').filter(Boolean), 'Test failed. See logs for details.']);
        toast({ title: 'Test Failed', description: 'Test failed in Playwright.' });
        setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
      }
    } catch (err) {
      setIsRunning(false);
      setTestStatus('failed');
      setExecutionLog(prev => [...prev, 'Test failed: ' + (err.message || err)]);
      toast({ title: 'Test Failed', description: 'Error running test: ' + (err.message || err) });
    }
  };

  const saveTest = () => {
    const newTest = {
      id: Date.now(),
      name: testName,
      url: testUrl,
      gherkin: gherkinContent,
      playwright: playwrightCode,
      status: testStatus,
      createdAt: new Date().toLocaleDateString()
    };
    
    setSavedTests(prev => {
      const updated = [...prev, newTest];
      localStorage.setItem('savedTests', JSON.stringify(updated));
      return updated;
    });
    toast({
      title: "Test Saved",
      description: "Your automation test has been saved successfully"
    });
  };

  // Sync localStorage on delete/edit
  const updateSavedTests = (tests: any[]) => {
    setSavedTests(tests);
    localStorage.setItem('savedTests', JSON.stringify(tests));
  };

  // Optionally, useEffect to sync if needed (for future edit/delete)


  const getStatusIcon = () => {
    switch (testStatus) {
      case 'running': return <Clock className="w-4 h-4 text-yellow-500 animate-spin" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <div className="flex-1 p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Playwright Test Editor</h1>
            <p className="text-muted-foreground mt-1">
              Create and run automated browser tests
            </p>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {getStatusIcon()}
          <Badge variant={testStatus === 'success' ? 'default' : testStatus === 'failed' ? 'destructive' : 'secondary'}>
            {testStatus.charAt(0).toUpperCase() + testStatus.slice(1)}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="editor" className="gap-2"><Code2 className="w-4 h-4" /> Editor</TabsTrigger>
          <TabsTrigger value="visualize" className="gap-2"><Eye className="w-4 h-4" /> Visualize</TabsTrigger>
          <TabsTrigger value="execution" className="gap-2"><Play className="w-4 h-4" /> Execution</TabsTrigger>
          <TabsTrigger value="saved" className="gap-2"><Save className="w-4 h-4" /> Saved</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2 mb-4">
          <span className="font-semibold">Browser:</span>
          <Button
            variant={selectedBrowser === 'chrome' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedBrowser('chrome')}
          >
            <img src={ChromeIcon} alt="Chrome" className="w-5 h-5 mr-1" /> Chrome
          </Button>
          <Button
            variant={selectedBrowser === 'firefox' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedBrowser('firefox')}
          >
            <img src={FirefoxIcon} alt="Firefox" className="w-5 h-5 mr-1" /> Firefox
          </Button>
          <Button
            variant={selectedBrowser === 'safari' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedBrowser('safari')}
          >
            <img src={SafariIcon} alt="Safari" className="w-5 h-5 mr-1" /> Safari
          </Button>
        </div>

        <TabsContent value="editor" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Test Configuration
                </CardTitle>
                <CardDescription>Configure your test parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="test-name">Test Name</Label>
                  <Input
                    id="test-name"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="test-url">Target URL</Label>
                  <Input
                    id="test-url"
                    value={testUrl}
                    onChange={(e) => setTestUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="mt-1"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={runTest} 
                    disabled={isRunning}
                    className="gap-2 flex-1"
                  >
                    <Play className="w-4 h-4" />
                    {isRunning ? 'Running...' : 'Run Test'}
                  </Button>
                  <Button 
                    onClick={saveTest}
                    variant="outline" 
                    className="gap-2"
                    disabled={testStatus === 'idle'}
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Gherkin Scenario */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gherkin Scenario</CardTitle>
                <CardDescription>Define your test scenario</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={gherkinContent}
                  onChange={(e) => setGherkinContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Feature: Your test feature..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Playwright Code */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Playwright Automation Code</CardTitle>
              <CardDescription>Write or paste your Playwright test implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={playwrightCode}
                onChange={(e) => setPlaywrightCode(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
                placeholder="import { Given, When, Then } from '@cucumber/cucumber';"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visualize" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Visualization</CardTitle>
              <CardDescription>Visual representation of your test execution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                  <Globe className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="font-semibold">Target URL</h3>
                    <p className="text-sm text-muted-foreground">{testUrl}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="font-semibold">Browser:</span>
                    <span className="capitalize font-bold">{selectedBrowser}</span>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['Browser Launch', 'Page Navigation', 'Element Interaction', 'Assertion'].map((step, index) => (
                    <div key={step} className="p-4 border rounded-lg text-center">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground mx-auto mb-2">
                        {index + 1}
                      </div>
                      <p className="text-sm font-medium">{step}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-semibold">Selected Browser:</span>
                  <span className="capitalize">{selectedBrowser}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="execution" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Execution Log</CardTitle>
              <CardDescription>Real-time execution progress and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-terminal p-4 rounded-lg min-h-[300px] font-mono text-sm">
                {executionLog.length === 0 ? (
                  <p className="text-muted-foreground">No execution logs yet. Click 'Run Test' to start.</p>
                ) : (
                  executionLog.map((log, index) => (
                    <div key={index} className="py-1">
                      <span className="text-green-400">[{new Date().toLocaleTimeString()}]</span> {log}
                    </div>
                  ))
                )}
              </div>
              {suggestions.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                  <p className="font-semibold text-yellow-700 mb-2">Possible reasons for failure:</p>
                  <ul className="list-disc pl-6 text-yellow-800">
                    {suggestions.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Saved Tests</CardTitle>
              <CardDescription>Manage your saved automation tests</CardDescription>
            </CardHeader>
            <CardContent>
              {savedTests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No saved tests yet. Create and save a test to see it here.</p>
              ) : (
                <div className="space-y-4">
                  {savedTests.map((test) => (
                    <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{test.name}</h3>
                        <p className="text-sm text-muted-foreground">{test.url}</p>
                        <p className="text-xs text-muted-foreground">Created: {test.createdAt}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={test.status === 'success' ? 'default' : 'destructive'}>
                          {test.status}
                        </Badge>
                        <Button size="sm" variant="outline" className="gap-2" onClick={() => {
                          setTestName(test.name);
                          setTestUrl(test.url);
                          setGherkinContent(test.gherkin);
                          setPlaywrightCode(test.playwright);
                          setTestStatus(test.status || 'idle');
                          toast({
                            title: 'Loaded Test',
                            description: `Test '${test.name}' loaded into editor`,
                          });
                        }}>
                          <Edit3 className="w-4 h-4" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}