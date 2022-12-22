import AuthCheck from "../../components/AuthCheck";
import { useRouter } from "next/router";
import { firestore, auth, serverTimestamp } from '../../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import ReactMarkDown from 'react-markdown';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ImageUploader from "../../components/ImageUploader";

import styles from '../../styles/Admin.module.css';

export default function AdminPostEditPage({}) {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    )
};

function PostManager() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { slug } = router.query;

    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
    const [post] = useDocumentData(postRef)


    return (
        <main className={styles.container}>
            {post && (
                <>
                    <section>
                        <h1>{post.title}</h1>
                        <p>ID: {post.slug}</p>

                        <PostForm postRef={postRef} defaultValues={post} preview={preview} />
                    </section> 

                    <aside>
                        <h3>Tools</h3>
                        <button onClick={() => setPreview(!preview)} className="btn-blue">{preview ? 'Edit' : 'Preview'}</button>
                        <Link className='w-full' href={`/${post.username}/${post.slug}`}>
                            <button className="btn-blue">Live view</button>
                        </Link>
                    </aside>
                </>
            )}
        </main>

    );
}

function PostForm({defaultValues, postRef, preview}) {
    const {register, handleSubmit, reset, watch, formState} = useForm({defaultValues, mode: 'onChange'})

    const {isValid, isDirty, errors } = formState;

    
    const updatePost = async ({content, published}) => {
        await postRef.update({content, published, updatedAt: serverTimestamp()});
        reset({content, published});
        toast.success('Post updated successfully!')
    }

    return (
        <form onSubmit={handleSubmit(updatePost)}>
            {preview && (
                <div className="card">
                    <ReactMarkDown>{watch('content')}</ReactMarkDown>
                </div>
            )}

            <div className={preview ? styles.hidden : styles.controls}/>
            <ImageUploader />
            <textarea className="w-full" {...register('content', {
                maxLength: {value: 20000, message: 'content is too long'},
                minLength: {value: 10, message: 'content is too short'},
                required: {value: true, message: 'content is required'}
            })}></textarea>

            {errors.content && <p className="text-danger">{errors.content.message}</p>}
            

            <fieldset>
                <input className={styles.checkbox} type='checkbox' {...register('published')} />
                <label>Published</label>
            </fieldset>

            <button type='submit' className="btn-green" disabled={!isDirty || !isValid}>Save Changes</button>

        </form>
    )
} 