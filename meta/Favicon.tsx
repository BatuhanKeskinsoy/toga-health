import React from 'react'

/* https://realfavicongenerator.net/ */

export default async function MetaFavicon() {
    return (
        <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/theme/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/theme/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/theme/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/theme/favicon/site.webmanifest" />
        <link rel="mask-icon" href="/theme/favicon/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        <meta name="theme-color" content="#ffffff" />
        </head>
    )
}