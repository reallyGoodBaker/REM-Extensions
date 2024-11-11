import { LookupConfig, ProviderDescritpor } from '../common/provider';
import { Provider } from '../common/provider';
export declare function lookup(conf: LookupConfig): Promise<unknown>;
export declare function registerProvider(conf: ProviderDescritpor, provider: Provider): Promise<void>;
export declare function unregisterProvider(pipeName: string): void;
