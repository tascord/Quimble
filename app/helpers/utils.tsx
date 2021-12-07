import { User } from "~/utils/db.server";

export function to_forum_case(name: string) {
    return name
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function get_name(user: User) {
    return user.identities[0].name ?? user.code;
}