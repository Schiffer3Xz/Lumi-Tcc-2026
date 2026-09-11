export default function UserAvatar({ name = '', src, className = '', imageClassName = 'h-full w-full object-cover', children }) {
    return (
        <div className={className}>
            {src ? <img src={src} alt={name} className={imageClassName} /> : (children ?? (name.charAt(0).toUpperCase() || 'U'))}
        </div>
    );
}
