import { get_user, Identity, User } from "~/utils/db.server";

class UserClass {

    private _user: User | null = null;
    private _code: string | null = null;

    public set user(code: string) {
        this._code = code;
    }

    public get_user(): Promise<User> {
        return new Promise((resolve, reject) => {

            // TODO: Verify users account session
            if (this._user && this._user.code === this._code) return resolve(this._user);

            if (!this._code) return reject("No user code provided");
            return get_user(this._code);

        });
    }

}

const Instance = new UserClass();
export { Instance as User }