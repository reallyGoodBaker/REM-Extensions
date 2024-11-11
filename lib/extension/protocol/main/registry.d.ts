import { LookupConfig, Provider, ProviderDescritpor } from '../common/provider';
export declare function lookup(conf: LookupConfig): ProviderDescritpor[];
export declare function registerInMain(pipeName: string, provider: Provider, conf?: LookupConfig): void;
export declare function register(desc: ProviderDescritpor): void;
export declare function setupRegistry(): void;
