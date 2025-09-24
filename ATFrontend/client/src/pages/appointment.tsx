import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import { Button } from "src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "src/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Input } from "src/components/ui/input";
import { Textarea } from "src/components/ui/textarea";
import { useToast } from "src/hooks/use-toast";
import { apiRequest } from "src/lib/queryClient";
import AstroTickHeader from "src/components/layout/AstroTickHeader";
import Footer from "src/components/layout/Footer";

const appointmentSchema = z.object({
  sessionType: z.string().min(1, "Please select a session type"),
  astrologer: z.string().min(1, "Please select an astrologer"),
  bookingDate: z.string().min(1, "Please select a date"),
  bookingTime: z.string().min(1, "Please select a time"),
  duration: z.number(),
  price: z.string(),
  notes: z.string().optional(),
});

export default function Appointments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      sessionType: "",
      astrologer: "",
      bookingDate: "",
      bookingTime: "",
      duration: 60,
      price: "120",
      notes: "",
    },
  });

  const { data: userAppointments = [] } = useQuery({
    queryKey: ["/api/appointments/user"],
  });

  const { data: bookedSlots = [] } = useQuery({
    queryKey: ["/api/appointments/date", selectedDate],
    enabled: !!selectedDate,
  });

  const createAppointment = useMutation({
    mutationFn: async (data: z.infer<typeof appointmentSchema>) => {
      return await apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: () => {
      toast({
        title: "Appointment Booked",
        description:
          "Your appointment has been successfully scheduled. You'll receive a confirmation email.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/appointments/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const sessionTypes = [
    { value: "Birth Chart Reading", duration: 60, price: "120" },
    { value: "Relationship Compatibility", duration: 45, price: "90" },
    { value: "Career Guidance", duration: 30, price: "60" },
    { value: "Quick Question Session", duration: 15, price: "30" },
  ];

  const astrologers = [
    "Maya Chen - Love & Relationships Specialist",
    "David Rodriguez - Career & Finance Expert",
    "Sarah Williams - Spiritual Growth Guide",
    "Any Available Astrologer",
  ];

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        const isBooked = bookedSlots.some(
          (slot: any) => slot.bookingTime === time,
        );
        slots.push({ time, isBooked });
      }
    }
    return slots;
  };

  const handleSessionTypeChange = (value: string) => {
    const sessionType = sessionTypes.find((s) => s.value === value);
    if (sessionType) {
      form.setValue("sessionType", value);
      form.setValue("duration", sessionType.duration);
      form.setValue("price", sessionType.price);
    }
  };

  const handleTimeSlotSelect = (time: string) => {
    setSelectedSlot(time);
    form.setValue("bookingTime", time);
  };

  const handleSubmit = (data: z.infer<typeof appointmentSchema>) => {
    createAppointment.mutate({
      ...data,
      bookingDate: selectedDate,
      bookingTime: selectedSlot,
    });
  };

  const upcomingAppointments = userAppointments.filter(
    (appointment: any) => new Date(appointment.bookingDate) >= new Date(),
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <AstroTickHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Book Consultation Session
            </h2>
            <p className="text-muted-foreground">
              Schedule a personal session with our expert astrologers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="sessionType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Type</FormLabel>
                          <Select
                            onValueChange={handleSessionTypeChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-session-type">
                                <SelectValue placeholder="Select session type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sessionTypes.map((session) => (
                                <SelectItem
                                  key={session.value}
                                  value={session.value}
                                >
                                  {session.value} ({session.duration} min) - $
                                  {session.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="astrologer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Astrologer</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger data-testid="select-astrologer">
                                <SelectValue placeholder="Select astrologer" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {astrologers.map((astrologer) => (
                                <SelectItem key={astrologer} value={astrologer}>
                                  {astrologer}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bookingDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preferred Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                setSelectedDate(e.target.value);
                              }}
                              data-testid="input-booking-date"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Session Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any specific topics you'd like to focus on..."
                              className="resize-none"
                              rows={3}
                              data-testid="input-session-notes"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={createAppointment.isPending || !selectedSlot}
                      data-testid="button-book-appointment"
                    >
                      {createAppointment.isPending
                        ? "Booking..."
                        : "Book Appointment"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Available Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle>Available Time Slots</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDate ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground mb-3">
                      {new Date(selectedDate).toLocaleDateString()} - Available
                      Times
                    </h4>
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                      {generateTimeSlots().map(({ time, isBooked }) => (
                        <Button
                          key={time}
                          variant={
                            selectedSlot === time ? "default" : "outline"
                          }
                          size="sm"
                          disabled={isBooked}
                          onClick={() => handleTimeSlotSelect(time)}
                          className={`${isBooked ? "opacity-50 cursor-not-allowed" : ""}`}
                          data-testid={`button-time-slot-${time}`}
                        >
                          {time} {isBooked && "(Booked)"}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Please select a date to view available time slots.
                  </p>
                )}

                <div className="bg-muted/50 p-4 rounded-lg mt-6">
                  <h4 className="font-medium text-foreground mb-2 flex items-center">
                    <i className="fas fa-info-circle text-accent mr-2"></i>
                    Booking Information
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Sessions are conducted via video call</li>
                    <li>• You'll receive booking confirmation via email</li>
                    <li>• Cancellation allowed up to 24 hours before</li>
                    <li>• All sessions are recorded for your reference</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Appointments */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-6">
              My Upcoming Appointments
            </h3>
            <div className="space-y-4">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment: any) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4
                            className="font-semibold text-foreground mb-2"
                            data-testid={`text-appointment-title-${appointment.id}`}
                          >
                            {appointment.sessionType} with{" "}
                            {appointment.astrologer}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <i className="fas fa-calendar text-primary mr-1"></i>
                              {new Date(
                                appointment.bookingDate,
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center">
                              <i className="fas fa-clock text-secondary mr-1"></i>
                              {appointment.bookingTime}
                            </span>
                            <span className="flex items-center">
                              <i className="fas fa-video text-accent mr-1"></i>
                              Video Call
                            </span>
                          </div>
                          {appointment.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Focus: {appointment.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-medium">
                            {appointment.status}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-cancel-appointment-${appointment.id}`}
                          >
                            <i className="fas fa-times text-destructive"></i>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <i className="fas fa-calendar-plus text-4xl text-muted-foreground mb-4"></i>
                    <h3 className="text-lg font-semibold mb-2">
                      No upcoming appointments
                    </h3>
                    <p className="text-muted-foreground">
                      Book your first consultation session above.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
