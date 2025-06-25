import { ContainerModule, ContainerModuleLoadOptions } from 'inversify';
import { z } from 'zod';
export type Bind = ContainerModuleLoadOptions["bind"];
export type Unbind = ContainerModuleLoadOptions["unbind"];
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
    schema?: z.ZodObject<any>;
}
export declare class EagerBinder {
    private all;
    private logs;
    private settings;
    constructor(settings: EagerBinderSettings);
    private bindString;
    private bindNumber;
    private bindBoolean;
    private bindArray;
    private bindUnknown;
    private bindAllInObject;
    getModuleFunction(): (options: ContainerModuleLoadOptions) => void;
    getModule(): ContainerModule;
    getBindingLog(): string[];
}
export declare const defaultEagerBinderModule: ContainerModule;
export default defaultEagerBinderModule;
