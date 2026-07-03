"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var JobController = function () {
    var _classDecorators = [(0, common_1.Controller)('jobs'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var _start_decorators;
    var _complete_decorators;
    var _fail_decorators;
    var _retry_decorators;
    var _cancel_decorators;
    var JobController = _classThis = /** @class */ (function () {
        function JobController_1(jobService) {
            this.jobService = (__runInitializers(this, _instanceExtraInitializers), jobService);
        }
        JobController_1.prototype.create = function (dto) {
            return this.jobService.create(dto);
        };
        JobController_1.prototype.findAll = function (page, limit, status) {
            if (page === void 0) { page = 1; }
            if (limit === void 0) { limit = 20; }
            return this.jobService.findAll(Number(page), Number(limit), status);
        };
        JobController_1.prototype.findOne = function (id) {
            return this.jobService.findOne(id);
        };
        JobController_1.prototype.update = function (id, dto) {
            return this.jobService.update(id, dto);
        };
        JobController_1.prototype.remove = function (id) {
            return this.jobService.remove(id);
        };
        JobController_1.prototype.start = function (id, workerId) {
            return this.jobService.start(id, workerId);
        };
        JobController_1.prototype.complete = function (id) {
            return this.jobService.complete(id);
        };
        JobController_1.prototype.fail = function (id) {
            return this.jobService.fail(id);
        };
        JobController_1.prototype.retry = function (id) {
            return this.jobService.retry(id);
        };
        JobController_1.prototype.cancel = function (id) {
            return this.jobService.cancel(id);
        };
        return JobController_1;
    }());
    __setFunctionName(_classThis, "JobController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)()];
        _findAll_decorators = [(0, common_1.Get)()];
        _findOne_decorators = [(0, common_1.Get)(':id')];
        _update_decorators = [(0, common_1.Patch)(':id')];
        _remove_decorators = [(0, common_1.Delete)(':id')];
        _start_decorators = [(0, common_1.Post)(':id/start')];
        _complete_decorators = [(0, common_1.Post)(':id/complete')];
        _fail_decorators = [(0, common_1.Post)(':id/fail')];
        _retry_decorators = [(0, common_1.Post)(':id/retry')];
        _cancel_decorators = [(0, common_1.Post)(':id/cancel')];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _start_decorators, { kind: "method", name: "start", static: false, private: false, access: { has: function (obj) { return "start" in obj; }, get: function (obj) { return obj.start; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _complete_decorators, { kind: "method", name: "complete", static: false, private: false, access: { has: function (obj) { return "complete" in obj; }, get: function (obj) { return obj.complete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _fail_decorators, { kind: "method", name: "fail", static: false, private: false, access: { has: function (obj) { return "fail" in obj; }, get: function (obj) { return obj.fail; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _retry_decorators, { kind: "method", name: "retry", static: false, private: false, access: { has: function (obj) { return "retry" in obj; }, get: function (obj) { return obj.retry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancel_decorators, { kind: "method", name: "cancel", static: false, private: false, access: { has: function (obj) { return "cancel" in obj; }, get: function (obj) { return obj.cancel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JobController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JobController = _classThis;
}();
exports.JobController = JobController;
