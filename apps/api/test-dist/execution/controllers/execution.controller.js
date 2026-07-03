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
exports.ExecutionController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var ExecutionController = function () {
    var _classDecorators = [(0, common_1.Controller)('execution'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _poll_decorators;
    var _complete_decorators;
    var _fail_decorators;
    var _retry_decorators;
    var _cancel_decorators;
    var ExecutionController = _classThis = /** @class */ (function () {
        function ExecutionController_1(executionService) {
            this.executionService = (__runInitializers(this, _instanceExtraInitializers), executionService);
        }
        /**
         * Worker polls for next job
         */
        ExecutionController_1.prototype.poll = function (queueId, workerId) {
            return this.executionService.poll(queueId, workerId);
        };
        /**
         * Complete execution
         */
        ExecutionController_1.prototype.complete = function (executionId, _dto) {
            return this.executionService.complete(executionId);
        };
        /**
         * Fail execution
         */
        ExecutionController_1.prototype.fail = function (executionId, dto) {
            var _a;
            return this.executionService.fail(executionId, (_a = dto.message) !== null && _a !== void 0 ? _a : 'Unknown error');
        };
        /**
         * Retry execution
         */
        ExecutionController_1.prototype.retry = function (executionId, nextRun) {
            return this.executionService.retry(executionId, new Date(nextRun));
        };
        /**
         * Cancel execution
         */
        ExecutionController_1.prototype.cancel = function (executionId) {
            return this.executionService.cancel(executionId);
        };
        return ExecutionController_1;
    }());
    __setFunctionName(_classThis, "ExecutionController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _poll_decorators = [(0, common_1.Post)('poll')];
        _complete_decorators = [(0, common_1.Post)(':executionId/complete')];
        _fail_decorators = [(0, common_1.Post)(':executionId/fail')];
        _retry_decorators = [(0, common_1.Post)(':executionId/retry')];
        _cancel_decorators = [(0, common_1.Post)(':executionId/cancel')];
        __esDecorate(_classThis, null, _poll_decorators, { kind: "method", name: "poll", static: false, private: false, access: { has: function (obj) { return "poll" in obj; }, get: function (obj) { return obj.poll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _complete_decorators, { kind: "method", name: "complete", static: false, private: false, access: { has: function (obj) { return "complete" in obj; }, get: function (obj) { return obj.complete; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _fail_decorators, { kind: "method", name: "fail", static: false, private: false, access: { has: function (obj) { return "fail" in obj; }, get: function (obj) { return obj.fail; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _retry_decorators, { kind: "method", name: "retry", static: false, private: false, access: { has: function (obj) { return "retry" in obj; }, get: function (obj) { return obj.retry; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _cancel_decorators, { kind: "method", name: "cancel", static: false, private: false, access: { has: function (obj) { return "cancel" in obj; }, get: function (obj) { return obj.cancel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExecutionController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExecutionController = _classThis;
}();
exports.ExecutionController = ExecutionController;
