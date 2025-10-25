import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ redirect }) => {
    const { DISCORD_CLIENT_ID, DISCORD_REDIRECT_URI } = import.meta.env;

    const params = new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        redirect_uri: DISCORD_REDIRECT_URI,
        response_type: 'code',
        scope: 'identify',
    });

    const url = `https://discord.com/api/oauth2/authorize?${params.toString()}`;

    return redirect(url);
};
