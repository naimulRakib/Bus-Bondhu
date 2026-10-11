import { delay } from "./client";
import { Departure } from "../types";
import { SEED_DEPARTURES } from "../data/seed";

export async function getAvailableDepartures(
  routeId: string,
  date?: string
): Promise<Departure[]> {
  await delay(200);
  return SEED_DEPARTURES.filter((dep) => {
    const matchesRoute = dep.routeId === routeId;
    if (date) {
      return matchesRoute && dep.date === date;
    }
    return matchesRoute;
  });
}
