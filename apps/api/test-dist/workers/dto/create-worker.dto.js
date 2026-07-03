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
exports.CreateWorkerDto = void 0;
var class_validator_1 = require("class-validator");
var CreateWorkerDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _hostname_decorators;
    var _hostname_initializers = [];
    var _hostname_extraInitializers = [];
    var _processId_decorators;
    var _processId_initializers = [];
    var _processId_extraInitializers = [];
    var _version_decorators;
    var _version_initializers = [];
    var _version_extraInitializers = [];
    var _tags_decorators;
    var _tags_initializers = [];
    var _tags_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateWorkerDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.hostname = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _hostname_initializers, void 0));
                this.processId = (__runInitializers(this, _hostname_extraInitializers), __runInitializers(this, _processId_initializers, void 0));
                this.version = (__runInitializers(this, _processId_extraInitializers), __runInitializers(this, _version_initializers, void 0));
                this.tags = (__runInitializers(this, _version_extraInitializers), __runInitializers(this, _tags_initializers, void 0));
                __runInitializers(this, _tags_extraInitializers);
            }
            return CreateWorkerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(100)];
            _hostname_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.MinLength)(2), (0, class_validator_1.MaxLength)(255)];
            _processId_decorators = [(0, class_validator_1.IsInt)(), (0, class_validator_1.Min)(1)];
            _version_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _tags_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsJSON)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _hostname_decorators, { kind: "field", name: "hostname", static: false, private: false, access: { has: function (obj) { return "hostname" in obj; }, get: function (obj) { return obj.hostname; }, set: function (obj, value) { obj.hostname = value; } }, metadata: _metadata }, _hostname_initializers, _hostname_extraInitializers);
            __esDecorate(null, null, _processId_decorators, { kind: "field", name: "processId", static: false, private: false, access: { has: function (obj) { return "processId" in obj; }, get: function (obj) { return obj.processId; }, set: function (obj, value) { obj.processId = value; } }, metadata: _metadata }, _processId_initializers, _processId_extraInitializers);
            __esDecorate(null, null, _version_decorators, { kind: "field", name: "version", static: false, private: false, access: { has: function (obj) { return "version" in obj; }, get: function (obj) { return obj.version; }, set: function (obj, value) { obj.version = value; } }, metadata: _metadata }, _version_initializers, _version_extraInitializers);
            __esDecorate(null, null, _tags_decorators, { kind: "field", name: "tags", static: false, private: false, access: { has: function (obj) { return "tags" in obj; }, get: function (obj) { return obj.tags; }, set: function (obj, value) { obj.tags = value; } }, metadata: _metadata }, _tags_initializers, _tags_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateWorkerDto = CreateWorkerDto;
