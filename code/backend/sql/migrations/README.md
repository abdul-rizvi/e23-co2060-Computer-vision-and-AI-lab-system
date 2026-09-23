# Project showcase migration

Existing databases need `001_project_team_members.sql` before the updated project create/edit API is deployed. It only adds the optional team-members column and is safe to run again.

Apply it using your database SQL console or PostgreSQL client. This task has not applied the migration or contacted the live database.

Do not run `runSchema.js` against an existing database to apply this change: `schema.sql` drops and recreates tables. The updated schema is for fresh installations only.

Local checks (from `code/backend`): `node --test tests/features.test.js`. Tests mock database and email dependencies; they do not validate SQL against PostgreSQL.
