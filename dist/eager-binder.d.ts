import { ContainerModule, interfaces } from 'inversify';
export declare enum TypeHint {
    String = 0,
    Number = 1
}
export interface TypeHints {
    [key: string]: TypeHint;
}
export interface EagerBinderSettings {
    root?: string;
    prefix?: string;
    log?: boolean;
    typeHints?: TypeHints;
    objects?: boolean;
}
export declare class EagerBinder {
    private settings;
    private all;
    private logs;
    constructor(settings: EagerBinderSettings);
    private bindString;
    private bindNumber;
    private bindBoolean;
    private bindArray;
    private bindUnknown;
    private bindAllInObject;
    getModuleFunction(): (bind: interfaces.Bind, unbind: interfaces.Unbind) => void;
    getModule(): ContainerModule;
    getBindingLog(): string[];
}
export declare const defaultEagerBinderModule: ContainerModule;
export default defaultEagerBinderModule;
