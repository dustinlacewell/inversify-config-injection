"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultEagerBinderModule = exports.EagerBinder = exports.TypeHint = void 0;
const inversify_1 = require("inversify");
const config = require("config");
var TypeHint;
(function (TypeHint) {
    TypeHint[TypeHint["String"] = 0] = "String";
    TypeHint[TypeHint["Number"] = 1] = "Number";
})(TypeHint || (exports.TypeHint = TypeHint = {}));
class EagerBinder {
    settings;
    all;
    logs;
    constructor(settings) {
        this.settings = settings;
        if (!this.settings)
            this.settings = {};
        if (!this.settings.root)
            this.settings.root = "";
        if (!this.settings.prefix)
            this.settings.prefix = "";
        if (!this.settings.typeHints)
            this.settings.typeHints = {};
        if (!this.settings.log)
            this.settings.log = false;
        if (!this.settings.objects)
            this.settings.objects = false;
        if (this.settings.root === "") {
            this.all = config;
        }
        else if (config.has(this.settings.root)) {
            this.all = config.get(this.settings.root);
        }
        else {
            throw new Error(`Could not find configuration root '${this.settings.root}'!`);
        }
        if (this.settings.schema) {
            this.settings.schema.parse(this.all);
        }
        this.logs = [];
    }
    bindString(bind, val, path) {
        if (this.settings.log)
            this.logs.push(`Binding '${path}' to string '${val}'`);
        bind(path).toConstantValue(val);
    }
    bindNumber(bind, val, path) {
        if (this.settings.log)
            this.logs.push(`Binding '${path}' to number '${val}'`);
        bind(path).toConstantValue(val);
    }
    bindBoolean(bind, val, path) {
        if (this.settings.log)
            this.logs.push(`Binding '${path}' to boolean '${val}'`);
        bind(path).toConstantValue(val);
    }
    bindArray(bind, val, path) {
        if (this.settings.typeHints[path] === TypeHint.String) {
            if (this.settings.log)
                this.logs.push(`Binding '${path}' to string[] '${val}'`);
            bind(path).toConstantValue(val);
        }
        else if (this.settings.typeHints[path] === TypeHint.Number) {
            if (this.settings.log)
                this.logs.push(`Binding '${path}' to number[] '${val}'`);
            bind(path).toConstantValue(val);
        }
        else {
            if (this.settings.log)
                this.logs.push(`Binding '${path}' to any[] '${val}'`);
            bind(path).toConstantValue(val);
        }
    }
    bindUnknown(bind, val, path) {
        if (typeof val === 'string') {
            this.bindString(bind, val, path);
        }
        else if (typeof val === 'number') {
            this.bindNumber(bind, val, path);
        }
        else if (typeof val === 'boolean') {
            this.bindBoolean(bind, val, path);
        }
        else if (val instanceof Array) {
            this.bindArray(bind, val, path);
        }
        else if (typeof val === 'object') {
            this.bindAllInObject(bind, val, path);
        }
    }
    bindAllInObject(bind, obj, path) {
        if (this.settings.objects) {
            if (this.settings.log) {
                this.logs.push(`Binding '${path}' to Object '${obj}'`);
            }
            bind(path).toConstantValue(obj);
        }
        if (path && path.length > 0) {
            path = path + ".";
        }
        for (const k in obj) {
            if (obj.hasOwnProperty(k)) {
                this.bindUnknown(bind, obj[k], path + k);
            }
        }
    }
    getModuleFunction() {
        return (options) => {
            const { bind } = options;
            this.bindAllInObject(bind, this.all, this.settings.prefix);
        };
    }
    getModule() {
        return new inversify_1.ContainerModule(this.getModuleFunction());
    }
    getBindingLog() {
        return this.logs;
    }
}
exports.EagerBinder = EagerBinder;
exports.defaultEagerBinderModule = new EagerBinder({}).getModule();
exports.default = exports.defaultEagerBinderModule;
