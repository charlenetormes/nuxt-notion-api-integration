let result = null
export default defineEventHandler(async (event) => {
    /**
     *
     * querying the GET /users api from notion api using the access_token we got from the
     * /oauth/token endpoint
     *
     */
    const body = await readBody(event)

    result = await $fetch(`https://api.notion.com/v1/users`, {
        method: 'GET',
        //Uses HTTP Basic Authentication (base 64 encoded)
        headers: {
            Authorization: `Bearer ${body.access_token}`,
            'Notion-Version': `2022-06-28`,
            'Content-Type': 'application/json',
        },
    })

    return result
})
