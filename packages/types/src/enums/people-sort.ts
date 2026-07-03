import { z } from "zod";

export const PeopleSortSchema = z.enum(["RECENT", "FOLLOWERS"]);
export type PeopleSort = z.infer<typeof PeopleSortSchema>;
