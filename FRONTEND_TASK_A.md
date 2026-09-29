# Frontend Task A — Real Login API

## What did I fix?

I updated the email login flow in `web/app/login/page.tsx`.

Before the change, the page called the login helper but did not save the token. It also redirected to a misspelled route, `/dashbaord`, and only showed a browser alert when something went wrong.

Now the login form sends a real request to:

```text
POST /user/login
```

with:

```json
{
  "email": "user email",
  "password": "user password"
}
```

## What happens after successful login?

The backend response contains a `token` field. The frontend checks that the token exists, saves it in localStorage using the key `apax.auth.token`, and updates the Zustand store.

After that, the user is sent to:

```text
/dashboard
```

## How is loading handled?

When the form is submitted, the Sign In button shows its existing loading spinner. The button, email input, password input, and password visibility button are disabled until the request finishes. This prevents duplicate login requests.

## How are errors handled?

If the backend returns `401`, the page shows:

```text
The email or password you entered is incorrect.
```

For network errors, backend errors, invalid JSON, or an unexpected response shape, the page shows a safe general error message instead of exposing backend details.

## How does logout and route handling work?

I connected the existing Sign Out icon in the sidebar. It clears the saved token from localStorage and Zustand, then sends the user to `/login`.

If a logged-in user opens `/` or `/login`, they are redirected back to `/dashboard`. If a logged-out user opens `/dashboard`, they are redirected to `/login`.

## What limitation did I find?

The supplied backend cannot complete a real login locally because MongoDB is not connected. Mongoose times out before it can check the email and password.

I also found that the backend response shape is:

```json
{
  "success": true,
  "user": {},
  "token": "jwt token"
}
```

The backend also sets a cookie, while the frontend stores the returned JWT in localStorage. A future backend update should make both sides use the same authentication strategy for protected API requests.
