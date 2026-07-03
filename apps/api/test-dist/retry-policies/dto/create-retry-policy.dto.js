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
exports.CreateRetryPolicyDto = void 0;
var class_validator_1 = require("class-validator");
var client_1 = require("@prisma/client");
var CreateRetryPolicyDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _strategy_decorators;
    var _strategy_initializers = [];
    var _strategy_extraInitializers = [];
    var _maxAttempts_decorators;
    var _maxAttempts_initializers = [];
    var _maxAttempts_extraInitializers = [];
    var _baseDelayMs_decorators;
    var _baseDelayMs_initializers = [];
    var _baseDelayMs_extraInitializers = [];
    var _maxDelayMs_decorators;
    var _maxDelayMs_initializers = [];
    var _maxDelayMs_extraInitializers = [];
    var _jitter_decorators;
    var _jitter_initializers = [];
    var _jitter_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateRetryPolicyDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.strategy = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _strategy_initializers, void 0));
                this.maxAttempts = (__runInitializers(this, _strategy_extraInitializers), __runInitializers(this, _maxAttempts_initializers, void 0));
                this.baseDelayMs = (__runInitializers(this, _maxAttempts_extraInitializers), __runInitializers(this, _baseDelayMs_initializers, void 0));
                this.maxDelayMs = (__runInitializers(this, _baseDelayMs_extraInitializers), __runInitializers(this, _maxDelayMs_initializers, void 0));
                this.jitter = (__runInitializers(this, _maxDelayMs_extraInitializers), __runInitializers(this, _jitter_initializers, false));
                __runInitializers(this, _jitter_extraInitializers);
            }
            return CreateRetryPolicyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(3), (0, class_validator_1.MaxLength)(100)];
            _strategy_decorators = [(0, class_validator_1.IsEnum)(client_1.RetryStrategy)];
            _maxAttempts_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(100)];
            _baseDelayMs_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _maxDelayMs_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(0)];
            _jitter_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _strategy_decorators, { kind: "field", name: "strategy", static: false, private: false, access: { has: function (obj) { return "strategy" in obj; }, get: function (obj) { return obj.strategy; }, set: function (obj, value) { obj.strategy = value; } }, metadata: _metadata }, _strategy_initializers, _strategy_extraInitializers);
            __esDecorate(null, null, _maxAttempts_decorators, { kind: "field", name: "maxAttempts", static: false, private: false, access: { has: function (obj) { return "maxAttempts" in obj; }, get: function (obj) { return obj.maxAttempts; }, set: function (obj, value) { obj.maxAttempts = value; } }, metadata: _metadata }, _maxAttempts_initializers, _maxAttempts_extraInitializers);
            __esDecorate(null, null, _baseDelayMs_decorators, { kind: "field", name: "baseDelayMs", static: false, private: false, access: { has: function (obj) { return "baseDelayMs" in obj; }, get: function (obj) { return obj.baseDelayMs; }, set: function (obj, value) { obj.baseDelayMs = value; } }, metadata: _metadata }, _baseDelayMs_initializers, _baseDelayMs_extraInitializers);
            __esDecorate(null, null, _maxDelayMs_decorators, { kind: "field", name: "maxDelayMs", static: false, private: false, access: { has: function (obj) { return "maxDelayMs" in obj; }, get: function (obj) { return obj.maxDelayMs; }, set: function (obj, value) { obj.maxDelayMs = value; } }, metadata: _metadata }, _maxDelayMs_initializers, _maxDelayMs_extraInitializers);
            __esDecorate(null, null, _jitter_decorators, { kind: "field", name: "jitter", static: false, private: false, access: { has: function (obj) { return "jitter" in obj; }, get: function (obj) { return obj.jitter; }, set: function (obj, value) { obj.jitter = value; } }, metadata: _metadata }, _jitter_initializers, _jitter_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateRetryPolicyDto = CreateRetryPolicyDto;
