import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2),
    role: z.enum(['STUDENT', 'EDUCATOR']).default('STUDENT'),
});

export class RegisterDto extends createZodDto(RegisterSchema) { }
