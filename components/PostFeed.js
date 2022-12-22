import React from 'react'
import  Link  from 'next/link'

function PostFeed({posts, admin}) {

    if (posts != undefined) {
        return posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />)
    }else {
        return (
        <p>
            <strong>There is no posts to show</strong>
        </p>
        );
    }
}

function PostItem({ post, admin = false }) {

    const wordCount = post.content.trim().split(/\s+/g).length
    const minutesToRead = (wordCount / 100 + 1).toFixed(0)

    const userHome = `/${post.username}`
    let userPost = `/${post.username}/${post.slug}`
    if (admin) {
        userPost = `/admin/${post.slug}`
    }

    return (
        <div className='card'>

            <Link href={userHome}>
                    <strong>By @{post.username}</strong>
            </Link>
            
            <Link href={userPost}>
                <h2>
                    {post.title}
                </h2>
            </Link>

            <footer>
                <span>{wordCount} words. {minutesToRead} min read</span>
                <span>️ {post.heartCount} Hearts</span>
            </footer>
        </div>
    )
}

export default PostFeed