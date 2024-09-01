export default class Users{
    async getEmailBySessionId(user, sql) {
        const email = await sql`select email from loginsessions where id = ${user.id}`;
        if(email.length) {
            return email[0].email;
        } else{
            return undefined;
        }
    }
    async isContribuitor(user, sql) {
        const query = await sql`select from specialaccounts where email = ${user.email}`;
        if(query.length > 0) {
            return true;
        }
        return false;
    }
    async getNameByEmail(email, sql) {
        const name = await sql`select name from users where email = ${email}`;
        if(name.length) {
            return name[0].name;
        } else{
            return undefined;
        }
    }
}