
import { IsNotEmpty } from "class-validator";

export class RegisterDto {

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

}