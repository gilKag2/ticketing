import { Publisher, Subjects, TicketUpdatedEvent } from "@gil-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
