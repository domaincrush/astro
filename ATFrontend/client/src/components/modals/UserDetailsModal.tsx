import { useState } from "react";
import { Button } from "src/components/ui/button";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { Textarea } from "src/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "src/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon, HelpCircleIcon } from "lucide-react";

interface UserDetailsModalProps {
  isOpen: boolean;
  onSubmit: (details: UserDetails) => void;
  onSkip: () => void;
  isLoading: boolean;
}

interface UserDetails {
  name: string;
  dateOfBirth: string;
  placeOfBirth: string;
  timeOfBirth: string;
  question: string;
}

export default function UserDetailsModal({ isOpen, onSubmit, onSkip, isLoading }: UserDetailsModalProps) {
  const [details, setDetails] = useState<UserDetails>({
    name: "",
    dateOfBirth: "",
    placeOfBirth: "",
    timeOfBirth: "",
    question: "",
  });

  const [errors, setErrors] = useState<Partial<UserDetails>>({});

  const validateForm = () => {
    const newErrors: Partial<UserDetails> = {};
    
    if (!details.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!details.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    }
    
    if (!details.placeOfBirth.trim()) {
      newErrors.placeOfBirth = "Place of birth is required";
    }
    
    if (!details.timeOfBirth) {
      newErrors.timeOfBirth = "Time of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(details);
    }
  };

  const handleInputChange = (field: keyof UserDetails, value: string) => {
    setDetails(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserIcon className="w-6 h-6 text-primary" />
            Share Your Birth Details
          </DialogTitle>
          <DialogDescription className="text-base">
            Please provide your birth information for accurate astrological consultation. 
            This helps our astrologer give you personalized predictions and insights.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  value={details.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarIcon className="w-5 h-5" />
                Birth Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                    Date of Birth *
                  </Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={details.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className={errors.dateOfBirth ? "border-red-500" : ""}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeOfBirth" className="text-sm font-medium">
                    Time of Birth *
                  </Label>
                  <Input
                    id="timeOfBirth"
                    type="time"
                    value={details.timeOfBirth}
                    onChange={(e) => handleInputChange("timeOfBirth", e.target.value)}
                    className={errors.timeOfBirth ? "border-red-500" : ""}
                  />
                  {errors.timeOfBirth && (
                    <p className="text-sm text-red-500">{errors.timeOfBirth}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth" className="text-sm font-medium flex items-center gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  Place of Birth *
                </Label>
                <Input
                  id="placeOfBirth"
                  value={details.placeOfBirth}
                  onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                  placeholder="City, State, Country"
                  className={errors.placeOfBirth ? "border-red-500" : ""}
                />
                {errors.placeOfBirth && (
                  <p className="text-sm text-red-500">{errors.placeOfBirth}</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <HelpCircleIcon className="w-5 h-5" />
                Your Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="question" className="text-sm font-medium">
                  What would you like to know? (Optional)
                </Label>
                <Textarea
                  id="question"
                  value={details.question}
                  onChange={(e) => handleInputChange("question", e.target.value)}
                  placeholder="Ask about career, relationships, health, or any specific concerns..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Note:</strong> Your consultation timer will start only after you submit these details or choose to skip. 
              All information is kept confidential and used solely for astrological consultation.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onSkip}
            disabled={isLoading}
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? "Saving..." : "Start Consultation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}