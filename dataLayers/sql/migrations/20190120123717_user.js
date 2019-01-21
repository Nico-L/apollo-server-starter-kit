const UserSchema = {
    up: (knex, Promise) => {
        return Promise.all([
            knex.schema.createTable('user', table => {
                table.increments();
                table.timestamps(true, true);
                table.string('email').notNullable();
                table.string('username').notNullable();
                table.string('password').notNullable();
                table.json('roles').defaultTo(JSON.stringify(['USER']));
                table.boolean('connected').defaultTo(false);
            })
        ]);
    },
    down: (knex, Promise) => {
        return Promise.all([
            knex.schema.dropTable('user')
        ]);
    }
}

module.exports = UserSchema;
