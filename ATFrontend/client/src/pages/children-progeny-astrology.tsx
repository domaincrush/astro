import { Button } from "src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "src/components/ui/card";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";
import { Users, Baby, Heart, Star, ArrowRight, MessageCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function ChildrenProgenyAstrology() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50">
      <AstroTickHeader />
      
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl flex items-center justify-center">
              <Users className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Children & Progeny Astrology
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Understand your progeny potential through 5th house analysis. Get insights into child birth timing, 
            number of children, and their future prospects.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="border-red-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Baby className="h-8 w-8 text-red-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Child Birth Timing</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">5th House Analysis</h4>
                  <p className="text-gray-600 text-sm">Children house examination and conception favorable periods</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Jupiter Transit Effects</h4>
                  <p className="text-gray-600 text-sm">Beneficial periods for childbirth and family expansion</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Heart className="h-8 w-8 text-rose-600 mr-3" />
                  <CardTitle className="text-2xl text-gray-900">Children's Future Prospects</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-rose-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Education & Career</h4>
                  <p className="text-gray-600 text-sm">Academic success and professional achievements of children</p>
                </div>
                <div className="bg-pink-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Health & Wellbeing</h4>
                  <p className="text-gray-600 text-sm">Children's health patterns and protective measures</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Understand Your Family Future?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700"
              onClick={() => setLocation('/astrologers')}
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Consult Family Astrologer
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}