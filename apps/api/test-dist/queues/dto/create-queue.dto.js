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
exports.CreateQueueDto = void 0;
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var CreateQueueDto = function () {
    var _a;
    var _projectId_decorators;
    var _projectId_initializers = [];
    var _projectId_extraInitializers = [];
    var _retryPolicyId_decorators;
    var _retryPolicyId_initializers = [];
    var _retryPolicyId_extraInitializers = [];
    var _deadLetterQueueId_decorators;
    var _deadLetterQueueId_initializers = [];
    var _deadLetterQueueId_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _concurrency_decorators;
    var _concurrency_initializers = [];
    var _concurrency_extraInitializers = [];
    var _visibilityTimeout_decorators;
    var _visibilityTimeout_initializers = [];
    var _visibilityTimeout_extraInitializers = [];
    var _paused_decorators;
    var _paused_initializers = [];
    var _paused_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateQueueDto() {
                this.projectId = __runInitializers(this, _projectId_initializers, void 0);
                this.retryPolicyId = (__runInitializers(this, _projectId_extraInitializers), __runInitializers(this, _retryPolicyId_initializers, void 0));
                this.deadLetterQueueId = (__runInitializers(this, _retryPolicyId_extraInitializers), __runInitializers(this, _deadLetterQueueId_initializers, void 0));
                this.name = (__runInitializers(this, _deadLetterQueueId_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, client_1.QueueStatus.ACTIVE));
                this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, 0));
                this.concurrency = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _concurrency_initializers, 5));
                this.visibilityTimeout = (__runInitializers(this, _concurrency_extraInitializers), __runInitializers(this, _visibilityTimeout_initializers, 60));
                this.paused = (__runInitializers(this, _visibilityTimeout_extraInitializers), __runInitializers(this, _paused_initializers, false));
                __runInitializers(this, _paused_extraInitializers);
            }
            return CreateQueueDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _projectId_decorators = [(0, class_validator_1.IsUUID)()];
            _retryPolicyId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _deadLetterQueueId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsUUID)()];
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(100)];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)(), (0, class_validator_1.MaxLength)(500)];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(client_1.QueueStatus)];
            _priority_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _concurrency_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _visibilityTimeout_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _paused_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _projectId_decorators, { kind: "field", name: "projectId", static: false, private: false, access: { has: function (obj) { return "projectId" in obj; }, get: function (obj) { return obj.projectId; }, set: function (obj, value) { obj.projectId = value; } }, metadata: _metadata }, _projectId_initializers, _projectId_extraInitializers);
            __esDecorate(null, null, _retryPolicyId_decorators, { kind: "field", name: "retryPolicyId", static: false, private: false, access: { has: function (obj) { return "retryPolicyId" in obj; }, get: function (obj) { return obj.retryPolicyId; }, set: function (obj, value) { obj.retryPolicyId = value; } }, metadata: _metadata }, _retryPolicyId_initializers, _retryPolicyId_extraInitializers);
            __esDecorate(null, null, _deadLetterQueueId_decorators, { kind: "field", name: "deadLetterQueueId", static: false, private: false, access: { has: function (obj) { return "deadLetterQueueId" in obj; }, get: function (obj) { return obj.deadLetterQueueId; }, set: function (obj, value) { obj.deadLetterQueueId = value; } }, metadata: _metadata }, _deadLetterQueueId_initializers, _deadLetterQueueId_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _concurrency_decorators, { kind: "field", name: "concurrency", static: false, private: false, access: { has: function (obj) { return "concurrency" in obj; }, get: function (obj) { return obj.concurrency; }, set: function (obj, value) { obj.concurrency = value; } }, metadata: _metadata }, _concurrency_initializers, _concurrency_extraInitializers);
            __esDecorate(null, null, _visibilityTimeout_decorators, { kind: "field", name: "visibilityTimeout", static: false, private: false, access: { has: function (obj) { return "visibilityTimeout" in obj; }, get: function (obj) { return obj.visibilityTimeout; }, set: function (obj, value) { obj.visibilityTimeout = value; } }, metadata: _metadata }, _visibilityTimeout_initializers, _visibilityTimeout_extraInitializers);
            __esDecorate(null, null, _paused_decorators, { kind: "field", name: "paused", static: false, private: false, access: { has: function (obj) { return "paused" in obj; }, get: function (obj) { return obj.paused; }, set: function (obj, value) { obj.paused = value; } }, metadata: _metadata }, _paused_initializers, _paused_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateQueueDto = CreateQueueDto;
