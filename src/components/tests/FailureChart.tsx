import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle
} from "lucide-react";

interface FailureChartProps {
  selectedUrls: string[];
}

export function FailureChart({ selectedUrls }: FailureChartProps) {
  // Mock failure data
  const generateFailureData = () => {
    return selectedUrls.map((url, index) => {
      const successRate = Math.max(20, 100 - (index * 8) - Math.random() * 30);
      const totalTests = Math.floor(Math.random() * 50) + 20;
      const failures = Math.floor((100 - successRate) * totalTests / 100);
      
      return {
        url,
        successRate: Math.round(successRate),
        failures,
        totalTests,
        lastFailure: Math.floor(Math.random() * 48) + 1,
        trend: Math.random() > 0.5 ? 'up' : 'down'
      };
    });
  };

  const failureData = generateFailureData();
  const overallSuccessRate = Math.round(
    failureData.reduce((acc, item) => acc + item.successRate, 0) / failureData.length
  );

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-success";
    if (rate >= 70) return "text-warning";
    return "text-destructive";
  };

  const getSuccessRateBg = (rate: number) => {
    if (rate >= 90) return "bg-success/10 border-success/20";
    if (rate >= 70) return "bg-warning/10 border-warning/20";
    return "bg-destructive/10 border-destructive/20";
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Overall Success Rate</p>
                <p className={`text-2xl font-bold ${getSuccessRateColor(overallSuccessRate)}`}>
                  {overallSuccessRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div>
                <p className="text-sm font-medium">Passing URLs</p>
                <p className="text-2xl font-bold text-success">
                  {failureData.filter(item => item.successRate >= 90).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div>
                <p className="text-sm font-medium">Warning URLs</p>
                <p className="text-2xl font-bold text-warning">
                  {failureData.filter(item => item.successRate >= 70 && item.successRate < 90).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              <div>
                <p className="text-sm font-medium">Failing URLs</p>
                <p className="text-2xl font-bold text-destructive">
                  {failureData.filter(item => item.successRate < 70).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Failure Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Animation Test Failure Analysis
          </CardTitle>
          <CardDescription>
            Detailed breakdown of test results for each URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {failureData.map((item, index) => (
              <div key={item.url} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <p className="font-mono text-sm break-all">{item.url}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {item.totalTests} total tests
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Last failure: {item.lastFailure}h ago
                      </span>
                      {item.trend === 'up' ? (
                        <div className="flex items-center gap-1 text-success">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs">Improving</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-destructive">
                          <TrendingDown className="w-3 h-3" />
                          <span className="text-xs">Declining</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getSuccessRateBg(item.successRate)}
                  >
                    {item.successRate}% success
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span className={getSuccessRateColor(item.successRate)}>
                      {item.successRate}%
                    </span>
                  </div>
                  <Progress value={item.successRate} className="h-2" />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{item.totalTests - item.failures} passed</span>
                    <span>{item.failures} failed</span>
                  </div>
                </div>

                {item.failures > 0 && (
                  <div className="mt-3 p-2 rounded bg-destructive/5 border border-destructive/20">
                    <p className="text-xs text-destructive font-medium">
                      Common failure reasons:
                    </p>
                    <ul className="text-xs text-destructive/80 mt-1 space-y-1">
                      <li>• Animation canvas not found</li>
                      <li>• Element not visible within timeout</li>
                      <li>• Page load timeout exceeded</li>
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}