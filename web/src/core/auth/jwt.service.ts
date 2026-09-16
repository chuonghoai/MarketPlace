import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub?: string;
    role?: string;
    exp?: number;
}

class JwtService {
    decode(token: string): JwtPayload {
        return jwtDecode<JwtPayload>(token);
    }

    isTokenExpired(token: string): boolean {
        try {
            const decoded = this.decode(token);

            if (!decoded.exp) {
                return true;
            }

            const currentTime = Date.now() / 1000;
            return decoded.exp < currentTime;
        } catch {
            return true;
        }
    }

    getRole(token: string): string | null {
        try {
            const decoded = this.decode(token);

            return decoded.role || null;
        } catch {
            return null;
        }
    }
}

export const jwtService = new JwtService();