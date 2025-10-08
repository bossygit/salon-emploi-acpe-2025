import Head from 'next/head'
import RegistrationPlatform from '../emploi-plateforme'

export default function Home() {
    return (
        <>
            <Head>
                <title>Inscription - Salon National de l&apos;Emploi Jeune 2025</title>
                <meta name="description" content="Inscrivez-vous au Salon National de l&apos;Emploi Jeune 2025 - République du Congo" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <RegistrationPlatform />
        </>
    )
}

