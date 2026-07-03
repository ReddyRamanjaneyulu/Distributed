"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobDto = void 0;
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var CreateJobDto = function () {
    var _a;
    var _queueId_decorators;
    var _queueId_initializers = [];
    var _queueId_extraInitializers = [];
    var _batchId_decorators;
    var _batchId_initializers = [];
    var _batchId_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _payload_decorators;
    var _payload_initializers = [];
    var _payload_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _retryStrategy_decorators;
    var _retryStrategy_initializers = [];
    var _retryStrategy_extraInitializers = [];
    var _maxAttempts_decorators;
    var _maxAttempts_initializers = [];
    var _maxAttempts_extraInitializers = [];
    var _baseDelayMs_decorators;
    var _baseDelayMs_initializers = [];
    var _baseDelayMs_extraInitializers = [];
    var _scheduledAt_decorators;
    var _scheduledAt_initializers = [];
    var _scheduledAt_extraInitializers = [];
    var _availableAt_decorators;
    var _availableAt_initializers = [];
    var _availableAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateJobDto() {
                this.queueId = __runInitializers(this, _queueId_initializers, void 0);
                this.batchId = (__runInitializers(this, _queueId_extraInitializers), __runInitializers(this, _batchId_initializers, void 0));
                this.type = (__runInitializers(this, _batchId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.payload = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _payload_initializers, void 0));
                this.priority = (__runInitializers(this, _payload_extraInitializers), __runInitializers(this, _priority_initializers, 0));
                this.retryStrategy = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _retryStrategy_initializers, void 0));
                this.maxAttempts = (__runInitializers(this, _retryStrategy_extraInitializers), __runInitializers(this, _maxAttempts_initializers, void 0));
                this.baseDelayMs = (__runInitializers(this, _maxAttempts_extraInitializers), __runInitializers(this, _baseDelayMs_initializers, void 0));
                this.scheduledAt = (__runInitializers(this, _baseDelayMs_extraInitializers), __runInitializers(this, _scheduledAt_initializers, void 0));
                this.availableAt = (__runInitializers(this, _scheduledAt_extraInitializers), __runInitializers(this, _availableAt_initializers, void 0));
                __runInitializers(this, _availableAt_extraInitializers);
            }
            return CreateJobDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _queueId_decorators = [(0, class_validator_1.IsUUID)()];
            _batchId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(client_1.JobType)];
            _payload_decorators = [(0, class_validator_1.IsJSON)()];
            _priority_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _retryStrategy_decorators = [(0, class_validator_1.IsEnum)(client_1.RetryStrategy)];
            _maxAttempts_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _baseDelayMs_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _scheduledAt_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _availableAt_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _queueId_decorators, { kind: "field", name: "queueId", static: false, private: false, access: { has: function (obj) { return "queueId" in obj; }, get: function (obj) { return obj.queueId; }, set: function (obj, value) { obj.queueId = value; } }, metadata: _metadata }, _queueId_initializers, _queueId_extraInitializers);
            __esDecorate(null, null, _batchId_decorators, { kind: "field", name: "batchId", static: false, private: false, access: { has: function (obj) { return "batchId" in obj; }, get: function (obj) { return obj.batchId; }, set: function (obj, value) { obj.batchId = value; } }, metadata: _metadata }, _batchId_initializers, _batchId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _payload_decorators, { kind: "field", name: "payload", static: false, private: false, access: { has: function (obj) { return "payload" in obj; }, get: function (obj) { return obj.payload; }, set: function (obj, value) { obj.payload = value; } }, metadata: _metadata }, _payload_initializers, _payload_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _retryStrategy_decorators, { kind: "field", name: "retryStrategy", static: false, private: false, access: { has: function (obj) { return "retryStrategy" in obj; }, get: function (obj) { return obj.retryStrategy; }, set: function (obj, value) { obj.retryStrategy = value; } }, metadata: _metadata }, _retryStrategy_initializers, _retryStrategy_extraInitializers);
            __esDecorate(null, null, _maxAttempts_decorators, { kind: "field", name: "maxAttempts", static: false, private: false, access: { has: function (obj) { return "maxAttempts" in obj; }, get: function (obj) { return obj.maxAttempts; }, set: function (obj, value) { obj.maxAttempts = value; } }, metadata: _metadata }, _maxAttempts_initializers, _maxAttempts_extraInitializers);
            __esDecorate(null, null, _baseDelayMs_decorators, { kind: "field", name: "baseDelayMs", static: false, private: false, access: { has: function (obj) { return "baseDelayMs" in obj; }, get: function (obj) { return obj.baseDelayMs; }, set: function (obj, value) { obj.baseDelayMs = value; } }, metadata: _metadata }, _baseDelayMs_initializers, _baseDelayMs_extraInitializers);
            __esDecorate(null, null, _scheduledAt_decorators, { kind: "field", name: "scheduledAt", static: false, private: false, access: { has: function (obj) { return "scheduledAt" in obj; }, get: function (obj) { return obj.scheduledAt; }, set: function (obj, value) { obj.scheduledAt = value; } }, metadata: _metadata }, _scheduledAt_initializers, _scheduledAt_extraInitializers);
            __esDecorate(null, null, _availableAt_decorators, { kind: "field", name: "availableAt", static: false, private: false, access: { has: function (obj) { return "availableAt" in obj; }, get: function (obj) { return obj.availableAt; }, set: function (obj, value) { obj.availableAt = value; } }, metadata: _metadata }, _availableAt_initializers, _availableAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateJobDto = CreateJobDto;
