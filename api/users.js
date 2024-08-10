export default class Users{
    async getEmailBySessionId(user, sql) {
        const email = await sql`select email from loginsessions where id = ${user.id}`;
        return email[0].email;
    }
    async isContribuitor(user, sql) {
        const query = await sql`select from specialaccounts where email = ${user.email}`;
        if(query.length > 0) {
            return true;
        }
        return false;
    }
}