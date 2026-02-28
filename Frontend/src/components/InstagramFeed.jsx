import React from 'react';
import { Button } from "./ui/button";
import { Heart, Instagram, MapPin, Link as LinkIcon } from 'lucide-react';

const INSTAGRAM_POSTS = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1714381108184-5183cb40e932?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBicmlkYWwlMjBtYWtldXB8ZW58MHx8fHwxNzcwMTM2Njg1fDA&ixlib=rb-4.1.0&q=85",
    likes: "1.2k"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1606251706444-d069cd266189?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDJ8MHwxfHNlYXJjaHwyfHxicmlkYWwlMjBoYWlyc3R5bGV8ZW58MHx8fHwxNzcwMTM2NjkzfDA&ixlib=rb-4.1.0&q=85",
    likes: "856"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwzfHxtYWtldXAlMjBwcm9kdWN0c3xlbnwwfHx8fDE3NzAxMzY3MDR8MA&ixlib=rb-4.1.0&q=85",
    likes: "2.5k"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1551392505-f4056032826e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2ODh8MHwxfHNlYXJjaHwxfHxleWUlMjBtYWtldXB8ZW58MHx8fHwxNzcwMTM2NzEzfDA&ixlib=rb-4.1.0&q=85",
    likes: "3.1k"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBicmlkYWwlMjBtYWtldXB8ZW58MHx8fHwxNzcwMTM2Njg1fDA&ixlib=rb-4.1.0&q=85",
    likes: "945"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODh8MHwxfHNlYXJjaHwyfHxtYWtldXAlMjBwcm9kdWN0c3xlbnwwfHx8fDE3NzAxMzY3MDR8MA&ixlib=rb-4.1.0&q=85",
    likes: "1.8k"
  }
];

const InstagramFeed = () => {
  const profileUrl = "https://www.instagram.com/mayleki_makeupstudio/";

  return (
    <section className="py-24 bg-background border-t border-border/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-16">
            {/* Profile Picture */}
            <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                    <div className="w-full h-full rounded-full border-4 border-background overflow-hidden bg-secondary">
                         {/* Placeholder for Profile Pic - using the first image but cropped */}
                         <img 
                            src="https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDR8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBicmlkYWwlMjBtYWtldXB8ZW58MHx8fHwxNzcwMTM2Njg1fDA&ixlib=rb-4.1.0&q=85" 
                            alt="Mayleki Profile" 
                            className="w-full h-full object-cover"
                         />
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <h2 className="text-2xl font-sans font-light text-primary">mayleki_makeupstudio</h2>
                    <div className="flex gap-2">
                        <Button 
                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md px-6 py-1 h-8 text-sm font-semibold"
                            onClick={() => window.open(profileUrl, '_blank')}
                        >
                            Follow
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 rounded-md">
                             <Instagram size={16} />
                        </Button>
                    </div>
                </div>

                <div className="flex justify-center md:justify-start gap-8 mb-4 text-sm">
                    <span><span className="font-bold text-primary">472</span> posts</span>
                    <span><span className="font-bold text-primary">1,476</span> followers</span>
                    <span><span className="font-bold text-primary">503</span> following</span>
                </div>

                <div className="space-y-1 text-sm text-primary/80">
                    <p className="font-bold text-primary">Mayleki Makeup Studio & Academy</p>
                    <p>✨ Bridal Makeup Artist 💄</p>
                    <p>✨ Hairstylist 💇 | Beautician 💄</p>
                    <p className="flex items-center justify-center md:justify-start gap-1">
                        <MapPin size={14} /> Rahuri, Ahmednagar, MH
                    </p>
                    <p>📞 Inquiry: +91 87678 75492</p>
                    <p className="text-blue-900/80 font-medium">@pallavi_sonawane</p>
                </div>
            </div>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4 mb-12">
            {INSTAGRAM_POSTS.map((post) => (
                <a 
                    key={post.id} 
                    href={profileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="relative group aspect-square block overflow-hidden bg-secondary"
                >
                    <img 
                        src={post.url} 
                        alt="Instagram Post" 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="flex items-center text-white font-bold gap-2">
                            <Heart fill="white" size={24} />
                            <span>{post.likes}</span>
                        </div>
                    </div>
                </a>
            ))}
        </div>

        {/* Footer CTA */}
        <div className="text-center">
             <Button 
                variant="outline"
                className="rounded-full border-primary/20 text-primary hover:bg-primary hover:text-white px-8 py-6 uppercase tracking-widest text-xs transition-all"
                onClick={() => window.open(profileUrl, '_blank')}
             >
                <Instagram size={16} className="mr-2" />
                Follow on Instagram
             </Button>
             <p className="mt-4 text-muted-foreground text-xs uppercase tracking-widest">
                For latest bridal looks & transformations
             </p>
        </div>

      </div>
    </section>
  );
};

export default InstagramFeed;
