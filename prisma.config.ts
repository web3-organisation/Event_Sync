import { defineConfig } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: 'postgresql://events_manager:123456@localhost:5432/eventa_synck_bd',
    },
});
