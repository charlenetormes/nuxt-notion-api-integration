import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    typescript: {
        shim: false,
    },
    runtimeConfig: {
        //the private keys which are only available on the server-side
        CLIENT_ID: process.env.CLIENT_ID,
        CLIENT_SECRET: process.env.CLIENT_SECRET,
        REDIRECT_URI: process.env.REDIRECT_URI,
        // Keys within public, will be also exposed to the client-side
        public: {
            CLIENT_ID: process.env.CLIENT_ID,
            REDIRECT_URI: process.env.REDIRECT_URI,
        },
    },
})
