import { Server as SocketIOServer } from "socket.io";
import { performance } from "perf_hooks";

interface PerformanceMetrics {
  activeConnections: number;
  totalConnections: number;
  messagesPerSecond: number;
  averageResponseTime: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage: number;
  dbConnectionsActive: number;
  lastUpdated: Date;
}

interface ConnectionStats {
  connectionId: string;
  connectedAt: Date;
  consultationId?: number;
  messagesCount: number;
  lastActivity: Date;
}

export class PerformanceMonitor {
  private io: SocketIOServer;
  private metrics: PerformanceMetrics;
  private connections: Map<string, ConnectionStats>;
  private messageHistory: number[];
  private responseTimeHistory: number[];
  private monitoringInterval!: NodeJS.Timeout;

  constructor(io: SocketIOServer) {
    this.io = io;
    this.connections = new Map();
    this.messageHistory = [];
    this.responseTimeHistory = [];
    
    this.metrics = {
      activeConnections: 0,
      totalConnections: 0,
      messagesPerSecond: 0,
      averageResponseTime: 0,
      memoryUsage: process.memoryUsage(),
      cpuUsage: 0,
      dbConnectionsActive: 0,
      lastUpdated: new Date()
    };

    this.startMonitoring();
    this.setupSocketListeners();
  }

  private startMonitoring() {
    // Update metrics every 10 seconds
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
    }, 10000);

    // Clean old history every minute
    setInterval(() => {
      this.cleanHistory();
    }, 60000);
  }

  private setupSocketListeners() {
    this.io.on('connection', (socket) => {
      const connectionStats: ConnectionStats = {
        connectionId: socket.id,
        connectedAt: new Date(),
        messagesCount: 0,
        lastActivity: new Date()
      };

      this.connections.set(socket.id, connectionStats);
      this.metrics.totalConnections++;
      this.metrics.activeConnections = this.connections.size;

      console.log(`[Monitor] New connection: ${socket.id}, Total active: ${this.metrics.activeConnections}`);

      socket.on('join-consultation', (consultationId: number) => {
        const stats = this.connections.get(socket.id);
        if (stats) {
          stats.consultationId = consultationId;
          stats.lastActivity = new Date();
        }
      });

      socket.on('disconnect', () => {
        this.connections.delete(socket.id);
        this.metrics.activeConnections = this.connections.size;
        console.log(`[Monitor] Connection closed: ${socket.id}, Total active: ${this.metrics.activeConnections}`);
      });

      // Monitor message activity
      socket.onAny(() => {
        const stats = this.connections.get(socket.id);
        if (stats) {
          stats.messagesCount++;
          stats.lastActivity = new Date();
        }
        this.recordMessage();
      });
    });
  }

  private recordMessage() {
    const now = Date.now();
    this.messageHistory.push(now);
  }

  private recordResponseTime(startTime: number) {
    const responseTime = performance.now() - startTime;
    this.responseTimeHistory.push(responseTime);
  }

  private updateMetrics() {
    const now = Date.now();
    const oneSecondAgo = now - 1000;

    // Calculate messages per second
    const recentMessages = this.messageHistory.filter(timestamp => timestamp > oneSecondAgo);
    this.metrics.messagesPerSecond = recentMessages.length;

    // Calculate average response time
    if (this.responseTimeHistory.length > 0) {
      const sum = this.responseTimeHistory.reduce((a, b) => a + b, 0);
      this.metrics.averageResponseTime = sum / this.responseTimeHistory.length;
    }

    // Update system metrics
    this.metrics.memoryUsage = process.memoryUsage();
    this.metrics.lastUpdated = new Date();

    // Log performance alerts
    this.checkPerformanceAlerts();
  }

  private cleanHistory() {
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    
    this.messageHistory = this.messageHistory.filter(timestamp => timestamp > fiveMinutesAgo);
    this.responseTimeHistory = this.responseTimeHistory.filter((_, index) => 
      index >= this.responseTimeHistory.length - 1000 // Keep last 1000 entries
    );

    // Clean inactive connections
    const inactiveThreshold = new Date(Date.now() - (30 * 60 * 1000)); // 30 minutes
    for (const [socketId, stats] of this.connections.entries()) {
      if (stats.lastActivity < inactiveThreshold) {
        this.connections.delete(socketId);
        console.log(`[Monitor] Cleaned inactive connection: ${socketId}`);
      }
    }
  }

  private checkPerformanceAlerts() {
    const { memoryUsage, activeConnections, averageResponseTime, messagesPerSecond } = this.metrics;
    
    // Memory usage alert (>500MB)
    if (memoryUsage.heapUsed > 500 * 1024 * 1024) {
      console.warn(`[Performance Alert] High memory usage: ${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`);
    }

    // High connection count alert (>80% of recommended capacity)
    if (activeConnections > 40) { // 50 is our target capacity
      console.warn(`[Performance Alert] High connection count: ${activeConnections}`);
    }

    // Slow response time alert (>2000ms)
    if (averageResponseTime > 2000) {
      console.warn(`[Performance Alert] Slow response time: ${Math.round(averageResponseTime)}ms`);
    }

    // Message rate alert (>100 messages/second may indicate spam)
    if (messagesPerSecond > 100) {
      console.warn(`[Performance Alert] High message rate: ${messagesPerSecond}/sec`);
    }

    // Log current status every 5 minutes
    if (Date.now() % (5 * 60 * 1000) < 10000) {
      this.logStatus();
    }
  }

  private logStatus() {
    const { activeConnections, messagesPerSecond, averageResponseTime, memoryUsage } = this.metrics;
    const memoryMB = Math.round(memoryUsage.heapUsed / 1024 / 1024);
    
    console.log(`[Performance Status] Connections: ${activeConnections} | Messages/sec: ${messagesPerSecond} | Response: ${Math.round(averageResponseTime)}ms | Memory: ${memoryMB}MB`);
  }

  // Public methods for monitoring
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  public getConnectionStats(): ConnectionStats[] {
    return Array.from(this.connections.values());
  }

  public getActiveConsultations(): number[] {
    const consultations = new Set<number>();
    for (const stats of this.connections.values()) {
      if (stats.consultationId) {
        consultations.add(stats.consultationId);
      }
    }
    return Array.from(consultations);
  }

  public recordDatabaseQuery(startTime: number) {
    this.recordResponseTime(startTime);
  }

  public stop() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}

// Memory optimization utilities
export class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private messageBuffers: Map<number, any[]> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  private constructor() {
    // Clean message buffers every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupBuffers();
    }, 5 * 60 * 1000);
  }

  public static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  public bufferMessage(consultationId: number, message: any) {
    if (!this.messageBuffers.has(consultationId)) {
      this.messageBuffers.set(consultationId, []);
    }
    
    const buffer = this.messageBuffers.get(consultationId)!;
    buffer.push({
      ...message,
      bufferedAt: Date.now()
    });

    // Keep only recent 100 messages in buffer
    if (buffer.length > 100) {
      buffer.splice(0, buffer.length - 100);
    }
  }

  public getBufferedMessages(consultationId: number): any[] {
    return this.messageBuffers.get(consultationId) || [];
  }

  private cleanupBuffers() {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    for (const [consultationId, messages] of this.messageBuffers.entries()) {
      // Remove old messages
      const recentMessages = messages.filter(msg => msg.bufferedAt > oneHourAgo);
      
      if (recentMessages.length === 0) {
        this.messageBuffers.delete(consultationId);
      } else {
        this.messageBuffers.set(consultationId, recentMessages);
      }
    }

    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }

    console.log(`[Memory] Cleaned buffers, active consultations: ${this.messageBuffers.size}`);
  }

  public stop() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export { PerformanceMetrics, ConnectionStats };