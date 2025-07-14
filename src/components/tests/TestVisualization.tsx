import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Play,
  Monitor,
  Smartphone,
  Globe,
  Square
} from "lucide-react";

interface TestVisualizationProps {
  selectedUrls: string[];
  gherkinContent: string;
  framework: string;
}

export function TestVisualization({ selectedUrls, gherkinContent, framework }: TestVisualizationProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [executionLog, setExecutionLog] = useState<string[]>([]);

  const testSteps = [
    { step: "Navigate to URL", status: "pending", duration: "-" },
    { step: "Locate in-play sport", status: "pending", duration: "-" },
    { step: "Click on match", status: "pending", duration: "-" },
    { step: "Verify animation", status: "pending", duration: "-" }
  ];

  const runLocalTest = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setTestResults({});
    setExecutionLog([]);
    
    // Simulate opening Chrome browser
    setExecutionLog(prev => [...prev, "🚀 Starting Chrome browser..."]);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    for (let i = 0; i < selectedUrls.length; i++) {
      const url = selectedUrls[i];
      setExecutionLog(prev => [...prev, `📍 Testing: ${url}`]);
      
      // Simulate test steps
      for (let stepIndex = 0; stepIndex < testSteps.length; stepIndex++) {
        setCurrentStep(stepIndex);
        setExecutionLog(prev => [...prev, `   ▶ ${testSteps[stepIndex].step}...`]);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Random success/failure for demo
        const success = Math.random() > 0.3;
        setExecutionLog(prev => [...prev, `   ${success ? '✅' : '❌'} ${success ? 'Passed' : 'Failed'}`]);
      }
      
      // Set final result for this URL
      const finalResult = Math.random() > 0.2 ? "completed" : "failed";
      setTestResults(prev => ({ ...prev, [url]: finalResult }));
      setExecutionLog(prev => [...prev, `📊 ${url}: ${finalResult === "completed" ? "PASSED" : "FAILED"}`]);
    }
    
    setExecutionLog(prev => [...prev, "🏁 Test execution completed"]);
    setIsRunning(false);
  };

  const stopTest = () => {
    setIsRunning(false);
    setExecutionLog(prev => [...prev, "⏹️ Test execution stopped by user"]);
  };

  const devices = [
    { name: "Desktop Chrome", icon: Monitor, status: isRunning ? "running" : "pending" }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "running": return <Clock className="w-4 h-4 text-warning animate-spin" />;
      case "failed": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success/10 text-success border-success/20";
      case "running": return "bg-warning/10 text-warning border-warning/20";
      case "failed": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Test Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Play className="w-5 h-5" />
            Local Test Execution
          </CardTitle>
          <CardDescription>Run tests in Chrome browser locally</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button 
            onClick={runLocalTest} 
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            {isRunning ? "Running..." : "Run Test"}
          </Button>
          {isRunning && (
            <Button 
              variant="outline" 
              onClick={stopTest}
              className="flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
              Stop
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Play className="w-5 h-5" />
              Test Execution
            </CardTitle>
            <CardDescription>Current test progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Framework:</span>
              <Badge variant="outline">{framework}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">URLs:</span>
              <Badge variant="outline">{selectedUrls.length} selected</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{currentStep + 1}/{testSteps.length} steps</span>
              </div>
              <Progress value={(currentStep + 1) / testSteps.length * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Execution Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Execution Log</CardTitle>
            <CardDescription>Real-time test execution output</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black/90 rounded-md p-3 h-48 overflow-y-auto font-mono text-sm">
              {executionLog.length === 0 ? (
                <div className="text-muted-foreground">Ready to run tests...</div>
              ) : (
                executionLog.map((log, index) => (
                  <div key={index} className="text-green-400 mb-1">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Test Steps</CardTitle>
            <CardDescription>Step-by-step execution progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {testSteps.map((step, index) => {
              const stepStatus = isRunning && index === currentStep ? "running" : 
                               isRunning && index < currentStep ? "completed" : "pending";
              return (
                <div key={index} className="flex items-center gap-3 p-2 rounded-md bg-muted/30">
                  {getStatusIcon(stepStatus)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{step.step}</p>
                    <p className="text-xs text-muted-foreground">{stepStatus === "running" ? "Running..." : step.duration}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* URL Test Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5" />
            URL Test Matrix
          </CardTitle>
          <CardDescription>Animation test results across all selected URLs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedUrls.slice(0, 6).map((url, index) => {
              const urlStatus = testResults[url] || "pending";
              
              return (
                <div key={url} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(urlStatus)}
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(urlStatus)}
                    >
                      {urlStatus}
                    </Badge>
                  </div>
                  <p className="text-sm font-mono break-all">{url}</p>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {isRunning ? "Testing..." : urlStatus === "pending" ? "Not tested" : "Last run completed"}
                  </div>
                </div>
              );
            })}
          </div>
          
          {selectedUrls.length > 6 && (
            <div className="mt-4 text-center">
              <Badge variant="outline">
                +{selectedUrls.length - 6} more URLs
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}