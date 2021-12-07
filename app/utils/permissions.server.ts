import { User } from "./db.server";
import { User as PrismaUser } from ".prisma/client";

const Roles = [
    'staff',
    'student',
    'moderator'
] as const;

const Actions = [
    'VIEW_ALL_STUDENTS',
    'CREATE_NOTIFICATION',
    'CREATE_RESOURCE',
    'CREATE_ROOM',
    'STICKY_ROOM',
] as const;

export type Role = typeof Roles[number];
export type Action = typeof Actions[number];

const Permissions = new Map<Action, Role[]>();
export function hasPermissions(user_role: User | PrismaUser | Role, action: Action) {
    return Permissions.get(action)?.includes((typeof user_role === 'string') ? user_role : user_role.role as Role) ?? false;
}

// Assign all permissions here
Permissions.set('VIEW_ALL_STUDENTS', ['moderator']);
Permissions.set('CREATE_NOTIFICATION', ['staff', 'moderator']);
Permissions.set('CREATE_RESOURCE', ['moderator']);
Permissions.set('CREATE_ROOM', ['staff', 'moderator']);
Permissions.set('STICKY_ROOM', ['staff', 'moderator']);
