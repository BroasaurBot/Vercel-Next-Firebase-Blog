import Link from 'next/link'

export default function Custom404() {
    return (
        <main>
            <h1>404 - Page Not Found</h1>
            <iframe src="https://giphy.com/embed/14uQ3cOFteDaU" width="480" height="360" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>
            <Link href='/'>
                <button className='btn-blue'>Go Home</button>
            </Link>
        </main>
    )
}