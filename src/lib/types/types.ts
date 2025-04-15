import type { ServiceDescription } from '@/api-client';

export function hasServices<T extends object>(
    service: T
): service is T & { services: ServiceDescription[] } {
    return (
        service.hasOwnProperty('services') &&
        Array.isArray((service as any).services)
    );
}
