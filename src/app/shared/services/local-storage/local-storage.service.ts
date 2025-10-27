import { inject, Injectable } from '@angular/core';

import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private logger = inject(LoggerService);

  setItem<T>(key: string, value: T): void {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(key, jsonValue);
    } catch (error) {
      this.logger.error('Error saving to local storage', error);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      this.logger.error('Error reading from local storage', error);
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
