# Assignment 1 - Agile Software Practice.

Name: Yifan Gu 20086429

## Overview.

This is a simple microblog which is called 'Creative Land'. It is designed for users to share stories about their lives. Users can register their own accounts and post articles. One user can get 'followed' by another user or add a 'like' for a good post.

## API endpoints.

   + GET /users - Get all users.
   + GET /users/:username - Get one user by his username.
   + GET /posts - Get all posts.
   + GET /posts/:id - Get one post by its id.
   + POST /reg - Register.
   + POST /log - Login.
   + POST /posts - Add a post.
   + PUT /users/:username/followed - Follow one user by his username.
   + PUT /posts/:id/likes - Add a 'like' for a post by its id.
   + DELETE /deleteUser/:id - Delete one user.
   + DELETE /deletePost/:id - Delete one post.


## Data model.

. . . . Describe the structure of the database being used by your API. An image (see example below) or JSON represerntation is acceptable . . . . 

![][datamodel]


## Sample Test execution.



~~~
    userTest
      GET /users
  GET /users 200 4.974 ms - 235
        √ should GET all the users
      GET /users/:username
        when the username is valid
  GET /users/GYF 200 1.798 ms - 116
          √ should return the matching user
        when the username is invalid
  GET /users/jojo 200 1.198 ms - 37
          √ should return the NOT found message
      POST /reg
        when the username is not used
  POST /reg 200 3.044 ms - 161
          √ should register successfully and update
  GET /users/Nancy 200 1.258 ms - 118
        when the username used by other users
  POST /reg 200 1.140 ms - 42
          √ should return the username existed message
      POST /log
        when the username is wrong
  POST /log 200 1.286 ms - 41
          √ should return the username NOT existed message
        when the password is wrong
  POST /log 200 1.115 ms - 35
          √ should return the WRONG password message
        when the username and password are both correct
  POST /log 200 1.149 ms - 156
          √ should return login successfully message
      PUT /users/:username/followed
        when the username is valid
  PUT /users/GYF/followed 200 4.418 ms - 172
          √ should return a message and the user followed by 1
  GET /users/GYF 200 1.142 ms - 116
        when the username is invalid
  PUT /users/jojo/followed 200 0.927 ms - 41
          √ should return the NOT exist message
      DELETE /deleteUser/:id
        when the id is valid
  DELETE /deleteUser/5dbffd7f9b185f4748f1014f 200 4.333 ms - 159
          √ should return a message and update
  GET /users 200 1.117 ms - 118
        when the id is invalid
  DELETE /deleteUser/jojo 200 0.879 ms - 225
          √ should return the NOT exist message

    postTest
  GET /posts 200 1.548 ms - 254
          √ should GET all the posts
      GET /posts/:id
        when the id is valid
  GET /posts/5dbffd7f9b185f4748f10156 200 2.784 ms - 135
          √ should return the matching post
        when the id is invalid
  GET /posts/jojojo 200 0.322 ms - 234
          √ should return the NOT found message
      POST /posts
        when the id is valid
  POST /posts 200 2.292 ms - 143
          √ should register successfully and update
  GET /posts/5dbffd7f9b185f4748f1015f 200 3.295 ms - 132
        when the id is invalid
  GET /posts/11111 200 0.299 ms - 231
          √ should return the NOT found message
      PUT /posts/:id/likes
        when the id is valid
  PUT /posts/5dbffd809b185f4748f10163/likes 200 2.340 ms - 179
          √ should return a message and the likes by 1
  GET /posts/5dbffd809b185f4748f10163 200 2.221 ms - 135
        when the id is invalid
  PUT /posts/jojo/likes 200 0.264 ms - 228
          √ should return the NOT exist message
      DELETE /deletePost/:id
        when the id is valid
  DELETE /deletePost/5dbffd809b185f4748f10169 200 2.300 ms - 168
          √ should return a message and update
  GET /posts 200 1.403 ms - 127
        when the id is invalid
  DELETE /deletePost/jojo 200 0.277 ms - 225
          √ should return the NOT exist message


  21 passing (2s)

~~~

[ Markdown Tip: By wrapping the test results in fences (~~~), GitHub will display it in a 'box' and preserve any formatting.]



[datamodel]: ./public/images/model.png