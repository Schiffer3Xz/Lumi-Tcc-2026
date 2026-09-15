import EmptyState from '@/components/shared/EmptyState';
import PostCard from './PostCard';

export default function PostFeed({ posts, user, savedOnly = false }) {
    if (posts.length === 0) {
        return (
            <EmptyState
                title={savedOnly ? 'Nenhuma publicação salva' : 'Nenhuma publicação ainda'}
                description={savedOnly ? 'Use o marcador de uma publicação para encontrá-la aqui.' : 'As publicações da comunidade aparecerão aqui.'}
                icon="fa-regular fa-comment"
            />
        );
    }

    return posts.map((post) => <PostCard key={post.id} post={post} user={user} />);
}
