import { Component } from '@angular/core';
import { Inoticia } from 'app/core/models/noticia.model';
import { NoticiaService } from 'app/core/services/noticia.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

  noticia: Inoticia[] = [];

  constructor(
    private serviceNoticia: NoticiaService
  ){}

  ngOnInit(): void{
    this.serviceNoticia.allNoticias().subscribe((data) => {
      console.log('data :' ,data);
      this.noticia = data;
    })
  }

}
