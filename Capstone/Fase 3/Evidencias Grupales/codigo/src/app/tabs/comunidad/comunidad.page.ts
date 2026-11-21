import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../../core/auth.service';
import { ComunidadService } from '../../services/comunidad.service';
import { Post, NuevoPost } from '../../models/comunidad.model';

@Component({
  selector: 'app-comunidad',
  standalone: true,
  templateUrl: './comunidad.page.html',
  styleUrls: ['./comunidad.page.scss'],
  imports: [CommonModule, FormsModule, IonContent],
})
export class ComunidadPage implements OnInit, OnDestroy {
  selectedSegment: 'todas' | 'comunidad' | 'administracion' = 'todas';
  isModalOpen = false;
  posts: Post[] = [];
  private unsubscribe?: () => void;
  private uid = '';

  newPost: NuevoPost = { title: '', body: '', category: 'comunidad' };

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private comunidadService: ComunidadService
  ) {}

  ngOnInit() {
    this.uid = this.authService.getCurrentUser()?.uid || '';
    this.unsubscribe = this.comunidadService.escucharPosts(this.uid, (posts) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }

  get filteredPosts(): Post[] {
    if (this.selectedSegment === 'todas') return this.posts;
    return this.posts.filter(p => p.category === this.selectedSegment);
  }

  timeAgo(post: Post): string {
    if (!post.createdAt?.seconds) return 'Ahora';
    const diffMs = Date.now() - post.createdAt.seconds * 1000;
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Ahora';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `Hace ${diffH} horas`;
    return `Hace ${Math.floor(diffH / 24)} días`;
  }

  onSegmentChange(valor: 'todas' | 'comunidad' | 'administracion') {
    this.selectedSegment = valor;
  }

  async toggleLike(post: Post) {
    try {
      await this.comunidadService.toggleLike(post.id, this.uid, post.liked);
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: 'Error al procesar el like', duration: 1600, color: 'danger' });
      await toast.present();
    }
  }

  async openComments(post: Post) {
    const comentarios = await this.comunidadService.obtenerComentarios(post.id);

    const message = comentarios.length
      ? comentarios.map(c => `<b>${c.authorName}:</b> ${c.text}`).join('<br><br>')
      : 'Todavía no hay comentarios.';

    const alert = await this.alertCtrl.create({
      header: `Comentarios (${comentarios.length})`,
      message,
      inputs: [{ name: 'nuevo', type: 'textarea', placeholder: 'Escribe un comentario...' }],
      buttons: [
        { text: 'Cerrar', role: 'cancel' },
        {
          text: 'Comentar',
          handler: async (data) => {
            const texto = (data.nuevo || '').trim();
            if (!texto) return;
            const user = this.authService.getCurrentUser();
            const authorName = user?.displayName || user?.email || 'Usuario';
            await this.comunidadService.agregarComentario(post.id, texto, authorName);
          },
        },
      ],
    });
    await alert.present();
  }

  async sharePost(post: Post) {
    const shareData = { title: post.title, text: post.body };
    if ((navigator as any).share) {
      try { await (navigator as any).share(shareData); } catch { /* cancelado */ }
    } else {
      await navigator.clipboard.writeText(`${post.title}\n${post.body}`);
      const toast = await this.toastCtrl.create({ message: 'Publicación copiada al portapapeles', duration: 1800 });
      await toast.present();
    }
  }

  openNewPostModal() {
    this.newPost = { title: '', body: '', category: 'comunidad' };
    this.isModalOpen = true;
  }

  closeModal() { this.isModalOpen = false; }

  async submitPost() {
    if (!this.newPost.title.trim() || !this.newPost.body.trim()) {
      const toast = await this.toastCtrl.create({ message: 'Completa el título y la descripción', duration: 1800, color: 'warning' });
      await toast.present();
      return;
    }

    try {
      const user = this.authService.getCurrentUser();
      const author = user?.displayName || user?.email || 'Usuario';
      await this.comunidadService.crearPost(this.uid, author, this.newPost);

      this.isModalOpen = false;
      const toast = await this.toastCtrl.create({ message: 'Publicación creada', duration: 1500, color: 'success' });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({ message: 'Error al crear la publicación', duration: 2000, color: 'danger' });
      await toast.present();
    }
  }
}
