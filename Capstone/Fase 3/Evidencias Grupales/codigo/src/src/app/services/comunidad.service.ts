import { Injectable } from '@angular/core';
import {
  collection, addDoc, doc, updateDoc, onSnapshot, query, orderBy,
  serverTimestamp, arrayUnion, arrayRemove, increment, getDocs
} from 'firebase/firestore';
import { db } from '../core/firestore';
import { Post, Comentario, NuevoPost } from '../models/comunidad.model';

@Injectable({ providedIn: 'root' })
export class ComunidadService {

  escucharPosts(uid: string, callback: (posts: Post[]) => void): () => void {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const posts: Post[] = snapshot.docs.map((d) => {
        const data: any = d.data();
        const likedBy: string[] = data.likedBy || [];
        return {
          id: d.id,
          author: data.author,
          authorUid: data.authorUid,
          avatarColor: data.avatarColor,
          avatarIcon: data.avatarIcon,
          title: data.title,
          body: data.body,
          tag: data.tag,
          tagColor: data.tagColor,
          category: data.category,
          likedBy,
          commentsCount: data.commentsCount || 0,
          likes: likedBy.length,
          liked: likedBy.includes(uid),
          createdAt: data.createdAt,
        };
      });
      callback(posts);
    });
  }

  async toggleLike(postId: string, uid: string, liked: boolean): Promise<void> {
    const ref = doc(db, 'posts', postId);
    if (liked) {
      await updateDoc(ref, { likedBy: arrayRemove(uid) });
    } else {
      await updateDoc(ref, { likedBy: arrayUnion(uid) });
    }
  }

  async obtenerComentarios(postId: string): Promise<Comentario[]> {
    const snap = await getDocs(collection(db, 'posts', postId, 'comments'));
    return snap.docs
      .map(d => d.data() as Comentario)
      .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
  }

  async agregarComentario(postId: string, texto: string, authorName: string): Promise<void> {
    await addDoc(collection(db, 'posts', postId, 'comments'), {
      text: texto,
      authorName,
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(db, 'posts', postId), { commentsCount: increment(1) });
  }

  async crearPost(uid: string, author: string, nuevo: NuevoPost): Promise<void> {
    await addDoc(collection(db, 'posts'), {
      author,
      authorUid: uid,
      avatarColor: '#6366f1',
      title: nuevo.title.trim(),
      body: nuevo.body.trim(),
      tag: nuevo.category === 'administracion' ? 'Administración' : 'Comunidad',
      tagColor: nuevo.category === 'administracion' ? 'primary' : 'tertiary',
      likedBy: [],
      commentsCount: 0,
      createdAt: serverTimestamp(),
    });
  }
}