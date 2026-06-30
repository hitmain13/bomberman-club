import { z } from "zod";

export const DrivetrainSchema = z.enum(["FWD", "RWD", "AWD", "FOURWD"]);
export type Drivetrain = z.infer<typeof DrivetrainSchema>;
