import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isProduction = environment.production;

  log(...args: any[]): void {
    if (!this.isProduction) {
      console.log(...args);
    }
  }

  warn(...args: any[]): void {
    if (!this.isProduction) {
      console.warn(...args);
    }
  }

  error(...args: any[]): void {
    // Always log errors, even in production (you might want to send these to a service)
    console.error(...args);
  }

  info(...args: any[]): void {
    if (!this.isProduction) {
      console.info(...args);
    }
  }

  debug(...args: any[]): void {
    if (!this.isProduction) {
      console.debug(...args);
    }
  }

  table(data: any): void {
    if (!this.isProduction) {
      console.table(data);
    }
  }

  group(label: string): void {
    if (!this.isProduction) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (!this.isProduction) {
      console.groupEnd();
    }
  }
}
