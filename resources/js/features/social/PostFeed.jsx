import EmptyState from '@/components/shared/EmptyState';
import { useEffect, useState } from 'react';
import PostCard from './PostCard';

export default function PostFeed({ posts, user }) {
    const [currentPosts, setCurrentPosts] = useState(posts);
    const [likedPosts, setLikedPosts] = useState({});

    useEffect(() => {
        setCurrentPosts(posts);
    }, [posts]);

    const toggleLike = (postId) => {
        const isLiked = !!likedPosts[postId];
        setLikedPosts((current) => ({ ...current, [postId]: !isLiked }));
        setCurrentPosts((current) =>
            current.map((post) => (post.id === postId ? { ...post, likesCount: post.likesCount + (isLiked ? -1 : 1) } : post)),
        );
    };

    if (currentPosts.length === 0) {
        return (
            <EmptyState title="Nenhuma publicação ainda" description="As publicações da comunidade aparecerão aqui." icon="fa-regular fa-comment" />
        );
    }

    return currentPosts.map((post) => (
        <PostCard key={post.id} post={post} user={user} isLiked={!!likedPosts[post.id]} onLike={() => toggleLike(post.id)} />
    ));
}
