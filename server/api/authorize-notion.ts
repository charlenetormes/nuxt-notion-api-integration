let result = null
export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    if (!query.code) {
        return null
    }

    /**
     * should be the same redirect uri when we were getting the authorization code
     * you can also store this in your .env files for seamless transition from prod/dev
     * store the ff: variables to your .env file
     * - redirect_uri
     * - client_secret
     * - client_id
     */
    const redirect_uri = 'http://localhost:3000'
    const client_secret = 'secret_WDMoFs38RMqd3p1YcvGZppX1FUXGGNnWoP8rEyEQ62P'
    const client_id = '2eb07026-b80c-4096-8b91-23fa33d21fdb'

    //base64 encoded client id and client secret
    const base64EncodedAuthentication = btoa(`${client_id}:${client_secret}`)

    result = await $fetch(`https://api.notion.com/v1/oauth/token`, {
        method: 'POST',
        body: {
            grant_type: 'authorization_code', //always use 'authorization_code'
            code: query.code,
            redirect_uri: redirect_uri,
        },
        //Uses HTTP Basic Authentication (base 64 encoded)
        headers: {
            Authorization: `Basic ${base64EncodedAuthentication}`,
            'Content-Type': 'application/json',
        },
    })

    return result
})
