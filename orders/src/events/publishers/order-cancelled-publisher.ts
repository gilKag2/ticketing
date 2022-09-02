import { Publisher, OrderCancelledEvent, Subjects } from "@gil-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
