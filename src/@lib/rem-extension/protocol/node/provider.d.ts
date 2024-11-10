import { LookupConfig, ProviderDescritpor } from '../main/registry';
import { Provider } from '../common/provider';
export declare function lookup(conf: LookupConfig): Promise<unknown>;
export declare function registerProvider(conf: ProviderDescritpor, provider: Provider): Promise<void>;
