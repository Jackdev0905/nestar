import { registerEnumType } from '@nestjs/graphql';
export enum Message{
     SOMETHING_WENT_WRONG = "Something went wrong!",
    NO_DATA_FOUND = "No data found!",
    CREATE_FAILED = "Create is failed",
    REMOVE_FAILED = "Remove is failed",
    TOKEN_NOT_EXIST = "Bearer token is not provided",
    UPDATE_FAILED = "Update is failed",
    UPLOAD_FAILED = "Upload is failed",
    BLOCKED_USER = "You have been blocked, please contact us",
    NO_MEMBER_NICK = "No member with that member nick!",
    WRONG_PASSWORD = "Wrong passsword, please try again!",
    NOT_AUTHENTICATED = "You are not authenicated, please login first!",
    BAD_REQUEST = "Bad Request",
    ONLY_SPECIFIC_ROLES_ALLOWED="Allowed only member with specific roles",
    NOT_ALLOWED_REQUEST="Not allowed request",
    PROVIDE_ALLOWED_FORMAT="Please insert jpg, png and jpeg",
    SELF_SUBSCRIPTION_DENIED="Self subscription is denied",
    USED_MEMEBERNICK_OR_PHONE = "Already used member nick or phone"
}

export enum Direction{
    ASC = 1,
    DESC = -1
}

registerEnumType(Direction, {name:"Direction"})