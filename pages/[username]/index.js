import Loader from "../../components/Loader";
import { useContext } from "react";
import { UserContext } from "../../lib/context";

import { firestore, getUserWithUsername, postToJSON} from "../../lib/firebase";
import Link from "next/link";

import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";

export async function getServerSideProps({ query }) {
    const { username } = query;

    const userDoc = await getUserWithUsername(username);

    if (!userDoc){
        return {
            notFound: true,
        };
    }

    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();
        const postsQuery = userDoc.ref
            .collection('posts')
            .where('published', '==', true)
            .orderBy('createdAt', 'desc')
            .limit(5)

        posts = (await postsQuery.get()).docs.map(postToJSON)
    }

    return {
        props: {user, posts},
    };
}


export default function UserProfilePage({user, posts}) {
    const context = useContext(UserContext);

    const resetUsername = async () => {

        if (context.username === user.username) {
            const userDoc = firestore.doc(`users/${context.user.uid}`);
            const usernameDoc = firestore.doc(`usernames/${context.username}`);

            const batch = firestore.batch();
            batch.update(userDoc, { username: null });
            batch.delete(usernameDoc);
            await batch.commit();
        }
    }

    return (
        <>
            <div className='absolute right-10 top-[80px]'>
                <Link className="ml-auto" href='/enter'>
                    {context.username === user.username ? 
                    <button className="bg-red-400" onClick={() => resetUsername()}>Reset Username</button> :
                    <></>}
                </Link>
            </div>
            <main>
                <UserProfile user={user} />
                <PostFeed posts={posts}/>
            </main>
        </>
    )
}
