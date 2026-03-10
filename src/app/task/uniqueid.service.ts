import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UniqueIdService {
  private static counter = 0;
  public static getId(): string {
    return 'mrid-' + UniqueIdService.counter++;
  }
}
