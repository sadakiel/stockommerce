// Database backup utilities
export class BackupManager {
  private static instance: BackupManager;

  static getInstance(): BackupManager {
    if (!BackupManager.instance) {
      BackupManager.instance = new BackupManager();
    }
    return BackupManager.instance;
  }

  async createBackup(tenantId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      // This would typically call a server endpoint
      const response = await fetch(`/api/backup/${tenantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Backup failed');
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async restoreBackup(tenantId: string, backupData: any): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch(`/api/restore/${tenantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(backupData)
      });

      if (!response.ok) {
        throw new Error('Restore failed');
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  exportData(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async importData(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          resolve(data);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }
}

// Automated backup scheduling
export class BackupScheduler {
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  scheduleBackup(tenantId: string, intervalHours: number = 24): void {
    // Clear existing interval
    this.clearSchedule(tenantId);

    const interval = setInterval(async () => {
      const backupManager = BackupManager.getInstance();
      const result = await backupManager.createBackup(tenantId);
      
      if (result.success) {
        console.log(`Automated backup completed for tenant ${tenantId}`);
      } else {
        console.error(`Automated backup failed for tenant ${tenantId}:`, result.error);
      }
    }, intervalHours * 60 * 60 * 1000);

    this.intervals.set(tenantId, interval);
  }

  clearSchedule(tenantId: string): void {
    const interval = this.intervals.get(tenantId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(tenantId);
    }
  }

  clearAllSchedules(): void {
    for (const [tenantId] of this.intervals) {
      this.clearSchedule(tenantId);
    }
  }
}