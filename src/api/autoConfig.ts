import { CreateACFetch } from './fetch';

const http = CreateACFetch();
export function getBlocksPermissions() {
    return http.get('/api_config/blocks_permissions', {});
}
