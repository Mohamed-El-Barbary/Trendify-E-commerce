import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavColorService {
  path: WritableSignal<string> = signal('');
  updatePath(newPath: string) {
    this.path.set(newPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
