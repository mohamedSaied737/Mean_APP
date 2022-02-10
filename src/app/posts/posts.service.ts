import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/posts/";

@Injectable({providedIn: 'root'})

export class PostSrevice {
 private posts: Post[] = [];
 private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

 constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http.get<{message : string, posts : any, maxPosts: number}>(BACKEND_URL + queryParams)
    .pipe(map((postData) => {
      return { posts:  postData.posts.map(post => {
        return {
          title : post.title,
          content : post.content,
          id : post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }),
       maxPosts: postData.maxPosts
      };
    }))
    .subscribe((transferPostData) => {
      console.log(transferPostData);
      this.posts = transferPostData.posts;
      this.postsUpdated.next({
        posts :[... this.posts],
        postCount: transferPostData.maxPosts
       });
    });
  }

 getPostUpdateListener() {
   return this.postsUpdated.asObservable();
 }

 addPost(title: string, content: string, image: File) {
  const postDate = new FormData();
  postDate.append("title", title)
  postDate.append("content", content)
  postDate.append("image", image, title)
  this.http.post<{message: string, post: Post}>( BACKEND_URL , postDate)
  .subscribe(res => {
    this.router.navigate(["/"])
  });
 }

 getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string, imagePath: string, creator: string}>(
      BACKEND_URL + id);
 }

 deletePost(postId: string) {
   return this.http.delete<{message: string}>(BACKEND_URL + postId)
 }

 updatePost(id: string, title: string, content: string, image: File | string) {
  let postData: Post | FormData;
  if (typeof image === 'object') {
    postData = new FormData();
    postData.append('title', title);
    postData.append('id', id);
    postData.append('content', content);
    postData.append('image', image, title);
  } else {
      postData = {
      id: id,
      title: title,
      content: content,
      imagePath: image,
      creator: null
    }
  }
   this.http.put<{message: string}>(BACKEND_URL + id, postData)
   .subscribe(res => {
      this.router.navigate(["/"]);
   });
 }
}
