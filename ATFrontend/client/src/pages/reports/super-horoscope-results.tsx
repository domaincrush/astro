import { useEffect, useState, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useRoute } from "wouter";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Crown, ArrowLeft, Download, Share } from "lucide-react";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { SuperHoroscopeDashboard } from "src/components/SuperHoroscopeDashboard";

export default function SuperHoroscopeResults() {
  const [, navigate] = useLocation();
  const [, params] = useRoute("/reports/super-horoscope/results/:reportId");
  const reportId = params?.reportId;
  
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReportData = async () => {
      console.log("Loading report data for reportId:", reportId);

      if (reportId) {
        // Try to get report from localStorage first
        const storedReport = localStorage.getItem(
          `super-horoscope-${reportId}`,
        );
        if (storedReport) {
          try {
            const parsedReport = JSON.parse(storedReport);
            setReportData(parsedReport);
            setLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing stored report:", error);
          }
        }

        // If not in localStorage, try to fetch from backend
        try {
          const token = localStorage.getItem("token");
          const headers: Record<string, string> = {
            "Content-Type": "application/json",
          };

          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }

          const response = await fetch(`/api/premium-report/${reportId}`, {
            headers,
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.report) {
              setReportData(data.report);
              setLoading(false);
              return;
            }
          }
        } catch (error) {
          console.error("Error fetching report from backend:", error);
        }
      }

      // If no report found, redirect back to form
      setTimeout(() => {
        navigate("/reports/super-horoscope");
      }, 2000);
    };

    loadReportData();
  }, [navigate, reportId]);

  const handleGoBack = () => {
    navigate("/reports/super-horoscope");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a downloadable version
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Super Horoscope Report - ${reportData?.basic_info?.name || "Report"}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .print-header { text-align: center; margin-bottom: 30px; }
              .report-content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <div class="print-header">
              <h1>Super Horoscope Report</h1>
              <h2>${reportData?.basic_info?.name || "Personal Report"}</h2>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
            <div class="report-content">
              <p>Complete report content would be formatted here...</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <>
        <AstroTickHeader />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center py-16">
              <Crown className="h-16 w-16 text-purple-600 mx-auto mb-6 animate-pulse" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Loading Your Super Horoscope...
              </h2>
              <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-purple-700">
                If you're seeing this for too long, you'll be redirected to
                create a new report.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!reportData) {
    return (
      <>
        <AstroTickHeader />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50">
          <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-center text-red-600">
                  Report Not Found
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center py-8">
                <p className="mb-6">
                  The Super Horoscope report you're looking for could not be
                  found.
                </p>
                <Button
                  onClick={handleGoBack}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Generate New Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          Super Horoscope Results -{" "}
          {reportData.basic_info?.name || "Personal Report"} | AstroTick
        </title>
        <meta
          name="description"
          content={`Comprehensive Super Horoscope report for ${reportData.basic_info?.name || "you"} with detailed astrological analysis, predictions, and remedies.`}
        />
      </Helmet>

      <AstroTickHeader />

      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50">
        {/* Results Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Form
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">
                    Super Horoscope Results
                  </h1>
                  <p className="text-purple-100 mt-1">
                    {reportData.basic_info?.name} • Generated on{" "}
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  size="sm"
                  className="text-white border-white/30 hover:bg-white/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="container mx-auto px-4 py-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-600/30 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-purple-700 font-medium">
                    Consulting Ancient Texts...
                  </p>
                </div>
              </div>
            }
          >
            <SuperHoroscopeDashboard reportData={reportData} />
          </Suspense>

          {/* Bottom Actions */}
          <div className="mt-12 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Your Super Horoscope is Complete!
                </h3>
                <p className="text-gray-600 mb-6">
                  This comprehensive analysis contains authentic Vedic insights
                  tailored specifically for you. Save or print this report for
                  future reference.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleGoBack}
                    variant="outline"
                    className="flex-1 sm:flex-none"
                  >
                    Generate New Report
                  </Button>
                  <Button
                    onClick={handlePrint}
                    className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Print Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
