import {
  ExpirationCompletedEvent,
  Publisher,
  Subjects,
} from "@gil-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompletedEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
