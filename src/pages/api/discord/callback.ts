import type { APIRoute } from 'astro';
import * as osu from 'osu-api-v2-js';
import db from '../../../lib/mongodb';
import type { User } from '../../../types/user';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
    const code = new URL(request.url).searchParams.get('code');
    if (!code) {
        return new Response('No code provided', { status: 400 });
    }

    const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, DISCORD_REDIRECT_URI } = import.meta.env;

    const body = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        redirect_uri: DISCORD_REDIRECT_URI,
        grant_type: 'authorization_code',
        code,
    });

    try {
        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error fetching Discord token:', error);
            return new Response('Error fetching Discord token', { status: 500 });
        }

        const { access_token } = await response.json();

        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        if (!userResponse.ok) {
            const error = await userResponse.json();
            console.error('Error fetching Discord user:', error);
            return new Response('Error fetching Discord user', { status: 500 });
        }

        const discordUser = await userResponse.json();

        const { DISCORD_BOT_TOKEN, DISCORD_SERVER_ID } = import.meta.env;

        const joinResponse = await fetch(`https://discord.com/api/guilds/${DISCORD_SERVER_ID}/members/${discordUser.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
            },
            body: JSON.stringify({ access_token }),
        });

        if (!joinResponse.ok) {
            try {
                const error = await joinResponse.json();
                console.error('Error joining Discord server:', error);
            } catch {
                console.error('Error joining Discord server:', joinResponse.statusText);
            }
        }

        const token_string = cookies.get('osuturkiye-token')?.value;
        if (!token_string) {
            return redirect('/login');
        }

        const token = JSON.parse(token_string);
        const osu_api = new osu.API(token);
        const osuUser = await osu_api.getResourceOwner();

        const users = db.collection<User>('users');
        await users.updateOne(
            { _id: osuUser.id.toString() },
            {
                $set: {
                    discord_id: discordUser.id,
                    discord_username: discordUser.username,
                    updatedAt: new Date(),
                },
            }
        );

        return redirect('/profile');
    } catch (error) {
        console.error('Error during Discord callback:', error);
        return new Response('An error occurred', { status: 500 });
    }
};
