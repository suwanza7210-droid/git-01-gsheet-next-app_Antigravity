import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
    /**
     * The shape of the user object returned in the OAuth providers' `profile` callback,
     * or the `user` object returned in the `authorize` callback.
     */
    interface User {
        use_sheet?: string;
        image?: string;
        address?: string;
        role?: string;
    }

    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            id: string;
            use_sheet: string;
            image?: string;
            address?: string;
            role?: string;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
    interface JWT {
        id?: string;
        use_sheet?: string;
        picture?: string;
        address?: string;
        role?: string;
    }
}
