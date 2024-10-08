import bcrypt from 'bcrypt';
import crypto from 'crypto';

class AuthService {
    constructor(sql) {
        this.sql = sql;
    }

    async getUserByEmail(email) {
        return await this.sql`SELECT * FROM users WHERE email = ${email}`;
    }

    async createLoginSession(email, id, name, expireDate) {
        await this.sql`insert into loginsessions (email, id, name, expiredate) values(${email}, ${id}, ${name}, ${expireDate})`;
    }

    async comparePasswords(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default AuthService;