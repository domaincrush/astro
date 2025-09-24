/**
 * Jyotisha Daemon Client
 * High-performance client for daemon service integration
 */

import axios from 'axios';

const DAEMON_BASE_URL = process.env.DAEMON_URL || 'http://localhost:8001';
const DAEMON_TIMEOUT = 10000; // 10 seconds

interface BirthDetails {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone?: string;
}

interface PlanetaryPosition {
  longitude: number;
  sign: string;
  degree: number;
  house: number;
}

interface BirthChartResponse {
  success: boolean;
  birth_details: {
    name: string;
    date: string;
    time: string;
    latitude: number;
    longitude: number;
  };
  planetary_positions: Record<string, PlanetaryPosition>;
  calculation_method: string;
  timestamp: string;
}

interface DashaTimelineResponse {
  success: boolean;
  birth_details: BirthDetails;
  current_dasha: {
    mahadasha: string;
    antardasha: string;
    start_date: string;
    end_date: string;
    current_age: number;
  };
  complete_timeline: Array<{
    planet: string;
    start_age: number;
    end_age: number;
    start_date: string;
    end_date: string;
    duration_years: number;
  }>;
  calculation_method: string;
  timestamp: string;
}

interface NakshatraResponse {
  success: boolean;
  nakshatra: {
    name: string;
    pada: number;
    deity: string;
    symbol: string;
    characteristics: string[];
  };
  calculation_method: string;
  timestamp: string;
}

class JyotishaDaemonClient {
  private baseURL: string;
  private timeout: number;
  private isHealthy: boolean = false;

  constructor() {
    this.baseURL = DAEMON_BASE_URL;
    this.timeout = DAEMON_TIMEOUT;
    this.checkHealth();
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
        timeout: 5000
      });
      this.isHealthy = response.data.status === 'healthy';
      return this.isHealthy;
    } catch (error) {
      console.warn('Daemon service health check failed:', error.message);
      this.isHealthy = false;
      return false;
    }
  }

  async calculateBirthChart(birthDetails: BirthDetails): Promise<BirthChartResponse | null> {
    if (!this.isHealthy) {
      await this.checkHealth();
      if (!this.isHealthy) {
        throw new Error('Daemon service not available');
      }
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/birth-chart`,
        birthDetails,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('Daemon birth chart calculation failed:', error.message);
      throw error;
    }
  }

  async calculateDashaTimeline(birthDetails: BirthDetails): Promise<DashaTimelineResponse | null> {
    try {
      const response = await axios.post(
        `${this.baseURL}/dasha-timeline`,
        birthDetails,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('Daemon dasha timeline calculation failed:', error.message);
      throw error;
    }
  }

  async calculateNakshatra(birthDetails: BirthDetails): Promise<NakshatraResponse | null> {
    try {
      const response = await axios.post(
        `${this.baseURL}/nakshatra`,
        {
          year: birthDetails.year,
          month: birthDetails.month,
          day: birthDetails.day,
          hour: birthDetails.hour,
          minute: birthDetails.minute,
          ayanaamsha_id: 'LAHIRI'
        },
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('Daemon nakshatra calculation failed:', error.message);
      throw error;
    }
  }

  async calculateSadeSati(birthDetails: BirthDetails): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/sade-sati`,
        birthDetails,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('Daemon sade sati calculation failed:', error.message);
      throw error;
    }
  }

  async calculatePanchang(date: { year: number; month: number; day: number; latitude: number; longitude: number }): Promise<any> {
    try {
      const response = await axios.post(
        `${this.baseURL}/panchang`,
        { ...date, timezone: 'Asia/Kolkata' },
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('Daemon panchang calculation failed:', error.message);
      throw error;
    }
  }

  isServiceHealthy(): boolean {
    return this.isHealthy;
  }
}

// Singleton instance
export const daemonClient = new JyotishaDaemonClient();

// Helper functions for backward compatibility
export async function calculateBirthChartDaemon(birthDetails: BirthDetails): Promise<BirthChartResponse | null> {
  return daemonClient.calculateBirthChart(birthDetails);
}

export async function calculateDashaTimelineDaemon(birthDetails: BirthDetails): Promise<DashaTimelineResponse | null> {
  return daemonClient.calculateDashaTimeline(birthDetails);
}

export async function isDaemonServiceAvailable(): Promise<boolean> {
  return daemonClient.checkHealth();
}