export interface Post {
  id: string;
  author: string;
  authorUid: string;
  avatarColor: string;
  avatarIcon?: string;
  title: string;
  body: string;
  tag: string;
  tagColor: string;
  category: 'comunidad' | 'administracion';
  likedBy: string[];
  commentsCount: number;
  likes: number;
  liked: boolean;
  createdAt: any;
}

export interface Comentario {
  authorName: string;
  text: string;
  createdAt: any;
}

export interface NuevoPost {
  title: string;
  body: string;
  category: 'comunidad' | 'administracion';
}
