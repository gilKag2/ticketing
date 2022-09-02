import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
  const ticket = Ticket.build({ title: "test", price: 5, userId: "123" });
  await ticket.save();

  const firstTicketInstance = await Ticket.findById(ticket.id);
  const secondTicketInstance = await Ticket.findById(ticket.id);

  firstTicketInstance!.set({ price: 10 });
  secondTicketInstance!.set({ price: 15 });

  await firstTicketInstance!.save();

  try {
    await secondTicketInstance!.save();
  } catch (err) {
    return;
  }
  throw new Error("shouldn't reach here");
});

it("increments the version number after multiple saves", async () => {
  const ticket = Ticket.build({ title: "test", price: 5, userId: "123" });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
