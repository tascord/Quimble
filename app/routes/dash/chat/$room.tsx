import { LoaderFunction, redirect } from "@remix-run/server-runtime";

export const loader: LoaderFunction = ({ params }) => {
    return redirect(`/dash/chat/${params.room}/0`);
}