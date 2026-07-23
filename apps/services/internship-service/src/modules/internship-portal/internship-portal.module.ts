import { Module } from "@nestjs/common";
import { InternshipPortalController } from "./internship-portal.controller";
import { InternshipPortalService } from "./internship-portal.service";

@Module({
  controllers: [InternshipPortalController],
  providers: [InternshipPortalService],
})
export class InternshipPortalModule {}
