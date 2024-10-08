import bcrypt from 'bcrypt';

export default class Users {
    constructor(sql) {
        this.sql = sql;
    }
    
    async createUser(user) {
        const securePassword = await bcrypt.hash(user.password, 10);
        user.id = crypto.randomUUID();
        await this.sql`insert into users (id, name, email, password, serie) values(${user.id}, ${user.name}, ${user.email}, ${securePassword}, ${user.serie})`;

        if (user.type === 'contribuidores') {
            await this.sql`insert into specialaccounts (email, id, type) values (${user.email}, ${user.id}, ${user.type})`;
        }

        return { result: 'sucessfuly' };
    }
    async getBookProgress() {
        return await this.sql`select * from bookprogress`;
    }
    async getNameByEmail(email) {
        const name = await this.sql`select name from users where email = ${email}`;
        return name.length ? name[0].name : undefined;
    }
    async getEmailBySessionId(userId) {
        const email = await this.sql`select email from loginsessions where id = ${userId}`;
        return email.length ? email[0].email : "logout";
    }
    async isValidSessionId(sessionId) {
        const validUser = await this.sql`select * from loginsessions where id = ${sessionId}`;
        return !validUser.length;
    }
    async getIdBySessionId(sessionId) {
        const email = await this.getEmailBySessionId(sessionId);
        const result = await this.sql`select id from users where email = ${email}`;
        if(result[0].id) {
            return result[0].id;
        } else{
            return email;
        }
    }
    async isContribuitor(userId) {
        const realId = await this.getIdBySessionId(userId);
        const result = await this.sql`select * from specialaccounts where id = ${realId}`;
        return result.length > 0;
    }
    async getNameByEmail(email) {
        const name = await this.sql`select name from users where email = ${email}`;
        return name.length ? name[0].name : undefined;
    }
    async sendPNTS(query) {
        await this.sql`insert into donatedpnts (name, id, serie, subject, pnts) values (${query.name}, ${query.id}, ${query.serie}, ${query.subject}, ${query.pnts})
            on conflict (id, subject) do update
            set pnts = donatedpnts.pnts + EXCLUDED.pnts`;
        await this.sql`update pntstable set pnts = pntstable.pnts - ${query.pnts} where id = ${query.id}`;
    }
}