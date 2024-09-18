export default class Users{
    async getEmailBySessionId(user, sql) {
        const email = await sql`select email from loginsessions where id = ${user.id}`;
        if(email.length) {
            return email[0].email;
        } else{
            return "logout"
        }
    }
    async getIdBySessionId(query, sql) {
        const email = await this.getEmailBySessionId(query, sql);
        const result = await sql`select id from users where email = ${email}`;
        return result[0].id;
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
    async sendPNTS(query, sql) {
        await sql`insert into donatedpnts (name, id, serie, subject, pnts) values (${query.name}, ${query.id}, ${query.serie}, ${query.subject}, ${query.pnts})
        on conflict (id, subject) do update
        set pnts = donatedpnts.pnts + EXCLUDED.pnts`;
        await sql`update pntstable set pnts = pntstable.pnts - ${query.pnts} where id = ${query.id}`;
    }
}