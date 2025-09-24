import { DatabaseStorage } from './storage';

export interface SessionTimeoutOptions {
  warningTime: number; // minutes before expiry to show warning
  checkInterval: number; // seconds between checks
}

class SessionTimeoutManager {
  private storage: DatabaseStorage;
  private activeTimers: Map<number, NodeJS.Timeout> = new Map();
  private warningTimers: Map<number, NodeJS.Timeout> = new Map();
  private options: SessionTimeoutOptions;

  constructor(storage: DatabaseStorage, options: SessionTimeoutOptions = {
    warningTime: 5, // 5 minutes warning
    checkInterval: 30 // check every 30 seconds
  }) {
    this.storage = storage;
    this.options = options;
    this.initializeActiveConsultations();
  }

  async initializeActiveConsultations() {
    try {
      const activeConsultations = await this.storage.getAllActiveConsultations();
      
      for (const consultation of activeConsultations) {
        this.startTimerForConsultation(consultation);
      }
      
      console.log(`✅ Initialized session timers for ${activeConsultations.length} active consultations`);
    } catch (error) {
      console.error('❌ Failed to initialize active consultations:', error);
    }
  }

  startTimerForConsultation(consultation: any) {
    const consultationId = consultation.id;
    const duration = consultation.duration; // in minutes
    const startTime = new Date(consultation.createdAt).getTime();
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const totalAllowedSeconds = duration * 60;
    const remainingSeconds = Math.max(0, totalAllowedSeconds - elapsedSeconds);

    // Clear existing timers if any
    this.clearTimersForConsultation(consultationId);

    // If session already expired, end it immediately
    if (remainingSeconds <= 0) {
      this.endConsultationAutomatically(consultationId, 'Time expired on initialization');
      return;
    }

    // Set warning timer (5 minutes before expiry)
    const warningSeconds = remainingSeconds - (this.options.warningTime * 60);
    if (warningSeconds > 0) {
      const warningTimer = setTimeout(() => {
        this.sendWarningNotification(consultationId, this.options.warningTime);
      }, warningSeconds * 1000);
      
      this.warningTimers.set(consultationId, warningTimer);
    }

    // Set expiry timer
    const expiryTimer = setTimeout(() => {
      this.endConsultationAutomatically(consultationId, 'Session time expired');
    }, remainingSeconds * 1000);

    this.activeTimers.set(consultationId, expiryTimer);

    console.log(`⏰ Timer set for consultation ${consultationId}: ${Math.floor(remainingSeconds / 60)} minutes ${remainingSeconds % 60} seconds remaining`);
  }

  async endConsultationAutomatically(consultationId: number, reason: string) {
    try {
      // Update consultation status to completed
      await this.storage.updateConsultation(consultationId, {
        status: 'completed',
        endedAt: new Date()
      });

      // Clear timers
      this.clearTimersForConsultation(consultationId);

      // Emit socket event to notify clients
      const io = (global as any).io;
      if (io) {
        io.to(`consultation_${consultationId}`).emit('session-expired', {
          consultationId,
          reason,
          timestamp: new Date().toISOString(),
          message: 'Your consultation has ended due to time expiry'
        });
      }

      console.log(`✅ Consultation ${consultationId} ended automatically: ${reason}`);
    } catch (error) {
      console.error(`❌ Failed to end consultation ${consultationId} automatically:`, error);
    }
  }

  sendWarningNotification(consultationId: number, minutesRemaining: number) {
    const io = (global as any).io;
    if (io) {
      io.to(`consultation_${consultationId}`).emit('session-warning', {
        consultationId,
        minutesRemaining,
        message: `Your consultation will end in ${minutesRemaining} minutes. Consider extending if you need more time.`,
        timestamp: new Date().toISOString()
      });
    }

    console.log(`⚠️ Warning sent for consultation ${consultationId}: ${minutesRemaining} minutes remaining`);
  }

  extendConsultation(consultationId: number, additionalMinutes: number) {
    // Clear existing timers
    this.clearTimersForConsultation(consultationId);

    // Restart timer with new duration
    // This will be called after the consultation is updated in the database
    setTimeout(async () => {
      try {
        const consultation = await this.storage.getConsultationById(consultationId);
        if (consultation && consultation.status === 'active') {
          this.startTimerForConsultation(consultation);
          console.log(`🔄 Timer extended for consultation ${consultationId} by ${additionalMinutes} minutes`);
        }
      } catch (error) {
        console.error(`❌ Failed to restart timer after extension for consultation ${consultationId}:`, error);
      }
    }, 1000);
  }

  clearTimersForConsultation(consultationId: number) {
    // Clear expiry timer
    if (this.activeTimers.has(consultationId)) {
      clearTimeout(this.activeTimers.get(consultationId)!);
      this.activeTimers.delete(consultationId);
    }

    // Clear warning timer
    if (this.warningTimers.has(consultationId)) {
      clearTimeout(this.warningTimers.get(consultationId)!);
      this.warningTimers.delete(consultationId);
    }
  }

  stopTimerForConsultation(consultationId: number) {
    this.clearTimersForConsultation(consultationId);
    console.log(`🛑 Timer stopped for consultation ${consultationId}`);
  }

  getActiveTimersCount(): number {
    return this.activeTimers.size;
  }

  getTimerStatus(consultationId: number): { hasTimer: boolean; hasWarningTimer: boolean } {
    return {
      hasTimer: this.activeTimers.has(consultationId),
      hasWarningTimer: this.warningTimers.has(consultationId)
    };
  }
}

export default SessionTimeoutManager;