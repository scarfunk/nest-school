import { getRepositoryToken } from '@nestjs/typeorm';

export async function truncateDB(module, entity: any, schemaName: string) {
  const repo = module.get(getRepositoryToken(entity));
  // 테스트 결정성을 위해 디비 전체 삭제.
  const GET_TRUNCATE_ALL_TABLE_QUERY = `
      SELECT Concat('TRUNCATE TABLE ', TABLE_NAME, ';') as str
        FROM INFORMATION_SCHEMA.TABLES
        WHERE table_schema = '${schemaName}'
        AND table_type = 'BASE TABLE';`;
  const queries = await repo.query(GET_TRUNCATE_ALL_TABLE_QUERY);
  for (const query of queries) {
    await repo.query(query.str);
  }
}
