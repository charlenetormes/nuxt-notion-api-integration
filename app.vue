<template>
    <div>
        <h1>Notion Integration</h1>
        <a :href="authorizationUrl">
            <button type="button" v-if="!authConnected">Connect to Notion</button>
        </a>
        <h3>Temp Authorization Code: {{ authorization_code ?? 'N/A' }}</h3>
        <p v-if="isError" style="color: red">
            Authorization Code not valid anymore. Refresh the page and remove the code from the query params.
        </p>
        <h3>Access Token: {{ res?.details?.access_token ?? 'N/A' }}</h3>
        <br />
        <h2>/GET USERS</h2>
        <div v-for="(item, index) in users?.list?.results" :key="index">
            <p>Object: {{ item?.object }}</p>
            <p>Name: {{ item?.name }}</p>
            <p>Display Photo: {{ item?.avatar_url ?? 'N/A' }}</p>
            <br />
        </div>
        <p v-if="!users?.list?.results">Nothing to show</p>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const route = useRoute()
const config = useRuntimeConfig()

// you can get this url from the notion integration for authorization
// you need the client id, redirect_uri which can be set in the integration settings
const authorizationUrl = `https://api.notion.com/v1/oauth/authorize?client_id=${
    config.CLIENT_ID
}&response_type=code&owner=user&redirect_uri=${encodeURI(config.REDIRECT_URI)}`

const authorization_code = ref(null)
const authConnected = ref(false)
const isError = ref(false)
const res = reactive({})
const users = reactive({})

/**
 * after giving access to our integration, the notion api redirects back to this page 'http://localhost:3000/ and
 * appends the code parameter in the url like this 'http://localhost:3000/?code=0394539c-68d2-444b-add7-54bc9b453f37&state='
 * this is the part where we check for that code query parameter and then call our api/authorize-notion endpoint
 * to get the access token necessary for querying the notion api
 */
if (route.query.code) {
    authorization_code.value = route.query.code
    const { data: results } = await useFetch(`/api/authorize-notion?code=${route.query.code}`)
    res.details = results

    if (!res?.details) {
        isError.value = true
    }

    authConnected.value = true

    // use the access_token to query from Notion's API
    if (res?.details?.access_token) {
        const { data: list } = await useFetch(`/api/users`, {
            method: 'POST',
            body: {
                access_token: res?.details?.access_token,
            },
        })

        users.list = list
    }
}
</script>
