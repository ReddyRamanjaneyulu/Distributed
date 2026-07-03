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
exports.HeartbeatDto = void 0;
var class_validator_1 = require("class-validator");
var HeartbeatDto = function () {
    var _a;
    var _cpuUsage_decorators;
    var _cpuUsage_initializers = [];
    var _cpuUsage_extraInitializers = [];
    var _memoryUsage_decorators;
    var _memoryUsage_initializers = [];
    var _memoryUsage_extraInitializers = [];
    var _activeJobs_decorators;
    var _activeJobs_initializers = [];
    var _activeJobs_extraInitializers = [];
    var _queuedJobs_decorators;
    var _queuedJobs_initializers = [];
    var _queuedJobs_extraInitializers = [];
    return _a = /** @class */ (function () {
            function HeartbeatDto() {
                this.cpuUsage = __runInitializers(this, _cpuUsage_initializers, void 0);
                this.memoryUsage = (__runInitializers(this, _cpuUsage_extraInitializers), __runInitializers(this, _memoryUsage_initializers, void 0));
                this.activeJobs = (__runInitializers(this, _memoryUsage_extraInitializers), __runInitializers(this, _activeJobs_initializers, 0));
                this.queuedJobs = (__runInitializers(this, _activeJobs_extraInitializers), __runInitializers(this, _queuedJobs_initializers, 0));
                __runInitializers(this, _queuedJobs_extraInitializers);
            }
            return HeartbeatDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _cpuUsage_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _memoryUsage_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _activeJobs_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _queuedJobs_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            __esDecorate(null, null, _cpuUsage_decorators, { kind: "field", name: "cpuUsage", static: false, private: false, access: { has: function (obj) { return "cpuUsage" in obj; }, get: function (obj) { return obj.cpuUsage; }, set: function (obj, value) { obj.cpuUsage = value; } }, metadata: _metadata }, _cpuUsage_initializers, _cpuUsage_extraInitializers);
            __esDecorate(null, null, _memoryUsage_decorators, { kind: "field", name: "memoryUsage", static: false, private: false, access: { has: function (obj) { return "memoryUsage" in obj; }, get: function (obj) { return obj.memoryUsage; }, set: function (obj, value) { obj.memoryUsage = value; } }, metadata: _metadata }, _memoryUsage_initializers, _memoryUsage_extraInitializers);
            __esDecorate(null, null, _activeJobs_decorators, { kind: "field", name: "activeJobs", static: false, private: false, access: { has: function (obj) { return "activeJobs" in obj; }, get: function (obj) { return obj.activeJobs; }, set: function (obj, value) { obj.activeJobs = value; } }, metadata: _metadata }, _activeJobs_initializers, _activeJobs_extraInitializers);
            __esDecorate(null, null, _queuedJobs_decorators, { kind: "field", name: "queuedJobs", static: false, private: false, access: { has: function (obj) { return "queuedJobs" in obj; }, get: function (obj) { return obj.queuedJobs; }, set: function (obj, value) { obj.queuedJobs = value; } }, metadata: _metadata }, _queuedJobs_initializers, _queuedJobs_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.HeartbeatDto = HeartbeatDto;
