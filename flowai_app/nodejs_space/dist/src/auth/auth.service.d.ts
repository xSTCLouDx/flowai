import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    validateUser(email: string, password: string): Promise<{
        id: string;
        email: string;
        password: string | null;
        name: string;
        avatarurl: string | null;
        ispremium: boolean;
        googleid: string | null;
        createdat: Date;
        updatedat: Date;
    } | null>;
    login(user: any): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            name: any;
        };
    }>;
    validateGoogleUser(profile: {
        googleId: string;
        email: string;
        name: string;
        avatarUrl?: string;
    }): Promise<{
        id: string;
        email: string;
        password: string | null;
        name: string;
        avatarurl: string | null;
        ispremium: boolean;
        googleid: string | null;
        createdat: Date;
        updatedat: Date;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        avatarurl: string | null;
        ispremium: boolean;
    }>;
    private generateToken;
}
