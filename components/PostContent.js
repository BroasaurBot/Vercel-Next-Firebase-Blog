import React from 'react'
import Link from 'next/link'
import ReactMarkDown from 'react-markdown'


    
export default function PostContent({ post }) {
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate()
    return (
        <div className='card'>
            <h1>{post?.title}</h1>
            <span className='text-sm'>
                Written by{' '}
                <Link href={`/${post.username}/`} className='text-info'>
                    @{post.username}
                </Link>{' '}
                on {createdAt.toISOString()}
            </span>
            <div className='pt-5'>
                <ReactMarkDown>{post?.content}</ReactMarkDown>
            </div>
        </div>
  )
}
