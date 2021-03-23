import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@team-ticketing/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
