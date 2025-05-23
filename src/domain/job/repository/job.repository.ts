import { GenericRepository } from "@/domain/shared/repositories/generic-repository";
import { Job } from "../entity/job.entity";

export interface JobRepository extends GenericRepository<Job> {}
