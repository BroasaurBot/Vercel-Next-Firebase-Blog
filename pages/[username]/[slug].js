import React from 'react'
import { getUserWithUsername, firestore, postToJSON } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import AuthCheck from '../../components/AuthCheck';
import HeartButton from '../../components/HeartButton';
import Link from 'next/link';

export async function getStaticProps({ params }) {
  const {username, slug} = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    const postRef = userDoc.ref.collection('posts').doc(slug);
    post = postToJSON(await postRef.get());


    path = postRef.path;
  }

  return {
    props: { post, path} ,
    revalidate: 5000
  };
}

export async function getStaticPaths() {
  const snapshot = await firestore.collectionGroup('posts').get();

  const paths = snapshot.docs.map((doc) => {
    const {slug, username} = doc.data();
    return {
      params: {username, slug}
    }
  })

  return {
    paths,
    fallback: 'blocking',
  };
} 

function PostPage(props) {
  const postRef = firestore.doc(props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  return (
    <main className={styles.container}>

      <section>
        <PostContent post={post} />
      </section>

      <aside className='card'>
        <p>
          <strong>Hearts: {post.heartCount || 0} </strong>
        </p>

        <AuthCheck
          fallback={
            <Link href='/enter'>
              <button> Sign Up</button>
            </Link>
          }>
          <HeartButton postRef={postRef} />
        </AuthCheck>
      </aside>

    </main>
  )
}

export default PostPage