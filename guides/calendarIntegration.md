# Integrating Calendar Feature

Below is a structured guide with code examples and recommended libraries to help you get started.

## Libraries and Tools

- NextAuth.js for user authentication (using Google as a provider)

- googleapis for interacting with the Google Calendar API on the server side

- Next.js API routes to securely handle requests from your client components

Using these libraries allows you to leverage secure OAuth authentication and server-side API calls while keeping your client code clean and minimal.2

## Setting Up Authentication with NextAuth

First, install the NextAuth package:

```bash
npm install next-auth
```

Create an API route for NextAuth in your project. For example, in pages/api/auth/[...nextauth].ts:

```ts
// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Save Google access token to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Make the access token available in the session
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
```

Ensure that you set up the corresponding environment variables in a .env file. This configuration allows you to securely obtain an OAuth access token from Google, which you will later use to make calendar API requests.2

## Creating Server-Side API Endpoints for Calendar Integration

Since the official googleapis package is intended for server-side usage, you can create an API route that interacts with the Google Calendar API. First, install the package:

```bash
npm install googleapis
```

Then create an endpoint such as pages/api/calendar.ts:

```ts
// pages/api/calendar.ts
import { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Retrieve the access token from request headers or session (implemented as needed)
    const { accessToken } = req.headers as { accessToken: string };

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    // Configure OAuth2 client with the retrieved access token
    const oAuth2Client = new google.auth.OAuth2();
    oAuth2Client.setCredentials({ access_token: accessToken });

    const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

    // Example: fetch the primary calendar events
    const calendarRes = await calendar.events.list({
      calendarId: "primary",
      maxResults: 10,
      orderBy: "startTime",
      singleEvents: true,
    });

    return res.status(200).json({ events: calendarRes.data.items });
  } catch (error) {
    console.error("Calendar API error:", error);
    return res.status(500).json({ error: "Error retrieving calendar events" });
  }
}
```

In this endpoint, you create an OAuth2 client with the user’s access token, then instantiate the calendar client and fetch events from the primary calendar. You can extend this endpoint to handle event creation or deletion as needed.1

## Client-Side Integration and Data Retrieval

On the client side, call your API endpoint to retrieve calendar events. For example, in a component within your to-do app:

```tsx
// pages/index.tsx
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime: string };
  end: { dateTime: string };
}
export default function Home() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    async function fetchEvents() {
      if (session?.accessToken) {
        const res = await fetch("/api/calendar", {
          headers: { accessToken: session.accessToken as string },
        });
        const data = await res.json();
        setEvents(data.events || []);
      }
    }
    fetchEvents();
  }, [session]);
  if (!session) {
    return (
      <div>
        <p>You need to be signed in to view your calendar events.</p>
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      </div>
    );
  }
  return (
    <div>
      <h2>Your Calendar Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            {event.summary} — {new Date(event.start.dateTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

This code uses the NextAuth hook to obtain the session and then requests calendar data from your API endpoint. The events are then rendered in a list on the page, which can be integrated into your to-do app’s dashboard.2

## Extending Functionality

Additional features you might consider:

1. Event Creation: Set up another API route that receives event details from the client and uses the google.calendar().events.insert() method to add events to the user’s calendar.

2. Error Handling: Enhance error handling on both the client and server to manage token expiration, network issues, or permission errors.

3. UI Integration: Integrate calendar components into your to-do app interface seamlessly, possibly using pre-built UI libraries for calendars if needed.

This approach balances client simplicity with secure server-side operations, letting you extend your to-do app to include robust calendar features. The provided code examples and instructions offer a starting point for connecting users’ calendars to your app.

In summary, by combining NextAuth for authentication and the googleapis package for managing API calls, you can efficiently integrate calendar management features into your to-do app built with Next.js and TypeScript.
