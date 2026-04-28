import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signup(signupDto: SignupDto): Promise<{
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
        };
    }>;
    login(loginDto: LoginDto, req: Request): Promise<{
        token: string;
        user: {
            id: any;
            email: any;
            name: any;
        };
    }>;
    getMe(user: any): Promise<{
        id: string;
        email: string;
        name: string;
        avatarurl: string | null;
        ispremium: boolean;
    }>;
    googleAuth(redirectUri: string): Promise<void>;
    googleAuthCallback(req: Request, res: Response): Promise<void>;
}
