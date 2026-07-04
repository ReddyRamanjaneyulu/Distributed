"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const organizations_1 = require("./organizations");
const projects_1 = require("./projects");
const retry_policies_1 = require("./retry-policies");
const queues_1 = require("./queues");
const jobs_1 = require("./jobs");
const workers_1 = require("./workers");
const scheduled_jobs_1 = require("./scheduled-jobs");
const execution_1 = require("./execution");
const runtime_1 = require("./runtime");
const health_module_1 = require("./health/health.module");
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
const database_config_1 = __importDefault(require("./config/database.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [jwt_config_1.default, database_config_1.default],
            }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            organizations_1.OrganizationsModule,
            projects_1.ProjectsModule,
            retry_policies_1.RetryPoliciesModule,
            queues_1.QueuesModule,
            jobs_1.JobsModule,
            workers_1.WorkersModule,
            scheduled_jobs_1.ScheduledJobsModule,
            execution_1.ExecutionModule,
            runtime_1.RuntimeModule,
            health_module_1.HealthModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map